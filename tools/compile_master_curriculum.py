# tools/compile_master_curriculum.py
import sys
import json
import os

sys.path.append('e:/mind/tools/data')
from physics_catalog import get_physics_catalog
from chemistry_catalog import get_chemistry_catalog
from mathematics_catalog import get_mathematics_catalog
from biology_catalog import get_biology_catalog

print("Loading all 4 subject catalogs...")
phy = get_physics_catalog()
chem = get_chemistry_catalog()
math = get_mathematics_catalog()
bio = get_biology_catalog()

catalog = {}
catalog.update(phy)
catalog.update(chem)
catalog.update(math)
catalog.update(bio)

print(f"Total authentic chapters in catalogs: {len(catalog)}")

with open('e:/mind/tools/chapters_manifest.json', 'r', encoding='utf-8') as f:
    chapters = json.load(f)

print(f"Loaded {len(chapters)} chapters from manifest.")

all_topics_data = {}
updated_chapters = []

for ch in chapters:
    ch_id = ch['id']
    code = ch['code']
    subject_id = ch['subjectId']
    grade_id = ch['gradeId']
    board_id = ch['boardId']
    
    topics_raw = catalog.get(code, [])
    if not topics_raw:
        print(f"WARNING: No catalog topics for {code}!")
        continue
    
    num_topics = len(topics_raw)
    ch_copy = dict(ch)
    ch_copy['topicsCount'] = num_topics
    updated_chapters.append(ch_copy)
    
    topic_nodes = []
    for idx, t in enumerate(topics_raw, start=1):
        topic_id = f"top-{code.lower()}-{idx:02d}"
        topic_code = f"{code}-T{idx:02d}"
        weightage = round(ch.get('weightagePercent', 4.0) / num_topics, 1)
        sim_id = t.get('simulationId')
        
        # Build artifacts
        if sim_id:
            artifacts = [
                {
                    "id": f"art-sim-{topic_id}",
                    "title": f"{t['title']} Interactive 3D Simulation",
                    "description": f"Contained real-time 3D simulation for {t['title']} with responsive parameters.",
                    "artifactType": "3d_simulation",
                    "simulationId": sim_id
                }
            ]
        else:
            artifacts = [
                {
                    "id": f"art-model-{topic_id}",
                    "title": f"{t['title']} Conceptual Visual Model",
                    "description": f"Orthogonal visual breakdown and parameter relationships for {t['title']}.",
                    "artifactType": "concept_model"
                }
            ]
            
        concepts = [
            {
                "id": f"c-{topic_id}",
                "title": t['title'],
                "summary": t['desc'],
                **({"simulationId": sim_id} if sim_id else {})
            }
        ]
        
        node = {
            "id": topic_id,
            "subjectId": subject_id,
            "gradeId": grade_id,
            "boardId": board_id,
            "parentId": ch_id,
            "nodeType": "topic",
            "code": topic_code,
            "title": t['title'],
            "description": t['desc'],
            "sequenceOrder": idx,
            "weightagePercent": weightage,
            "estimatedMinutes": 45,
            "masteryStatus": "uncalibrated",
            "retentionPercent": 100,
            "notes": {
                "overview": t['notesOverview'],
                "sections": t['notesSections'],
                "commonMisconceptions": t.get('misconceptions', [])
            },
            "formulas": t.get('formulas', []),
            "artifacts": artifacts,
            "concepts": concepts
        }
        topic_nodes.append(node)
        
    all_topics_data[ch_id] = topic_nodes

print(f"Generated authentic topics for {len(all_topics_data)} chapters.")
total_topics_count = sum(len(ts) for ts in all_topics_data.values())
print(f"Total topics generated across all subjects: {total_topics_count}")

# 1. Output ncert-topics-data.ts
topics_ts_path = 'e:/mind/apps/web/src/lib/curriculum/fixtures/ncert-topics-data.ts'
print(f"Writing {topics_ts_path}...")
with open(topics_ts_path, 'w', encoding='utf-8') as f:
    f.write("import type { TopicNode } from '@/lib/types/curriculum';\n\n")
    f.write("export const ALL_NCERT_TOPICS: Record<string, TopicNode[]> = ")
    json.dump(all_topics_data, f, indent=2, ensure_ascii=False)
    f.write(";\n")

print("Finished writing ncert-topics-data.ts.")

# 2. Output ncert-chapters-data.ts
chapters_ts_path = 'e:/mind/apps/web/src/lib/curriculum/fixtures/ncert-chapters-data.ts'
print(f"Writing {chapters_ts_path}...")
with open(chapters_ts_path, 'w', encoding='utf-8') as f:
    f.write("import type { ChapterNode } from '@/lib/types/curriculum';\n\n")
    f.write("export const ALL_NCERT_CHAPTERS: ChapterNode[] = ")
    json.dump(updated_chapters, f, indent=2, ensure_ascii=False)
    f.write(";\n")

print("Master curriculum compilation complete!")
