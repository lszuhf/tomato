import { useState, useEffect } from 'react';
import { Timer, Clock, Calendar as CalendarIcon, Moon, Sun } from 'lucide-react';
import { Tab, Theme } from './types';
import { getTheme, saveTheme } from './utils/localStorage';
import PomodoroTimer from './components/PomodoroTimer';
import CustomTimer from './components/CustomTimer';
import Calendar from './components/Calendar';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('pomodoro');
  const [theme, setTheme] = useState<Theme>(getTheme());

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const tabs = [
    { id: 'pomodoro' as Tab, label: '番茄钟', icon: Timer },
    { id: 'timer' as Tab, label: '正计时', icon: Clock },
    { id: 'calendar' as Tab, label: '日历', icon: CalendarIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🍅</div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                番茄钟
              </h1>
            </div>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="切换主题"
            >
              {theme === 'light' ? (
                <Moon className="w-6 h-6" />
              ) : (
                <Sun className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center gap-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative ${
                    activeTab === tab.id
                      ? 'text-red-500 dark:text-red-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 dark:bg-red-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto">
        {activeTab === 'pomodoro' && <PomodoroTimer />}
        {activeTab === 'timer' && <CustomTimer />}
        {activeTab === 'calendar' && <Calendar />}
      </main>

      <footer className="mt-12 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>专注工作，高效生活 🚀</p>
      </footer>
    </div>
  );
}

export default App;
