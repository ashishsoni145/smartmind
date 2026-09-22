export type ConceptRelationshipType =
  | 'prerequisite_of'
  | 'part_of'
  | 'related_to'
  | 'enables'
  | 'common_misconception_of';

export interface ConceptMisconception {
  misconception: string;
  explanation: string;
  remedy?: string;
}

export interface Concept {
  id: string;
  code: string;
  title: string;
  summary: string;
  learningObjectives: string[];
  subjectId: string;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  misconceptions: ConceptMisconception[];
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeGraphEdge {
  id: string;
  sourceConceptId: string;
  targetConceptId: string;
  relationshipType: ConceptRelationshipType;
  weight: number;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface PrerequisiteNode {
  conceptId: string;
  conceptCode: string;
  conceptTitle: string;
  depth: number;
  path: string[];
}

export interface ConceptWithGraph extends Concept {
  prerequisites?: PrerequisiteNode[];
  relatedConcepts?: Concept[];
  curriculumNodes?: Array<{ id: string; code: string; title: string; nodeType: string }>;
}
