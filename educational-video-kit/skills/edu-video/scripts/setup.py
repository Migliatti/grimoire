#!/usr/bin/env python3
"""Install free local dependencies; downloads are explicit, never paid calls."""
import argparse
import os
from pathlib import Path
import platform
import subprocess
import sys
import urllib.request
import hashlib
import json
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--english', action='store_true')
p.add_argument('--asr', action='store_true')
a=p.parse_args()
config=Path(__file__).resolve().parents[1]/'references/runtime.json'
default_kit=json.loads(config.read_text())['kit'] if config.exists() else Path(__file__).resolve().parents[3]
kit=Path(os.environ.get('EDU_VIDEO_HOME',default_kit))
python=kit/'.venv/bin/python'
def call(argv,**kwargs):subprocess.run([str(x) for x in argv],check=True,**kwargs)
if not python.exists():call([sys.executable,'-m','venv',kit/'.venv'])
call([python,'-m','pip','install','-r',kit/'requirements.txt'])
if a.asr:call([python,'-m','pip','install','faster-whisper==1.2.1','av==16.1.0'])
env=dict(os.environ,PLAYWRIGHT_BROWSERS_PATH=str(kit/'.browsers'))
call([python,'-m','playwright','install','chromium'],env=env)
if platform.system()=='Darwin' and platform.machine()=='arm64':
 call(['npm','ci','--prefix',kit])
 (kit/'node_modules/@ffprobe-installer/darwin-arm64/ffprobe').chmod(0o755)
elif not os.environ.get('FFPROBE'):
 print('Instale ffprobe pelo gerenciador do sistema ou configure FFPROBE.')
models=kit/'models';models.mkdir(exist_ok=True)
base='https://huggingface.co/rhasspy/piper-voices/resolve/main/'
voices=[('pt/pt_BR/faber/medium','pt_BR-faber-medium')]
if a.english:voices.append(('en/en_US/lessac/medium','en_US-lessac-medium'))
for folder,name in voices:
 for filename in [name+'.onnx',name+'.onnx.json','MODEL_CARD']:
  target=models/(name+'-MODEL_CARD' if filename=='MODEL_CARD' else filename)
  if not target.exists():
   temporary=target.with_suffix(target.suffix+'.download')
   urllib.request.urlretrieve(base+folder+'/'+filename,temporary)
   temporary.replace(target)
record={f.name:hashlib.sha256(f.read_bytes()).hexdigest() for f in models.iterdir() if f.is_file()}
(models/'download-hashes.json').write_text(json.dumps(record,indent=2)+'\n')
print('Setup concluído; hashes locais registrados. Releia MODEL_CARD antes de trocar voz.')
