import copy
import importlib.util
import json
import os
from pathlib import Path
import shutil
import tempfile
import unittest
import wave
import subprocess
import sys

KIT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('pipeline',KIT/'skills/edu-video/scripts/pipeline.py')
pipeline=importlib.util.module_from_spec(spec);spec.loader.exec_module(pipeline)
M=json.loads((KIT/'runs/universe-center/manifest.json').read_text())

class PipelineTests(unittest.TestCase):
 def test_unreviewed_research_rejected(self):
  m=copy.deepcopy(M);m['research']['reviewed']=False
  with self.assertRaises(AssertionError):pipeline.contract(m)
 def test_missing_source_rejected(self):
  m=copy.deepcopy(M);m['scenes'][0]['sources']=['not-found']
  with self.assertRaises(AssertionError):pipeline.contract(m)
 def test_visual_instruction_in_speech_rejected(self):
  m=copy.deepcopy(M);m['scenes'][0]['narration']=['[zoom] Uma frase.']
  with self.assertRaises(AssertionError):pipeline.contract(m)
 def test_existing_real_audio_and_cues(self):
  with tempfile.TemporaryDirectory() as directory:
   root=Path(directory);(root/'inputs').mkdir()
   shutil.copy(KIT/'runs/universe-center/work/audio/narration.wav',root/'inputs/audio.wav')
   cues=[{k:c[k] for k in ['text','start','end']} for c in M['timestamps']]
   (root/'inputs/cues.json').write_text(json.dumps(cues))
   m=copy.deepcopy(M);m['voice']={'provider':'existing','audio':'inputs/audio.wav','timestamps':'inputs/cues.json'}
   pipeline.narrate(m,root)
   self.assertAlmostEqual(m['duration'],M['duration'],places=4)
   with wave.open(str(root/'work/audio/narration.wav')) as imported, wave.open(str(KIT/'runs/universe-center/work/audio/narration.wav')) as original:
    self.assertEqual(imported.readframes(imported.getnframes()),original.readframes(original.getnframes()))
   self.assertEqual([c['start'] for c in m['timestamps']],[c['start'] for c in M['timestamps']])
   cues[0]['end']=1000;(root/'inputs/cues.json').write_text(json.dumps(cues))
   with self.assertRaises(AssertionError):pipeline.narrate(m,root)
 def test_cache_and_repair_isolation(self):
  root=KIT/'runs/universe-center';m=copy.deepcopy(M)
  before=[pipeline.scene_payload(m,s,root)[2] for s in m['scenes']]
  self.assertEqual(before,[s['frame_key'] for s in M['scenes']])
  m['scenes'][2]['takeaway']='Uma alteração somente nesta cena'
  after=[pipeline.scene_payload(m,s,root)[2] for s in m['scenes']]
  self.assertEqual([i for i in range(len(before)) if before[i]!=after[i]],[2])
 def test_deterministic_out_of_order_frames(self):
  from playwright.sync_api import sync_playwright
  os.environ['PLAYWRIGHT_BROWSERS_PATH']=str(KIT/'.browsers')
  with sync_playwright() as p:
   browser=p.chromium.launch();page=browser.new_page(viewport={'width':1080,'height':1920})
   page.goto((KIT/'skills/edu-video/assets/scene.html').as_uri())
   payload,_,_=pipeline.scene_payload(M,M['scenes'][2],KIT/'runs/universe-center')
   page.evaluate('(p)=>window.configure(p)',payload)
   page.evaluate('()=>document.fonts.ready')
   page.evaluate('window.renderAt(2.5)');first=page.screenshot()
   page.evaluate('window.renderAt(8)');self.assertNotEqual(first,page.screenshot());page.evaluate('window.renderAt(2.5)')
   self.assertEqual(first,page.screenshot());browser.close()
 def test_install_to_isolated_codex_home(self):
  with tempfile.TemporaryDirectory() as directory:
   env=dict(os.environ,CODEX_HOME=directory)
   script=KIT/'skills/edu-video/scripts/install_skills.py'
   subprocess.run([sys.executable,str(script)],env=env,check=True,capture_output=True)
   runtime=json.loads((Path(directory)/'skills/edu-video/references/runtime.json').read_text())
   self.assertEqual(runtime['kit'],str(KIT))
   result=subprocess.run([sys.executable,str(script)],env=env,capture_output=True)
   self.assertNotEqual(result.returncode,0)

if __name__=='__main__':unittest.main(verbosity=2)
