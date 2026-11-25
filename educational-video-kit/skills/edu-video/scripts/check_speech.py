#!/usr/bin/env python3
"""Independently transcribe actual MP4 audio locally and compare scene windows."""
import argparse
import difflib
import hashlib
import json
import os
from pathlib import Path
import re
import unicodedata
from faster_whisper import WhisperModel
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('manifest',type=Path)
p.add_argument('--model',default='small')
a=p.parse_args();path=a.manifest.resolve();root=path.parent;m=json.loads(path.read_text())
config=Path(__file__).resolve().parents[1]/'references/runtime.json'
default_kit=json.loads(config.read_text())['kit'] if config.exists() else Path(__file__).resolve().parents[3]
kit=Path(os.environ.get('EDU_VIDEO_HOME',default_kit))
model=WhisperModel(a.model,device='cpu',compute_type='int8',download_root=str(kit/'models/whisper'))
video_hash=hashlib.sha256((root/m['files']['video']).read_bytes()).hexdigest()
segments,info=model.transcribe(str(root/m['files']['video']),language='pt' if m['language']=='pt-BR' else 'en',word_timestamps=True,beam_size=5,vad_filter=False)
actual=[{'start':s.start,'end':s.end,'text':s.text,'words':[{'start':w.start,'end':w.end,'text':w.word} for w in s.words]} for s in segments]
def normalize(t):return re.findall(r'\w+',unicodedata.normalize('NFKD',t.lower()).encode('ascii','ignore').decode())
checks=[]
for s in m['scenes']:
 words=[w['text'] for seg in actual for w in seg['words'] if s['start']<= (w['start']+w['end'])/2 < s['end']]
 expected=normalize(' '.join(s['narration']));heard=normalize(' '.join(words))
 checks.append({'scene':s['id'],'window':[s['start'],s['end']],'expected':' '.join(s['narration']),'recognized':' '.join(words),'similarity':difflib.SequenceMatcher(None,expected,heard,autojunk=False).ratio()})
assert video_hash==hashlib.sha256((root/m['files']['video']).read_bytes()).hexdigest(), 'MP4 mudou durante ASR; repita'
report={'video_sha256':video_hash,'audio_sha256':m['files']['audio_sha256'],'model':a.model,'language':info.language,'language_probability':info.language_probability,'segments':actual,'scene_checks':checks,'note':'Reconhecimento independente auxilia revisão; não substitui escuta humana nem é alinhamento forçado.'}
(root/'review').mkdir(exist_ok=True)
(root/'review/speech-check.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(checks,ensure_ascii=False,indent=2))
