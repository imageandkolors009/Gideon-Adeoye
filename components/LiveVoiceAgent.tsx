
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { Mic, MicOff, Loader2, Waves, X } from 'lucide-react';
import { SYSTEM_INSTRUCTION } from '../constants';
import { decode, encode, decodeAudioData, createPcmBlob } from '../services/audioUtils';

const API_KEY = process.env.API_KEY;

export const LiveVoiceAgent: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcription, setTranscription] = useState<string>('');
  
  const audioContextInRef = useRef<AudioContext | null>(null);
  const audioContextOutRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const streamRef = useRef<MediaStream | null>(null);

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close?.();
      sessionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    sourcesRef.current.forEach(source => source.stop());
    sourcesRef.current.clear();
    setIsActive(false);
    setIsConnecting(false);
  }, []);

  const startSession = async () => {
    if (!API_KEY) {
      alert("API Key is missing. Check environment variables.");
      return;
    }
    
    setIsConnecting(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      
      // Setup contexts
      audioContextInRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextOutRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }, // Professional voice
          },
          systemInstruction: SYSTEM_INSTRUCTION,
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            console.log('Gemini Session Opened');
            setIsActive(true);
            setIsConnecting(false);

            // Start streaming microphone
            const source = audioContextInRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextInRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createPcmBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextInRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Transcriptions
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => prev + ' ' + message.serverContent?.outputTranscription?.text);
            }

            // Handle Audio Data
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContextOutRef.current) {
              const ctx = audioContextOutRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                ctx,
                24000,
                1
              );

              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            // Handle Interruptions
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Session error:', e);
            stopSession();
          },
          onclose: () => {
            console.log('Session closed');
            stopSession();
          }
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Failed to start session:', err);
      setIsConnecting(false);
      alert('Could not start voice session. Please ensure microphone access is granted.');
    }
  };

  useEffect(() => {
    return () => stopSession();
  }, [stopSession]);

  return (
    <div className="fixed bottom-[96px] left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4 w-full px-6 max-w-sm pointer-events-none">
      {isActive && (
        <div className="glass p-4 rounded-2xl w-full shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto border-blue-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-blue-400">
              <Waves className="w-5 h-5 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Focus Partner Active</span>
            </div>
            <button onClick={stopSession} className="p-1 hover:bg-white/10 rounded-lg text-gray-500">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="max-h-24 overflow-y-auto text-sm text-gray-200 italic mb-2 leading-relaxed">
            {transcription || "Listening for Gideon..."}
          </div>
        </div>
      )}

      <button
        onClick={isActive ? stopSession : startSession}
        disabled={isConnecting}
        data-voice-trigger="true"
        className={`pointer-events-auto w-16 h-16 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/30 transition-all duration-300 hover:scale-110 active:scale-90 ${
          isActive 
          ? 'bg-red-500 text-white animate-pulse' 
          : 'accent-gradient text-white ring-8 ring-blue-500/10'
        }`}
      >
        {isConnecting ? (
          <Loader2 className="w-8 h-8 animate-spin" />
        ) : isActive ? (
          <MicOff className="w-8 h-8" />
        ) : (
          <Mic className="w-8 h-8" />
        )}
      </button>
    </div>
  );
};
