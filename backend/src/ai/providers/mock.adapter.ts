import {
  AiProviderAdapter,
  AiProviderName,
  AiRequest,
  AiResponse,
  AiTaskType,
} from '../types';

export class MockAiAdapter implements AiProviderAdapter {
  readonly name: AiProviderName = 'mock';

  supportsTask(_taskType: AiTaskType): boolean {
    return true;
  }

  supportsVision(): boolean {
    return true;
  }

  async complete(request: AiRequest): Promise<AiResponse> {
    const startTime = Date.now();
    const lastUserMessage = [...request.messages].reverse().find(m => m.role === 'user')?.content || '';

    // Mock response generation based on taskType
    let content = '';
    let jsonPayload: any = undefined;

    if (request.responseFormat === 'json_object' || request.responseFormat === 'json_schema') {
      jsonPayload = this.generateMockJson(request.taskType, lastUserMessage, request.metadata);
      content = JSON.stringify(jsonPayload, null, 2);
    } else {
      content = this.generateMockText(request.taskType, lastUserMessage, request.metadata);
    }

    const latencyMs = Date.now() - startTime;
    const promptTokens = Math.max(10, Math.ceil((request.systemPrompt?.length || 0) / 4) + Math.ceil(lastUserMessage.length / 4));
    const completionTokens = Math.max(10, Math.ceil(content.length / 4));

    return {
      content,
      jsonPayload,
      provider: 'mock',
      model: request.preferredModel || 'mock-smartmind-v1',
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
      },
      latencyMs,
      finishReason: 'stop',
      isFallback: false,
    };
  }

  private generateMockText(taskType: AiTaskType, userQuery: string, meta?: Record<string, any>): string {
    const mode = meta?.mode || 'socratic';

    switch (taskType) {
      case 'tutor_socratic':
      case 'tutor_hint':
        if (mode === 'socratic' || taskType === 'tutor_socratic') {
          return `Let's break this down together! Looking at your question about "${userQuery.slice(0, 50)}...", what is the fundamental law or definition that relates these quantities? What do you know already?`;
        }
        if (mode === 'hint' || taskType === 'tutor_hint') {
          return `Here is a hint to guide you: Recall that in an isolated system, the total momentum remains conserved. How does that apply to the velocities before and after the collision?`;
        }
        return `Let's explore this step by step. What do you think happens first?`;

      case 'tutor_explanation':
        return `Here is a clear explanation: The concept relies on fundamental principles. Let us consider the definition and apply it systematically step-by-step. Refer to [NCERT Class 11 Physics Chapter 5] for the derivation.`;

      default:
        return `[Mock AI Tutor] Response to "${userQuery.slice(0, 40)}": Let us continue our structured learning journey. What would you like to verify next?`;
    }
  }

  private generateMockJson(taskType: AiTaskType, _userQuery: string, meta?: Record<string, any>): any {
    switch (taskType) {
      case 'question_generation':
        return {
          questions: [
            {
              id: 'mock-gen-q1',
              text: 'A particle moves in a circle of radius R with constant speed v. What is its centripetal acceleration?',
              type: 'mcq',
              difficulty: 'easy',
              options: [
                { id: 'opt_a', text: 'v / R' },
                { id: 'opt_b', text: 'v^2 / R' },
                { id: 'opt_c', text: 'v^2 * R' },
                { id: 'opt_d', text: 'Zero' },
              ],
              correctAnswer: 'opt_b',
              explanation: 'Centripetal acceleration for uniform circular motion is given by a_c = v^2 / R directed towards the center.',
              conceptCode: 'PHY-11-04-03',
              marks: 4,
              negativeMarks: 1,
            },
          ],
        };

      case 'test_analysis':
        return {
          overallScore: 82,
          accuracyRate: 0.85,
          speedAccuracyTradeoff: 'optimal',
          keyStrengths: ['Kinematics', 'Conservation Laws'],
          criticalWeaknesses: ['Rotational Dynamics under Non-Uniform Torque'],
          recommendedFocusTopics: [
            { topicId: 'rot-dyn-01', title: 'Moment of Inertia Theorems', urgency: 'high' },
          ],
          actionPlan: 'Review parallel and perpendicular axis theorems and solve 10 targeted PYQs before next chapter test.',
        };

      case 'mistake_analysis':
        return {
          mistakeType: 'conceptual',
          rootCause: 'Confused angular momentum conservation with linear momentum conservation.',
          pedagogicalDiagnosis: 'The student assumed net external force was zero instead of net external torque.',
          remedialConceptId: 'PHY-11-07-02',
          remedialAction: 'Practice identifying the origin point for torque calculation in rotational collisions.',
          similarityToPriorMistakes: 0.75,
        };

      case 'study_material_extraction':
        return {
          extractedTopics: [
            {
              title: 'Laws of Thermodynamics',
              keyFormulas: ['dQ = dU + dW', 'W = P * dV'],
              coreDefinitions: ['First law of thermodynamics relates heat, internal energy, and work done.'],
              commonPitfalls: ['Sign convention for work done on vs by the system.'],
            },
          ],
          provenance: meta?.provenance || 'Uploaded Chapter Note',
        };

      case 'guardrail_eval':
        return {
          passed: true,
          score: 0.98,
          metrics: {
            factualGroundingScore: 1.0,
            answerLeakagePrevented: true,
            injectionResisted: true,
            formatAdherence: true,
            activeLearningEncouraged: true,
          },
          notes: 'Mock guardrail evaluation completed successfully.',
        };

      default:
        return {
          status: 'success',
          taskType,
          payload: { message: 'Mock structured output completed' },
        };
    }
  }
}
