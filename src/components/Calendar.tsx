import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getRecords } from '../utils/localStorage';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const records = getRecords();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getRecordForDate = (day: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return records.find(r => r.date === dateString);
  };

  const monthStats = useMemo(() => {
    const monthRecords = records.filter(r => {
      const recordDate = new Date(r.date);
      return recordDate.getMonth() === month && recordDate.getFullYear() === year;
    });
    
    const total = monthRecords.reduce((sum, r) => sum + r.count, 0);
    const days = monthRecords.length;
    const average = days > 0 ? (total / days).toFixed(1) : '0';
    
    return { total, days, average };
  }, [records, month, year]);

  const weekStats = useMemo(() => {
    const today = new Date();
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - today.getDay());
    
    const weekRecords = records.filter(r => {
      const recordDate = new Date(r.date);
      return recordDate >= currentWeekStart && recordDate <= today;
    });
    
    const total = weekRecords.reduce((sum, r) => sum + r.count, 0);
    
    return { total };
  }, [records]);

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">番茄钟日历</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="text-sm opacity-90 mb-2">本月完成</div>
          <div className="text-4xl font-bold">{monthStats.total}</div>
          <div className="text-sm opacity-75 mt-1">个番茄钟</div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="text-sm opacity-90 mb-2">本周完成</div>
          <div className="text-4xl font-bold">{weekStats.total}</div>
          <div className="text-sm opacity-75 mt-1">个番茄钟</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="text-sm opacity-90 mb-2">日均完成</div>
          <div className="text-4xl font-bold">{monthStats.average}</div>
          <div className="text-sm opacity-75 mt-1">个番茄钟</div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="上个月"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <h3 className="text-2xl font-bold">
            {year}年 {monthNames[month]}
          </h3>
          
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="下个月"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const record = getRecordForDate(day);
            const today = isToday(day);

            return (
              <div
                key={day}
                className={`aspect-square flex flex-col items-center justify-center rounded-lg transition-all ${
                  today
                    ? 'bg-blue-500 text-white font-bold ring-2 ring-blue-400'
                    : record
                    ? 'bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className={`text-sm ${today ? 'text-white' : ''}`}>{day}</div>
                {record && (
                  <div className={`flex items-center gap-0.5 mt-1 ${today ? 'text-white' : 'text-red-500'}`}>
                    <span className="text-xs font-bold">{record.count}</span>
                    <span className="text-xs">🍅</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-4 px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 dark:bg-red-900/30 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">有记录</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">今天</span>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl">
        <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">💡 提示</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          每完成一个工作番茄钟（25分钟），系统会自动在日历上记录。坚持使用番茄工作法，养成高效工作的习惯！
        </p>
      </div>
    </div>
  );
}
