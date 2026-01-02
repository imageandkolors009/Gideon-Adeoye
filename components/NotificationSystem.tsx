
import React, { useState, useEffect, useCallback } from 'react';
import { Bell, AlertTriangle, X, Rocket, Zap } from 'lucide-react';

interface Notification {
  id: number;
  message: string;
  type: 'alert' | 'info' | 'success';
}

export const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string, type: 'alert' | 'info' | 'success' = 'alert') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 8000);

    // Play alert sound if it's an alert
    if (type === 'alert') {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => console.log("Audio play blocked by browser"));
    }
  }, []);

  useEffect(() => {
    // Simulate periodic "Push Notifications" for Gideon
    const alerts = [
      "Gideon: Deep work block starting NOW. NO SCROLLING.",
      "ALERT: Are you shipping an MVP this week or just polishing?",
      "FOCUS CHECK: Does your current task lead to RECURRING INCOME?",
      "REMINDER: Sleep before midnight. Your clarity is your power."
    ];

    const interval = setInterval(() => {
      const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
      addNotification(randomAlert, 'alert');
    }, 180000); // Every 3 minutes for simulation

    // Initial alert
    const timer = setTimeout(() => addNotification("Welcome back, Gideon. Ready to build intentionally?", "success"), 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [addNotification]);

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-4 w-80 pointer-events-none">
      {notifications.map(notif => (
        <div 
          key={notif.id}
          className={`pointer-events-auto glass p-4 rounded-xl shadow-2xl flex items-start gap-3 animate-in slide-in-from-right-8 duration-500 border-l-4 ${
            notif.type === 'alert' ? 'border-red-500 bg-red-500/10' : 
            notif.type === 'success' ? 'border-green-500 bg-green-500/10' : 
            'border-blue-500 bg-blue-500/10'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {notif.type === 'alert' ? <AlertTriangle className="w-5 h-5 text-red-500" /> : 
             notif.type === 'success' ? <Rocket className="w-5 h-5 text-green-500" /> : 
             <Zap className="w-5 h-5 text-blue-500" />}
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">
              {notif.type === 'alert' ? 'Priority Alert' : 'System Update'}
            </div>
            <p className="text-xs font-semibold text-gray-200 leading-snug">{notif.message}</p>
          </div>
          <button 
            onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
            className="shrink-0 text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
