import { useClasses } from '../hooks/useClasses';
import LoadingSpinner from '../components/LoadingSpinner';
import { Class } from '../types';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function CapacityBadge({ current, max }: { current: number; max: number }) {
  const ratio = current / max;
  const cls =
    ratio >= 1
      ? 'bg-red-100 text-red-700'
      : ratio >= 0.7
        ? 'bg-amber-100 text-amber-700'
        : 'bg-emerald-100 text-emerald-700';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {current}/{max}
    </span>
  );
}

export default function Dashboard() {
  const { data: classes, isLoading } = useClasses();

  if (isLoading) return <LoadingSpinner />;

  const grouped = DAYS.reduce((acc, day) => {
    acc[day] = (classes || [])
      .filter((c: Class) => c.dayOfWeek === day)
      .sort((a: Class, b: Class) => a.startTime.localeCompare(b.startTime));
    return acc;
  }, {} as Record<string, Class[]>);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Dashboard</h1>
        <p className="text-sm text-surface-500 mt-1">Weekly class schedule overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {DAYS.map((day, i) => (
          <div key={day} className="card overflow-hidden">
            <div className="px-3 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500">
              <h3 className="text-sm font-semibold text-white">{DAY_LABELS[i]}</h3>
            </div>
            <div className="p-2 space-y-2 min-h-[120px]">
              {grouped[day]?.length === 0 ? (
                <p className="text-xs text-surface-400 text-center py-6">No classes</p>
              ) : (
                grouped[day]?.map((cls) => {
                  const registered = cls.classRegistrations?.length || 0;
                  return (
                    <div
                      key={cls.id}
                      className="p-2.5 rounded-lg bg-surface-50 border border-surface-100 hover:border-primary-200 hover:shadow-sm transition-all duration-200"
                    >
                      <p className="text-sm font-medium text-surface-800 truncate">{cls.name}</p>
                      <p className="text-xs text-primary-600 font-medium mt-1">
                        {cls.startTime} – {cls.endTime}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <CapacityBadge current={registered} max={cls.maxStudents} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
