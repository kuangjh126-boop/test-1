"use client";

import React, { useState } from 'react';
import { Activity, Apple, Scale, Clock } from 'lucide-react';

export default function FitnessApp() {
  const [fastingTime, setFastingTime] = useState(0);
  const [isFasting, setIsFasting] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 p-4">
      <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg mb-6">
        <h1 className="text-2xl font-bold">我的健身助手</h1>
        <p className="opacity-80">16+8 断食与体脂管理</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="text-blue-500" />
          <span className="font-bold text-slate-700">断食计时器</span>
        </div>
        <div className="text-4xl font-mono font-bold text-slate-800 mb-4">
          {Math.floor(fastingTime / 3600).toString().padStart(2, '0')}:
          {Math.floor((fastingTime % 3600) / 60).toString().padStart(2, '0')}:
          {(fastingTime % 60).toString().padStart(2, '0')}
        </div>
        <button 
          onClick={() => setIsFasting(!isFasting)}
          className={`px-8 py-3 rounded-full font-bold ${
            isFasting ? 'bg-red-100 text-red-600' : 'bg-blue-600 text-white'
          }`}
        >
          {isFasting ? '停止计时' : '开始断食'}
        </button>
      </div>
    </div>
  );
}

