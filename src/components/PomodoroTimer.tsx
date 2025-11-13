import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { PomodoroSettings, TimerState } from '../types';
import { getSettings, saveSettings, addPomodoroRecord, getTimerState, saveTimerState } from '../utils/localStorage';
import { showNotification, playSound, requestNotificationPermission } from '../utils/notifications';

export default function PomodoroTimer() {
  const [settings, setSettings] = useState<PomodoroSettings>(getSettings());
  const [showSettings, setShowSettings] = useState(false);
  
  const getInitialTimerState = (): TimerState => {
    const savedState = getTimerState();
    if (savedState) {
      return savedState;
    }
    return {
      isRunning: false,
      isPaused: false,
      timeRemaining: settings.workDuration * 60,
      mode: 'work',
    };
  };
  
  const [timerState, setTimerState] = useState<TimerState>(getInitialTimerState());
  
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    saveTimerState(timerState);
  }, [timerState]);

  useEffect(() => {
    if (timerState.isRunning && !timerState.isPaused) {
      intervalRef.current = window.setInterval(() => {
        setTimerState(prev => {
          if (prev.timeRemaining <= 1) {
            handleTimerComplete(prev.mode);
            return {
              ...prev,
              isRunning: false,
              isPaused: false,
              timeRemaining: prev.mode === 'work' ? settings.breakDuration * 60 : settings.workDuration * 60,
              mode: prev.mode === 'work' ? 'break' : 'work',
            };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isRunning, timerState.isPaused, settings, timerState.mode]);

  const handleTimerComplete = (completedMode: 'work' | 'break') => {
    playSound();
    
    if (completedMode === 'work') {
      const today = new Date().toISOString().split('T')[0];
      addPomodoroRecord(today);
      showNotification('工作时间结束！', '恭喜完成一个番茄钟！休息一下吧。');
    } else {
      showNotification('休息时间结束！', '准备好开始新的工作番茄钟了吗？');
    }
  };

  const handleStartPause = () => {
    if (!timerState.isRunning) {
      setTimerState(prev => ({ ...prev, isRunning: true, isPaused: false }));
    } else {
      setTimerState(prev => ({ ...prev, isPaused: !prev.isPaused }));
    }
  };

  const handleReset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimerState({
      isRunning: false,
      isPaused: false,
      timeRemaining: settings.workDuration * 60,
      mode: 'work',
    });
  };

  const handleSettingsSave = (newSettings: PomodoroSettings) => {
    saveSettings(newSettings);
    setSettings(newSettings);
    setShowSettings(false);
    
    if (!timerState.isRunning) {
      setTimerState(prev => ({
        ...prev,
        timeRemaining: prev.mode === 'work' ? newSettings.workDuration * 60 : newSettings.breakDuration * 60,
      }));
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = timerState.mode === 'work'
    ? (1 - timerState.timeRemaining / (settings.workDuration * 60)) * 100
    : (1 - timerState.timeRemaining / (settings.breakDuration * 60)) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">
            {timerState.mode === 'work' ? '工作时间' : '休息时间'}
          </h2>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="设置"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        {showSettings && (
          <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">设置</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  工作时长（分钟）
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.workDuration}
                  onChange={(e) => setSettings({ ...settings, workDuration: parseInt(e.target.value) || 25 })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  休息时长（分钟）
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.breakDuration}
                  onChange={(e) => setSettings({ ...settings, breakDuration: parseInt(e.target.value) || 5 })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => handleSettingsSave(settings)}
                className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                保存设置
              </button>
            </div>
          </div>
        )}

        <div className="relative w-80 h-80 mx-auto mb-12">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="160"
              cy="160"
              r="140"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="160"
              cy="160"
              r="140"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeDasharray="879.64"
              strokeDashoffset={879.64 * (1 - progress / 100)}
              className={timerState.mode === 'work' ? 'text-red-500' : 'text-green-500'}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-6xl font-bold font-mono">
              {formatTime(timerState.timeRemaining)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {timerState.mode === 'work' ? '专注工作中' : '休息放松中'}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleStartPause}
            className={`flex items-center gap-2 px-8 py-4 rounded-xl font-medium transition-all transform hover:scale-105 ${
              timerState.mode === 'work'
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/50'
                : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/50'
            }`}
          >
            {!timerState.isRunning || timerState.isPaused ? (
              <>
                <Play className="w-5 h-5" />
                开始
              </>
            ) : (
              <>
                <Pause className="w-5 h-5" />
                暂停
              </>
            )}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-8 py-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-xl font-medium transition-all transform hover:scale-105"
          >
            <RotateCcw className="w-5 h-5" />
            重置
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>使用番茄工作法提高专注力和效率</p>
        </div>
      </div>
    </div>
  );
}
