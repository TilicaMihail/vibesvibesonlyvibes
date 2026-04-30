'use client';
import { use, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Tabs from '@/components/ui/Tabs';
import Spinner from '@/components/ui/Spinner';
import QuestionCard from '@/components/test-editor/QuestionCard';
import QuestionForm from '@/components/test-editor/QuestionForm';
import AIGeneratePanel from '@/components/test-editor/AIGeneratePanel';
import { useGetCourseQuery } from '@/services/coursesApi';
import { useGetTestByLessonQuery, useCreateTestMutation, usePublishTestMutation } from '@/services/testsApi';
import { useGetQuestionsQuery, useCreateQuestionMutation, useDeleteQuestionMutation } from '@/services/questionsApi';
import type { ChapterWithLessons, Lesson, Question } from '@/types';

const TABS = [{ id: 'ai', label: '✨ AI Generate' }, { id: 'manual', label: 'Manual' }];

function LessonTestEditor({ courseId, lesson }: { courseId: string; lesson: Lesson }) {
  const [tab, setTab] = useState('manual');
  const [showForm, setShowForm] = useState(false);
  const [editingQ, setEditingQ] = useState<Question | null>(null);

  const { data: test, isLoading: testLoading } = useGetTestByLessonQuery(lesson.id);
  const { data: questions = [], isLoading: questionsLoading } = useGetQuestionsQuery(test?.id ?? '', { skip: !test?.id });
  const [createTest, { isLoading: creatingTest }] = useCreateTestMutation();
  const [publishTest, { isLoading: publishing }] = usePublishTestMutation();
  const [createQuestion] = useCreateQuestionMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();

  async function handleCreateTest() {
    await createTest({ lessonId: lesson.id, title: lesson.title + ' — Test' });
  }

  async function handleSaveQuestion(q: Omit<Question, 'questionId'>) {
    if (!test) return;
    await createQuestion({ testId: test.id, body: q });
    setShowForm(false);
    setEditingQ(null);
  }

  if (testLoading) return <div className="flex justify-center py-8"><Spinner size="sm" /></div>;

  return (
    <div className="space-y-4">
      {/* Test header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-on-surface">{lesson.title}</h3>
          {test && (
            <Badge variant={test.status === 'PUBLISHED' ? 'success' : 'neutral'}>{test.status}</Badge>
          )}
        </div>
        {test && test.status === 'DRAFT' && (
          <Button variant="primary" size="sm" onClick={() => publishTest(test.id)} isLoading={publishing}>
            Publish Test
          </Button>
        )}
        {!test && (
          <Button variant="secondary" size="sm" onClick={handleCreateTest} isLoading={creatingTest}>
            Create Test
          </Button>
        )}
      </div>

      {test && (
        <>
          <Tabs tabs={TABS} activeTab={tab} onChange={setTab} />

          {tab === 'ai' && (
            <div className="bg-surface-raised border border-surface-border rounded-xl p-5">
              <AIGeneratePanel lessonId={lesson.id} onDone={() => {}} />
            </div>
          )}

          {tab === 'manual' && (
            <div className="space-y-3">
              {questionsLoading ? (
                <div className="flex justify-center py-4"><Spinner size="sm" /></div>
              ) : (
                <>
                  {questions.map((q, i) => (
                    <QuestionCard
                      key={q.questionId}
                      question={q}
                      index={i}
                      onEdit={() => { setEditingQ(q); setShowForm(true); }}
                      onDelete={() => deleteQuestion({ testId: test.id, questionId: q.questionId })}
                    />
                  ))}

                  {showForm && (
                    <QuestionForm
                      initial={editingQ ?? undefined}
                      onSave={handleSaveQuestion}
                      onCancel={() => { setShowForm(false); setEditingQ(null); }}
                    />
                  )}

                  {!showForm && (
                    <Button variant="secondary" onClick={() => { setEditingQ(null); setShowForm(true); }}>
                      + Add Question
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function TestEditorPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const { data: course, isLoading } = useGetCourseQuery(courseId);
  const chapters: ChapterWithLessons[] = course?.chapters ?? [];
  const allLessons = chapters.flatMap(c => c.lessons);

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="flex gap-6 max-w-5xl mx-auto">
      {/* Lesson picker sidebar */}
      <div className="w-64 shrink-0">
        <div className="bg-surface-raised border border-surface-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-surface-border">
            <h3 className="text-sm font-semibold text-on-surface">Select Lesson</h3>
          </div>
          {allLessons.length === 0 ? (
            <p className="px-4 py-4 text-xs text-on-surface-faint">No lessons yet. Add lessons in the course editor first.</p>
          ) : (
            <div className="divide-y divide-surface-border max-h-96 overflow-y-auto">
              {chapters.map(chapter => (
                <div key={chapter.id}>
                  <p className="px-4 py-2 text-xs font-semibold text-on-surface-faint uppercase tracking-wide bg-surface">{chapter.title}</p>
                  {chapter.lessons.map(lesson => (
                    <button
                      key={lesson.id}
                      onClick={() => setSelectedLesson(lesson)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedLesson?.id === lesson.id ? 'bg-brand/5 text-brand' : 'hover:bg-surface text-on-surface'}`}
                    >
                      <span className="truncate block">{lesson.title}</span>
                      {lesson.testId && <span className="text-xs text-on-surface-faint">📝 has test</span>}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-3">
          <Link href={`/courses/${courseId}`} className="text-sm text-on-surface-faint hover:text-on-surface transition-colors">← Back to course</Link>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-on-surface">Test Editor — {course?.title}</h1>
        </div>

        {!selectedLesson ? (
          <div className="bg-surface-raised border border-surface-border rounded-xl p-8 text-center">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-on-surface font-medium mb-1">Select a lesson</p>
            <p className="text-on-surface-faint text-sm">Pick a lesson from the left to create or edit its test.</p>
          </div>
        ) : (
          <div className="bg-surface-raised border border-surface-border rounded-xl p-5">
            <LessonTestEditor courseId={courseId} lesson={selectedLesson} />
          </div>
        )}
      </div>
    </div>
  );
}
