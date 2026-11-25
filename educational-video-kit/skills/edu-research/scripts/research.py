#!/usr/bin/env python3
"""Validate reviewed research and export clean narration/source ledger."""
import runpy
import sys
from pathlib import Path
sys.argv.insert(1, 'research')
runpy.run_path(str(Path(__file__).resolve().parents[2] / 'edu-video/scripts/pipeline.py'), run_name='__main__')
