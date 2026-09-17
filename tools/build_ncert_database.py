# tools/build_ncert_database.py
# Comprehensive NCERT Curriculum Generator for all 106 Chapters
import json
import os

with open('e:/mind/tools/chapters_manifest.json', 'r', encoding='utf-8') as f:
    chapters = json.load(f)

print(f"Loaded {len(chapters)} chapters from manifest.")
