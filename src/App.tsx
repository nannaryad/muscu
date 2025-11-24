// @ts-nocheck
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Activity, Calendar, ChevronDown, ChevronRight, 
  BarChart2, Settings, Dumbbell, 
  Check, X, Play, User, 
  Scale, Utensils, Droplet, Moon, Trash2, Download, Ruler,
  Calculator, Disc, Save, Share2, Clock, StickyNote, Flame, Pause, PlayCircle,
  Info, Volume2, VolumeX, Upload, Battery, Youtube, TrendingUp, Target, LogOut, Mail, Lock, Loader,
  Timer as TimerIcon, PieChart, HelpCircle, History, HeartPulse, Music
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { initializeApp } from 'firebase/app';
import { 
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, signOut, signInWithCustomToken, signInAnonymously 
} from 'firebase/auth';
import { 
  getFirestore, doc, setDoc, onSnapshot, updateDoc 
} from 'firebase/firestore';

// --- FIREBASE CONFIG & INIT ---
const firebaseConfig = JSON.parse(__firebase_config || '{}');
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- DATA ---
const WarmUpRoutine = [
  { name: "Rotations externes élastique", reps: "2 x 15-20" },
  { name: "Dislocations bâton", reps: "2 x 10" },
  { name: "Scapular Push-ups", reps: "2 x 12" },
  { name: "Y-T-W au sol", reps: "2 x 10" }
];

const ProgramData = {
  weeks: {
    "A": {
      "Jour 1 (Push)": [
        { id: 101, name: "Dev. incliné haltères", sets: 4, targetReps: "8-12", rest: 90, tutorial: "Banc 30°. Prise neutre. Contrôlez la descente." },
        { id: 102, name: "Presse pectoraux", sets: 4, targetReps: "10-12", rest: 90, tutorial: "Poignées hauteur tétons. Coudes sous les épaules." },
        { id: 103, name: "Écarté poulie bas", sets: 3, targetReps: "12-15", rest: 60, tutorial: "Tirez vers le haut et l'intérieur. Bras semi-fléchis." },
        { id: 104, name: "Élévations latérales", sets: 4, targetReps: "15-20", rest: 60, tutorial: "Coudes hauteur épaules. Ne balancez pas." },
        { id: 105, name: "Floor Press", sets: 3, targetReps: "10-12", rest: 90, tutorial: "Dos au sol. Les coudes touchent le sol à chaque rep." },
        { id: 106, name: "Face pull", sets: 4, targetReps: "15-20", rest: 60, tutorial: "Tirez vers les yeux. Rotation externe en fin de course." },
        { id: 107, name: "Extension triceps", sets: 4, targetReps: "10-15", rest: 60, tutorial: "Coudes fixes aux côtes. Écartez la corde en bas." }
      ],
      "Jour 2 (Pull)": [
        { id: 201, name: "Tractions / Tirage", sets: 4, targetReps: "8-10", rest: 120, tutorial: "Sortez la poitrine. Tirez les coudes vers le bas." },
        { id: 202, name: "Rowing haltère", sets: 4, targetReps: "10-12", rest: 90, tutorial: "Dos plat. Tirez vers la hanche." },
        { id: 203, name: "Tirage horizontal", sets: 3, targetReps: "10-12", rest: 90, tutorial: "Tirez vers le nombril. Serrez les omoplates." },
        { id: 204, name: "Face pull", sets: 4, targetReps: "15-20", rest: 60, tutorial: "Focus rotation externe." },
        { id: 205, name: "Curl incliné", sets: 3, targetReps: "10-12", rest: 60, tutorial: "Banc 45°. Bras en arrière. Étirement max." }
      ],
      "Jour 3 (Legs)": [
        { id: 301, name: "Presse à cuisses", sets: 4, targetReps: "10-15", rest: 120, tutorial: "Ne verrouillez pas les genoux." },
        { id: 302, name: "Fentes marchées", sets: 3, targetReps: "12 pas", rest: 90, tutorial: "Genou arrière frôle le sol." },
        { id: 303, name: "Leg extension", sets: 3, targetReps: "12-15", rest: 60, tutorial: "Contrôlez la descente." },
        { id: 304, name: "Leg curl", sets: 4, targetReps: "10-15", rest: 60, tutorial: "Talon aux fesses." },
        { id: 305, name: "Mollets debout", sets: 4, targetReps: "15-20", rest: 45, tutorial: "Amplitude maximale." }
      ]
    },
    "B": {
      "Jour 1 (Push)": [
        { id: 401, name: "Dev. Incliné Smith", sets: 4, targetReps: "8-12", rest: 90, tutorial: "Barre guidée. Banc 30°." },
        { id: 402, name: "Dev. Couché Haltères", sets: 4, targetReps: "8-12", rest: 90, tutorial: "Prise neutre. Omoplates serrées." },
        { id: 403, name: "Câbles croisés", sets: 3, targetReps: "12-15", rest: 60, tutorial: "Poulies hautes. Croisez en bas." },
        { id: 404, name: "Élévations lat. poulie", sets: 4, targetReps: "15-20", rest: 60, tutorial: "Poulie basse derrière le dos." },
        { id: 405, name: "Face pull", sets: 4, targetReps: "15-20", rest: 60, tutorial: "Toujours et encore." }
      ],
      "Jour 2 (Pull)": [
        { id: 501, name: "Tirage vertical neutre", sets: 4, targetReps: "8-12", rest: 90, tutorial: "Prise serrée (Triangle). Haut de poitrine." },
        { id: 502, name: "Rowing machine", sets: 3, targetReps: "10-12", rest: 90, tutorial: "Coudes loin derrière." },
        { id: 503, name: "Pull-over poulie", sets: 3, targetReps: "12-15", rest: 60, tutorial: "Bras tendus. Mouvement d'arc." },
        { id: 504, name: "Curl EZ", sets: 3, targetReps: "10-12", rest: 60, tutorial: "Coudes fixes." }
      ],
      "Jour 3 (Legs)": [
        { id: 601, name: "Squat guidé", sets: 4, targetReps: "8-12", rest: 120, tutorial: "Pieds en avant. Dos droit." },
        { id: 602, name: "Hip Thrust", sets: 4, targetReps: "10-12", rest: 90, tutorial: "Contractez fessiers en haut." },
        { id: 603, name: "Bulgarian split squat", sets: 3, targetReps: "10-12", rest: 90, tutorial: "Unilatéral. Descendez droit." },
        { id: 604, name: "Leg curl allongé", sets: 4, targetReps: "10-15", rest: 60, tutorial: "Ischios. Pas d'élan." }
      ]
    }
  }
};

// --- HOOKS & HELPERS ---

const calculateBMI = (weight, heightCm) => {
    if (!weight || !heightCm) return { value: 0, label: '-', color: 'text-slate-500' };
    const hM = heightCm / 100;
    const bmi = weight / (hM * hM);
    let label = 'Normal';
    let color = 'text-green-500';
    
    if (bmi < 18.5) { label = 'Maigreur'; color = 'text-blue-400'; }
    else if (bmi >= 25 && bmi < 30) { label = 'Surpoids'; color = 'text-yellow-500'; }
    else if (bmi >= 30) { label = 'Obésité'; color = 'text-red-500'; }
    
    return { value: bmi.toFixed(1), label, color };
};

// --- COMPONENTS ---

// 1. Auth Screen
const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message.includes('auth/') ? "Erreur d'authentification (Vérifiez vos identifiants)" : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
        <div className="flex justify-center mb-6">
           <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
               <span className="font-black text-slate-900 text-xl">R</span>
           </div>
        </div>
        <h2 className="text-2xl font-bold text-white text-center mb-1">
          {isLogin ? 'Bon retour !' : 'Créer un compte'}
        </h2>
        <p className="text-slate-400 text-center text-sm mb-8">
          {isLogin ? 'Connectez-vous pour retrouver vos stats.' : 'Rejoignez le programme RehabPro.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Email</label>
            <div className="relative">
                <Mail size={16} className="absolute left-3 top-3 text-slate-500"/>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-cyan-500 focus:outline-none transition-all"
                  placeholder="exemple@email.com"
                />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Mot de passe</label>
            <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-slate-500"/>
                <input 
                  type="password" 
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-cyan-500 focus:outline-none transition-all"
                  placeholder="••••••••"
                />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex gap-2 items-center">
                <X size={16} className="text-red-500 shrink-0"/>
                <span className="text-red-400 text-xs">{error}</span>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-cyan-900/20 transition-all active:scale-[0.98] flex justify-center items-center gap-2"
          >
            {loading ? <Loader size={18} className="animate-spin"/> : (isLogin ? 'Se connecter' : "S'inscrire")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            {isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. SessionTimer Component (RESTORED)
const SessionTimer = () => {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    const formatTime = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded border border-slate-700">
            <Clock size={14} className="text-cyan-500"/>
            <span className="font-mono font-bold text-sm text-white w-16 text-center">{formatTime(seconds)}</span>
            <button onClick={() => setIsActive(!isActive)} className="text-slate-400 hover:text-white">
                {isActive ? <Pause size={12} fill="currentColor"/> : <Play size={12} fill="currentColor"/>}
            </button>
        </div>
    );
};

// 3. Settings Page Component (RESTORED)
const SettingsPage = ({ profile, settings, onUpdateProfile, onUpdateSettings, onResetData, onImportData }) => {
    // Safe defaults
    const safeSettings = settings || { sound: true, vibration: true };

    return (
        <div className="p-4 space-y-6 animate-in slide-in-from-right-10">
            <h2 className="text-xl font-bold text-white mb-6">Réglages</h2>
            
            <section className="space-y-4">
                <h3 className="text-xs font-bold uppercase text-slate-500">Profil Utilisateur</h3>
                <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                    <div className="p-4 space-y-4">
                        <div>
                             <label className="text-xs text-slate-400 mb-1 block">Nom / Pseudo</label>
                             <input 
                                type="text"
                                value={profile.name || ''}
                                onChange={(e) => onUpdateProfile('name', e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white focus:border-cyan-500 focus:outline-none"
                             />
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="space-y-4">
                <h3 className="text-xs font-bold uppercase text-slate-500">Préférences</h3>
                <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                     <button 
                        onClick={() => onUpdateSettings('sound', !safeSettings.sound)}
                        className="w-full p-4 border-b border-slate-700 flex justify-between items-center hover:bg-slate-700/50"
                     >
                        <div className="flex items-center gap-3">
                            {safeSettings.sound ? <Volume2 size={20} className="text-cyan-500"/> : <VolumeX size={20} className="text-slate-500"/>}
                            <span className="text-sm font-medium text-slate-200">Sons (Timer)</span>
                        </div>
                        <div className={`w-10 h-5 rounded-full relative transition-colors ${safeSettings.sound ? 'bg-cyan-600' : 'bg-slate-600'}`}>
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${safeSettings.sound ? 'left-6' : 'left-1'}`}></div>
                        </div>
                     </button>
                     <button 
                        onClick={() => onUpdateSettings('vibration', !safeSettings.vibration)}
                        className="w-full p-4 border-b border-slate-700 flex justify-between items-center hover:bg-slate-700/50"
                     >
                        <div className="flex items-center gap-3">
                            <Activity size={20} className={safeSettings.vibration ? "text-cyan-500" : "text-slate-500"}/>
                            <span className="text-sm font-medium text-slate-200">Vibrations</span>
                        </div>
                        <div className={`w-10 h-5 rounded-full relative transition-colors ${safeSettings.vibration ? 'bg-cyan-600' : 'bg-slate-600'}`}>
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${safeSettings.vibration ? 'left-6' : 'left-1'}`}></div>
                        </div>
                     </button>
                </div>
            </section>

            <section className="space-y-4">
                <h3 className="text-xs font-bold uppercase text-slate-500">Gestion des Données</h3>
                <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden p-4 space-y-4">
                    <label className="flex items-center gap-3 w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded border border-slate-500 justify-center cursor-pointer transition">
                        <Upload size={16}/> Import Sauvegarde (JSON)
                        <input type="file" accept=".json" onChange={onImportData} className="hidden" />
                    </label>

                    <div className="bg-red-900/10 border border-red-900/30 rounded-lg p-4 mt-4">
                        <p className="text-xs text-red-400 mb-4">
                            Zone Danger : Suppression irréversible.
                        </p>
                        <button 
                            onClick={onResetData}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-900/50 hover:bg-red-900 text-red-200 rounded border border-red-800 transition-colors text-sm font-bold"
                        >
                            <Trash2 size={16} /> Tout effacer
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

// --- SUB-COMPONENTS ---

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in duration-200">
    <div className="bg-slate-900 w-full sm:max-w-md h-[85vh] sm:h-auto sm:rounded-2xl rounded-t-2xl border border-slate-700 flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 rounded-t-2xl">
        <h3 className="font-bold text-white text-lg">{title}</h3>
        <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-full transition-colors">
          <X size={20} className="text-slate-400"/>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {children}
      </div>
    </div>
  </div>
);

const TimerBar = ({ duration, onReset, onClose, settings }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(true);
  const vibrationEnabled = settings?.vibration ?? true;

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    else if (timeLeft === 0) {
        setIsRunning(false);
        if(vibrationEnabled && navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, vibrationEnabled]);

  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="fixed bottom-20 left-4 right-4 max-w-lg mx-auto bg-slate-800 border border-slate-600 rounded-xl shadow-2xl p-3 flex items-center gap-4 z-40 animate-in slide-in-from-bottom-5">
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-baseline">
          <span className="text-xs font-mono text-slate-400 uppercase">Repos</span>
          <span className={`text-2xl font-mono font-bold ${timeLeft === 0 ? 'text-green-400' : 'text-cyan-400'}`}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>
        <div className="h-1 bg-slate-700 mt-2 w-full rounded-full overflow-hidden">
          <div className="h-full bg-cyan-500 transition-all duration-1000 linear" style={{ width: `${100 - progress}%` }} />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setTimeLeft(t => t + 20)} className="px-3 py-1 bg-slate-700 text-slate-300 text-xs font-mono border border-slate-600 rounded hover:bg-slate-600">+20s</button>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white"><X size={18} /></button>
      </div>
    </div>
  );
};

const SetRow = ({ setNumber, previousData, currentData, onChange, onValidate }) => {
  const [weight, setWeight] = useState(currentData?.weight || previousData?.weight || '');
  const [reps, setReps] = useState(currentData?.reps || previousData?.reps || '');
  const [rpe, setRpe] = useState(currentData?.rpe || '');
  const [isValidated, setIsValidated] = useState(currentData?.isValidated || false);

  const handleValidate = () => {
    const newVal = !isValidated;
    setIsValidated(newVal);
    onValidate({ weight, reps, rpe, isValidated: newVal });
  };

  return (
    <div className={`grid grid-cols-10 gap-2 items-center py-2 border-b border-slate-800/50 ${isValidated ? 'opacity-50' : 'opacity-100'}`}>
      <div className="col-span-1 flex justify-center">
        <span className="font-mono text-slate-500 text-sm">{setNumber}</span>
      </div>
      <div className="col-span-2 text-center text-xs text-slate-600 font-mono hidden sm:block">
        {previousData ? `${previousData.weight}kg` : '-'}
      </div>
      <div className="col-span-3 sm:col-span-2">
        <input 
          type="number" placeholder="kg" value={weight} disabled={isValidated}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded text-center text-slate-100 font-mono py-1 focus:border-cyan-500 focus:outline-none"
        />
      </div>
      <div className="col-span-3 sm:col-span-2">
        <input 
          type="number" placeholder="reps" value={reps} disabled={isValidated}
          onChange={(e) => setReps(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded text-center text-slate-100 font-mono py-1 focus:border-cyan-500 focus:outline-none"
        />
      </div>
      <div className="col-span-2 hidden sm:block">
         <input 
          type="number" placeholder="RPE" max="10" value={rpe} disabled={isValidated}
          onChange={(e) => setRpe(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded text-center text-slate-400 font-mono py-1 focus:border-yellow-500 focus:outline-none text-xs"
        />
      </div>
      <div className="col-span-3 sm:col-span-1 flex justify-center">
        <button 
          onClick={handleValidate}
          className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${isValidated ? 'bg-green-500/20 text-green-500 border border-green-500/50' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
        >
          <Check size={16} />
        </button>
      </div>
    </div>
  );
};

const ExerciseModule = ({ exercise, history, logs, onUpdateLog, onStartTimer, notes, onSaveNotes }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [localNote, setLocalNote] = useState(notes || '');

  useEffect(() => { setLocalNote(notes || ''); }, [notes]);

  const handleSaveNote = () => { onSaveNotes(exercise.id, localNote); setShowNotes(false); };
  
  // 1RM Calc
  const estimated1RM = useMemo(() => {
      if (!history) return null;
      let best = 0;
      Object.values(history).forEach(set => {
          const w = parseFloat(set.weight);
          const r = parseFloat(set.reps);
          if(w && r) { const e = w * (1 + r/30); if(e > best) best = e; }
      });
      return best > 0 ? Math.round(best) : null;
  }, [history]);

  const todaysLog = logs?.currentSession?.[exercise.id];
  const currentVolume = todaysLog ? Object.values(todaysLog).reduce((acc, set) => acc + (parseFloat(set.weight||0) * parseFloat(set.reps||0)), 0) : 0;

  return (
    <div className="mb-4 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden w-full shadow-sm">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer bg-slate-900 hover:bg-slate-800/50 transition-colors border-b border-slate-800"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 overflow-hidden">
            <div className={`w-1 h-8 rounded-full flex-shrink-0 ${currentVolume > 0 ? 'bg-cyan-500' : 'bg-slate-700'}`}></div>
            <div className="min-w-0">
                <h3 className="font-bold text-slate-200 text-sm sm:text-base truncate">{exercise.name}</h3>
                <div className="flex gap-3 mt-1 items-center text-xs text-slate-500 font-mono">
                    <span className="flex items-center gap-1 flex-shrink-0"><Dumbbell size={10}/> {exercise.sets} séries</span>
                    {estimated1RM && <span className="text-yellow-600 flex items-center gap-1 flex-shrink-0">🔥 1RM: {estimated1RM}kg</span>}
                </div>
            </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
             <button 
                onClick={(e) => { e.stopPropagation(); setShowTutorial(!showTutorial); }}
                className={`p-2 rounded-full transition-colors ${showTutorial ? 'bg-blue-500/20 text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
             >
                <Info size={18} />
             </button>
             <button 
                onClick={(e) => { e.stopPropagation(); setShowChart(!showChart); }}
                className={`p-2 rounded-full transition-colors ${showChart ? 'bg-purple-500/20 text-purple-400' : 'text-slate-500 hover:text-slate-300'}`}
             >
                <TrendingUp size={18} />
             </button>
             <button 
                onClick={(e) => { e.stopPropagation(); setShowNotes(!showNotes); }}
                className={`p-2 rounded-full transition-colors ${showNotes || notes ? 'bg-yellow-500/20 text-yellow-500' : 'text-slate-500 hover:text-slate-300'}`}
             >
                <StickyNote size={18} />
             </button>
             {isExpanded ? <ChevronDown size={18} className="text-slate-500 ml-1"/> : <ChevronRight size={18} className="text-slate-500 ml-1"/>}
        </div>
      </div>

      {isExpanded && (
        <div className="p-2 bg-slate-950/30">
            {/* Tutorial Block */}
            {showTutorial && (
                <div className="p-3 mb-2 bg-blue-900/10 border border-blue-500/20 rounded-lg animate-in slide-in-from-top-2">
                    <p className="text-sm text-blue-100 mb-2">{exercise.tutorial}</p>
                    <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name + " musculation")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300">
                        <Youtube size={14} /> Voir vidéo
                    </a>
                </div>
            )}

            {/* Notes Block */}
            {showNotes && (
                <div className="p-3 mb-2 bg-yellow-900/10 border border-yellow-700/30 rounded-lg animate-in slide-in-from-top-2">
                    <textarea 
                        value={localNote}
                        onChange={(e) => setLocalNote(e.target.value)}
                        placeholder="Notes persos..."
                        className="w-full bg-transparent text-yellow-100 text-sm p-0 focus:outline-none min-h-[60px] placeholder:text-yellow-500/30"
                    />
                    <div className="flex justify-end mt-2">
                        <button onClick={handleSaveNote} className="text-xs bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1 rounded font-bold">Enregistrer</button>
                    </div>
                </div>
            )}

            {/* Chart Block Placeholder */}
            {showChart && <div className="p-3 mb-2 bg-purple-900/10 border border-purple-500/20 rounded-lg text-center text-xs text-purple-300 animate-in slide-in-from-top-2">Graphique de progression (nécessite plus de données)</div>}

            <div className="grid grid-cols-10 gap-2 mb-2 px-1">
                <div className="col-span-1 text-center text-[10px] text-slate-500 uppercase font-bold">Set</div>
                <div className="col-span-2 text-center text-[10px] text-slate-500 uppercase font-bold hidden sm:block">Préc.</div>
                <div className="col-span-3 sm:col-span-2 text-center text-[10px] text-slate-500 uppercase font-bold">kg</div>
                <div className="col-span-3 sm:col-span-2 text-center text-[10px] text-slate-500 uppercase font-bold">Reps</div>
                <div className="col-span-2 text-center text-[10px] text-slate-500 uppercase font-bold hidden sm:block">RPE</div>
                <div className="col-span-3 sm:col-span-1 text-center text-[10px] text-slate-500 uppercase font-bold">OK</div>
            </div>
            {Array.from({ length: exercise.sets }).map((_, i) => (
                <SetRow 
                    key={i} setNumber={i + 1}
                    previousData={history ? history[i + 1] : null}
                    currentData={todaysLog ? todaysLog[i + 1] : null}
                    onChange={(data) => onUpdateLog(exercise.id, i + 1, data)}
                    onValidate={(data) => { onUpdateLog(exercise.id, i + 1, data); if (data.isValidated) onStartTimer(exercise.rest); }}
                />
            ))}
        </div>
      )}
    </div>
  );
};

// NEW: Metronome Component
const MetronomeTool = () => {
    const [bpm, setBpm] = useState(60);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioCtx = useRef(null);
    const nextNoteTime = useRef(0.0);
    const timerID = useRef(null);

    const scheduleNote = (time) => {
        const osc = audioCtx.current.createOscillator();
        const envelope = audioCtx.current.createGain();
        osc.frequency.value = 1000;
        envelope.gain.value = 1;
        envelope.gain.exponentialRampToValueAtTime(1, time + 0.001);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.02);
        osc.connect(envelope);
        envelope.connect(audioCtx.current.destination);
        osc.start(time);
        osc.stop(time + 0.03);
    };

    const scheduler = () => {
        while (nextNoteTime.current < audioCtx.current.currentTime + 0.1) {
            scheduleNote(nextNoteTime.current);
            nextNoteTime.current += 60.0 / bpm;
        }
        timerID.current = window.setTimeout(scheduler, 25.0);
    };

    const toggle = () => {
        if (isPlaying) {
            window.clearTimeout(timerID.current);
            setIsPlaying(false);
        } else {
            if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
            nextNoteTime.current = audioCtx.current.currentTime + 0.05;
            setIsPlaying(true);
            scheduler();
        }
    };

    useEffect(() => { return () => window.clearTimeout(timerID.current); }, []);

    return (
        <div className="text-center space-y-6">
            <div className="text-6xl font-black text-white tabular-nums">{bpm} <span className="text-lg font-normal text-slate-500">BPM</span></div>
            <input type="range" min="30" max="120" value={bpm} onChange={e => setBpm(Number(e.target.value))} className="w-full accent-cyan-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"/>
            <button onClick={toggle} className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 mx-auto ${isPlaying ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                {isPlaying ? <Pause size={32}/> : <Play size={32} className="ml-1"/>}
            </button>
            <p className="text-xs text-slate-500">Idéal pour contrôler le tempo (ex: 3s descente)</p>
        </div>
    );
};

const StopwatchTool = () => {
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    useEffect(() => {
        let interval;
        if(running) interval = setInterval(() => setTime(t => t + 10), 10);
        else clearInterval(interval);
        return () => clearInterval(interval);
    }, [running]);
    const format = (t) => {
        const m = Math.floor(t / 60000);
        const s = Math.floor((t % 60000) / 1000);
        const ms = Math.floor((t % 1000) / 10);
        return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}.${ms.toString().padStart(2,'0')}`;
    };
    return (
        <div className="space-y-6 text-center">
            <div className="text-6xl font-mono font-black text-white tabular-nums tracking-tighter">{format(time)}</div>
            <div className="flex justify-center gap-4">
                <button onClick={() => setRunning(!running)} className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${running ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                    {running ? <Pause size={32}/> : <Play size={32} className="ml-1"/>}
                </button>
                <button onClick={() => {setRunning(false); setTime(0);}} className="w-20 h-20 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center shadow-lg transition-all active:scale-95 hover:bg-slate-600">
                    <Clock size={28}/>
                </button>
            </div>
        </div>
    );
};

const MacroTool = ({ profile }) => {
    const [weight, setWeight] = useState(profile?.weight || '');
    const [height, setHeight] = useState(profile?.height || '');
    const [age, setAge] = useState(profile?.age || '');
    const [gender, setGender] = useState('male');
    const [activity, setActivity] = useState(1.375);
    const [goal, setGoal] = useState(0); // -500, 0, +500
    const [result, setResult] = useState(null);

    const calculate = () => {
        if(!weight || !height || !age) return;
        let bmr = 10 * weight + 6.25 * height - 5 * age;
        bmr += gender === 'male' ? 5 : -161;
        const tdee = Math.round(bmr * activity);
        const target = tdee + goal;
        setResult({
            cals: target,
            protein: Math.round(weight * 2), // 2g/kg
            fat: Math.round((target * 0.25) / 9), // 25%
            carbs: Math.round((target - (weight*2*4) - (target*0.25)) / 4)
        });
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><label className="text-xs font-bold text-slate-500">Poids (kg)</label><input type="number" value={weight} onChange={e=>setWeight(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"/></div>
                <div className="space-y-1"><label className="text-xs font-bold text-slate-500">Taille (cm)</label><input type="number" value={height} onChange={e=>setHeight(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"/></div>
                <div className="space-y-1"><label className="text-xs font-bold text-slate-500">Age</label><input type="number" value={age} onChange={e=>setAge(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"/></div>
                <div className="space-y-1"><label className="text-xs font-bold text-slate-500">Genre</label><select value={gender} onChange={e=>setGender(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"><option value="male">Homme</option><option value="female">Femme</option></select></div>
                <div className="space-y-1 col-span-2"><label className="text-xs font-bold text-slate-500">Activité</label><select value={activity} onChange={e=>setActivity(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"><option value={1.2}>Sédentaire (Bureau)</option><option value={1.375}>Léger (1-3j sport)</option><option value={1.55}>Modéré (3-5j sport)</option><option value={1.725}>Intense (6-7j sport)</option></select></div>
                <div className="space-y-1 col-span-2"><label className="text-xs font-bold text-slate-500">Objectif</label><div className="flex bg-slate-950 rounded p-1 border border-slate-700"><button onClick={()=>setGoal(-500)} className={`flex-1 py-1 rounded text-xs font-bold ${goal===-500?'bg-red-600 text-white':'text-slate-400'}`}>Sèche</button><button onClick={()=>setGoal(0)} className={`flex-1 py-1 rounded text-xs font-bold ${goal===0?'bg-blue-600 text-white':'text-slate-400'}`}>Maintien</button><button onClick={()=>setGoal(500)} className={`flex-1 py-1 rounded text-xs font-bold ${goal===500?'bg-green-600 text-white':'text-slate-400'}`}>Masse</button></div></div>
            </div>
            <button onClick={calculate} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg">Calculer</button>
            {result && (
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 grid grid-cols-4 gap-2 text-center">
                    <div className="col-span-4 mb-2"><span className="text-3xl font-black text-white">{result.cals}</span> <span className="text-xs text-slate-400">kcal/jour</span></div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-700"><div className="text-xs text-blue-400 font-bold">Prot</div><div className="font-bold text-white">{result.protein}g</div></div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-700"><div className="text-xs text-yellow-400 font-bold">Gluc</div><div className="font-bold text-white">{result.carbs}g</div></div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-700"><div className="text-xs text-red-400 font-bold">Lip</div><div className="font-bold text-white">{result.fat}g</div></div>
                </div>
            )}
        </div>
    );
};

const BodyFatTool = ({ profile }) => {
    const [waist, setWaist] = useState('');
    const [neck, setNeck] = useState('');
    const [height, setHeight] = useState(profile?.height || '');
    const [bf, setBf] = useState(null);

    const calculate = () => {
        if(!waist || !neck || !height) return;
        const w = parseFloat(waist);
        const n = parseFloat(neck);
        const h = parseFloat(height);
        const res = 86.010 * Math.log10(w - n) - 70.041 * Math.log10(h) + 36.76;
        setBf(res.toFixed(1));
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <div><label className="text-xs font-bold text-slate-500">Taille (cm)</label><input type="number" value={height} onChange={e=>setHeight(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white"/></div>
                <div><label className="text-xs font-bold text-slate-500">Tour de cou (cm)</label><input type="number" value={neck} onChange={e=>setNeck(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white"/></div>
                <div><label className="text-xs font-bold text-slate-500">Tour de taille (nombril) (cm)</label><input type="number" value={waist} onChange={e=>setWaist(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white"/></div>
            </div>
            <button onClick={calculate} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg">Calculer IMG</button>
            {bf && (
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-center">
                    <span className="text-4xl font-black text-white">{bf}%</span>
                    <p className="text-xs text-slate-400 mt-2">Indice Masse Grasse (Navy Method)</p>
                </div>
            )}
        </div>
    );
};

const ToolsPage = ({ profile }) => {
    const [activeTool, setActiveTool] = useState(null);
    const [targetWeight, setTargetWeight] = useState('');
    const [plates, setPlates] = useState([]);
    const [oneRmWeight, setOneRmWeight] = useState('');
    const [oneRmReps, setOneRmReps] = useState('');
    const [max, setMax] = useState(null);

    // Plate logic
    useEffect(() => {
        if (!targetWeight || targetWeight < 20) { setPlates([]); return; }
        let remaining = (targetWeight - 20) / 2;
        const res = [];
        [20, 10, 5, 2.5, 1.25].forEach(p => {
            while (remaining >= p) { res.push(p); remaining -= p; }
        });
        setPlates(res);
    }, [targetWeight]);

    // 1RM logic
    useEffect(() => {
        if(oneRmWeight && oneRmReps) setMax(Math.round(oneRmWeight * (1 + oneRmReps/30)));
        else setMax(null);
    }, [oneRmWeight, oneRmReps]);

    const ToolButton = ({ icon: Icon, title, sub, color, onClick }) => (
        <button onClick={onClick} className="w-full bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center justify-between hover:bg-slate-700 transition group">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500 group-hover:scale-110 transition-transform`}>
                    <Icon size={24}/>
                </div>
                <div className="text-left">
                    <h3 className="font-bold text-slate-100">{title}</h3>
                    <p className="text-xs text-slate-500">{sub}</p>
                </div>
            </div>
            <ChevronRight size={20} className="text-slate-600"/>
        </button>
    );

    return (
        <div className="p-4 space-y-4 animate-in slide-in-from-right-10 pb-24">
            <h2 className="text-xl font-bold text-white mb-6">Boîte à Outils</h2>
            
            <ToolButton icon={Disc} color="blue" title="Calculateur de Disques" sub="Chargement de barre" onClick={() => setActiveTool('plates')} />
            <ToolButton icon={Activity} color="purple" title="Calculateur 1RM" sub="Estimation force max" onClick={() => setActiveTool('1rm')} />
            <ToolButton icon={TimerIcon} color="green" title="Chronomètre Libre" sub="Gainage, repos, étirements" onClick={() => setActiveTool('stopwatch')} />
            <ToolButton icon={Music} color="pink" title="Métronome" sub="Contrôle du tempo" onClick={() => setActiveTool('metronome')} />
            <ToolButton icon={Utensils} color="orange" title="Calories & Macros" sub="Besoins nutritionnels" onClick={() => setActiveTool('macros')} />
            <ToolButton icon={PieChart} color="red" title="Indice Masse Grasse" sub="Estimation via mensurations" onClick={() => setActiveTool('bodyfat')} />

            {/* Modals */}
            {activeTool === 'plates' && (
                <Modal title="Calculateur de Charge" onClose={() => setActiveTool(null)}>
                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Poids Total (kg)</label>
                            <input type="number" value={targetWeight} onChange={e => setTargetWeight(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white font-bold text-center text-xl focus:outline-none focus:border-blue-500" placeholder="ex: 80"/>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-lg flex items-center justify-center gap-1 min-h-[80px]">
                            <div className="w-full h-2 bg-slate-600 absolute z-0 max-w-[300px]"></div>
                            {plates.length > 0 ? plates.map((p, i) => (
                                <div key={i} className={`z-10 h-${p >= 20 ? 16 : p >= 10 ? 12 : 8} w-4 rounded-sm border border-black/20 shadow-md ${p===20?'bg-blue-600':p===10?'bg-green-600':p===5?'bg-white':'bg-yellow-500'}`} title={`${p}kg`}></div>
                            )) : <span className="z-10 text-xs text-slate-500 bg-slate-800 px-2">Entrez un poids</span>}
                        </div>
                        {plates.length > 0 && <p className="text-center text-sm text-slate-400">Par côté : {plates.join(' + ')}</p>}
                    </div>
                </Modal>
            )}

            {activeTool === '1rm' && (
                <Modal title="Calculateur 1RM" onClose={() => setActiveTool(null)}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-xs font-bold text-slate-500 block mb-1">Poids (kg)</label><input type="number" value={oneRmWeight} onChange={e=>setOneRmWeight(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white"/></div>
                            <div><label className="text-xs font-bold text-slate-500 block mb-1">Reps</label><input type="number" value={oneRmReps} onChange={e=>setOneRmReps(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white"/></div>
                        </div>
                        {max && <div className="bg-purple-500/20 border border-purple-500/50 p-6 rounded-xl text-center"><span className="text-3xl font-black text-white">{max} kg</span><p className="text-xs text-purple-300 uppercase mt-1">Max Théorique</p></div>}
                    </div>
                </Modal>
            )}

            {activeTool === 'stopwatch' && <Modal title="Chronomètre" onClose={() => setActiveTool(null)}><StopwatchTool/></Modal>}
            {activeTool === 'metronome' && <Modal title="Métronome" onClose={() => setActiveTool(null)}><MetronomeTool/></Modal>}
            {activeTool === 'macros' && <Modal title="Calculateur Macros" onClose={() => setActiveTool(null)}><MacroTool profile={profile}/></Modal>}
            {activeTool === 'bodyfat' && <Modal title="Indice Masse Grasse" onClose={() => setActiveTool(null)}><BodyFatTool profile={profile}/></Modal>}
        </div>
    );
};

// NEW: Daily Checkin Component
const DailyCheckin = ({ todayLog, onUpdate }) => {
    const [pain, setPain] = useState(todayLog?.pain || 0);
    const [energy, setEnergy] = useState(todayLog?.energy || 5);
    const [note, setNote] = useState(todayLog?.note || '');

    const handleSave = () => {
        onUpdate({ pain, energy, note });
    };

    return (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><HeartPulse size={16} className="text-red-500"/> Bilan du Jour</h3>
            
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Douleur Épaule</span> <span>{pain}/10</span></div>
                    <input type="range" min="0" max="10" value={pain} onChange={e=>setPain(Number(e.target.value))} className="w-full accent-red-500 h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer"/>
                </div>
                <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Niveau d'Énergie</span> <span>{energy}/10</span></div>
                    <input type="range" min="0" max="10" value={energy} onChange={e=>setEnergy(Number(e.target.value))} className="w-full accent-green-500 h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer"/>
                </div>
                <textarea 
                    value={note}
                    onChange={e=>setNote(e.target.value)}
                    placeholder="Comment vous sentez-vous aujourd'hui ?"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white focus:outline-none min-h-[60px]"
                />
                <button onClick={handleSave} className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-bold transition">Enregistrer</button>
            </div>
        </div>
    );
};

// --- MAIN APP ---

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('workout');
  const [activeWeek, setActiveWeek] = useState("A");
  const [activeDay, setActiveDay] = useState("Jour 1 (Push)");
  const [userData, setUserData] = useState({ logs: {}, profile: {}, settings: { sound: true, vibration: true }, habits: {}, notes: {}, measurements: {}, dailyLogs: {} }); // Added dailyLogs
  const [timer, setTimer] = useState(null);
  const [showWarmUp, setShowWarmUp] = useState(false);
  const [showRpeHelp, setShowRpeHelp] = useState(false);

  useEffect(() => {
    const initAuth = async () => { if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) await signInWithCustomToken(auth, __initial_auth_token); };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => { setUser(u); setAuthLoading(false); });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'main');
    const unsub = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) setUserData(docSnap.data());
      else { const initial = { logs: {}, profile: {}, settings: { sound: true }, habits: {}, notes: {}, measurements: {}, dailyLogs: {} }; setDoc(userDocRef, initial); setUserData(initial); }
    });
    return () => unsub();
  }, [user]);

  const saveToFire = async (key, value) => { if (!user) return; const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'main'); await updateDoc(userDocRef, { [key]: value }); };

  const today = new Date().toISOString().split('T')[0];
  const sessionKey = `${today}-${activeWeek}-${activeDay}`;

  const handleUpdateLog = (exoId, setNum, data) => {
    const newLogs = { ...userData.logs };
    if (!newLogs[sessionKey]) newLogs[sessionKey] = {};
    if (!newLogs[sessionKey][exoId]) newLogs[sessionKey][exoId] = {};
    newLogs[sessionKey][exoId][setNum] = data;
    setUserData(prev => ({ ...prev, logs: newLogs }));
    saveToFire('logs', newLogs);
  };

  const handleUpdateProfile = (field, value) => {
      const newProfile = { ...userData.profile, [field]: value };
      setUserData(prev => ({ ...prev, profile: newProfile }));
      saveToFire('profile', newProfile);
  };

  const handleUpdateHabit = (date, habitId) => {
      const newHabits = { ...userData.habits };
      if(!newHabits[date]) newHabits[date] = {};
      newHabits[date][habitId] = !newHabits[date][habitId];
      setUserData(prev => ({ ...prev, habits: newHabits }));
      saveToFire('habits', newHabits);
  };

  const handleUpdateDailyLog = (data) => {
      const newDaily = { ...userData.dailyLogs, [today]: data };
      setUserData(prev => ({ ...prev, dailyLogs: newDaily }));
      saveToFire('dailyLogs', newDaily);
  };

  const handleUpdateMeasurements = (part, value) => {
      const newM = { ...userData.measurements, [part]: value };
      setUserData(prev => ({...prev, measurements: newM}));
      saveToFire('measurements', newM);
  };

  const handleUpdateSettings = (field, value) => {
      const newS = { ...(userData.settings || {sound: true, vibration: true}), [field]: value };
      setUserData(prev => ({...prev, settings: newS}));
      saveToFire('settings', newS);
  };

  const handleResetData = () => {
      if(window.confirm("Êtes-vous sûr de vouloir tout effacer ?")) {
          const empty = { logs: {}, profile: {}, settings: { sound: true }, habits: {}, notes: {}, measurements: {}, dailyLogs: {} };
          setUserData(empty);
          if(user) setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'main'), empty);
      }
  };

  const handleImportData = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const importedData = JSON.parse(event.target.result);
              if (confirm("Remplacer les données actuelles par le fichier importé ?")) {
                  setUserData(importedData);
                  if(user) setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'main'), importedData);
                  alert("Import réussi !");
              }
          } catch (error) {
              alert("Erreur: Fichier invalide.");
          }
      };
      reader.readAsText(file);
  };

  const getLastSessionData = (exerciseId) => {
    if (!userData.logs) return null;
    const keys = Object.keys(userData.logs).filter(k => k.includes(`${activeWeek}-${activeDay}`) && k !== sessionKey).sort().reverse();
    if (keys.length > 0) return userData.logs[keys[0]]?.[exerciseId];
    return null;
  };

  const currentExercises = ProgramData.weeks[activeWeek][activeDay];

  if (authLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader className="text-cyan-500 animate-spin"/></div>;
  if (!user) return <AuthScreen />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-24 overflow-x-hidden">
      
      {/* HEADER */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 w-full max-w-lg mx-auto shadow-md">
        <div className="px-4 h-14 flex items-center justify-between">
           <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                   <span className="font-black text-slate-900 text-sm">R</span>
               </div>
               <SessionTimer />
           </div>
           {activeTab === 'workout' && (
               <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                   {['A', 'B'].map(w => (
                       <button key={w} onClick={() => setActiveWeek(w)} className={`text-xs font-bold px-3 py-1 rounded transition-all ${activeWeek === w ? 'bg-cyan-500 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}>Sem {w}</button>
                   ))}
               </div>
           )}
        </div>
        {activeTab === 'workout' && (
            <div className="px-4 py-2 flex overflow-x-auto gap-2 no-scrollbar bg-slate-900/95 backdrop-blur border-b border-slate-800">
                {Object.keys(ProgramData.weeks[activeWeek]).map(day => (
                    <button key={day} onClick={() => setActiveDay(day)} className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${activeDay === day ? 'bg-slate-100 text-slate-900 border-white' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                        {day}
                    </button>
                ))}
            </div>
        )}
      </header>

      {/* CONTENT */}
      <main className="max-w-lg mx-auto pt-4 w-full px-4">
        
        {activeTab === 'dashboard' && (
            <div className="animate-in fade-in space-y-6">
                <DailyCheckin todayLog={userData.dailyLogs?.[today]} onUpdate={handleUpdateDailyLog} />

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <div className="flex items-center gap-2 text-slate-400 mb-2"><Activity size={16}/><span className="text-xs font-bold uppercase">Sessions</span></div>
                        <span className="text-2xl font-bold text-white">{Object.keys(userData.logs || {}).length}</span>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <div className="flex items-center gap-2 text-slate-400 mb-2"><Target size={16}/><span className="text-xs font-bold uppercase">Habitudes</span></div>
                        <span className="text-2xl font-bold text-white text-green-400">OK</span>
                    </div>
                </div>
                
                {/* History List */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-slate-700 flex items-center gap-2">
                        <History size={18} className="text-blue-400"/>
                        <h3 className="font-bold text-sm text-white">Dernières Séances</h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        {Object.keys(userData.logs || {}).sort().reverse().slice(0, 5).map(key => (
                            <div key={key} className="p-4 border-b border-slate-700/50 flex justify-between items-center last:border-0">
                                <div>
                                    <p className="text-xs text-slate-400">{new Date(key.split('-').slice(0,3).join('-')).toLocaleDateString()}</p>
                                    <p className="text-sm font-bold text-white">{key.split('-').slice(4).join(' ')}</p>
                                </div>
                                <div className="bg-slate-700 px-2 py-1 rounded text-xs font-mono text-cyan-300">Complété</div>
                            </div>
                        ))}
                        {Object.keys(userData.logs || {}).length === 0 && <div className="p-4 text-center text-xs text-slate-500">Aucune séance enregistrée.</div>}
                    </div>
                </div>

                {/* Measurements */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Ruler size={16} className="text-cyan-500"/> Mensurations</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {['Poids', 'Taille', 'Bras', 'Taille (cm)'].map(label => (
                            <div key={label}>
                                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">{label}</label>
                                <input 
                                    type="number" 
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm focus:border-cyan-500 focus:outline-none" 
                                    placeholder="-"
                                    value={userData.measurements?.[label] || ''}
                                    onChange={(e) => handleUpdateMeasurements(label, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Daily Habits */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                    <div className="p-3 bg-slate-900 border-b border-slate-700">
                        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2"><Check size={16} className="text-green-500"/> Habitudes</h3>
                    </div>
                    <div className="p-2 grid grid-cols-2 gap-2">
                        {[{ id: 'protein', label: 'Protéines' }, { id: 'water', label: '2L Eau' }, { id: 'sleep', label: '8h Sommeil' }, { id: 'creatine', label: 'Créatine' }].map(h => (
                            <button key={h.id} onClick={() => handleUpdateHabit(today, h.id)} className={`flex items-center gap-3 p-3 rounded-md border transition-all ${userData.habits?.[today]?.[h.id] ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                                <span className="text-xs font-bold">{h.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'workout' && (
            <div className="animate-in fade-in duration-300 pb-10">
                <div className="flex gap-2 mb-6">
                    <button onClick={() => setShowWarmUp(true)} className="flex-1 bg-gradient-to-r from-orange-900/20 to-slate-900 border border-orange-500/20 p-3 rounded-xl flex items-center justify-center gap-2 group hover:border-orange-500/40 transition-all">
                        <Flame size={18} className="text-orange-500"/> <span className="text-xs font-bold text-orange-100">Échauffement</span>
                    </button>
                    <button onClick={() => setShowRpeHelp(true)} className="flex-none bg-slate-800 border border-slate-700 p-3 rounded-xl flex items-center justify-center hover:bg-slate-700 transition-all">
                        <HelpCircle size={18} className="text-slate-400"/>
                    </button>
                </div>

                <div className="space-y-4">
                    {currentExercises.map(exo => (
                        <ExerciseModule 
                            key={exo.id} exercise={exo}
                            history={getLastSessionData(exo.id)}
                            logs={{ currentSession: userData.logs?.[sessionKey], allLogs: userData.logs }}
                            notes={userData.notes?.[exo.id]}
                            onUpdateLog={handleUpdateLog}
                            onStartTimer={setTimer}
                            onSaveNotes={(id, n) => {
                                const newNotes = { ...userData.notes, [id]: n };
                                setUserData(prev => ({ ...prev, notes: newNotes }));
                                saveToFire('notes', newNotes);
                            }}
                        />
                    ))}
                </div>
                <button onClick={() => setActiveTab('dashboard')} className="w-full mt-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-900/20 transition-all active:scale-[0.98]">Terminer la séance</button>
            </div>
        )}
        
        {activeTab === 'tools' && <ToolsPage profile={userData.profile} />}

        {activeTab === 'settings' && (
             <SettingsPage 
                profile={userData.profile}
                settings={userData.settings}
                onUpdateProfile={handleUpdateProfile}
                onUpdateSettings={handleUpdateSettings}
                onResetData={handleResetData}
                onImportData={handleImportData}
             />
        )}
      </main>

      {/* OVERLAYS */}
      {timer && <TimerBar duration={timer} settings={userData.settings} onReset={() => setTimer(null)} onClose={() => setTimer(null)} />}
      {showWarmUp && <WarmUpModal onClose={() => setShowWarmUp(false)} />}
      {showRpeHelp && (
          <Modal title="Guide RPE (Effort Ressenti)" onClose={() => setShowRpeHelp(false)}>
              <div className="space-y-2 text-sm text-slate-300">
                  <div className="p-2 bg-green-900/20 border border-green-500/30 rounded"><span className="font-bold text-green-400">RPE 6-7:</span> Échauffement, facile. Encore 3-4 reps en réserve.</div>
                  <div className="p-2 bg-yellow-900/20 border border-yellow-500/30 rounded"><span className="font-bold text-yellow-400">RPE 8:</span> Difficile. Encore 2 reps possibles. (Zone Hypertrophie)</div>
                  <div className="p-2 bg-orange-900/20 border border-orange-500/30 rounded"><span className="font-bold text-orange-400">RPE 9:</span> Très difficile. 1 seule rep possible.</div>
                  <div className="p-2 bg-red-900/20 border border-red-500/30 rounded"><span className="font-bold text-red-400">RPE 10:</span> Échec. Impossible de faire une rep de plus.</div>
              </div>
          </Modal>
      )}

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50 pb-safe">
          <div className="max-w-lg mx-auto flex justify-between items-center h-16 px-6">
              <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 w-12 transition-colors ${activeTab === 'dashboard' ? 'text-cyan-400' : 'text-slate-500'}`}>
                  <BarChart2 size={20} /> <span className="text-[9px] font-bold uppercase">Suivi</span>
              </button>
              <button onClick={() => setActiveTab('tools')} className={`flex flex-col items-center gap-1 w-12 transition-colors ${activeTab === 'tools' ? 'text-cyan-400' : 'text-slate-500'}`}>
                  <Calculator size={20} /> <span className="text-[9px] font-bold uppercase">Outils</span>
              </button>
              <button onClick={() => setActiveTab('workout')} className="flex flex-col items-center justify-center -mt-8">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-slate-900 transition-all ${activeTab === 'workout' ? 'bg-cyan-500 text-slate-900 scale-110' : 'bg-slate-700 text-slate-400'}`}>
                    <Play size={24} fill="currentColor" className={activeTab === 'workout' ? 'ml-1' : ''} />
                  </div>
              </button>
              <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 w-12 transition-colors ${activeTab === 'settings' ? 'text-cyan-400' : 'text-slate-500'}`}>
                  <Settings size={20} /> <span className="text-[9px] font-bold uppercase">Profil</span>
              </button>
          </div>
      </nav>
    </div>
  );
}
