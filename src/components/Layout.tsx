import { NavLink, Outlet } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', to: '/', icon: HomeIcon },
  { name: 'Parents', to: '/parents', icon: UserGroupIcon },
  { name: 'Students', to: '/students', icon: AcademicCapIcon },
  { name: 'Classes', to: '/classes', icon: CalendarDaysIcon },
  { name: 'Subscriptions', to: '/subscriptions', icon: CreditCardIcon },
  { name: 'Registrations', to: '/registrations', icon: ClipboardDocumentListIcon },
];

export default function Layout() {
  return (
    <div className="flex h-screen bg-surface-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-surface-900">
        <div className="flex items-center gap-3 px-6 h-16 border-b border-surface-700/50">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <AcademicCapIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">TeenUp</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-600/20 text-primary-400'
                    : 'text-surface-400 hover:bg-surface-800 hover:text-surface-200'
                }`
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-surface-700/50">
          <p className="text-xs text-surface-500">TeenUp Management v1.0</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 px-4 h-14 bg-white border-b border-surface-200 shadow-sm">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <AcademicCapIcon className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold text-surface-900">TeenUp</span>
        </header>

        {/* Mobile nav */}
        <nav className="lg:hidden flex items-center gap-1 px-2 py-2 bg-white border-b border-surface-200 overflow-x-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-surface-500 hover:bg-surface-100'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
