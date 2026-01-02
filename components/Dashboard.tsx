
import React, { useState, useEffect, useRef } from 'react';
import { 
  Target, 
  Zap, 
  TrendingUp, 
  BookOpen, 
  ShieldCheck, 
  Heart, 
  CheckCircle2, 
  Calendar,
  Rocket,
  ArrowRight,
  User,
  BarChart3,
  Mic2,
  Terminal,
  FastForward,
  Layers,
  Flame,
  AlertCircle,
  Cpu,
  Church,
  ScrollText,
  Sunrise,
  Loader2,
  Sparkles,
  Check,
  ChevronLeft,
  ChevronRight,
  Share2,
  Volume2,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Settings2,
  Sun,
  Award
} from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";
import { GIDEON_ROADMAP, INITIAL_WEEKLY_TARGETS } from '../constants';
import { WeeklyTarget } from '../types';
import { decode, decodeAudioData } from '../services/audioUtils';

const Card: React.FC<{ children: React.ReactNode; className?: string; title: string; icon: React.ReactNode; headerExtra?: React.ReactNode }> = ({ children, className = "", title, icon, headerExtra }) => (
  <div className={`glass p-6 rounded-2xl relative overflow-hidden group hover:border-blue-500/50 transition-all ${className}`}>
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      {icon}
    </div>
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
          {icon}
        </div>
        <h3 className="font-bold text-lg">{title}</h3>
      </div>
      {headerExtra}
    </div>
    {children}
  </div>
);

const PomodoroTimer: React.FC<{ onSessionComplete?: () => void }> = ({ onSessionComplete }) => {
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [showSettings, setShowSettings] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, mode]);

  const handleComplete = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.volume = 0.2;
    audio.play().catch(() => {});
    
    if (mode === 'focus') {
      onSessionComplete?.();
      setMode('break');
      setSecondsLeft(breakTime * 60);
    } else {
      setMode('focus');
      setSecondsLeft(focusTime * 60);
    }
    setIsActive(false);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft((mode === 'focus' ? focusTime : breakTime) * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'focus' 
    ? (1 - secondsLeft / (focusTime * 60)) * 100 
    : (1 - secondsLeft / (breakTime * 60)) * 100;

  return (
    <Card 
      title="Deep Work Engine" 
      icon={<Timer className="w-6 h-6" />} 
      className={`border-l-4 ${mode === 'focus' ? 'border-l-blue-500' : 'border-l-emerald-500'}`}
      headerExtra={
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-500 hover:text-white"
        >
          <Settings2 className="w-4 h-4" />
        </button>
      }
    >
      <div className="flex flex-col items-center py-4">
        {showSettings ? (
          <div className="w-full space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Focus (min)</label>
                <input 
                  type="number" 
                  value={focusTime}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setFocusTime(val);
                    if (!isActive && mode === 'focus') setSecondsLeft(val * 60);
                  }}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Break (min)</label>
                <input 
                  type="number" 
                  value={breakTime}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setBreakTime(val);
                    if (!isActive && mode === 'break') setSecondsLeft(val * 60);
                  }}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 outline-none text-white"
                />
              </div>
            </div>
            <button 
              onClick={() => setShowSettings(false)}
              className="w-full py-2 bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600/30 transition-all"
            >
              Save Configuration
            </button>
          </div>
        ) : (
          <>
            <div className="relative w-40 h-40 flex items-center justify-center mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                <circle
                  cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="4" fill="transparent"
                  strokeDasharray={440} strokeDashoffset={440 - (440 * progress) / 100}
                  strokeLinecap="round" className={`transition-all duration-1000 ${mode === 'focus' ? 'text-blue-500' : 'text-emerald-500'}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">
                  {mode === 'focus' ? 'Focus Session' : 'Recovery Mode'}
                </span>
                <span className="text-4xl font-black font-mono tracking-tighter">
                  {formatTime(secondsLeft)}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={toggleTimer}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  isActive ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'accent-gradient text-white shadow-lg shadow-blue-500/20'
                }`}
              >
                {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>
              <button 
                onClick={resetTimer}
                className="w-14 h-14 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

const CheckItem: React.FC<{ label: string }> = ({ label }) => {
  const [done, setDone] = useState(false);
  return (
    <div onClick={() => setDone(!done)} className="flex items-center gap-3 py-2 cursor-pointer group">
      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${done ? 'bg-blue-500 border-blue-500' : 'border-gray-600 group-hover:border-blue-400'}`}>
        {done && <CheckCircle2 className="w-3 h-3 text-white" />}
      </div>
      <span className={`text-sm transition-all ${done ? 'text-gray-500 line-through' : 'text-gray-300'}`}>{label}</span>
    </div>
  );
};

const SpiritualGoalItem: React.FC<{ label: string }> = ({ label }) => {
  const [isDone, setIsDone] = useState(false);
  return (
    <div 
      onClick={() => setIsDone(!isDone)}
      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 group ${
        isDone ? 'bg-amber-500/20 border-amber-500/40 opacity-80' : 'bg-white/5 border-white/10 hover:border-amber-500/30'
      }`}
    >
      <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all shrink-0 ${
        isDone ? 'bg-amber-500 border-amber-500 shadow-lg shadow-amber-500/20' : 'border-gray-600 group-hover:border-amber-400'
      }`}>
        {isDone && <Check className="w-4 h-4 text-black font-bold" />}
      </div>
      <span className={`text-xs font-medium leading-snug transition-all ${
        isDone ? 'text-amber-100/60 line-through' : 'text-gray-200'
      }`}>
        {label}
      </span>
    </div>
  );
};

const FocusRating: React.FC<{ title: string }> = ({ title }) => {
  const [rating, setRating] = useState(0);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{title}</span>
        <span className="text-[10px] text-blue-400 font-bold">{rating}/5</span>
      </div>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onClick={() => setRating(s)}
            className={`h-1.5 flex-1 rounded-full transition-all ${s <= rating ? 'bg-blue-500' : 'bg-gray-800 hover:bg-gray-700'}`}
          />
        ))}
      </div>
    </div>
  );
};

const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [
    { url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop", title: "Focus Deeply", desc: "Intentional execution in every pixel." },
    { url: "https://images.unsplash.com/photo-1506485338023-6ce5f36692df?q=80&w=2070&auto=format&fit=crop", title: "Build Intentionally", desc: "Systems that generate calm and growth." }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden mb-12 group shadow-2xl">
      {images.map((img, idx) => (
        <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
          <img src={img.url} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[10s]" alt={img.title} />
          <div className="absolute bottom-12 left-8 md:left-12 z-20 max-w-2xl">
             <div className="flex items-center gap-2 text-blue-500 mb-2">
                <Target className="w-5 h-5" />
                <span className="font-bold tracking-widest text-xs uppercase">{GIDEON_ROADMAP.name}</span>
             </div>
             <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">{img.title}</h2>
             <p className="text-sm md:text-lg text-gray-300 font-medium italic opacity-90 leading-relaxed max-w-lg">
                "{GIDEON_ROADMAP.theme}"
             </p>
          </div>
        </div>
      ))}
      <div className="absolute bottom-8 right-8 z-20 flex gap-2">
        <button onClick={() => setCurrentSlide(prev => (prev - 1 + images.length) % images.length)} className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full border border-white/10 transition-all active:scale-90"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={() => setCurrentSlide(prev => (prev + 1) % images.length)} className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full border border-white/10 transition-all active:scale-90"><ChevronRight className="w-5 h-5" /></button>
      </div>
    </div>
  );
};

const Header: React.FC = () => (
  <header className="sticky top-0 z-50 w-full bg-black/50 backdrop-blur-xl border-b border-white/5 py-4 mb-8">
    <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
      <div className="flex items-center gap-3 group">
        <div className="p-2 bg-blue-600 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/20">
          <Rocket className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic">Focus<span className="text-blue-500">2026</span></h1>
          <p className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.2em] leading-none">Strategic Operating System</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex flex-col items-end">
           <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Q1 SPRINT</span>
           <span className="text-xs font-black">Day 32 of 90</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center relative">
          <User className="w-5 h-5 text-gray-400" />
          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#0a0a0a] rounded-full"></div>
        </div>
      </div>
    </div>
  </header>
);

export const Dashboard: React.FC = () => {
  const [weeklyTargets, setWeeklyTargets] = useState<WeeklyTarget[]>(INITIAL_WEEKLY_TARGETS);
  const [devotional, setDevotional] = useState<string | null>(null);
  const [isLoadingDevotional, setIsLoadingDevotional] = useState(false);
  const [isSharingProgress, setIsSharingProgress] = useState(false);
  const [deepWorkSessions, setDeepWorkSessions] = useState(0);

  const toggleTarget = (id: string) => {
    setWeeklyTargets(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const generateDevotional = async () => {
    const key = process.env.API_KEY;
    if (!key) return;
    setIsLoadingDevotional(true);
    try {
      const ai = new GoogleGenAI({ apiKey: key });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Gideon Adeoye needs his Daily Devotional for his 2026 Roadmap. Theme: ${GIDEON_ROADMAP.theme}. Provide: Verse of the Day, 3-sentence build reflection, and 3-chapter reading plan. Be intense.`,
      });
      setDevotional(response.text || "Failed to receive wisdom.");
    } catch (err) {
      console.error(err);
      setDevotional("Heaven's gateway is blocked. Check your API key.");
    } finally { setIsLoadingDevotional(false); }
  };

  const shareProgressVoice = async () => {
    const key = process.env.API_KEY;
    if (!key) return;
    setIsSharingProgress(true);
    try {
      const completed = weeklyTargets.filter(t => t.isCompleted);
      const progressPercent = Math.round((completed.length / weeklyTargets.length) * 100);
      const ai = new GoogleGenAI({ apiKey: key });
      const prompt = `Gideon progress report: ${progressPercent}% complete. Completed: ${completed.map(c => c.task).join(', ')}. Give a commanding, strategic voice report for Gideon. Mention he has done ${deepWorkSessions} deep work sessions today. END WITH A LOUD ALERT TO SHIP THE MVP.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const audioBuffer = await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        source.start();
      }
    } catch (err) { console.error(err); } finally { setIsSharingProgress(false); }
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 pb-32">
        
        {/* DEVOTIONAL PRIORITY #1 */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4 px-2">
            <Sun className="w-5 h-5 text-amber-500 animate-spin-slow" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500/80">Morning First-Fruits Protocol</span>
          </div>
          <Card title="Daily Spiritual Targets" icon={<Church className="w-6 h-6" />} className="border-amber-500/30 bg-amber-500/[0.03] shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {GIDEON_ROADMAP.spiritualRules.map((rule, i) => <SpiritualGoalItem key={i} label={rule} />)}
                </div>
                {devotional ? (
                  <div className="bg-amber-900/10 border border-amber-500/20 p-6 rounded-2xl prose prose-invert animate-in fade-in zoom-in-95 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><ScrollText className="w-12 h-12 text-amber-500" /></div>
                    <div className="text-sm text-gray-200 leading-relaxed font-medium">{devotional}</div>
                  </div>
                ) : (
                  <div className="py-8 border-2 border-dashed border-amber-500/10 rounded-2xl bg-amber-500/[0.01] flex flex-col items-center">
                    <button onClick={generateDevotional} disabled={isLoadingDevotional} className="bg-amber-500 text-black px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-400 transition-all flex items-center gap-2">
                      {isLoadingDevotional ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Receive Devotional</>}
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                 <div className="p-5 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-center">
                    <h5 className="font-bold text-sm mb-4 italic">"Seek first the kingdom..."</h5>
                    <button onClick={generateDevotional} className="w-full py-3 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all">
                      Refresh Wisdom
                    </button>
                 </div>
              </div>
            </div>
          </Card>
        </section>

        <HeroSlider />

        {/* WORK ENGINE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <PomodoroTimer onSessionComplete={() => setDeepWorkSessions(s => s + 1)} />
           <Card title="Sprint Architect" icon={<Cpu className="w-6 h-6" />} className="md:col-span-2 border-emerald-500/20 bg-emerald-500/[0.02]">
              <div className="flex flex-col h-full justify-center">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-emerald-400">Strategy Breakdown</h4>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600">
                    <Award className="w-4 h-4" /> {deepWorkSessions} SESSIONS TODAY
                  </div>
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-emerald-500/10 mb-4 italic text-sm text-emerald-100/80">
                  "AI Partner, Gideon here. Perform a status audit on my MVP targets for Week 05."
                </div>
                <button 
                  onClick={() => (document.querySelector('[data-voice-trigger="true"]') as HTMLElement)?.click()}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-4 transition-all hover:scale-[1.02]"
                >
                  <Mic2 className="w-5 h-5 animate-pulse" /> START SESSION
                </button>
              </div>
           </Card>
        </div>

        {/* TARGETS & AUDIT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card 
            title="Weekly Sprint Targets" icon={<Layers className="w-6 h-6" />} className="lg:col-span-2 border-orange-500/20 bg-orange-500/[0.02]"
            headerExtra={
              <button onClick={shareProgressVoice} disabled={isSharingProgress} className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-orange-500/20 transition-all">
                {isSharingProgress ? <Loader2 className="w-3 h-3 animate-spin" /> : <Volume2 className="w-3 h-3" />}
                Share Progress
              </button>
            }
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {weeklyTargets.map((target) => (
                  <div key={target.id} onClick={() => toggleTarget(target.id)} className={`p-4 rounded-xl border transition-all cursor-pointer flex gap-3 ${target.isCompleted ? 'bg-green-500/10 border-green-500/20 opacity-60' : 'bg-white/5 border-white/10 hover:border-orange-500/50'}`}>
                    <div className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${target.isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-600'}`}>
                      {target.isCompleted && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <div className="text-[8px] font-bold uppercase text-orange-400 mb-1">{target.category}</div>
                      <div className={`text-xs font-bold ${target.isCompleted ? 'text-gray-500 line-through' : 'text-gray-200'}`}>{target.task}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 flex items-center justify-center border-t border-white/5">
                <button onClick={() => (document.querySelector('[data-voice-trigger="true"]') as HTMLElement)?.click()} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400 hover:text-orange-300 transition-colors">
                  <Flame className="w-4 h-4" /> Start Audit Session
                </button>
              </div>
            </div>
          </Card>

          <Card title="Voice Audit Protocol" icon={<Terminal className="w-6 h-6" />} className="border-purple-500/20 bg-purple-500/[0.02]">
            <div className="space-y-4">
              <div className="space-y-3 text-xs text-gray-500">
                <div className="flex gap-3"><div className="w-5 h-5 bg-purple-500/20 text-purple-400 rounded flex items-center justify-center font-bold">1</div><span>Daily Devotional Wisdom</span></div>
                <div className="flex gap-3"><div className="w-5 h-5 bg-purple-500/20 text-purple-400 rounded flex items-center justify-center font-bold">2</div><span>Weekly Strategy Alignment</span></div>
                <div className="flex gap-3"><div className="w-5 h-5 bg-purple-500/20 text-purple-400 rounded flex items-center justify-center font-bold">3</div><span>Alert Mode Performance Audit</span></div>
              </div>
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl mt-4">
                <div className="text-[10px] font-black text-red-500 uppercase mb-1">Gideon's Warning:</div>
                <p className="text-[10px] text-gray-400 leading-tight">Perfectionism is pride. Slash the features and ship the MVP now.</p>
              </div>
            </div>
          </Card>
        </div>

        {/* CORE ROADMAP CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="Life Vision" icon={<Target className="w-6 h-6" />}>
            <ul className="space-y-3 text-sm text-gray-400 italic">
              {GIDEON_ROADMAP.vision.map((v, i) => <li key={i}>{v}</li>)}
            </ul>
          </Card>
          <Card title="Business Goals" icon={<Rocket className="w-6 h-6" />}>
            <ul className="space-y-2 text-xs text-gray-300">
              {GIDEON_ROADMAP.businessGoals.map((g, i) => <li key={i} className="flex gap-2"><ArrowRight className="w-3 h-3 text-blue-500" /> {g}</li>)}
            </ul>
          </Card>
          <Card title="Health & Energy" icon={<Heart className="w-6 h-6" />}>
            <div className="space-y-3">
              <div className="text-[10px] font-bold text-red-400 uppercase">Say NO to:</div>
              <ul className="text-xs text-gray-500 space-y-1">
                {GIDEON_ROADMAP.healthRules.filter(r => r.includes('Say NO')).map((r, i) => <li key={i}>&bull; {r.replace('Say NO to: ', '')}</li>)}
              </ul>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3 glass p-12 rounded-3xl mt-12 text-center bg-gradient-to-br from-blue-600/10 to-purple-600/10">
          <Calendar className="w-12 h-12 text-blue-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black mb-6 italic tracking-tight text-white">"I choose focus over noise, execution over excuses, and progress over perfection."</h2>
          <span className="font-bold uppercase tracking-widest text-sm text-gray-500">Gideon Adeoye &bull; 2/1/2026</span>
        </div>
      </div>
      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>
    </>
  );
};
