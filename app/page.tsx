"use client"; // 确保这一行没有被注释，并且在最顶部

import React, { useState, useEffect } from 'react';
import { Activity, Apple, Scale, Clock } from 'lucide-react';

export default function FitnessApp() { // 确保这里有 export default
  const [fastingTime, setFastingTime] = useState(0);
  const [isFasting, setIsFasting] = useState(false);

  // 定时器逻辑
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isFasting) {
      timer = setInterval(() => {
        setFastingTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (!isFasting && fastingTime !== 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isFasting, fastingTime]); // 修正依赖数组

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* 头部 */}
      <div className="bg-blue-600 p-6 rounded-b-3xl text-white shadow-lg">
        <h1 className="text-2xl font-bold">我的健身看板</h1>
        <p className="opacity-80">坚持就是胜利！</p>
      </div>

      {/* 16+8 计时器 */}
      <div className="m-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="text-blue-500" />
            <span className="font-bold text-slate-700">16+8 断食计时</span>
          </div>
          <span className="text-sm text-slate-400">目标: 16小时</span>
        </div>
        <div className="text-center py-4">
          <div className="text-4xl font-mono font-bold text-slate-800 mb-2">
            {Math.floor(fastingTime / 3600).toString().padStart(2, '0')}:
            {Math.floor((fastingTime % 3600) / 60).toString().padStart(2, '0')}:
            {(fastingTime % 60).toString().padStart(2, '0')}
          </div>
          <button
            onClick={() => setIsFasting(!isFasting)}
            className={`px-8 py-3 rounded-full font-bold transition-all ${
              isFasting ? 'bg-red-100 text-red-600' : 'bg-blue-600 text-white shadow-md'
            }`}
          >
            {isFasting ? '停止计时' : '开始断食'}
          </button>
        </div>
      </div>

      {/* 快捷数据 */}
      <div className="grid grid-cols-2 gap-4 m-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <Apple className="text-green-500 mb-2" />
          <div className="text-sm text-slate-500">摄入热量</div>
          <div className="text-xl font-bold">1,450 kcal</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <Activity className="text-orange-500 mb-2" />
          <div className="text-sm text-slate-500">消耗热量</div>
          <div className="text-xl font-bold">420 kcal</div>
        </div>
      </div>

      {/* 底部导航栏 */}
      <div className="fixed bottom-0 w-full bg-white border-t flex justify-around py-3">
        <div className="flex flex-col items-center text-blue-600">
          <Activity size={24} />
          <span className="text-xs">训练</span>
        </div>
        <div className="flex flex-col items-center text-slate-400">
          <Apple size={24} />
          <span className="text-xs">饮食</span>
        </div>
        <div className="flex flex-col items-center text-slate-400">
          <Scale size={24} />
          <span className="text-xs">身体</span>
        </div>
      </div>
    </div>
  );
}

