import type { TutorAdapter } from './tutor-adapter.interface';
import type {
  TutorSession,
  TutorMessage,
  TutorMode,
  TutorContext,
} from '@/lib/types/tutor';

const SESSIONS_STORAGE_KEY = 'sharpmind_tutor_sessions_v1';
const MESSAGES_STORAGE_KEY = 'sharpmind_tutor_messages_v1';

export class LocalAITutorAdapter implements TutorAdapter {
  public readonly name = 'LocalAITutorAdapter';

  private getStoredSessions(): TutorSession[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(SESSIONS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveSessions(sessions: TutorSession[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    } catch {
      // Ignore
    }
  }

  private getStoredMessages(): Record<string, TutorMessage[]> {
    if (typeof window === 'undefined') return {};
    try {
      const data = localStorage.getItem(MESSAGES_STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  private saveMessages(messagesMap: Record<string, TutorMessage[]>) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messagesMap));
    } catch {
      // Ignore
    }
  }

  public async getSessions(userId: string): Promise<TutorSession[]> {
    const all = this.getStoredSessions();
    const userSessions = all.filter((s) => s.userId === userId);
    if (userSessions.length === 0) {
      // Create initial welcome session
      const defaultSession: TutorSession = {
        id: 'sess-default-welcome',
        userId,
        title: 'Physics: Kinematics & 2D Motion Dialogue',
        subjectId: 'physics',
        currentMode: 'socratic',
        context: {
          subjectId: 'physics',
          topicTitle: 'Kinematics & 2D Projectile Motion',
          grade: 'class_11',
          targetExam: 'JEE Main',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messageCount: 2,
      };

      const defaultMessages: TutorMessage[] = [
        {
          id: 'msg-welcome-1',
          sessionId: defaultSession.id,
          senderRole: 'assistant',
          messageText: `Welcome to SharpMind Socratic Doubt Solver. I am your active learning pedagogical companion.\n\nUnlike traditional tools that dump complete answers, my goal is to guide you to deduce solutions through structured reasoning and first principles.\n\nYou can attach diagrams/equations or select between our 10 learning modes above (Teach, Socratic, Hint, Practice, Quiz, Check Solution, Explain Mistake, Revision, Viva, Exam).\n\nWhat concept or problem are you working through today?`,
          mode: 'socratic',
          citations: [
            { source: 'NCERT Physics', chapterOrDoc: 'Motion in a Straight Line & Plane (Ch 3 & 4)' },
          ],
          createdAt: new Date().toISOString(),
        },
      ];

      this.saveSessions([defaultSession]);
      const map = this.getStoredMessages();
      map[defaultSession.id] = defaultMessages;
      this.saveMessages(map);

      return [defaultSession];
    }

    return userSessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  public async getSession(sessionId: string): Promise<TutorSession | null> {
    const all = this.getStoredSessions();
    return all.find((s) => s.id === sessionId) || null;
  }

  public async createSession(
    userId: string,
    title: string,
    mode: TutorMode,
    context?: TutorContext
  ): Promise<TutorSession> {
    const newSession: TutorSession = {
      id: `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      title: title || (context?.topicTitle ? `${context.topicTitle} Session` : 'New Academic Dialogue'),
      subjectId: context?.subjectId,
      currentMode: mode,
      context,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 0,
    };

    const sessions = this.getStoredSessions();
    sessions.unshift(newSession);
    this.saveSessions(sessions);

    // Add initial pedagogical greeting message
    const initialGreeting: TutorMessage = {
      id: `msg-${Date.now()}`,
      sessionId: newSession.id,
      senderRole: 'assistant',
      messageText: this.generateInitialGreeting(mode, context),
      mode,
      citations: context?.topicTitle
        ? [{ source: 'NCERT Reference', chapterOrDoc: context.topicTitle }]
        : undefined,
      createdAt: new Date().toISOString(),
    };

    const map = this.getStoredMessages();
    map[newSession.id] = [initialGreeting];
    this.saveMessages(map);

    return newSession;
  }

  public async deleteSession(sessionId: string): Promise<boolean> {
    const sessions = this.getStoredSessions().filter((s) => s.id !== sessionId);
    this.saveSessions(sessions);

    const map = this.getStoredMessages();
    delete map[sessionId];
    this.saveMessages(map);

    return true;
  }

  public async getMessages(sessionId: string): Promise<TutorMessage[]> {
    const map = this.getStoredMessages();
    return map[sessionId] || [];
  }

  public async sendMessage(
    sessionId: string,
    messageText: string,
    mode: TutorMode,
    imageUrl?: string,
    context?: TutorContext
  ): Promise<TutorMessage> {
    const userMessage: TutorMessage = {
      id: `msg-user-${Date.now()}`,
      sessionId,
      senderRole: 'student',
      messageText,
      imageUrl,
      mode,
      createdAt: new Date().toISOString(),
    };

    const map = this.getStoredMessages();
    const currentList = map[sessionId] || [];
    currentList.push(userMessage);

    // Simulated pedagogical response generation
    await new Promise((resolve) => setTimeout(resolve, 500));

    const assistantResponse: TutorMessage = {
      id: `msg-ai-${Date.now()}`,
      sessionId,
      senderRole: 'assistant',
      messageText: this.generatePedagogicalResponse(messageText, mode, context, Boolean(imageUrl)),
      mode,
      citations: [
        {
          source: 'NCERT Curriculum Provenance',
          chapterOrDoc: context?.topicTitle || 'Standard Conceptual Taxonomy',
          section: 'Verified Syllabus Reference',
        },
      ],
      createdAt: new Date().toISOString(),
    };

    currentList.push(assistantResponse);
    map[sessionId] = currentList;
    this.saveMessages(map);

    // Update session timestamp and title if needed
    const sessions = this.getStoredSessions();
    const sess = sessions.find((s) => s.id === sessionId);
    if (sess) {
      sess.updatedAt = new Date().toISOString();
      sess.currentMode = mode;
      sess.messageCount = currentList.length;
      this.saveSessions(sessions);
    }

    return assistantResponse;
  }

  private generateInitialGreeting(mode: TutorMode, context?: TutorContext): string {
    const topic = context?.topicTitle ? ` regarding "${context.topicTitle}"` : '';
    switch (mode) {
      case 'teach':
        return `[Teach Mode Initialized]\nI will walk you through the foundational concepts${topic} from first principles, establishing core definitions, mathematical relations, and real-world intuition.\n\nWhat specific sub-topic or law would you like to examine first?`;
      case 'socratic':
        return `[Socratic Discovery Mode]\nI am here to guide your deduction${topic}. Instead of handing over raw solutions, I will ask targeted questions to help you spot key constraints and formulate the next step independently.\n\nDescribe the problem you are tackling, or share your initial thought process!`;
      case 'hint':
        return `[Progressive Hint Scaffolding]\nShare your problem statement or equation. I will provide structured, progressive hints (Level 1 direction -> Level 2 governing law -> Level 3 execution step) without giving away the final answer.`;
      case 'practice':
        return `[Targeted Practice Mode]\nReady to test your analytical mastery${topic}. Share what difficulty level (Foundational, JEE Main, or Advanced) you'd like to practice, and I will generate an authentic problem with instant step verification.`;
      case 'quiz':
        return `[Rapid Micro-Quiz Mode]\nI will present a 3-question diagnostic series${topic} to evaluate your conceptual grasp. Are you ready for Question 1?`;
      case 'check_solution':
        return `[Solution Diagnostic & Step Verifier]\nPaste your written steps or attach a photo of your notebook calculation. I will verify your algebraic manipulations and point out any conceptual or careless slips.`;
      case 'explain_mistake':
        return `[Mistake Root-Cause Diagnosis]\nTell me what question you got wrong and what answer you marked. We will trace back whether it was a conceptual misunderstanding, a sign convention error, or an unstated boundary assumption.`;
      case 'revision':
        return `[Active Spaced Recall Mode]\nLet's test your long-term memory retention${topic}. Without looking at your notes, how would you define the core governing theorem?`;
      case 'viva':
        return `[Oral Concept Defense / Viva]\nI will act as your examiner. I will challenge you with edge cases and ask you to rigorously justify your assumptions. Ready for your first question?`;
      case 'exam':
        return `[Strict Examination Condition]\nNo hints or conversational feedback will be provided until your final submission is locked. Provide your final numerical or option answer clearly.`;
      default:
        return `SharpMind Academic Tutor initialized. How can I assist your study session?`;
    }
  }

  private generatePedagogicalResponse(
    query: string,
    mode: TutorMode,
    context?: TutorContext,
    hasImage?: boolean
  ): string {
    const imageNotice = hasImage
      ? `\n\n[Diagram/Image Received]: I have analyzed your attached diagram. Let's isolate the vector components and boundary conditions shown in your work.\n`
      : '';

    switch (mode) {
      case 'socratic':
        return `[Socratic Guidance]${imageNotice}\nLet’s analyze this step-by-step rather than jumping straight to the conclusion:\n\n1. What is the fundamental conservation law or physical condition that must hold true at this boundary?\n2. Consider: if we decompose this motion or equilibrium into orthogonal components (e.g. horizontal vs vertical), which component has a net force acting on it?\n\nTake a moment to formulate your answer for step 1, and reply with what you deduce!`;
      case 'hint':
        return `[Hint Level 1 — Strategic Direction]${imageNotice}\nConsider applying the work-energy theorem or the conservation of linear momentum before resolving the individual forces.\n\n*Key question to ask yourself*: Does the normal reaction perform any work on the system along the displacement vector?\n\nIf you need a Level 2 equation hint, let me know!`;
      case 'teach':
        return `[First-Principles Concept Explanation]${imageNotice}\nLet’s ground this concept systematically:\n\n1. **Core Principle**: In any isolated system where no external non-conservative forces act, the total mechanical energy remains conserved: $E = K + U = \\text{constant}$.\n2. **Mathematical Formulation**: $\\Delta K = W_{\\text{net}} = \\int \\vec{F}_{\\text{net}} \\cdot d\\vec{r}$.\n3. **Application**: When resolving on an incline, always align your coordinate axes parallel and perpendicular to the plane to eliminate the normal force from your acceleration equation.\n\nDoes this derivation clarify the underlying mechanism?`;
      case 'check_solution':
        return `[Solution Review & Step Verification]${imageNotice}\nHere is the step-by-step audit of your reasoning:\n\n✓ **Step 1 (Setup)**: Correctly identified the initial conditions and coordinate orientation.\n✓ **Step 2 (Governing Equation)**: Formula application is sound.\n⚠️ **Observation**: Double check your sign convention in the third line. Remember that if acceleration is directed opposite to the positive reference direction, it must enter with a negative sign ($-g$).\n\nRecalculate with that sign adjustment and let's check your final numerical value!`;
      case 'quiz':
        return `[Micro-Quiz Evaluation]${imageNotice}\nGood effort! Let's examine your answer:\n\nYour deduction regarding the conservation principle is conceptually accurate. Here is your next micro-check:\n\n*Question 2*: If the mass of the projectile is doubled while keeping the launch velocity $u$ and angle $\\theta$ identical, how does the maximum height $H$ change? (A: Doubles, B: Quadruples, C: Unchanged, D: Halved)`;
      default:
        return `[Pedagogical Guidance]${imageNotice}\nBased on our curriculum alignment with ${context?.topicTitle || 'this topic'}:\n\nAlways ensure that your dimensional units match (SI units: meters, seconds, kg) and that you state the boundary constraints clearly before substituting values.\n\nWhat is your next deduction?`;
    }
  }
}
