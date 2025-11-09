import { PomodoroSettings, PomodoroRecord } from '../types';

const SETTINGS_KEY = 'pomodoro_settings';
const RECORDS_KEY = 'pomodoro_records';
const THEME_KEY = 'pomodoro_theme';

export const getSettings = (): PomodoroSettings => {
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return getDefaultSettings();
    }
  }
  return getDefaultSettings();
};

export const saveSettings = (settings: PomodoroSettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const getDefaultSettings = (): PomodoroSettings => ({
  workDuration: 25,
  breakDuration: 5,
});

export const getRecords = (): PomodoroRecord[] => {
  const stored = localStorage.getItem(RECORDS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
};

export const saveRecords = (records: PomodoroRecord[]): void => {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
};

export const addPomodoroRecord = (date: string): void => {
  const records = getRecords();
  const existingRecord = records.find(r => r.date === date);
  
  if (existingRecord) {
    existingRecord.count += 1;
  } else {
    records.push({ date, count: 1 });
  }
  
  saveRecords(records);
};

export const getTheme = (): 'light' | 'dark' => {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'dark' || stored === 'light') {
    return stored;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const saveTheme = (theme: 'light' | 'dark'): void => {
  localStorage.setItem(THEME_KEY, theme);
};
