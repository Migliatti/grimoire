#!/usr/bin/env python3
"""Create a new editable manifest; does not invent research or clone approval."""
import argparse
import json
import shutil
from pathlib import Path
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('directory', type=Path)
p.add_argument('--topic', required=True)
p.add_argument('--language', choices=['pt-BR','en'], default='pt-BR')
args=p.parse_args()
args.directory.mkdir(parents=True, exist_ok=False)
config=Path(__file__).resolve().parents[1]/'references/runtime.json'
kit=Path(json.loads(config.read_text())['kit']) if config.exists() else Path(__file__).resolve().parents[3]
sample=kit/'examples/universe-center.json'
m=json.loads(sample.read_text())
m.update(topic=args.topic, language=args.language, research={'reviewed':False,'reviewer':'pending'}, sources=[],scenes=[],timestamps=[],files={},status={})
m['voice']['length_scale']=1.0
if args.language=='en':
    m['voice']['model']='models/en_US-lessac-medium.onnx'
    m['voice']['length_scale']=1.0
(args.directory/'manifest.json').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
print(args.directory/'manifest.json')
