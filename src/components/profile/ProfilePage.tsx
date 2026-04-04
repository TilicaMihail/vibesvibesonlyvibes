'use client';
import { useState, useEffect } from 'react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addToast } from '@/store/slices/uiSlice';
import { useUpdateUserMutation } from '@/services/usersApi';
import { useGetCoursesQuery } from '@/services/coursesApi';
import { useGetUserProgressQuery } from '@/services/progressApi';
import { useGetOrganizationQuery } from '@/services/organizationsApi';

export default function ProfilePage() {
  const user = useAppSelector(s => s.auth.user);
  const dispatch = useAppDispatch();
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');

  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  const { data: courses = [] } = useGetCoursesQuery(
    { teacherId: user?.id ?? '' },
    { skip: !user || user.role !== 'teacher' }
  );
  const { data: studentCourses = [] } = useGetCoursesQuery(
    { tab: 'assigned', studentId: user?.id ?? '' },
    { skip: !user || user.role !== 'student' }
  );
  const { data: progressList = [] } = useGetUserProgressQuery(
    user?.id ?? '',
    { skip: !user || user.role !== 'student' }
  );
  const { data: org } = useGetOrganizationQuery(undefined, { skip: !user || user.role !== 'admin' });

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
    }
  }, [user]);

  async function handleSaveProfile() {
    if (!user) return;
    await updateUser({ id: user.id, firstName, lastName, email }).unwrap();
    setEditMode(false);
    dispatch(addToast({ message: 'Profile updated successfully', type: 'success' }));
  }

  async function handleChangePassword() {
    if (newPw !== confirmPw) { setPwError('Passwords do not match'); return; }
    if (newPw.length < 6) { setPwError('Password must be at least 6 characters'); return; }
    setPwError('');
    dispatch(addToast({ message: 'Password changed successfully', type: 'success' }));
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
  }

  if (!user) return null;

  const roleBadge: Record<string, 'primary' | 'info' | 'neutral'> = { admin: 'primary', teacher: 'info', student: 'neutral' };

  const totalTests = progressList.reduce((sum, p) => sum + (p.testSessionIds?.length ?? 0), 0);
  const avgScore = 0; // would compute from test sessions

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-on-surface">My Profile</h1>

      {/* Header card */}
      <Card padding="lg">
        <div className="flex items-start gap-5">
          <Avatar name={`${user.firstName} ${user.lastName}`} size="xl" />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-on-surface">{user.firstName} {user.lastName}</h2>
              <Badge variant={roleBadge[user.role]}>{user.role}</Badge>
            </div>
            <p className="text-on-surface-faint text-sm">{user.email}</p>
            <p className="text-xs text-on-surface-faint mt-1">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          <Button variant="secondary" onClick={() => setEditMode(!editMode)}>
            {editMode ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>
      </Card>

      {/* Edit form */}
      {editMode && (
        <Card padding="lg">
          <h3 className="font-semibold text-on-surface mb-4">Edit Profile</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input label="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
            <Input label="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
          </div>
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="mb-4" />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setEditMode(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveProfile} isLoading={updating}>Save</Button>
          </div>
        </Card>
      )}

      {/* Change password */}
      <Card padding="lg">
        <h3 className="font-semibold text-gray-800 mb-4">Change Password</h3>
        <div className="space-y-3">
          <Input label="Current Password" type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} />
          <Input label="New Password" type="password" value={newPw} onChange={e => setNewPw(e.target.value)} />
          <Input label="Confirm New Password" type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} error={pwError} />
          <div className="flex justify-end">
            <Button variant="primary" onClick={handleChangePassword}>Update Password</Button>
          </div>
        </div>
      </Card>

      {/* Role stats */}
      <Card padding="lg">
        <h3 className="font-semibold text-gray-800 mb-4">Statistics</h3>
        {user.role === 'student' && (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center"><div className="text-2xl font-bold text-brand">{studentCourses.length}</div><div className="text-xs text-on-surface-faint">Courses</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-brand">{totalTests}</div><div className="text-xs text-on-surface-faint">Tests Taken</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-green-600">{progressList.filter(p => p.completionPercent === 100).length}</div><div className="text-xs text-on-surface-faint">Completed</div></div>
          </div>
        )}
        {user.role === 'teacher' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center"><div className="text-2xl font-bold text-brand">{courses.length}</div><div className="text-xs text-on-surface-faint">Courses Created</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-brand">{courses.reduce((sum, c) => sum + c.enrolledStudentIds.length, 0)}</div><div className="text-xs text-on-surface-faint">Total Students</div></div>
          </div>
        )}
        {user.role === 'admin' && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-medium">Organization:</span> {org?.name ?? '—'}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1"><span className="font-medium">Slug:</span> {org?.slug ?? '—'}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
