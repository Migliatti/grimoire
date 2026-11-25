#!/usr/bin/env python3
"""Install three discoverable skills without replacing an existing skill."""
import os
from pathlib import Path
import shutil
source=Path(__file__).resolve().parents[2]
kit=source.parent.resolve()
target=Path(os.environ.get('CODEX_HOME',str(Path.home()/'.codex')))/'skills'
names=['edu-research','edu-narration','edu-video']
for name in names:
 if (target/name).exists():raise SystemExit(f'Já existe {target/name}; compare antes de substituir.')
target.mkdir(parents=True,exist_ok=True)
for name in names:
 shutil.copytree(source/name,target/name,ignore=shutil.ignore_patterns('__pycache__'))
config=target/'edu-video/references/runtime.json'
config.write_text(__import__('json').dumps({'kit':str(kit),'python':str(kit/'.venv/bin/python')},indent=2)+'\n')
print('Instaladas: '+', '.join(str(target/n) for n in names))
