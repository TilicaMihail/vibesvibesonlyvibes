'use client';
import { use, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import QuestionCard from '@/components/test-editor/QuestionCard';
import QuestionForm from '@/components/test-editor/QuestionForm';
import AIGeneratePanel from '@/components/test-editor/AIGeneratePanel';
import { useGetCourseTestsQuery, useCreateTestMutation } from '@/services/testsApi';
import type { Question } from '@/types';

const TABS = [{ id: 'ai', label: '✨ AI Generate' }, { id: 'manual', label: 'Manual' }];

export default function TestEditorPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const [tab, setTab] = useState('ai');
  const [testTitle, setTestTitle] = useState('');
  const [questions, setQuestions] = useState<Omit<Question, 'id' | 'testId'>[]>([]);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: tests = [], isLoading: testsLoading } = useGetCourseTestsQuery({ courseId });
  const [createTest, { isLoading: saving }] = useCreateTestMutation();

  function handleGenerated(qs: Question[]) {
    setQuestions(qs.map(({ id: _id, testId: _tid, ...rest }) => rest));
    setTestTitle('AI Generated Test');
  }

  function handleAddQuestion(q: Omit<Question, 'id' | 'testId'>) {
    if (editingIdx !== null) {
      setQuestions(prev => prev.map((x, i) => i === editingIdx ? q : x));
      setEditingIdx(null);
    } else {
      setQuestions(prev => [...prev, q]);
    }
    setShowForm(false);
  }

  async function handleSave() {
    if (!testTitle.trim() || questions.length === 0) return;
    await createTest({
      courseId,
      body: {
        courseId,
        title: testTitle.trim(),
        isAIGenerated: tab === 'ai',
        questions: questions.map((q, i) => ({ ...q, id: 'q-' + Date.now() + i, testId: '' })),
      },
    }).unwrap();
    setQuestions([]);
    setTestTitle('');
  }

  return (
    <div className="flex gap-6">
      {/* Sidebar: existing tests */}
      <div className="w-64 shrink-0">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700">Saved Tests</h3>
          </div>
          {testsLoading ? (
            <div className="flex justify-center py-4"><Spinner size="sm" /></div>
          ) : tests.length === 0 ? (
            <p className="px-4 py-4 text-xs text-gray-400">No tests yet</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {tests.map(t => (
                <div key={t.id} className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-800 truncate">{t.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={t.isAIGenerated ? 'primary' : 'neutral'}>{t.isAIGenerated ? 'AI' : 'Manual'}</Badge>
                    <span className="text-xs text-gray-400">{t.questions.length} questions</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-3">
          <Link href={`/teacher/courses/${courseId}`} className="text-sm text-gray-400 hover:text-gray-700">← Back to course</Link>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Test Editor</h1>
        </div>

        <Tabs tabs={TABS} activeTab={tab} onChange={t => { setTab(t); setQuestions([]); setTestTitle(''); }} />

        <div className="mt-4 space-y-4">
          {tab === 'ai' && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <AIGeneratePanel courseId={courseId} onGenerated={handleGenerated} />
            </div>
          )}

          {tab === 'manual' && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              {!showForm ? (
                <Button variant="secondary" onClick={() => { setEditingIdx(null); setShowForm(true); }}>+ Add Question</Button>
              ) : (
                <QuestionForm
                  initial={editingIdx !== null ? { ...(questions[editingIdx] as Partial<Question>) } : undefined}
                  onSave={handleAddQuestion}
                  onCancel={() => { setShowForm(false); setEditingIdx(null); }}
                />
              )}
            </div>
          )}

          {questions.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-gray-700">Questions ({questions.length})</h2>
              {questions.map((q, i) => (
                <QuestionCard
                  key={i}
                  question={{ ...q, id: String(i), testId: '' }}
                  index={i}
                  onEdit={() => { setEditingIdx(i); setShowForm(true); }}
                  onDelete={() => setQuestions(prev => prev.filter((_, idx) => idx !== i))}
                />
              ))}
              <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-end gap-4">
                <div className="flex-1">
                  <Input label="Test Title" value={testTitle} onChange={e => setTestTitle(e.target.value)} placeholder="Give this test a name" />
                </div>
                <Button variant="primary" onClick={handleSave} isLoading={saving}>Save Test</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
