#!/usr/bin/env python3
"""Produce local speech or import measured existing audio and cue boundaries."""
import runpy
import sys
from pathlib import Path
sys.argv.insert(1, 'narration')
runpy.run_path(str(Path(__file__).resolve().parents[2] / 'edu-video/scripts/pipeline.py'), run_name='__main__')
