export type PronunciationDictionaryLocator = {pronunciation_dictionary_id: string; version_id: string};
export type NarrationInput = {voiceId: string; modelId: string; language: 'pt-BR' | 'en'; text: string; voiceSettings?: {stability?: number; similarity_boost?: number; style?: number; use_speaker_boost?: boolean}; pronunciationDictionaryLocators?: PronunciationDictionaryLocator[]};
export type ProviderAlignment = {characters: string[]; character_start_times_seconds: number[]; character_end_times_seconds: number[]};
export type NarrationProviderResult = {audioBase64: string; alignment: ProviderAlignment; modelId: string; voiceId: string; characterCount: number; licenseConditions: string};
export interface NarrationProvider {synthesize(input: NarrationInput, beforeChargedRequest: () => Promise<void>): Promise<NarrationProviderResult>}
type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;
type Model = {model_id: string; can_do_text_to_speech: boolean; maximum_text_length_per_request: number; languages?: {language_id: string; name: string}[]};
type Voice = {voice_id: string; name: string; labels?: Record<string, string>; verified_languages?: {language: string; locale?: string}[]};

export class NarrationProviderError extends Error {
  constructor(message: string, readonly mayHaveCharged = false) {super(message); this.name = 'NarrationProviderError';}
}

export function parsePronunciationDictionaryLocators(value?: string): PronunciationDictionaryLocator[] | undefined {
  if (value === undefined) return undefined;
  const locators = value.split(',').map((item) => {
    const [pronunciation_dictionary_id, version_id, extra] = item.trim().split(':');
    if (!pronunciation_dictionary_id || !version_id || extra !== undefined) throw new Error('Pronunciation dictionaries must use <dictionary-id>:<version-id> pairs');
    return {pronunciation_dictionary_id, version_id};
  });
  if (locators.length === 0) throw new Error('At least one pronunciation dictionary ID/version pair is required');
  return locators;
}

const endpoint = 'https://api.elevenlabs.io';
const languageLabel = (language: NarrationInput['language']) => language === 'pt-BR' ? 'portuguese' : 'english';

/** Protocol adapter; credential is kept only in the request header and never included in errors. */
export class ElevenLabsProvider implements NarrationProvider {
  constructor(private readonly apiKey: string, private readonly fetcher: FetchLike = fetch) {
    if (!apiKey.trim()) throw new Error('ELEVENLABS_API_KEY is required');
  }
  private async request(url: string, init: RequestInit = {}, charged = false) {
    let response: Response;
    try {response = await this.fetcher(url, {...init, signal: init.signal ?? AbortSignal.timeout(45_000), headers: {...Object.fromEntries(new Headers(init.headers)), 'xi-api-key': this.apiKey}});}
    catch {throw new NarrationProviderError(charged ? 'ElevenLabs synthesis request failed without a response; charge outcome is uncertain. Do not retry automatically.' : 'ElevenLabs capability request failed before a response.', charged);}
    if (!response.ok) throw new NarrationProviderError(`ElevenLabs returned HTTP ${response.status}; response details were omitted`, charged);
    return response;
  }
  async models(): Promise<Model[]> {
    const response = await this.request(`${endpoint}/v1/models`);
    const data: unknown = await response.json();
    if (!Array.isArray(data)) throw new Error('ElevenLabs model capability response was invalid');
    return data as Model[];
  }
  async voice(voiceId: string): Promise<Voice> {
    const response = await this.request(`${endpoint}/v1/voices/${encodeURIComponent(voiceId)}`);
    const data = await response.json() as Voice;
    if (data.voice_id !== voiceId) throw new Error('ElevenLabs voice capability response was invalid');
    return data;
  }
  async synthesize(input: NarrationInput, beforeChargedRequest: () => Promise<void>): Promise<NarrationProviderResult> {
    const models = await this.models();
    const model = models.find((item) => item.model_id === input.modelId);
    if (!model || model.can_do_text_to_speech !== true) throw new Error('Selected ElevenLabs model does not support text-to-speech');
    const language = languageLabel(input.language);
    const modelLanguage = model.languages?.some((item) => item.language_id.toLowerCase() === (input.language === 'pt-BR' ? 'pt' : 'en') || item.name.toLowerCase().includes(language));
    if (!modelLanguage) throw new Error(`Selected ElevenLabs model has no verified ${input.language} capability`);
    if (!Number.isInteger(model.maximum_text_length_per_request) || [...input.text].length > model.maximum_text_length_per_request) {
      throw new Error('Narration exceeds the selected model maximum text length');
    }
    const voice = await this.voice(input.voiceId);
    const voiceLanguage = voice.verified_languages?.some((item) => input.language === 'pt-BR'
      ? item.locale?.toLowerCase() === 'pt-br'
      : item.language.toLowerCase().includes(language) || item.locale?.toLowerCase().startsWith('en'));
    if (!voiceLanguage) throw new Error(`Selected voice has no verified ${input.language} language or accent label`);

    await beforeChargedRequest();
    const response = await this.request(`${endpoint}/v1/text-to-speech/${encodeURIComponent(input.voiceId)}/with-timestamps`, {
      method: 'POST', headers: {'content-type': 'application/json'},
      // language_code is optional and some otherwise multilingual models reject it.
      body: JSON.stringify({text: input.text, model_id: input.modelId, voice_settings: input.voiceSettings, pronunciation_dictionary_locators: input.pronunciationDictionaryLocators}),
    }, true);
    let data: {audio_base64?: unknown; alignment?: ProviderAlignment; normalized_alignment?: ProviderAlignment};
    try {data = await response.json() as typeof data;}
    catch {throw new NarrationProviderError('ElevenLabs synthesis response could not be read; charge outcome is uncertain. Do not retry automatically.', true);}
    let alignment: ProviderAlignment | undefined;
    for (const candidate of [data.alignment, data.normalized_alignment]) {
      if (!candidate) continue;
      try {validateCharacterTimings(candidate); alignment = candidate; break;}
      catch { /* Try the provider's other documented timing representation. */ }
    }
    if (typeof data.audio_base64 !== 'string' || !alignment) throw new NarrationProviderError('ElevenLabs synthesis returned no usable audio or character timings; charge outcome is uncertain. Do not retry automatically.', true);
    return {audioBase64: data.audio_base64, alignment, modelId: model.model_id, voiceId: voice.voice_id, characterCount: [...input.text].length, licenseConditions: 'Provider terms and account plan must be reviewed by the operator; commercial-use eligibility has not been verified.'};
  }
}

export function validateCharacterTimings(alignment: ProviderAlignment) {
  const {characters, character_start_times_seconds: starts, character_end_times_seconds: ends} = alignment;
  if (!Array.isArray(characters) || !Array.isArray(starts) || !Array.isArray(ends) || characters.length !== starts.length || starts.length !== ends.length || starts.length === 0) throw new Error('ElevenLabs character timing arrays are incomplete');
  for (let index = 0; index < starts.length; index++) {
    if (!Number.isFinite(starts[index]) || !Number.isFinite(ends[index]) || starts[index]! < 0 || ends[index]! <= starts[index]! || (index > 0 && starts[index]! < starts[index - 1]!)) throw new Error('ElevenLabs character timings are invalid or non-monotonic');
  }
}

export function characterAlignment(narration: {id: string; text: string}[], provider: ProviderAlignment) {
  validateCharacterTimings(provider);
  const segments = [];
  let cursor = 0;
  for (const segment of narration) {
    const chars = [...segment.text];
    const startIndex = cursor;
    const endIndex = startIndex + chars.length;
    if (endIndex > provider.characters.length || chars.some((character, index) => provider.characters[startIndex + index] !== character)) throw new Error('ElevenLabs character timing text does not match clean narration');
    const timed = chars.map((character, index) => ({character, start: provider.character_start_times_seconds[startIndex + index]!, end: provider.character_end_times_seconds[startIndex + index]!})).filter(({character}) => !/^\s+$/u.test(character));
    if (!timed.length) throw new Error('Narration segment has no spoken characters to align');
    segments.push({id: segment.id, text: segment.text, start: Math.min(...timed.map((item) => item.start)), end: Math.max(...timed.map((item) => item.end))});
    cursor = endIndex;
    if (segments.length < narration.length) {
      while (/^\s+$/u.test(provider.characters[cursor] ?? '')) cursor++;
    }
  }
  if (cursor !== provider.characters.length) throw new Error('ElevenLabs character timing text contains unexpected trailing characters');
  return {provenance: 'elevenlabs-character-timings' as const, segments};
}
