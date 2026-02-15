
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Bell, Settings, Volume2, VolumeX, ShieldAlert, ShieldCheck, RefreshCcw, 
  Zap, Info, ChevronRight, History, AlertTriangle, Power, Minus, Plus, 
  RotateCcw, Wifi, Lock, Cpu, ArrowRight, Smartphone, Flame, Bluetooth, 
  Loader2, CheckCircle, Search, MessageSquare, ListFilter, Download
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { DeviceState, CylinderType, CYLINDERS, HistoryPoint, EventLog } from './types';
import { getSafetyAdvice } from './services/geminiService';
import Gauge from './components/Gauge';

const INITIAL_STATE: DeviceState = {
  percentage: 85,
  currentWeight: 14.5,
  gasWeight: 11.1,
  tara: 3.4,
  cylinderType: CylinderType.P13,
  leakInternal: false,
  leakExternal: false,
  isMuted: false,
  relayActive: true,
  mq2InternalValue: 45,
  mq2ExternalValue: 32,
  lastUpdate: new Date()
};

const MOCK_HISTORY: HistoryPoint[] = [
  { time: '08:00', weight: 11.5 },
  { time: '10:00', weight: 11.45 },
  { time: '12:00', weight: 11.3 },
  { time: '14:00', weight: 11.25 },
  { time: '16:00', weight: 11.2 },
  { time: '18:00', weight: 11.1 },
];

const LoginScreen: React.FC<{ onConnect: () => void }> = ({ onConnect }) => {
  const [step, setStep] = useState<'welcome' | 'scanning' | 'deviceFound' | 'credentials' | 'provisioning'>('welcome');
  const [ssid, setSsid] = useState('WiFi_Home_2.4G');
  const [password, setPassword] = useState('');
  const [detectedDevices, setDetectedDevices] = useState<{id: string, name: string}[]>([]);

  const startScanning = () => {
    setStep('scanning');
    setTimeout(() => {
      setDetectedDevices([{ id: 'SIMES-GX-8821', name: 'Monitor SIMES GÁS v2.1' }]);
      setStep('deviceFound');
    }, 2500);
  };

  const selectDevice = () => setStep('credentials');

  const handleProvision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return alert("Por favor, insira a senha do seu Wi-Fi.");
    setStep('provisioning');
    setTimeout(() => {
      onConnect();
    }, 4500);
  };

  return (
    <div className="flex flex-col h-full p-8 bg-gray-950 justify-center items-center relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]" />

      {step === 'welcome' && (
        <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative inline-block">
            <div className="bg-blue-600 p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(37,99,235,0.4)]">
              <Flame className="w-16 h-16 text-white fill-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-gray-900 border-2 border-gray-800 p-2 rounded-xl">
              <Bluetooth className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter">SIMES GÁS</h1>
            <p className="text-gray-400 text-sm max-w-[240px] mx-auto leading-relaxed">
              Inicie a detecção Bluetooth para configurar seu monitor.
            </p>
          </div>
          <button onClick={startScanning} className="w-full bg-white text-black font-black py-5 rounded-3xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl">
            DETECTAR PRODUTO <Search className="w-5 h-5" />
          </button>
        </div>
      )}

      {step === 'scanning' && (
        <div className="text-center space-y-8 animate-in fade-in duration-500">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-48 h-48 border-2 border-blue-500/20 rounded-full animate-ping" />
            <div className="bg-blue-600/20 p-8 rounded-full">
              <Bluetooth className="w-12 h-12 text-blue-500 animate-pulse" />
            </div>
          </div>
          <h2 className="text-xl font-black uppercase tracking-widest text-blue-500">Buscando...</h2>
        </div>
      )}

      {step === 'deviceFound' && (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center space-y-2">
            <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-black tracking-tight">Produto Encontrado</h2>
          </div>
          <div className="space-y-3">
            {detectedDevices.map(device => (
              <button key={device.id} onClick={selectDevice} className="w-full flex items-center justify-between p-5 bg-gray-900 border border-blue-500/30 rounded-3xl group active:scale-95 transition-all">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 p-2 rounded-xl"><Cpu className="w-5 h-5 text-white" /></div>
                  <div className="text-left"><p className="font-bold text-sm">{device.name}</p></div>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-400" />
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'credentials' && (
        <form onSubmit={handleProvision} className="w-full space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <h2 className="text-2xl font-black tracking-tight text-blue-400 text-center">Configurar Wi-Fi</h2>
          <div className="space-y-4">
            <div className="relative"><Wifi className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" /><input type="text" placeholder="Nome da Rede (SSID)" value={ssid} onChange={(e) => setSsid(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-5 pl-12 pr-4 text-sm font-bold placeholder:text-gray-600 focus:border-blue-500 outline-none" /></div>
            <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" /><input type="password" placeholder="Senha da Rede Wi-Fi" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-5 pl-12 pr-4 text-sm font-bold placeholder:text-gray-600 focus:border-blue-500 outline-none" /></div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-black py-5 rounded-3xl active:scale-95 transition-all shadow-xl">SINCROZINAR HARDWARE</button>
        </form>
      )}

      {step === 'provisioning' && (
        <div className="text-center space-y-8 animate-in fade-in duration-500">
          <Loader2 className="w-20 h-20 text-blue-500 animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-black uppercase tracking-widest text-blue-400">Provisionando</h2>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [state, setState] = useState<DeviceState>(INITIAL_STATE);
  const [aiAdvice, setAiAdvice] = useState<string>("Analisando status do sistema...");
  const [activeTab, setActiveTab] = useState<'status' | 'history' | 'settings'>('status');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [eventLogs, setEventLogs] = useState<EventLog[]>(() => {
    try {
      const saved = localStorage.getItem('simes_logs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const lastNotifiedPercent = useRef<number>(101);
  const leakAlertSent = useRef<boolean>(false);

  // Sync logs to localStorage
  useEffect(() => {
    localStorage.setItem('simes_logs', JSON.stringify(eventLogs));
  }, [eventLogs]);

  // Handle PWA Installation event
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const calculateNewState = (prev: DeviceState, customWeights?: Partial<DeviceState>) => {
    const next = { ...prev, ...customWeights };
    const cylinder = CYLINDERS[next.cylinderType];
    const gasWeight = Math.max(0, next.currentWeight - next.tara);
    const percentage = (gasWeight / cylinder.maxWeight) * 100;
    return { ...next, gasWeight, percentage: Math.min(100, percentage) };
  };

  const addEventLog = useCallback((message: string, type: 'alert' | 'leak' | 'refill') => {
    const newEvent: EventLog = {
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      message,
      type
    };
    setEventLogs(prev => [newEvent, ...prev].slice(0, 50));
  }, []);

  const sendUINotification = useCallback((title: string, message: string, isUrgent = false) => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body: message });
    }
    if (isUrgent && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 500]);
    }
  }, []);

  useEffect(() => {
    if (!isConnected) return;
    const currentPercentInt = Math.floor(state.percentage);
    
    if (currentPercentInt <= 10 && currentPercentInt < lastNotifiedPercent.current) {
      const msg = `GÁS ACABANDO: ${currentPercentInt}%`;
      sendUINotification("SIMES GÁS - Alerta", msg, true);
      addEventLog(msg, 'alert');
      lastNotifiedPercent.current = currentPercentInt;
    } 
    else if (currentPercentInt > 10) {
      if (lastNotifiedPercent.current <= 10) addEventLog("Botijão Renovado", "refill");
      lastNotifiedPercent.current = 101;
    }

    if ((state.leakInternal || state.leakExternal) && !leakAlertSent.current) {
      sendUINotification("PERIGO: GÁS VAZANDO", "Válvula bloqueada automaticamente.", true);
      addEventLog("GÁS VAZANDO: Detecção Crítica", "leak");
      leakAlertSent.current = true;
    } else if (!(state.leakInternal || state.leakExternal)) {
      leakAlertSent.current = false;
    }
  }, [state.percentage, state.leakInternal, state.leakExternal, isConnected, sendUINotification, addEventLog]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!isConnected) return;
    const interval = setInterval(() => {
      setState(prev => {
        const newRawWeight = prev.currentWeight - (Math.random() * 0.005);
        const hasLeak = prev.leakInternal || prev.leakExternal;
        return calculateNewState(prev, {
          currentWeight: newRawWeight,
          lastUpdate: new Date(),
          mq2InternalValue: 40 + Math.random() * 10,
          mq2ExternalValue: 30 + Math.random() * 10,
          relayActive: hasLeak ? false : prev.relayActive,
        });
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [isConnected]);

  const updateAiInsight = useCallback(async () => {
    if (!isConnected) return;
    const advice = await getSafetyAdvice(state);
    setAiAdvice(advice);
  }, [state, isConnected]);

  useEffect(() => {
    if (isConnected) updateAiInsight();
  }, [isConnected]);

  const toggleMute = () => setState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  const toggleRelay = () => {
    if (state.leakInternal || state.leakExternal) {
      alert("Segurança: Válvula travada devido ao vazamento detectado.");
      return;
    }
    setState(prev => ({ ...prev, relayActive: !prev.relayActive }));
  };
  const adjustTara = (amount: number) => setState(prev => calculateNewState(prev, { tara: Math.max(0, prev.tara + amount) }));
  const handleResetTara = () => { if (confirm("Zerar Tara?")) setState(prev => calculateNewState(prev, { tara: 0 })); };
  const changeCylinder = (type: CylinderType) => setState(prev => calculateNewState(prev, { cylinderType: type }));

  if (!isConnected) return <LoginScreen onConnect={() => setIsConnected(true)} />;

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-gray-950 text-gray-100 overflow-hidden relative selection:bg-blue-500/30">
      {/* Leak Overlay */}
      {(state.leakInternal || state.leakExternal) && (
        <div className="absolute inset-0 z-50 bg-red-600/95 flex flex-col items-center justify-center p-8 text-center backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white/20 p-6 rounded-full mb-6 animate-bounce shadow-2xl">
            <AlertTriangle className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-black mb-2 tracking-tighter uppercase text-white">GÁS VAZANDO!</h1>
          <p className="text-white/80 font-medium mb-12">Detecção crítica de sensores MQ2. Válvula de segurança bloqueada.</p>
          <button 
            onClick={() => {
              if ('vibrate' in navigator) navigator.vibrate(50);
              setState(prev => ({ ...prev, leakInternal: false, leakExternal: false }));
            }} 
            className="bg-white text-red-600 px-12 py-5 rounded-3xl font-black shadow-2xl active:scale-95 transition-transform"
          >
            SILENCIAR ALARME
          </button>
        </div>
      )}

      {/* Header */}
      <header className="p-6 pb-2 flex justify-between items-center z-10">
        <div>
          <h1 className="text-xl font-black flex items-center gap-2 tracking-tighter">
            <Flame className="text-blue-500 fill-blue-500 w-5 h-5 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" /> 
            SIMES GÁS
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">ONLINE • ESP32-CORE3</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={toggleMute} 
            className={`p-3 rounded-2xl border transition-all ${state.isMuted ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-gray-900 border-gray-800 text-blue-400'}`}
          >
            {state.isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => setActiveTab('settings')} 
            className={`p-3 rounded-2xl border transition-all ${activeTab === 'settings' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-900 border-gray-800 text-gray-500'}`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-6 pb-32 pt-2 scrollbar-hide space-y-5">
        {activeTab === 'status' && (
          <>
            <div className="flex flex-col items-center justify-center bg-gray-900/40 rounded-[40px] py-6 border border-gray-800/50 shadow-inner relative group overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <Gauge percentage={state.percentage} />
              {state.percentage <= 10 && (
                <div className="absolute top-6 right-6 flex items-center gap-1 bg-red-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg animate-bounce ring-4 ring-red-500/20">
                  <ShieldAlert className="w-3 h-3" /> NÍVEL CRÍTICO
                </div>
              )}
              <div className="flex gap-10 mt-2 pb-2">
                <div className="text-center">
                  <p className="text-[10px] uppercase text-gray-500 font-bold mb-1 tracking-wider">Peso Líquido</p>
                  <p className="font-mono text-2xl font-black">{state.gasWeight.toFixed(2)}<span className="text-xs text-gray-600 ml-0.5">kg</span></p>
                </div>
                <div className="w-px h-10 bg-gray-800 self-center opacity-50"></div>
                <div className="text-center">
                  <p className="text-[10px] uppercase text-gray-500 font-bold mb-1 tracking-wider">Cilindro</p>
                  <p className="font-mono text-2xl font-black text-blue-400">{state.cylinderType}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => {
                  if ('vibrate' in navigator) navigator.vibrate(20);
                  toggleRelay();
                }} 
                className={`w-full flex items-center justify-between p-5 rounded-[28px] border-2 transition-all active:scale-[0.98] ${
                  state.relayActive 
                  ? 'bg-green-500/10 border-green-500/40 shadow-lg shadow-green-500/5' 
                  : 'bg-red-500/10 border-red-500/40 shadow-lg shadow-red-500/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl shadow-inner ${state.relayActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    <Power className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-xs uppercase tracking-tight">Válvula Inteligente</p>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${state.relayActive ? 'text-green-400' : 'text-red-400'}`}>
                      {state.relayActive ? 'FLUXO ATIVO' : 'SISTEMA BLOQUEADO'}
                    </p>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full relative transition-all duration-300 ${state.relayActive ? 'bg-green-600' : 'bg-gray-700'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${state.relayActive ? 'left-7' : 'left-1'}`} />
                </div>
              </button>

              <div className="bg-gray-900/60 backdrop-blur border border-gray-800 rounded-[32px] p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Ajuste de Tara</h2>
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">Bruto: {state.currentWeight.toFixed(2)}kg</span>
                </div>
                <div className="flex items-center justify-between bg-gray-950/80 rounded-2xl p-2 border border-gray-800/50 shadow-inner">
                  <button onClick={() => adjustTara(-0.1)} className="p-4 bg-gray-800/50 text-gray-300 rounded-xl active:bg-blue-600 active:text-white transition-all"><Minus className="w-5 h-5" /></button>
                  <div className="text-center px-4">
                    <p className="text-3xl font-black font-mono tracking-tight">{state.tara.toFixed(1)}<span className="text-sm font-normal text-gray-600 ml-1">kg</span></p>
                  </div>
                  <button onClick={() => adjustTara(0.1)} className="p-4 bg-gray-800/50 text-gray-300 rounded-xl active:bg-blue-600 active:text-white transition-all"><Plus className="w-5 h-5" /></button>
                </div>
                <button 
                  onClick={handleResetTara} 
                  className="w-full text-[10px] font-black uppercase text-orange-500 flex justify-center items-center gap-2 py-1 hover:text-orange-400 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Redefinir para zero
                </button>
              </div>
            </div>

            <div className="bg-blue-600/10 border border-blue-500/20 rounded-[32px] p-6 flex gap-5 items-start relative shadow-2xl overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors" />
              <div className="bg-blue-600 rounded-2xl p-3 shrink-0 shadow-[0_8px_20px_rgba(37,99,235,0.4)]">
                <Info className="w-6 h-6 text-white" />
              </div>
              <div className="pr-6">
                <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2">Relatório de IA SIMES</h3>
                <p className="text-sm font-medium text-gray-200 leading-relaxed italic opacity-90">"{aiAdvice}"</p>
              </div>
              <button 
                onClick={() => {
                  if ('vibrate' in navigator) navigator.vibrate(10);
                  updateAiInsight();
                }} 
                className="absolute top-6 right-6 text-blue-400/40 hover:text-blue-400 transition-all hover:rotate-180 duration-500"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-[32px] h-72 shadow-lg">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 px-1">Fluxo de Peso (24h)</h3>
              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={MOCK_HISTORY}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="time" stroke="#4b5563" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis domain={['dataMin - 0.2', 'dataMax + 0.2']} stroke="#4b5563" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#030712', border: '1px solid #1f2937', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} 
                    itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#3b82f6" 
                    strokeWidth={4} 
                    dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#030712' }} 
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2">
                  <ListFilter className="w-3 h-3" /> Eventos do Sistema
                </h3>
                <button 
                  onClick={() => { if(confirm("Limpar log?")) setEventLogs([]); }}
                  className="text-[9px] font-black text-gray-700 uppercase hover:text-red-500 transition-colors"
                >
                  Limpar
                </button>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-[32px] overflow-hidden divide-y divide-gray-800/50 shadow-inner">
                {eventLogs.length > 0 ? eventLogs.map(log => (
                  <div key={log.id} className="p-5 flex gap-4 items-start bg-gray-900/20 group hover:bg-gray-900/40 transition-colors">
                    <div className={`p-2.5 rounded-xl shrink-0 shadow-sm ${
                      log.type === 'leak' ? 'bg-red-500/20 text-red-500' : 
                      log.type === 'alert' ? 'bg-orange-500/20 text-orange-500' : 
                      'bg-blue-500/20 text-blue-500'
                    }`}>
                      {log.type === 'leak' ? <AlertTriangle className="w-5 h-5" /> : 
                       log.type === 'alert' ? <ShieldAlert className="w-5 h-5" /> : 
                       <RefreshCcw className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <p className={`text-[10px] font-black uppercase tracking-wider ${
                          log.type === 'leak' ? 'text-red-400' : 
                          log.type === 'alert' ? 'text-orange-400' : 
                          'text-blue-400'
                        }`}>
                          {log.type === 'leak' ? 'Emergência' : log.type === 'alert' ? 'Nível' : 'Manutenção'}
                        </p>
                        <span className="text-[10px] text-gray-600 font-mono font-bold">{log.time}</span>
                      </div>
                      <p className="text-sm font-bold text-gray-300 truncate group-hover:text-white transition-colors">{log.message}</p>
                    </div>
                  </div>
                )) : (
                  <div className="p-12 text-center flex flex-col items-center gap-4 opacity-30">
                    <MessageSquare className="w-10 h-10" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Nenhum evento registrado</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
            {deferredPrompt && (
              <section className="bg-blue-600 rounded-[32px] p-6 shadow-xl shadow-blue-500/20 animate-bounce">
                <div className="flex gap-4 items-center">
                  <div className="bg-white/20 p-3 rounded-2xl text-white">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-sm uppercase">Adicionar à Tela Inicial</h3>
                    <p className="text-[10px] font-bold text-white/80">Instale o app para acesso rápido com ícone.</p>
                  </div>
                  <button 
                    onClick={handleInstallClick}
                    className="bg-white text-blue-600 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase shadow-lg active:scale-95 transition-all"
                  >
                    Instalar
                  </button>
                </div>
              </section>
            )}

            <section>
              <h3 className="text-[10px] font-black uppercase text-gray-500 mb-4 tracking-[0.2em] ml-1">Configuração de Hardware</h3>
              <div className="grid grid-cols-3 gap-3">
                {Object.values(CylinderType).map(type => (
                  <button 
                    key={type} 
                    onClick={() => {
                      if ('vibrate' in navigator) navigator.vibrate(10);
                      changeCylinder(type);
                    }} 
                    className={`py-5 rounded-2xl border-2 font-black text-sm transition-all active:scale-[0.96] ${
                      state.cylinderType === type 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' 
                      : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-black uppercase text-gray-500 mb-4 tracking-[0.2em] ml-1">Testes e Simulação</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    if ('vibrate' in navigator) navigator.vibrate(50);
                    setState(prev => ({...prev, percentage: 9, currentWeight: 1.17 + prev.tara}));
                  }} 
                  className="w-full bg-orange-600/10 border border-orange-500/20 p-5 rounded-[28px] flex items-center justify-between active:bg-orange-600/20 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-500/20 p-2.5 rounded-xl text-orange-500"><Bell className="w-5 h-5" /></div>
                    <p className="font-bold text-sm text-orange-400 uppercase tracking-tight">Simular Alerta de Nível</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-orange-500/30" />
                </button>

                <button 
                  onClick={() => {
                    if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
                    setState(prev => ({...prev, leakInternal: true}));
                  }} 
                  className="w-full bg-red-600/10 border border-red-500/20 p-5 rounded-[28px] flex items-center justify-between active:bg-red-600/20 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-red-500/20 p-2.5 rounded-xl text-red-500"><ShieldAlert className="w-5 h-5" /></div>
                    <p className="font-bold text-sm text-red-400 uppercase tracking-tight">Simular Vazamento MQ2</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-red-500/30" />
                </button>

                <button 
                  onClick={() => { 
                    if(confirm("Tem certeza que deseja sair e limpar os dados locais?")) {
                      localStorage.clear(); 
                      window.location.reload(); 
                    }
                  }} 
                  className="w-full bg-gray-900/50 border border-gray-800 p-5 rounded-[28px] flex items-center justify-between active:bg-gray-800 transition-all opacity-50 grayscale hover:grayscale-0 hover:opacity-100"
                >
                  <div className="flex items-center gap-4 text-gray-400">
                    <div className="bg-gray-800 p-2.5 rounded-xl"><Power className="w-5 h-5" /></div>
                    <p className="font-bold text-sm uppercase tracking-tight">Encerrar e Limpar Cache</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-800" />
                </button>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Navegação */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-24 bg-gray-950/90 backdrop-blur-2xl border-t border-gray-900/50 flex items-center justify-around px-10 pb-6 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {[
          { id: 'status', label: 'Início', icon: Flame },
          { id: 'history', label: 'Monitor', icon: History },
          { id: 'settings', label: 'Painel', icon: Settings }
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => {
              if ('vibrate' in navigator) navigator.vibrate(5);
              setActiveTab(item.id as any);
            }} 
            className={`flex flex-col items-center gap-2 transition-all duration-300 relative ${activeTab === item.id ? 'text-blue-400 -translate-y-1' : 'text-gray-600'}`}
          >
            <div className={`p-2 rounded-[18px] transition-all duration-300 ${activeTab === item.id ? 'bg-blue-400/15 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'bg-transparent'}`}>
              <item.icon className={`w-6 h-6 ${activeTab === item.id ? 'fill-blue-400' : ''}`} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-tighter ${activeTab === item.id ? 'opacity-100' : 'opacity-40'}`}>{item.label}</span>
            {activeTab === item.id && <div className="absolute -bottom-3 w-1 h-1 bg-blue-400 rounded-full shadow-[0_0_8px_#3b82f6]" />}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
