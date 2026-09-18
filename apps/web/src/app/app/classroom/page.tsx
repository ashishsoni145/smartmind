'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { ClassroomBreadcrumbs } from '@/components/classroom/ClassroomBreadcrumbs';
import { ClassroomFilterBar } from '@/components/classroom/ClassroomFilterBar';
import { SubjectCardGrid } from '@/components/classroom/SubjectCardGrid';
import { ChapterListView } from '@/components/classroom/ChapterListView';
import { TopicListView } from '@/components/classroom/TopicListView';
import { TopicDetailView, type TopicTab } from '@/components/classroom/TopicDetailView';
import { curriculumAdapter } from '@/lib/adapters/curriculum';
import type {
  Subject,
  ChapterNode,
  TopicNode,
  CurriculumQuestion,
  CurriculumMaterial,
} from '@/lib/types/curriculum';
import styles from './classroom.module.css';

function ClassroomHierarchyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Query parameter state for deep linking
  const subjectId = searchParams.get('subject') || '';
  const chapterId = searchParams.get('chapter') || '';
  const topicId = searchParams.get('topic') || '';
  const rawTab = searchParams.get('tab');
  const tabParam: TopicTab =
    rawTab === 'notes' || rawTab === 'formulas' || rawTab === 'artifacts' || rawTab === 'questions'
      ? rawTab
      : 'notes';
  const gradeParam = searchParams.get('grade') || 'all';
  const searchParam = searchParams.get('search') || '';

  // Local state
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [allChapters, setAllChapters] = useState<ChapterNode[]>([]);
  const [topics, setTopics] = useState<TopicNode[]>([]);
  const [questions, setQuestions] = useState<CurriculumQuestion[]>([]);
  const [materials, setMaterials] = useState<CurriculumMaterial[]>([]);
  const [chapterCounts, setChapterCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [selectedGrade, setSelectedGrade] = useState(gradeParam);

  // Sync state with URL params
  useEffect(() => {
    setSearchQuery(searchParam);
  }, [searchParam]);

  useEffect(() => {
    setSelectedGrade(gradeParam);
  }, [gradeParam]);

  // Load initial curriculum taxonomy
  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      setIsLoading(true);
      setError(null);
      try {
        const subs = await curriculumAdapter.getSubjects();
        if (!isMounted) return;
        setSubjects(subs);

        // Calculate chapter counts across subjects
        const counts: Record<string, number> = {};
        for (const sub of subs) {
          const chs = await curriculumAdapter.getChapters(sub.id);
          counts[sub.id] = chs.length;
        }
        if (!isMounted) return;
        setChapterCounts(counts);
      } catch (err) {
        if (!isMounted) return;
        console.error('Failed to load classroom subjects:', err);
        setError('Failed to load curriculum taxonomy. Please try again.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Load chapters when a subject is selected
  useEffect(() => {
    if (!subjectId) {
      setAllChapters([]);
      return;
    }

    let isMounted = true;
    async function loadChapters() {
      try {
        const chs = await curriculumAdapter.getChapters(subjectId);
        if (isMounted) setAllChapters(chs);
      } catch (err) {
        console.error('Failed to load chapters for subject:', subjectId, err);
      }
    }
    loadChapters();

    return () => {
      isMounted = false;
    };
  }, [subjectId]);

  // Load topics and materials when a chapter is selected
  useEffect(() => {
    if (!chapterId) {
      setTopics([]);
      setQuestions([]);
      setMaterials([]);
      return;
    }

    let isMounted = true;
    async function loadChapterDetails() {
      try {
        const [topList, qList, matList] = await Promise.all([
          curriculumAdapter.getTopics(chapterId),
          topicId
            ? curriculumAdapter.getQuestionsForNode(topicId).then(async (tQs) => {
                if (tQs.length > 0) return tQs;
                return curriculumAdapter.getQuestionsForNode(chapterId);
              })
            : curriculumAdapter.getQuestionsForNode(chapterId),
          curriculumAdapter.getMaterialsForNode(chapterId),
        ]);
        if (isMounted) {
          setTopics(topList);
          setQuestions(qList);
          setMaterials(matList);
        }
      } catch (err) {
        console.error('Failed to load chapter details:', chapterId, err);
      }
    }
    loadChapterDetails();

    return () => {
      isMounted = false;
    };
  }, [chapterId, topicId]);

  // Current entity lookups
  const currentSubject = useMemo(
    () => subjects.find((s) => s.id === subjectId) || null,
    [subjects, subjectId]
  );

  const currentChapter = useMemo(
    () => allChapters.find((c) => c.id === chapterId) || null,
    [allChapters, chapterId]
  );

  const currentTopic = useMemo(
    () => topics.find((t) => t.id === topicId) || null,
    [topics, topicId]
  );

  // Navigation helpers that push new query params
  const navigateToSubject = (newSubjectId: string) => {
    const params = new URLSearchParams();
    params.set('subject', newSubjectId);
    if (selectedGrade !== 'all') params.set('grade', selectedGrade);
    router.push(`/app/classroom?${params.toString()}`);
  };

  const navigateToChapter = (newChapterId: string) => {
    const params = new URLSearchParams();
    params.set('subject', subjectId);
    params.set('chapter', newChapterId);
    if (selectedGrade !== 'all') params.set('grade', selectedGrade);
    router.push(`/app/classroom?${params.toString()}`);
  };

  const navigateToTopic = (newTopicId: string) => {
    const params = new URLSearchParams();
    params.set('subject', subjectId);
    params.set('chapter', chapterId);
    params.set('topic', newTopicId);
    params.set('tab', 'notes');
    router.push(`/app/classroom?${params.toString()}`);
  };

  const handleTabChange = (newTab: TopicTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', newTab);
    router.push(`/app/classroom?${params.toString()}`);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set('search', query.trim());
    } else {
      params.delete('search');
    }
    router.replace(`/app/classroom?${params.toString()}`);
  };

  const handleGradeChange = (grade: string) => {
    setSelectedGrade(grade);
    const params = new URLSearchParams(searchParams.toString());
    if (grade !== 'all') {
      params.set('grade', grade);
    } else {
      params.delete('grade');
    }
    router.replace(`/app/classroom?${params.toString()}`);
  };

  // Filtered lists based on search and grade
  const filteredSubjects = useMemo(() => {
    if (!searchQuery) return subjects;
    const q = searchQuery.toLowerCase();
    return subjects.filter(
      (s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
    );
  }, [subjects, searchQuery]);

  const filteredChapters = useMemo(() => {
    return allChapters.filter((ch) => {
      if (selectedGrade !== 'all' && ch.gradeId !== selectedGrade) {
        return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = ch.title.toLowerCase().includes(q);
        const matchesCode = ch.code.toLowerCase().includes(q);
        const matchesDesc = ch.description.toLowerCase().includes(q);
        return matchesTitle || matchesCode || matchesDesc;
      }
      return true;
    });
  }, [allChapters, selectedGrade, searchQuery]);

  const filteredTopics = useMemo(() => {
    if (!searchQuery) return topics;
    const q = searchQuery.toLowerCase();
    return topics.filter(
      (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    );
  }, [topics, searchQuery]);

  // Construct breadcrumb items
  const breadcrumbItems = useMemo(() => {
    const items = [];
    if (currentSubject) {
      items.push({
        label: currentSubject.name,
        href: `/app/classroom?subject=${currentSubject.id}${selectedGrade !== 'all' ? `&grade=${selectedGrade}` : ''}`,
        active: !currentChapter,
      });
    }
    if (currentChapter && currentSubject) {
      items.push({
        label: currentChapter.title,
        href: `/app/classroom?subject=${currentSubject.id}&chapter=${currentChapter.id}`,
        active: !currentTopic,
      });
    }
    if (currentTopic) {
      items.push({
        label: currentTopic.title,
        active: true,
      });
    }
    return items;
  }, [currentSubject, currentChapter, currentTopic, selectedGrade]);

  // Determine current hierarchy level
  const currentLevel = currentTopic
    ? 'Concept & Resource Workspace'
    : currentChapter
    ? 'Chapter Topics'
    : currentSubject
    ? 'Subject Chapters'
    : 'Enrolled Subjects';

  return (
    <div className={styles.pageContainer}>
      {/* Page Header */}
      <header className={styles.pageHeader}>
        <div className={styles.titleRow}>
          <h1 className={styles.pageTitle}>
            <Icon name="classroom" size="lg" />
            <span>Classroom Learning Hierarchy</span>
          </h1>
          <span className={styles.levelIndicator}>{currentLevel}</span>
        </div>
        <p className={styles.pageSubtitle}>
          Hierarchical study syllabus grounded in authentic NCERT and entrance exam specifications.
        </p>

        {/* Dynamic Breadcrumb Path */}
        <ClassroomBreadcrumbs items={breadcrumbItems} />
      </header>

      {/* Global Filter & Search Affordance */}
      {!currentTopic && (
        <ClassroomFilterBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          selectedGrade={selectedGrade}
          onGradeChange={currentSubject ? handleGradeChange : undefined}
          showGradeFilter={Boolean(currentSubject && !currentChapter)}
          placeholder={
            currentChapter
              ? 'Search topics within this chapter...'
              : currentSubject
              ? `Search chapters in ${currentSubject.name}...`
              : 'Search subjects by title or code...'
          }
        />
      )}

      {/* Loading & Error States */}
      {isLoading && (
        <div className={styles.loadingSkeleton} role="status" aria-live="polite">
          <div className={styles.spinner} />
          <p>Loading curriculum learning hierarchy...</p>
        </div>
      )}

      {error && (
        <div className={styles.errorState} role="alert">
          <p>{error}</p>
          <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      )}

      {/* HIERARCHY LEVEL 4: Topic Detail View (Concepts, PYQs, Notes, Mastery Hooks) */}
      {!isLoading && !error && currentSubject && currentChapter && currentTopic && (
        <TopicDetailView
          subject={currentSubject}
          chapter={currentChapter}
          topic={currentTopic}
          questions={questions}
          materials={materials}
          activeTab={tabParam}
          onTabChange={handleTabChange}
        />
      )}

      {/* HIERARCHY LEVEL 3: Chapter View (Topics List) */}
      {!isLoading && !error && currentSubject && currentChapter && !currentTopic && (
        <TopicListView
          subject={currentSubject}
          chapter={currentChapter}
          topics={filteredTopics}
          onSelectTopic={navigateToTopic}
        />
      )}

      {/* HIERARCHY LEVEL 2: Subject View (Chapters List) */}
      {!isLoading && !error && currentSubject && !currentChapter && (
        <ChapterListView
          subject={currentSubject}
          chapters={filteredChapters}
          onSelectChapter={navigateToChapter}
        />
      )}

      {/* HIERARCHY LEVEL 1: Classroom Root (Subject Card Grid) */}
      {!isLoading && !error && !currentSubject && (
        <SubjectCardGrid
          subjects={filteredSubjects}
          chapterCounts={chapterCounts}
          onSelectSubject={navigateToSubject}
        />
      )}
    </div>
  );
}

export default function ClassroomPage() {
  return (
    <WorkspaceShell>
      <Suspense
        fallback={
          <div className={styles.loadingSkeleton} role="status" aria-live="polite">
            <div className={styles.spinner} />
            <p>Initializing Classroom...</p>
          </div>
        }
      >
        <ClassroomHierarchyContent />
      </Suspense>
    </WorkspaceShell>
  );
}
