'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CreditCard,
  Banknote,
  Gift,
  UserCircle,
  ArrowLeftRight,
  ShieldCheck,
  HeadphonesIcon,
  Moon,
  Sun,
  LogOut,
  Menu,
  Users,
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import HomeView from './views/HomeView';
import WalletCardsView from './views/WalletCardsView';
import LoansView from './views/LoansView';
import SpinWinView from './views/SpinWinView';
import ProfileView from './views/ProfileView';
import LinkWalletView from './views/LinkWalletView';
import SecurityView from './views/SecurityView';
import SupportView from './views/SupportView';
import ReferralView from './views/ReferralView';

type ViewId =
  | 'dashboard'
  | 'wallet-cards'
  | 'loans'
  | 'spin-win'
  | 'referral'
  | 'profile'
  | 'link-wallet'
  | 'security'
  | 'support';


interface NavItem {
  id: ViewId;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

const mainNav: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'link-wallet', label: 'Link Wallet', icon: ArrowLeftRight },
  { id: 'loans', label: 'Loans', icon: Banknote },
  { id: 'spin-win', label: 'Spin & Win', icon: Gift },
  { id: 'wallet-cards', label: 'Wallet Cards', icon: CreditCard },
  { id: 'referral', label: 'Referral', icon: Users },
];

const settingsNav: NavItem[] = [
  { id: 'profile', label: 'Profile Setting', icon: UserCircle },
  { id: 'security', label: '2FA Security', icon: ShieldCheck },
  { id: 'support', label: 'Support Ticket', icon: HeadphonesIcon },
];

const viewTitles: Record<ViewId, string> = {
  dashboard: 'Dashboard',
  'wallet-cards': 'Wallet Cards',
  loans: 'Loans',
  'spin-win': 'Spin & Win',
  referral: 'Referral',
  profile: 'Profile Setting',
  'link-wallet': 'Link Wallet',
  security: '2FA Security',
  support: 'Support Ticket',
};

function ViewRenderer({
  activeView,
  navigate,
}: {
  activeView: ViewId;
  navigate: (id: ViewId) => void;
}) {
  switch (activeView) {
    case 'dashboard':    return <HomeView onNavigateToCards={() => navigate('wallet-cards')} onNavigateToProfile={() => navigate('profile')} />;
    case 'wallet-cards': return <WalletCardsView />;
    case 'loans':        return <LoansView onNavigateToCards={() => navigate('wallet-cards')} />;
    case 'spin-win':     return <SpinWinView onNavigateToCards={() => navigate('wallet-cards')} />;
    case 'referral':     return <ReferralView />;
    case 'profile':      return <ProfileView />;
    case 'link-wallet':  return <LinkWalletView onNavigateToCards={() => navigate('wallet-cards')} />;
    case 'security':     return <SecurityView />;
    case 'support':      return <SupportView />;
    default:             return <HomeView />;
  }
}

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState<ViewId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDark = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    setDarkMode(!darkMode);
  };

  const navigate = (id: ViewId) => {
    setActiveView(id);
    setSidebarOpen(false);
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      className={`flex flex-col h-full bg-black dark:bg-gray-950 ${
        mobile ? 'w-72' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center px-6 py-6 border-b border-white/10">
        <img
          src="/assets/fundsphere_dark_transparent.png"
          alt="FundSphere"
          className="h-24 w-auto object-contain"
        />
      </div>

      {/* Main Nav */}
      <nav className="flex-1 overflow-y-auto dashboard-scroll px-3 py-4 space-y-1">
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gold-gradient text-black shadow-lg gold-glow'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}

        {/* Separator */}
        <div className="my-3 border-t border-white/10" />

        {settingsNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gold-gradient text-black shadow-lg gold-glow'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom controls */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        {/* Dark mode toggle */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3 text-sm font-medium text-gray-400">
            {darkMode ? <Moon size={18} /> : <Sun size={18} />}
            <span>Dark Mode</span>
          </div>
          <button
            onClick={toggleDark}
            className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
              darkMode ? 'bg-gold' : 'bg-white/20'
            }`}
            aria-label="Toggle dark mode"
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
                darkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Sign out */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50"
            >
              <Sidebar mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between px-4 md:px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-bold text-black dark:text-white">
              {viewTitles[activeView]}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification bell */}
            

            {/* User avatar */}
            <button
              onClick={() => navigate('profile')}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-white/10 rounded-full hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center">
                <UserCircle size={16} className="text-black" />
              </div>
              <span className="text-sm font-semibold text-black dark:text-white hidden sm:block">
                {user?.name}
              </span>
            </button>
          </div>
        </header>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto dashboard-scroll">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="h-full"
            >
              <ViewRenderer activeView={activeView} navigate={navigate} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
