#!/usr/bin/env python3
"""Local educational video pipeline. No paid API calls or shell interpolation."""
import argparse
import hashlib
import json
import math
import os
from pathlib import Path
import shutil
import subprocess
import sys
import time
import wave
import fcntl

HERE = Path(__file__).resolve().parent
RUNTIME = HERE.parent / 'references/runtime.json'
DEFAULT_KIT = json.loads(RUNTIME.read_text())['kit'] if RUNTIME.exists() else HERE.parents[2]
KIT = Path(os.environ.get('EDU_VIDEO_HOME', DEFAULT_KIT))
ASSETS = HERE.parent / 'assets'

def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, ensure_ascii=False).encode()).hexdigest()

def filehash(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for block in iter(lambda: f.read(1024 * 1024), b''):
            h.update(block)
    return h.hexdigest()

def save(path, value):
    tmp = path.with_suffix(path.suffix + '.tmp')
    tmp.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
    tmp.replace(path)

def ffmpeg():
    import imageio_ffmpeg
    return os.environ.get('FFMPEG', imageio_ffmpeg.get_ffmpeg_exe())

def ffprobe():
    found = os.environ.get('FFPROBE') or shutil.which('ffprobe')
    if found:
        return found
    bundled = KIT / 'node_modules/@ffprobe-installer/darwin-arm64/ffprobe'
    if bundled.exists():
        return str(bundled)
    raise RuntimeError('FFprobe ausente: configure FFPROBE ou execute setup.py.')

def run(args):
    result = subprocess.run([str(a) for a in args], capture_output=True, text=True)
    if result.returncode:
        # Commands never contain credentials. Avoid dumping provider stderr.
        raise RuntimeError(f'{Path(str(args[0])).name} falhou: {result.stderr[-1800:]}')
    return result.stdout

def probe(path):
    return json.loads(run([ffprobe(), '-v', 'error', '-show_streams', '-show_format', '-of', 'json', path]))

def duration(path):
    return float(probe(path)['format']['duration'])

def voice_input(m, root):
    cfg = dict(m['voice'])
    if cfg['provider'] == 'piper':
        model = Path(cfg['model'])
        if not model.is_absolute():
            model = KIT / model
        cfg['model_hash'] = filehash(model)
        cfg['config_hash'] = filehash(str(model) + '.json')
    if cfg['provider'] == 'existing':
        cfg['audio_hash'] = filehash(root / cfg['audio'])
        cfg['timestamps_hash'] = filehash(root / cfg['timestamps'])
    return digest([[(s['id'], s['narration']) for s in m['scenes']], cfg])

def scene_payload(m, scene, root):
    visual = {k: v for k, v in scene.items() if k != 'frame_key'}
    cues = [{**c, 'start': c['start'] - scene['start'], 'end': c['end'] - scene['start']} for c in m['timestamps'] if c['scene'] == scene['id']]
    renderer = (root / scene['renderer']).resolve() if scene.get('renderer') else None
    custom = renderer.read_text() if renderer else ''
    payload = dict(scene=visual, cues=cues, format=m['format'], language=m['language'])
    return payload, custom, digest([payload, filehash(ASSETS / 'scene.html'), custom])

def contract(m):
    import jsonschema
    jsonschema.validate(m, json.loads((HERE.parent / 'references/manifest.schema.json').read_text()))
    ids = [s['id'] for s in m['scenes']]
    assert len(set(ids)) == len(ids), 'IDs de cena duplicados'
    source_ids = {s['id'] for s in m['sources']}
    for scene in m['scenes']:
        assert scene['sources'] and set(scene['sources']) <= source_ids, 'Fonte ausente'
        assert all(len(t) <= 120 for t in scene['narration']), 'Divida a fala em trechos <=120 caracteres'
        assert not any('http' in t or '[' in t or ']' in t for t in scene['narration']), 'Narração deve conter apenas fala'
        if scene['visual_kind'] == 'observational':
            assert scene.get('renderer') and scene.get('asset_origin') and scene.get('asset_license'), 'Observacional exige renderer real, origem e licença'
        if scene['template'] == 'custom':
            assert scene.get('renderer'), 'Template custom exige renderer'
        if scene['template'] in ('bullets', 'timeline'):
            assert scene.get('points'), 'Template exige points'
        if scene['template'] == 'bars':
            assert scene.get('values') and scene.get('labels'), 'Barras exigem values e labels'
    assert m['research']['reviewed'], 'Pesquisa ainda não revisada; verifique as afirmações primeiro'

def research(m, root):
    contract(m)
    (root / 'work').mkdir(exist_ok=True)
    (root / 'work/narration.txt').write_text('\n'.join(t for s in m['scenes'] for t in s['narration']))
    lines = [f"# {m['topic']}", '', 'Verificação editorial: ' + m['research']['reviewer'], '']
    for s in m['scenes']:
        lines += [f"## {s['id']}: {s['title']}", f"Classificação: {s['epistemic']}; visual: {s['visual_kind']}", s['claim'], 'Fontes: ' + ', '.join(s['sources']), '']
    for source in m['sources']:
        lines += [f"- {source['id']}: {source['title']} — {source['url']} (consultada {source['accessed']})", '  Evidência: ' + source['supports']]
    (root / 'sources.md').write_text('\n'.join(lines) + '\n')
    m['status']['research'] = 'validated'

def narrate(m, root):
    contract(m)
    audio_path = root / m['files'].get('audio', '__missing__')
    captions_path = root / m['files'].get('captions', '__missing__')
    if m['files'].get('voice_input_key') == voice_input(m, root) and audio_path.is_file() and captions_path.is_file() and m['timestamps'] and filehash(audio_path) == m['files'].get('audio_sha256') and filehash(captions_path) == m['files'].get('captions_sha256'):
        m['status']['narration'] = 'validated'
        print('Áudio e timestamps atuais reutilizados', flush=True)
        return
    cfg = m['voice']
    provider = cfg['provider']
    work = root / 'work/audio'
    work.mkdir(parents=True, exist_ok=True)
    chunks = []
    texts = [(s, i, t) for s in m['scenes'] for i, t in enumerate(s['narration'])]
    if provider == 'existing':
        audio = (root / cfg['audio']).resolve()
        cues = json.loads((root / cfg['timestamps']).read_text())
        assert len(cues) == len(texts), 'Áudio existente exige timestamps de cada trecho'
        total = duration(audio)
        previous = 0
        for (s, i, text), cue in zip(texts, cues):
            assert cue['text'] == text and cue['start'] >= previous and cue['end'] > cue['start'] and cue['end'] <= total + .02, 'Timestamps incompatíveis'
            previous = cue['end']
            chunks.append(dict(cue, scene=s['id']))
        run([ffmpeg(), '-y', '-v', 'error', '-i', audio, '-ar', '22050', '-ac', '1', work / 'narration.wav'])
    else:
        assert provider in ('piper', 'command'), 'Provedor desconhecido'
        if provider == 'piper':
            from piper import PiperVoice, SynthesisConfig
            model = Path(cfg['model'])
            if not model.is_absolute():
                model = KIT / model
            assert model.exists(), 'Modelo ausente: execute setup.py'
            voice = PiperVoice.load(model)
            identity = {'model': filehash(model), 'config': filehash(str(model) + '.json')}
        else:
            assert cfg.get('commercial_reviewed') and cfg.get('free_local'), 'Adaptador só aceita comando local gratuito com licença revisada'
            identity = {'command': cfg['command'], 'revision': cfg['revision']}
        combined = bytearray()
        cursor = 0.0
        rate = 22050
        for s, i, text in texts:
            key = digest([text, identity, cfg.get('length_scale', 1.0)])
            path = work / (key + '.wav')
            if not path.exists():
                temporary = work / (key + '.tmp.wav')
                if provider == 'piper':
                    with wave.open(str(temporary), 'wb') as output:
                        voice.synthesize_wav(text, output, SynthesisConfig(length_scale=cfg.get('length_scale', 1.0), noise_scale=0, noise_w_scale=0))
                else:
                    input_path = work / (key + '.txt')
                    input_path.write_text(text)
                    argv = [a.replace('{text_file}', str(input_path)).replace('{output}', str(temporary)) for a in cfg['command']]
                    result = subprocess.run(argv, capture_output=True)
                    if result.returncode:
                        raise RuntimeError('Adaptador local falhou; stderr omitido para proteger dados do provedor')
                normalized = work / (key + '.normalized.wav')
                run([ffmpeg(), '-y', '-v', 'error', '-i', temporary, '-ar', rate, '-ac', '1', '-c:a', 'pcm_s16le', normalized])
                normalized.replace(path)
                temporary.unlink()
            with wave.open(str(path), 'rb') as source:
                assert source.getframerate() == rate and source.getnchannels() == 1 and source.getsampwidth() == 2
                frames = source.readframes(source.getnframes())
                seconds = source.getnframes() / rate
            chunks.append({'scene': s['id'], 'text': text, 'start': cursor, 'end': cursor + seconds, 'file': str(path.relative_to(root))})
            combined.extend(frames)
            # Fixed pause, measured and included in the final timeline.
            pause = cfg.get('pause', .12)
            combined.extend(b'\0\0' * round(rate * pause))
            cursor += seconds + round(rate * pause) / rate
        with wave.open(str(work / 'narration.wav'), 'wb') as out:
            out.setparams((1, 2, rate, 0, 'NONE', 'not compressed'))
            out.writeframes(combined)
    total = duration(work / 'narration.wav')
    for index, s in enumerate(m['scenes']):
        local = [c for c in chunks if c['scene'] == s['id']]
        s['start'] = local[0]['start']
        s['end'] = next((c['start'] for c in chunks if c['scene'] == m['scenes'][index + 1]['id']), total) if index + 1 < len(m['scenes']) else total
    m['timestamps'] = chunks
    m['duration'] = total
    m['files']['audio'] = 'work/audio/narration.wav'
    m['files']['audio_sha256'] = filehash(work / 'narration.wav')
    m['files']['voice_input_key'] = voice_input(m, root)
    save(root / 'work/timestamps.json', chunks)
    def stamp(t):
        ms = round(t * 1000)
        return f'{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02},{ms % 1000:03}'
    srt = '\n\n'.join(f"{i+1}\n{stamp(c['start'])} --> {stamp(c['end'])}\n{c['text']}" for i, c in enumerate(chunks)) + '\n'
    (root / 'final').mkdir(exist_ok=True)
    (root / 'final/captions.srt').write_text(srt)
    m['files']['captions'] = 'final/captions.srt'
    m['files']['captions_sha256'] = filehash(root / 'final/captions.srt')
    m['status']['narration'] = 'validated'

def render(m, root, only=None):
    from playwright.sync_api import sync_playwright
    assert m['timestamps'], 'Execute narration antes de render'
    contract(m)
    assert only is None or only in [s['id'] for s in m['scenes']], 'ID de cena inexistente'
    assert voice_input(m, root) == m['files']['voice_input_key'], 'Roteiro/voz mudou; execute narration'
    assert filehash(root / m['files']['audio']) == m['files']['audio_sha256'], 'Áudio mudou; execute narration'
    os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', str(KIT / '.browsers'))
    fps = m['format']['fps']
    width, height = m['format']['width'], m['format']['height']
    frames = root / 'work/frames'
    frames.mkdir(parents=True, exist_ok=True)
    scene_files = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': width, 'height': height}, device_scale_factor=1)
        page.goto(ASSETS.joinpath('scene.html').as_uri())
        page.evaluate('async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode())); }')
        for scene in m['scenes']:
            first = math.ceil(scene['start'] * fps - 1e-7)
            last = math.ceil(scene['end'] * fps - 1e-7)
            payload, custom_source, key = scene_payload(m, scene, root)
            directory = frames / scene['id'] / key
            directory.mkdir(parents=True, exist_ok=True)
            if only and only != scene['id']:
                assert all((directory / f'{i:06}.jpg').exists() for i in range(first, last)), 'Cena não selecionada desatualizada; rode render completo'
            else:
                page.evaluate('(p) => window.configure(p)', payload)
                page.evaluate('window.customDraw = null')
                page.evaluate('window.ready = Promise.resolve()')
                if custom_source:
                    page.add_script_tag(content=custom_source)
                page.evaluate('async () => { await window.ready; await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode())); }')
                for index in range(first, last):
                    path = directory / f'{index:06}.jpg'
                    if path.exists():
                        continue
                    page.evaluate('(t) => window.renderAt(t)', index / fps - scene['start'])
                    tmp = path.with_suffix('.tmp.jpg')
                    page.screenshot(path=str(tmp), type='jpeg', quality=94, animations='disabled')
                    tmp.replace(path)
                print(f"frames {scene['id']}: {last-first} ({key[:8]})", flush=True)
            scene['frame_key'] = key
            scene_files.extend(directory / f'{i:06}.jpg' for i in range(first, last))
        browser.close()
    sequence = root / 'work/sequence'
    if sequence.exists():
        shutil.rmtree(sequence)
    sequence.mkdir()
    for i, frame in enumerate(scene_files):
        (sequence / f'{i:06}.jpg').symlink_to(frame.resolve())
    m['frame_count'] = len(scene_files)
    m['files']['frames'] = 'work/sequence'
    m['status']['render'] = 'validated'

def encode(m, root):
    assert m['status'].get('render') == 'validated', 'Render ausente'
    assert voice_input(m, root) == m['files']['voice_input_key'], 'Narração desatualizada'
    assert filehash(root / m['files']['audio']) == m['files']['audio_sha256'], 'Áudio alterado'
    for scene in m['scenes']:
        assert scene_payload(m, scene, root)[2] == scene['frame_key'], 'Cena alterada; execute render antes de encode'
    output = root / 'final/video.mp4'
    signature = digest([m['files']['audio_sha256'], filehash(root / m['files']['captions']), [(s['id'], s['frame_key']) for s in m['scenes']], m['format'], 'h264-crf20-aac160-tv-v2'])
    if m['files'].get('encode_key') == signature and output.exists() and filehash(output) == m['files'].get('video_sha256'):
        m['status']['encode'] = 'validated'
        print('MP4 atual reutilizado', flush=True)
        return
    tmp = output.with_name('video.tmp.mp4')
    run([ffmpeg(), '-y', '-v', 'error', '-framerate', m['format']['fps'], '-i', root / 'work/sequence/%06d.jpg', '-i', root / m['files']['audio'], '-i', root / m['files']['captions'], '-map', '0:v', '-map', '1:a', '-map', '2:s', '-c:v', 'libx264', '-preset', 'fast', '-crf', '20', '-vf', 'scale=in_range=pc:out_range=tv,format=yuv420p', '-pix_fmt', 'yuv420p', '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-c:a', 'aac', '-b:a', '160k', '-c:s', 'mov_text', '-metadata:s:s:0', 'language=por' if m['language'] == 'pt-BR' else 'language=eng', '-movflags', '+faststart', tmp])
    tmp.replace(output)
    m['files']['video'] = 'final/video.mp4'
    m['files']['video_sha256'] = filehash(output)
    m['files']['encode_key'] = signature
    if m.get('review', {}).get('video_sha256') != m['files']['video_sha256']:
        m['review'] = {'status': 'pending'}
    m['status']['encode'] = 'validated'

def validate(m, root):
    import numpy as np
    video = root / m['files']['video']
    info = probe(video)
    streams = info['streams']
    v = next(s for s in streams if s['codec_type'] == 'video')
    a = next(s for s in streams if s['codec_type'] == 'audio')
    sub = next(s for s in streams if s['codec_type'] == 'subtitle')
    assert v['codec_name'] == 'h264' and v['pix_fmt'] == 'yuv420p'
    assert [v['width'], v['height']] == [m['format']['width'], m['format']['height']]
    n, d = map(int, v['avg_frame_rate'].split('/'))
    assert abs(n / d - m['format']['fps']) < .001
    assert a['codec_name'] == 'aac' and sub['codec_name'] == 'mov_text'
    assert abs(float(v.get('start_time', 0)) - float(a.get('start_time', 0))) <= 1 / m['format']['fps'], 'Offset A/V'
    assert filehash(root / m['files']['captions']) == m['files']['captions_sha256'], 'Legendas externas alteradas'
    assert abs(float(v['duration']) - m['duration']) <= 1 / m['format']['fps'] + .02
    assert abs(float(a['duration']) - m['duration']) < .10, 'Desvio de áudio'
    assert abs(m['duration'] - m['target_duration']) <= m.get('duration_tolerance', 8), 'Duração fora da tolerância; revise texto ou length_scale'
    previous = 0
    for cue in m['timestamps']:
        assert previous <= cue['start'] < cue['end'] <= m['duration'] + .01
        s = next(s for s in m['scenes'] if s['id'] == cue['scene'])
        assert s['start'] <= cue['start'] and cue['end'] <= s['end'] + .001
        previous = cue['end']
    with wave.open(str(root / m['files']['audio'])) as audio:
        samples = np.frombuffer(audio.readframes(audio.getnframes()), dtype='<i2').astype(float) / 32768
    rms = float(np.sqrt(np.mean(samples ** 2)))
    clipping = float(np.mean(np.abs(samples) >= .999))
    assert rms > .008, 'Áudio silencioso'
    assert clipping < .002, 'Clipping excessivo'
    decoded = subprocess.run([ffmpeg(), '-v', 'error', '-i', str(video), '-map', '0:a:0', '-ac', '1', '-ar', '22050', '-f', 'f32le', '-'], capture_output=True, check=True)
    actual = np.frombuffer(decoded.stdout, dtype='<f4')
    count = min(len(samples), len(actual))
    correlation = float(np.corrcoef(samples[:count], actual[:count])[0, 1])
    assert correlation > .95, 'Áudio do MP4 não corresponde à narração'
    run([ffmpeg(), '-v', 'error', '-xerror', '-i', video, '-f', 'null', '-'])
    review = root / 'review'
    review.mkdir(exist_ok=True)
    sample_times = {}
    for name, desired in [('start', .8), ('middle', m['duration'] / 2), ('end', m['duration'] - 1)]:
        cue = min(m['timestamps'], key=lambda c: abs((c['start'] + c['end']) / 2 - desired))
        t = min(max(desired, cue['start'] + .1), cue['end'] - .1)
        sample_times[name] = t
        run([ffmpeg(), '-y', '-v', 'error', '-ss', t, '-i', video, '-frames:v', '1', review / (name + '.png')])
    report = {'technical': 'passed', 'duration': m['duration'], 'video_duration': float(v['duration']), 'audio_duration': float(a['duration']), 'resolution': [v['width'], v['height']], 'fps': n / d, 'rms_dbfs': 20 * math.log10(rms), 'clipping_fraction': clipping, 'full_decode': 'passed', 'subtitle_stream': 'mov_text + burned-in', 'sync': 'measured chunk boundaries; not word alignment', 'editorial_review': m.get('review', {'status': 'pending'}), 'sha256': filehash(video)}
    save(review / 'validation.json', report)
    report['encoded_audio_correlation'] = correlation
    save(review / 'validation.json', report)
    save(review / 'sample-times.json', sample_times)
    m['status']['validation'] = 'technical_passed'
    print(json.dumps(report, ensure_ascii=False, indent=2))

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('stage', choices=['research', 'narration', 'render', 'encode', 'validate', 'run'])
    parser.add_argument('manifest', type=Path)
    parser.add_argument('--scene', help='Recaptura apenas esta cena se as outras estão atuais')
    args = parser.parse_args()
    path = args.manifest.resolve()
    root = path.parent
    lock = open(root / '.run.lock', 'w')
    try:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        raise SystemExit('Outra execução usa este manifesto')
    m = json.loads(path.read_text())
    stages = ['research', 'narration', 'render', 'encode', 'validate'] if args.stage == 'run' else [args.stage]
    funcs = {'research': research, 'narration': narrate, 'render': render, 'encode': encode, 'validate': validate}
    for stage in stages:
        m['status'][stage] = 'running'
        save(path, m)
        try:
            if stage == 'render':
                funcs[stage](m, root, args.scene)
            else:
                funcs[stage](m, root)
        except (Exception, KeyboardInterrupt) as error:
            m['status'][stage] = 'failed'
            m['last_error'] = {'stage': stage, 'message': str(error), 'time': time.time()}
            save(path, m)
            raise
        m.pop('last_error', None)
        save(path, m)

if __name__ == '__main__':
    main()
