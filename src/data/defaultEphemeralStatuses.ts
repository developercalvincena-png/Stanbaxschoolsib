import { UserEphemeralStatus } from '../types';

export const DURATION_16_HOURS_MS = 16 * 60 * 60 * 1000;

export const cleanExpiredStatuses = (statuses: UserEphemeralStatus[]): UserEphemeralStatus[] => {
  const now = Date.now();
  return (statuses || []).filter(s => {
    try {
      const expTime = new Date(s.expiresAt).getTime();
      return expTime > now;
    } catch {
      return false;
    }
  });
};

export const create16HourStatus = (
  data: Omit<UserEphemeralStatus, 'id' | 'createdAt' | 'expiresAt' | 'views'>
): UserEphemeralStatus => {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + DURATION_16_HOURS_MS).toISOString();

  return {
    ...data,
    id: `status-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: now.toISOString(),
    expiresAt,
    views: []
  };
};

export const INITIAL_EPHEMERAL_STATUSES: UserEphemeralStatus[] = [
  {
    id: 'status-demo-1',
    userId: 'stu-1',
    userName: 'Tiwa Adeleke',
    userRole: 'student',
    userGradeOrTitle: 'SSS 2 Science • Head Girl',
    userBadge: '🏅 Head Girl',
    text: 'Preparing for tomorrow morning\'s Physics practical with Mr. Ogunleye! Don\'t forget your optical pins and graph sheets! 🔬✨',
    backgroundColor: 'from-indigo-900 to-purple-900',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 14 * 60 * 60 * 1000).toISOString(),
    views: ['tut-1', 'stu-2']
  },
  {
    id: 'status-demo-2',
    userId: 'tut-1',
    userName: 'Mr. Olumide Ogunleye',
    userRole: 'tutor',
    userGradeOrTitle: 'Senior Science Master & Class Teacher',
    userBadge: '👨‍🏫 Class Teacher',
    text: 'JETS Club announcement: The new Arduino microcontrollers and sensor shields have been delivered to Block B Lab! Meeting at 3pm Wednesday. 🤖⚡',
    backgroundColor: 'from-emerald-900 to-teal-950',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    views: ['stu-1', 'stu-2', 'stu-3']
  },
  {
    id: 'status-demo-3',
    userId: 'stu-2',
    userName: 'Babatunde Akindele',
    userRole: 'student',
    userGradeOrTitle: 'SSS 2 Science • JETS President',
    userBadge: '👑 President',
    text: 'Inter-house football relay trials after classes today! Sapphire vs Ruby house on the AstroTurf pitch. ⚽🏃‍♂️',
    backgroundColor: 'from-amber-900 to-red-950',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(),
    views: ['stu-1']
  }
];
