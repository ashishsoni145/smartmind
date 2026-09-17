# tools/build_all_ncert_curriculum.py
import json
import os
import re

print("Compiling full 106 chapters NCERT Curriculum...")

# Load chapter manifest
with open('e:/mind/tools/chapters_manifest.json', 'r', encoding='utf-8') as f:
    CHAPTERS = json.load(f)

print(f"Loaded {len(CHAPTERS)} chapters.")
