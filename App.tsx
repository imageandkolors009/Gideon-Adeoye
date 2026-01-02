
import React from 'react';
import { Dashboard } from './components/Dashboard';
import { LiveVoiceAgent } from './components/LiveVoiceAgent';
import { NotificationSystem } from './components/NotificationSystem';
import { LayoutGrid, Target, Church, Rocket, Bell } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen relative flex flex-col bg-[#0a0a0a]">
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
      </div>

      <main className="flex-1 overflow-y-auto pb-32 sm:pb-24">
        <Dashboard />
      </main>

      {/* Persistent Voice Agent */}
      <LiveVoiceAgent />

      {/* Loud Alert Push Notifications */}
      <NotificationSystem />

      {/* Mobile-Native Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full border-t border-white/5 bg-black/80 backdrop-blur-2xl px-6 pt-3 pb-8 sm:pb-4 z-40 flex justify-between items-center safe-area-bottom">
        <button className="flex flex-col items-center gap-1 group">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 group-active:scale-90 transition-transform">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Focus</span>
        </button>
        
        <button className="flex flex-col items-center gap-1 group text-gray-500 hover:text-white transition-colors">
          <div className="p-2 rounded-xl group-active:scale-90 transition-transform">
            <Target className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest">Sprints</span>
        </button>

        {/* Center Action Button Placeholder (Voice is floating) */}
        <div className="w-12"></div>

        <button className="flex flex-col items-center gap-1 group text-gray-500 hover:text-white transition-colors">
          <div className="p-2 rounded-xl group-active:scale-90 transition-transform">
            <Church className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest">Spirit</span>
        </button>

        <button className="flex flex-col items-center gap-1 group text-gray-500 hover:text-white transition-colors">
          <div className="p-2 rounded-xl group-active:scale-90 transition-transform">
            <Bell className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest">Alerts</span>
        </button>
      </nav>

      {/* Desktop Branded Footer - Hidden on Mobile */}
      <footer className="hidden sm:block fixed bottom-0 left-0 w-full pointer-events-none pb-2">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center opacity-40">
          <div className="text-[8px] font-black tracking-[0.3em] uppercase text-gray-500">
            Focus2026 Native <span className="text-blue-500">PWA v2.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
