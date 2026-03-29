"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Activity, Apple, Ruler, User, Target, 
  History, TrendingDown, Calendar, Clock, Zap, Coffee, ChevronRight, Flame
} from "lucide-react";

export default function FitnessUltimateSystem() {
  // 1. 基础数据状态
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("25");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [waist, setWaist] = useState("");
  const [neck, setNeck] = useState("");
  const [hip, setHip] = useState("");
  const [activity, setActivity] = useState("1.375");

  // 2. 目标设定状态
  const [targetWeight, setTargetWeight] = useState("");
  const [targetBF, setTargetBF] = useState("");
  const [dailyDeficit, setDailyDeficit] = useState("300");

  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  // 初始化加载
  useEffect(() => {
    const saved = localStorage.getItem("fitvibe_ultimate_v5");
    if (saved) {
      const parsed = JSON.parse(saved);
      setHistory(parsed.history || []);
      setWeight(parsed.lastData?.weight || "");
      setHeight(parsed.lastData?.height || "");
      setAge(parsed.lastData?.age || "25");
      setTargetWeight(parsed.lastData?.targetWeight || "");
      setTargetBF(parsed.lastData?.targetBF || "");
    }
  }, []);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    const wa = parseFloat(waist);
    const ne = parseFloat(neck);
    const hi = parseFloat(hip) || 0;
    const tW = parseFloat(targetWeight);
    const tBF = parseFloat(targetBF);
    const deficit = parseFloat(dailyDeficit);

    if (!w || !h || !wa || !ne) {
      alert("请填写完整：身高、体重、腰围、颈围");
      return;
    }

    // A. 计算当前体脂率 (Navy Formula)
    let currentBF = gender === "male" 
      ? 495 / (1.0324 - 0.19077 * Math.log10(wa - ne) + 0.15456 * Math.log10(h)) - 450
      : 495 / (1.29579 - 0.35004 * Math.log10(wa + hi - ne) + 0.22100 * Math.log10(h)) - 450;
    currentBF = parseFloat(currentBF.toFixed(1));

    // B. 热量计算
    const bmr = gender === "male" ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
    const tdee = Math.round(bmr * parseFloat(activity));
    const targetCals = tdee - deficit;

    // C. 目标达成时间预测
    // 减掉 1kg 脂肪约需 7700kcal
    let weightDays = tW && w > tW ? Math.round(((w - tW) * 7700) / deficit) : 0;
    
    // 按目标体脂计算所需减去的纯脂肪 (假设瘦体重不变)
    let bfDays = 0;
    if (tBF && currentBF > tBF) {
      const leanMass = w * (1 - currentBF/100);
      const goalWeightAtBF = leanMass / (1 - tBF/100);
      bfDays = Math.round(((w - goalWeightAtBF) * 7700) / deficit);
    }

    // D. 营养素分配
    const proteinG = Math.round(w * 1.8); // 减脂期保持 1.8g/kg 蛋白
    const fatG = Math.round(w * 0.7);
    const carbG = Math.round((targetCals - (proteinG * 4) - (fatG * 9)) / 4);

    const newData = {
      currentBF,
      bmi: (w / ((h / 100) ** 2)).toFixed(1),
      tdee,
      targetCals,
      proteinG, fatG, carbG,
      weightDays,
      bfDays,
      date: new Date().toLocaleDateString()
    };

    setResult(newData);

    // 保存
    const newHistory = [{ date: newData.date, weight: w, bf: currentBF }, ...history.slice(0, 9)];
    setHistory(newHistory);
    localStorage.setItem("fitvibe_ultimate_v5", JSON.stringify({
      history: newHistory,
      lastData: { weight, height, age, targetWeight, targetBF }
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 text-slate-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* 左侧：输入控制台 */}
        <div className="xl:col-span-4 space-y-6">
          <Card className="border-0 shadow-2xl rounded-[2.5rem] bg-white">
            <CardHeader className="bg-indigo-600 rounded-t-[2.5rem] p-8 text-white">
              <CardTitle className="flex items-center gap-3">
                <Flame className="text-orange-400" /> 减脂精密计算
              </CardTitle>
              <p className="text-indigo-100 text-xs mt-2">基于代谢模型与 16+8 饮食策略</p>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {/* 基础信息 */}
              <div className="space-y-4">
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                  {["male", "female"].map(s => (
                    <Button key={s} variant={gender === s ? "default" : "ghost"} className="flex-1 rounded-lg capitalize" onClick={() => setGender(s)}>{s === 'male' ? '男生' : '女生'}</Button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><Label className="text-xs">年龄</Label><Input type="number" value={age} onChange={(e)=>setAge(e.target.value)} className="rounded-xl"/></div>
                  <div className="space-y-1"><Label className="text-xs">身高 cm</Label><Input type="number" value={height} onChange={(e)=>setHeight(e.target.value)} className="rounded-xl"/></div>
                  <div className="space-y-1"><Label className="text-xs">体重 kg</Label><Input type="number" value={weight} onChange={(e)=>setWeight(e.target.value)} className="rounded-xl"/></div>
                  <div className="space-y-1"><Label className="text-xs">腰围 cm</Label><Input type="number" value={waist} onChange={(e)=>setWaist(e.target.value)} className="rounded-xl"/></div>
                  <div className="space-y-1"><Label className="text-xs">颈围 cm</Label><Input type="number" value={neck} onChange={(e)=>setNeck(e.target.value)} className="rounded-xl"/></div>
                  {gender === 'female' && <div className="space-y-1"><Label className="text-xs">臀围 cm</Label><Input type="number" value={hip} onChange={(e)=>setHip(e.target.value)} className="rounded-xl"/></div>}
                </div>
              </div>

              {/* 目标设定 */}
              <div className="pt-6 border-t space-y-4">
                <div className="text-sm font-bold flex items-center gap-2 text-indigo-600"><Target size={16}/> 减脂目标与缺口</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1"><Label className="text-[10px]">目标体重</Label><Input type="number" value={targetWeight} onChange={(e)=>setTargetWeight(e.target.value)} className="rounded-lg"/></div>
                  <div className="space-y-1"><Label className="text-[10px]">目标体脂%</Label><Input type="number" value={targetBF} onChange={(e)=>setTargetBF(e.target.value)} className="rounded-lg"/></div>
                  <div className="space-y-1"><Label className="text-[10px]">日缺口kcal</Label><Input type="number" value={dailyDeficit} onChange={(e)=>setDailyDeficit(e.target.value)} className="rounded-lg text-orange-600 font-bold"/></div>
                </div>
              </div>

              <Button onClick={calculate} className="w-full py-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-xl font-black shadow-xl shadow-indigo-100 transition-transform active:scale-95">
                生成全方位方案
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 右侧：分析与详细食谱 */}
        <div className="xl:col-span-8 space-y-6">
          {!result ? (
            <div className="h-[600px] flex flex-col items-center justify-center bg-white rounded-[3rem] border-4 border-dashed border-slate-200 text-slate-400">
               <Activity size={64} className="mb-4 opacity-20" />
               <p className="text-lg">请输入数据并开启您的身材管理</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
              
              {/* 核心指标与倒计时 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6 rounded-3xl border-0 shadow-lg bg-white">
                  <p className="text-xs text-slate-400 font-bold mb-1">当前体脂率</p>
                  <div className="text-4xl font-black text-indigo-600">{result.currentBF}%</div>
                  <div className="mt-2 text-[10px] text-slate-500">BMI: {result.bmi}</div>
                </Card>
                <Card className="p-6 rounded-3xl border-0 shadow-lg bg-indigo-600 text-white relative overflow-hidden">
                  <p className="text-indigo-100 text-xs font-bold mb-1">达成目标体重还需</p>
                  <div className="text-4xl font-black">{result.weightDays} <span className="text-sm">天</span></div>
                  <Zap className="absolute right-[-10px] bottom-[-10px] size-24 opacity-10" />
                </Card>
                <Card className="p-6 rounded-3xl border-0 shadow-lg bg-orange-500 text-white">
                  <p className="text-orange-100 text-xs font-bold mb-1">达成目标体脂还需</p>
                  <div className="text-4xl font-black">{result.bfDays} <span className="text-sm">天</span></div>
                </Card>
              </div>

              {/* 16+8 详细食谱方案 */}
              <Card className="border-0 shadow-2xl rounded-[3rem] bg-white overflow-hidden">
                <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black flex items-center gap-2">
                      <Clock className="text-yellow-400" /> 16+8 深度营养方案
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">进食窗口：12:00 - 20:00 | 每日目标：{result.targetCals} kcal</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase">今日宏量分配</div>
                    <div className="flex gap-3 font-mono text-xs mt-1">
                      <span className="text-emerald-400">P:{result.proteinG}g</span>
                      <span className="text-blue-400">C:{result.carbG}g</span>
                      <span className="text-orange-400">F:{result.fatG}g</span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-8 space-y-8">
                  {/* 早餐/断食期 */}
                  <div className="flex gap-6">
                    <div className="flex-none w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl">☕</div>
                    <div className="space-y-2">
                      <h4 className="font-black text-slate-800 flex items-center gap-2">08:00 - 12:00 脂肪代谢期</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        <span className="font-bold text-slate-700">建议项：</span>黑咖啡 (提高代谢)、绿茶或柠檬水。<br/>
                        <span className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md font-bold">此阶段禁食，仅补充水分。</span>
                      </p>
                    </div>
                  </div>

                  {/* 第一餐 */}
                  <div className="flex gap-6 pt-6 border-t">
                    <div className="flex-none w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl">🥗</div>
                    <div className="space-y-3">
                      <h4 className="font-black text-slate-800">12:00 营养强化餐 (第一餐)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-xs font-bold text-emerald-600 mb-1">蛋白质 (选一)</p>
                          <ul className="text-xs text-slate-600 space-y-1">
                            <li>• 鸡胸肉 {Math.round(result.proteinG * 0.5)}g (黑胡椒煎)</li>
                            <li>• 龙利鱼/鳕鱼 {Math.round(result.proteinG * 0.6)}g (清蒸)</li>
                            <li>• 瘦牛肉片 {Math.round(result.proteinG * 0.45)}g (水煮)</li>
                          </ul>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-xs font-bold text-blue-600 mb-1">优质碳水与纤维</p>
                          <ul className="text-xs text-slate-600 space-y-1">
                            <li>• 糙米/红薯 {Math.round(result.carbG * 0.5)}g (蒸熟重量)</li>
                            <li>• 蔬菜 300g (西兰花、生菜、西葫芦)</li>
                            <li>• 建议烹饪：白灼或橄榄油轻炒</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 第二餐 */}
                  <div className="flex gap-6 pt-6 border-t">
                    <div className="flex-none w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-3xl">🥩</div>
                    <div className="space-y-3">
                      <h4 className="font-black text-slate-800">19:30 燃脂闭窗餐 (最后一餐)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-xs font-bold text-orange-600 mb-1">蛋白质 (选一)</p>
                          <ul className="text-xs text-slate-600 space-y-1">
                            <li>• 虾仁 {Math.round(result.proteinG * 0.45)}g (清蒸/蒜蓉)</li>
                            <li>• 鸡蛋 2个 + 蛋白 2个 (水煮)</li>
                            <li>• 豆腐 200g (少油煎/炖)</li>
                          </ul>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-xs font-bold text-indigo-600 mb-1">极低碳水与纤维</p>
                          <ul className="text-xs text-slate-600 space-y-1">
                            <li>• 大份混合沙拉 300g (紫甘蓝、黄瓜、菠菜)</li>
                            <li>• 调味：苹果醋/少许海盐/柠檬汁</li>
                            <li>• <span className="text-red-500 font-bold">注意：</span>此餐尽量不摄入主食。</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 历史趋势图 */}
              <Card className="border-0 shadow-xl rounded-[2.5rem] bg-white p-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><TrendingDown className="text-indigo-600" /> 体重与体脂变化历史</h3>
                <div className="flex items-end gap-3 h-40 pt-10 border-b border-slate-100 px-4">
                  {history.slice().reverse().map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center group relative">
                      <div className="absolute -top-12 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[10px] p-2 rounded-lg transition-all z-20">
                        {h.weight}kg / {h.bf}%
                      </div>
                      <div className="w-full flex gap-1 items-end h-full">
                        <div className="flex-1 bg-indigo-500/80 rounded-t-md hover:bg-indigo-600 transition-colors" style={{ height: `${(h.weight/150)*100}%` }}></div>
                        <div className="flex-1 bg-orange-400/80 rounded-t-md hover:bg-orange-500 transition-colors" style={{ height: `${h.bf}%` }}></div>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-2 rotate-[-45deg]">{h.date.split('/')[1]}/{h.date.split('/')[2]}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


