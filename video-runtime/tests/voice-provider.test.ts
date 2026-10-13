import {test} from 'node:test';
import assert from 'node:assert/strict';
import {ElevenLabsProvider, characterAlignment} from '../src/voice-provider';

const model = {model_id: 'eleven_multilingual_v2', can_do_text_to_speech: true, maximum_text_length_per_request: 5000, languages: [{language_id: 'pt', name: 'Portuguese'}]};
const voice = {voice_id: 'voice-br', name: 'Brazil voice', verified_languages: [{language: 'Portuguese', locale: 'pt-BR'}]};
function response(body: unknown, status = 200) {return new Response(JSON.stringify(body), {status, headers: {'content-type': 'application/json'}});}

test('ElevenLabs provider checks the selected model and voice capabilities before synthesis', async () => {
  const calls: {url: string; init?: RequestInit}[] = [];
  const provider = new ElevenLabsProvider('test-secret', async (input, init) => {
    const url = String(input); calls.push({url, init});
    if (url.endsWith('/v1/models')) return response([model]);
    if (url.endsWith('/v1/voices/voice-br')) return response(voice);
    return response({audio_base64: 'YXVkaW8=', alignment: {characters: ['O'], character_start_times_seconds: [0], character_end_times_seconds: [0.2]}});
  });
  const result = await provider.synthesize({voiceId: 'voice-br', modelId: model.model_id, language: 'pt-BR', text: 'O céu.', voiceSettings: {stability: 0.5}}, async () => {});
  assert.equal(result.audioBase64, 'YXVkaW8=');
  assert.ok(calls.some(({url}) => url.endsWith('/v1/models')));
  assert.ok(calls.some(({url}) => url.endsWith('/v1/voices/voice-br')));
  assert.equal(calls.at(-1)?.init?.method, 'POST');
  assert.equal(new Headers(calls.at(-1)?.init?.headers).get('xi-api-key'), 'test-secret');
});

test('provider refuses unsupported model or language before attempting charged synthesis', async () => {
  let synthesisCalls = 0;
  const provider = new ElevenLabsProvider('test-secret', async (input) => {
    const url = String(input);
    if (url.endsWith('/v1/models')) return response([{...model, can_do_text_to_speech: false}]);
    if (url.endsWith('/v1/voices/voice-br')) return response(voice);
    synthesisCalls++;
    return response({});
  });
  await assert.rejects(provider.synthesize({voiceId: 'voice-br', modelId: model.model_id, language: 'pt-BR', text: 'O céu.'}, async () => {}), /does not support text-to-speech/i);
  assert.equal(synthesisCalls, 0);
});

test('character timings normalize into shared caption segments and reject incomplete provider timing', () => {
  const mapped = characterAlignment([
    {id: 'line-001', text: 'Oi.'}, {id: 'line-002', text: 'Tudo bem?'}
  ], {characters: [...'Oi.\n\nTudo bem?'], character_start_times_seconds: [0, .1, .2, .3, .4, .5, .6, .7, .8, .9, 1, 1.1, 1.2, 1.3], character_end_times_seconds: [.1, .2, .3, .4, .5, .6, .7, .8, .9, 1, 1.1, 1.2, 1.3, 1.4]});
  assert.equal(mapped.provenance, 'elevenlabs-character-timings');
  assert.deepEqual(mapped.segments.map(({id, text}) => ({id, text})), [{id: 'line-001', text: 'Oi.'}, {id: 'line-002', text: 'Tudo bem?'}]);
  assert.deepEqual(mapped.segments.map(({start, end}) => [start, end]), [[0, .3], [.5, 1.4]]);
  assert.throws(() => characterAlignment([{id: 'line-001', text: 'Oi.'}], {characters: ['O'], character_start_times_seconds: [0], character_end_times_seconds: [.1]}), /character timing/i);
});

test('provider errors do not return response bodies or credential material', async () => {
  const key = 'test-secret-do-not-print';
  const provider = new ElevenLabsProvider(key, async () => new Response(`error ${key}`, {status: 401}));
  await assert.rejects(provider.models(), (error: Error) => !error.message.includes(key) && /HTTP 401/.test(error.message));
});

test('ambiguous synthesis timeout is reported as potentially charged and is never retried', async () => {
  let calls = 0;
  const provider = new ElevenLabsProvider('test-secret', async (input) => {
    calls++;
    const url = String(input);
    if (url.endsWith('/v1/models')) return response([model]);
    if (url.endsWith('/v1/voices/voice-br')) return response(voice);
    throw new Error('simulated timeout');
  });
  await assert.rejects(provider.synthesize({voiceId: 'voice-br', modelId: model.model_id, language: 'pt-BR', text: 'O céu.'}, async () => {}), (error: Error & {mayHaveCharged?: boolean}) => error.mayHaveCharged === true && /Do not retry automatically/.test(error.message));
  assert.equal(calls, 3, 'one models check, one voice check, and exactly one charged synthesis attempt');
});
