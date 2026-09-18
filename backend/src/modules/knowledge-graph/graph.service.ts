import { supabase } from '../../db/client';
import { BadRequestError, NotFoundError } from '../../lib/errors';
import {
  ListConceptsQueryInput,
  CreateConceptInput,
  CreateEdgeInput,
  MapConceptToNodeInput,
} from './graph.schema';

export class GraphService {
  public static async listConcepts(filters: ListConceptsQueryInput) {
    let q = supabase
      .from('concepts')
      .select('*', { count: 'exact' })
      .order('code', { ascending: true });

    if (filters.subjectId) q = q.eq('subject_id', filters.subjectId);
    if (filters.difficultyLevel) q = q.eq('difficulty_level', filters.difficultyLevel);

    const from = (filters.page - 1) * filters.limit;
    const to = from + filters.limit - 1;

    const { data, count, error } = await q.range(from, to);
    if (error) throw new BadRequestError(error.message);

    return {
      concepts: data || [],
      total: count || 0,
    };
  }

  public static async getConceptById(id: string) {
    const { data: concept, error } = await supabase
      .from('concepts')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new BadRequestError(error.message);
    if (!concept) throw new NotFoundError('Concept not found');

    // Fetch immediate prerequisites and related concepts
    const [prereqs, related, mappings] = await Promise.all([
      this.getPrerequisites(id),
      this.getRelatedConcepts(id),
      this.getConceptCurriculumNodes(id),
    ]);

    return {
      ...concept,
      prerequisites: prereqs,
      relatedConcepts: related,
      curriculumNodes: mappings,
    };
  }

  public static async getPrerequisites(conceptId: string) {
    // Uses the recursive CTE RPC get_concept_prerequisites defined in Supabase
    const { data, error } = await supabase.rpc('get_concept_prerequisites', {
      start_concept_id: conceptId,
      max_depth: 5,
    });

    if (error) {
      // Fallback to direct edges query if RPC is unavailable
      const { data: directEdges } = await supabase
        .from('knowledge_graph_edges')
        .select('source_concept_id, weight, concepts:source_concept_id (id, code, title)')
        .eq('target_concept_id', conceptId)
        .eq('relationship_type', 'prerequisite_of');

      return (directEdges || []).map((e: any) => ({
        conceptId: e.concepts?.id,
        conceptCode: e.concepts?.code,
        conceptTitle: e.concepts?.title,
        depth: 1,
        path: [conceptId, e.source_concept_id],
      }));
    }

    return (data || []).map((row: any) => ({
      conceptId: row.concept_id,
      conceptCode: row.concept_code,
      conceptTitle: row.concept_title,
      depth: row.depth,
      path: row.path,
    }));
  }

  public static async getRelatedConcepts(conceptId: string) {
    const { data: edges, error } = await supabase
      .from('knowledge_graph_edges')
      .select(`
        id,
        relationship_type,
        weight,
        source:source_concept_id (id, code, title),
        target:target_concept_id (id, code, title)
      `)
      .or(`source_concept_id.eq.${conceptId},target_concept_id.eq.${conceptId}`)
      .neq('relationship_type', 'prerequisite_of');

    if (error) throw new BadRequestError(error.message);

    return (edges || []).map((e: any) => {
      const other = e.source.id === conceptId ? e.target : e.source;
      return {
        id: other.id,
        code: other.code,
        title: other.title,
        relationshipType: e.relationship_type,
        weight: e.weight,
      };
    });
  }

  public static async getConceptCurriculumNodes(conceptId: string) {
    const { data, error } = await supabase
      .from('concept_curriculum_mappings')
      .select(`
        curriculum_node:curriculum_node_id (
          id,
          code,
          title,
          node_type,
          subject_id
        )
      `)
      .eq('concept_id', conceptId);

    if (error) throw new BadRequestError(error.message);
    return (data || []).map((m: any) => m.curriculum_node);
  }

  public static async getCurriculumNodeConcepts(curriculumNodeId: string) {
    const { data, error } = await supabase
      .from('concept_curriculum_mappings')
      .select(`
        concept:concept_id (
          id,
          code,
          title,
          summary,
          difficulty_level,
          misconceptions
        )
      `)
      .eq('curriculum_node_id', curriculumNodeId);

    if (error) throw new BadRequestError(error.message);
    return (data || []).map((m: any) => m.concept);
  }

  /**
   * Directed Acyclic Graph (DAG) cycle detection
   * Checks if adding edge source -> target would create a cycle in prerequisite graph
   */
  public static async hasPrerequisiteCycle(sourceId: string, targetId: string): Promise<boolean> {
    if (sourceId === targetId) return true;

    // A cycle occurs if sourceId is already reachable from targetId via prerequisite_of edges
    // Using BFS/DFS traversal
    const visited = new Set<string>();
    const queue: string[] = [sourceId];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current === targetId) {
        return true; // Reached targetId from sourceId => cycle!
      }

      visited.add(current);

      // Find all concepts that require current (where current is prerequisite of them)
      const { data: dependents } = await supabase
        .from('knowledge_graph_edges')
        .select('target_concept_id')
        .eq('source_concept_id', current)
        .eq('relationship_type', 'prerequisite_of');

      if (dependents) {
        for (const edge of dependents) {
          if (!visited.has(edge.target_concept_id)) {
            queue.push(edge.target_concept_id);
          }
        }
      }
    }

    return false;
  }

  public static async createConcept(input: CreateConceptInput) {
    const payload = {
      ...(input.id ? { id: input.id } : {}),
      code: input.code,
      title: input.title,
      summary: input.summary,
      learning_objectives: input.learningObjectives,
      subject_id: input.subjectId,
      difficulty_level: input.difficultyLevel,
      misconceptions: input.misconceptions,
      metadata: input.metadata,
    };

    const { data, error } = await supabase
      .from('concepts')
      .upsert(payload, { onConflict: 'code' })
      .select('*')
      .single();

    if (error || !data) throw new BadRequestError(`Failed to create concept: ${error?.message}`);
    return data;
  }

  public static async createEdge(input: CreateEdgeInput) {
    if (input.sourceConceptId === input.targetConceptId) {
      throw new BadRequestError('Self-referential edges are disallowed in knowledge graph');
    }

    // Enforce DAG acyclic constraint for prerequisite relationships
    if (input.relationshipType === 'prerequisite_of') {
      const hasCycle = await this.hasPrerequisiteCycle(input.targetConceptId, input.sourceConceptId);
      if (hasCycle) {
        throw new BadRequestError(
          'Cycle detected: adding this prerequisite edge would create a cycle in the knowledge graph'
        );
      }
    }

    const { data, error } = await supabase
      .from('knowledge_graph_edges')
      .upsert(
        {
          source_concept_id: input.sourceConceptId,
          target_concept_id: input.targetConceptId,
          relationship_type: input.relationshipType,
          weight: input.weight,
          description: input.description,
          metadata: input.metadata,
        },
        { onConflict: 'source_concept_id,target_concept_id,relationship_type' }
      )
      .select('*')
      .single();

    if (error || !data) throw new BadRequestError(`Failed to create edge: ${error?.message}`);
    return data;
  }

  public static async mapConceptToNode(input: MapConceptToNodeInput) {
    const { data, error } = await supabase
      .from('concept_curriculum_mappings')
      .upsert(
        {
          concept_id: input.conceptId,
          curriculum_node_id: input.curriculumNodeId,
        },
        { onConflict: 'concept_id,curriculum_node_id' }
      )
      .select('*')
      .single();

    if (error || !data) throw new BadRequestError(`Mapping failed: ${error?.message}`);
    return data;
  }
}
