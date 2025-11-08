export interface PomodoroSettings {
  workDuration: number;
  breakDuration: number;
}

export interface PomodoroRecord {
  date: string;
  count: number;
}

export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  timeRemaining: number;
  mode: 'work' | 'break';
}

export interface CustomTimerState {
  isRunning: boolean;
  isPaused: boolean;
  elapsedTime: number;
}

export type Tab = 'pomodoro' | 'timer' | 'calendar';

export type Theme = 'light' | 'dark';
