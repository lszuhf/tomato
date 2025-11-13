import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { CustomTimerState } from '../types';

export default function CustomTimer() {
  const [timerState, setTimerState] = useState<CustomTimerState>({
    isRunning: false,
    isPaused: false,
    elapsedTime: 0,
  });
  
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && timerState.isRunning && !timerState.isPaused && startTimeRef.current !== null) {
        const newElapsedTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
        
        setTimerState(prev => ({
          ...prev,
          elapsedTime: newElapsedTime,
        }));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [timerState.isRunning, timerState.isPaused]);

  useEffect(() => {
    if (timerState.isRunning && !timerState.isPaused) {
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now() - (timerState.elapsedTime * 1000);
      }

      intervalRef.current = window.setInterval(() => {
        if (startTimeRef.current === null) return;

        const newElapsedTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
        
        setTimerState(prev => ({
          ...prev,
          elapsedTime: newElapsedTime,
        }));
      }, 1000);
    } else {
      if (timerState.isPaused) {
        startTimeRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isRunning, timerState.isPaused, timerState.elapsedTime]);

  const handleStartPause = () => {
    if (!timerState.isRunning) {
      setTimerState(prev => ({ ...prev, isRunning: true, isPaused: false }));
    } else {
      setTimerState(prev => ({ ...prev, isPaused: !prev.isPaused }));
    }
  };

  const handleStop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    startTimeRef.current = null;
    setTimerState({
      isRunning: false,
      isPaused: false,
      elapsedTime: 0,
    });
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] px-4">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-12">正计时器</h2>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 mb-8">
          <div className="text-center">
            <div className={`text-7xl font-bold font-mono mb-4 ${
              timerState.isRunning && !timerState.isPaused ? 'text-blue-500 animate-pulse-slow' : ''
            }`}>
              {formatTime(timerState.elapsedTime)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {timerState.isRunning && !timerState.isPaused ? '计时中...' : 
               timerState.isPaused ? '已暂停' : '准备开始'}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleStartPause}
            className="flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg shadow-blue-500/50"
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
          {(timerState.isRunning || timerState.elapsedTime > 0) && (
            <button
              onClick={handleStop}
              className="flex items-center gap-2 px-8 py-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-xl font-medium transition-all transform hover:scale-105"
            >
              <Square className="w-5 h-5" />
              停止
            </button>
          )}
        </div>

        <div className="mt-12 text-center space-y-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>自定义计时器，适用于任意长度的任务</p>
          </div>
          
          {timerState.elapsedTime > 0 && (
            <div className="grid grid-cols-3 gap-4 p-6 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {Math.floor(timerState.elapsedTime / 3600)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">小时</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {Math.floor((timerState.elapsedTime % 3600) / 60)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">分钟</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {timerState.elapsedTime % 60}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">秒</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
