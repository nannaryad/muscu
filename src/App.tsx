// @ts-nocheck
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Activity, Calendar, ChevronDown, ChevronRight, 
  BarChart2, Settings, Dumbbell, 
  Check, X, Play, User, 
  Scale, Utensils, Droplet, Moon, Trash2, Download, Ruler,
  Calculator, Disc, Save, Share2, Clock, StickyNote, Flame, Pause, PlayCircle,
  Info, Volume2, VolumeX, Upload, Battery, Youtube
} from 'lucide-react';

// --- DATA (Avec Tutoriels Réintégrés) ---
const WarmUpRoutine = [
  { name: "Rotations externes élastique (L-Fly)", reps: "2 x 15-20" },
  { name: "Dislocations élastique/bâton", reps: "2 x 10" },
  { name: "Scapular Push-ups (Serratus)", reps: "2 x 12" },
  { name: "Élévations Y-T-W au sol", reps: "2 x 10" }
];

const ProgramData = {
  weeks: {
    "A": {
      "Jour 1 (Push)": [
        { id: 101, name: "Développé incliné haltères", sets: 4, targetReps: "8-12", rest: 90, tutorial: "Banc incliné à 30° max. Prise neutre (paumes face à face) pour protéger l'épaule. Descendez les haltères vers le creux de l'aisselle." },
        { id: 102, name: "Presse pectoraux guidée", sets: 4, targetReps: "10-12", rest: 90, tutorial: "Réglez le siège pour que les poignées soient au niveau des tétons. Gardez les coudes sous le niveau des épaules. Ne décollez pas le dos." },
        { id: 103, name: "Écarté poulie bas → haut", sets: 3, targetReps: "12-15", rest: 60, tutorial: "Poulies au sol. Tirez vers le haut et l'intérieur (niveau visage). Gardez les bras semi-fléchis comme pour faire un câlin à un arbre." },
        { id: 104, name: "Élévations latérales", sets: 4, targetReps: "15-20", rest: 60, tutorial: "Bras légèrement fléchis. Montez les coudes (pas les mains) jusqu'à la hauteur des épaules. Ne balancez pas le buste." },
        { id: 105, name: "Floor Press", sets: 3, targetReps: "10-12", rest: 90, tutorial: "Allongé au sol avec haltères. Les coudes touchent le sol à chaque rep, ce qui limite l'amplitude et protège l'articulation." },
        { id: 106, name: "Face pull", sets: 4, targetReps: "15-20", rest: 60, tutorial: "Poulie haute. Tirez la corde vers vos yeux en écartant les mains. Finissez en position 'double biceps'. Indispensable pour la coiffe." },
        { id: 107, name: "Extension corde triceps", sets: 4, targetReps: "10-15", rest: 60, tutorial: "Coudes collés aux côtes. Écartez la corde en bas du mouvement pour contracter le triceps." }
      ],
      "Jour 2 (Pull)": [
        { id: 201, name: "Tractions / Tirage neutre", sets: 4, targetReps: "8-10", rest: 120, tutorial: "Prise neutre ou supination préférée. Sortez la poitrine. Tirez les coudes vers le bas." },
        { id: 202, name: "Rowing haltère", sets: 4, targetReps: "10-12", rest: 90, tutorial: "Un genou sur le banc. Dos plat. Tirez l'haltère vers la hanche (pas vers l'épaule)." },
        { id: 203, name: "Tirage horizontal", sets: 3, targetReps: "10-12", rest: 90, tutorial: "Buste droit. Tirez vers le nombril. Serrez les omoplates à la fin du mouvement." },
        { id: 204, name: "Face pull", sets: 4, targetReps: "15-20", rest: 60, tutorial: "Voir Jour 1. Focus sur la rotation externe." },
        { id: 205, name: "Curl incliné", sets: 3, targetReps: "10-12", rest: 60, tutorial: "Banc à 45°. Bras en arrière du corps. Étire le chef long du biceps." }
      ],
      "Jour 3 (Legs)": [
        { id: 301, name: "Presse à cuisses", sets: 4, targetReps: "10-15", rest: 120, tutorial: "Pieds largeur bassin. Ne tendez jamais les jambes à fond (gardez une légère flexion)." },
        { id: 302, name: "Fentes marchées", sets: 3, targetReps: "12 pas", rest: 90, tutorial: "Grands pas. Le genou arrière frôle le sol. Buste droit." },
        { id: 303, name: "Leg extension", sets: 3, targetReps: "12-15", rest: 60, tutorial: "Contrôlez la descente. Ne donnez pas d'élan." },
        { id: 304, name: "Leg curl", sets: 4, targetReps: "10-15", rest: 60, tutorial: "Tirez les talons vers les fesses. Gardez le bassin plaqué au banc." },
        { id: 305, name: "Mollets debout", sets: 4, targetReps: "15-20", rest: 45, tutorial: "Montez le plus haut possible sur la pointe des pieds." }
      ]
    },
    "B": {
      "Jour 1 (Push)": [
        { id: 401, name: "Dev. Incliné Smith", sets: 4, targetReps: "8-12", rest: 90, tutorial: "Barre guidée. Banc à 30°. Contrôle total." },
        { id: 402, name: "Dev. Couché Haltères", sets: 4, targetReps: "8-12", rest: 90, tutorial: "Prise neutre pour l'épaule. Resserrez les omoplates." },
        { id: 403, name: "Câbles croisés", sets: 3, targetReps: "12-15", rest: 60, tutorial: "Poulies hautes. Croisez les mains en bas. Focus bas de pecs." },
        { id: 404, name: "Élévations latérales poulie", sets: 4, targetReps: "15-20", rest: 60, tutorial: "Poulie basse derrière le dos. Tirez sur le côté." },
        { id: 405, name: "Face pull", sets: 4, targetReps: "15-20", rest: 60, tutorial: "Toujours et encore. C'est la clé de la santé épaule." }
      ],
      "Jour 2 (Pull)": [
        { id: 501, name: "Tirage vertical neutre", sets: 4, targetReps: "8-12", rest: 90, tutorial: "Poignée triangle V-Bar. Tirez vers le haut des pecs." },
        { id: 502, name: "Rowing machine", sets: 3, targetReps: "10-12", rest: 90, tutorial: "Appui thoracique si possible. Tirez les coudes loin derrière." },
        { id: 503, name: "Pull-over poulie", sets: 3, targetReps: "12-15", rest: 60, tutorial: "Bras tendus. Amenez la barre des yeux jusqu'aux cuisses. Travail du grand dorsal." },
        { id: 504, name: "Curl EZ", sets: 3, targetReps: "10-12", rest: 60, tutorial: "Barre tordue. Coudes fixes." }
      ],
      "Jour 3 (Legs)": [
        { id: 601, name: "Squat guidé", sets: 4, targetReps: "8-12", rest: 120, tutorial: "Pieds un peu en avant. Dos droit. Descendez les fesses." },
        { id: 602, name: "Hip Thrust", sets: 4, targetReps: "10-12", rest: 90, tutorial: "Barre sur le bassin. Contractez fort les fessiers en haut." },
        { id: 603, name: "Bulgarian split squat", sets: 3, targetReps: "10-12", rest: 90, tutorial: "Un pied sur banc derrière. Descendez verticalement." },
        { id: 604, name: "Leg curl allongé", sets: 4, targetReps: "10-15", rest: 60, tutorial: "Classique ischios. Pas d'élan." }
      ]
    }
  }
};

// --- UTILS & HOOKS ---

const useStickyState = (defaultValue, key) => {
  const [value, setValue] = useState(() => {
    try {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    } catch (err) { return defaultValue; }
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

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

const WarmUpModal = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-slate-900 rounded-xl max-w-sm w-full border border-slate-700 overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-orange-900/10">
                <h3 className="font-bold text-orange-500 flex items-center gap-2">
                    <Flame size={18}/> Routine Échauffement
                </h3>
                <button onClick={onClose}><X size={20} className="text-slate-400"/></button>
            </div>
            <div className="p-4 space-y-3">
                {WarmUpRoutine.map((exo, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-slate-800 rounded-lg border border-slate-700">
                        <span className="text-sm font-medium text-slate-200">{exo.name}</span>
                        <span className="text-xs font-bold bg-slate-900 px-2 py-1 rounded text-orange-400 border border-slate-700">{exo.reps}</span>
                    </div>
                ))}
            </div>
            <button onClick={onClose} className="w-full p-4 bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm uppercase tracking-wider transition-colors">
                Prêt à feu !
            </button>
        </div>
    </div>
);

const TimerBar = ({ duration, onReset, onClose, settings }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    else if (timeLeft === 0) {
        setIsRunning(false);
        if(settings?.vibration && navigator.vibrate) navigator.vibrate([200, 100, 200]);
        // Simple beep logic would go here if sound enabled
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, settings]);

  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-slate-800 border border-slate-600 rounded-md shadow-2xl p-3 flex items-center gap-4 z-50 animate-in slide-in-from-bottom-5">
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

  const handleBlur = () => {
    if (!isValidated) onChange({ weight, reps, rpe, isValidated: false });
  };

  return (
    <div className={`grid grid-cols-10 gap-2 items-center py-2 border-b border-slate-800/50 ${isValidated ? 'opacity-50' : 'opacity-100'}`}>
      <div className="col-span-1 flex justify-center">
        <span className="font-mono text-slate-500 text-sm">{setNumber}</span>
      </div>
      <div className="col-span-2 text-center text-xs text-slate-600 font-mono hidden sm:block">
        {previousData ? `${previousData.weight}kg x ${previousData.reps}` : '-'}
      </div>
      <div className="col-span-3 sm:col-span-2">
        <input 
          type="number" 
          placeholder="kg"
          value={weight}
          disabled={isValidated}
          onChange={(e) => setWeight(e.target.value)}
          onBlur={handleBlur}
          className="w-full bg-slate-800 border border-slate-700 rounded text-center text-slate-100 font-mono py-1 focus:border-cyan-500 focus:outline-none"
        />
      </div>
      <div className="col-span-3 sm:col-span-2">
        <input 
          type="number" 
          placeholder="reps"
          value={reps}
          disabled={isValidated}
          onChange={(e) => setReps(e.target.value)}
          onBlur={handleBlur}
          className="w-full bg-slate-800 border border-slate-700 rounded text-center text-slate-100 font-mono py-1 focus:border-cyan-500 focus:outline-none"
        />
      </div>
      <div className="col-span-2 hidden sm:block">
         <input 
          type="number" 
          placeholder="RPE"
          max="10"
          value={rpe}
          disabled={isValidated}
          onChange={(e) => setRpe(e.target.value)}
          onBlur={handleBlur}
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

const ExerciseModule = ({ exercise, history, todaysLog, onUpdateLog, onStartTimer, notes, onSaveNotes }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false); // NEW: Tutorial Toggle
  const [localNote, setLocalNote] = useState(notes || '');

  useEffect(() => { setLocalNote(notes || ''); }, [notes]);

  const handleSaveNote = () => {
      onSaveNotes(exercise.id, localNote);
      setShowNotes(false);
  };
  
  const getBestSet = () => {
    if (!history) return null;
    let best1RM = 0;
    Object.values(history).forEach(set => {
        const w = parseFloat(set.weight);
        const r = parseFloat(set.reps);
        if(w && r) {
            const e1rm = w * (1 + r/30);
            if(e1rm > best1RM) best1RM = e1rm;
        }
    });
    return best1RM > 0 ? Math.round(best1RM) : null;
  };
  const estimated1RM = getBestSet();

  const currentVolume = todaysLog 
    ? Object.values(todaysLog).reduce((acc, set) => acc + (parseFloat(set.weight || 0) * parseFloat(set.reps || 0)), 0)
    : 0;

  return (
    <div className="mb-4 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer bg-slate-900 hover:bg-slate-800/50 transition-colors border-b border-slate-800"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
            <div className={`w-1 h-8 rounded-full ${currentVolume > 0 ? 'bg-cyan-500' : 'bg-slate-700'}`}></div>
            <div>
                <h3 className="font-bold text-slate-200 text-sm sm:text-base flex items-center gap-2">
                    {exercise.name}
                </h3>
                <div className="flex gap-3 mt-1">
                    <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                        <Dumbbell size={10}/> {exercise.sets} séries
                    </span>
                    {estimated1RM && (
                        <span className="text-xs text-yellow-600 font-mono flex items-center gap-1">
                           🔥 1RM: {estimated1RM}kg
                        </span>
                    )}
                </div>
            </div>
        </div>
        <div className="flex items-center gap-3">
             <button 
                onClick={(e) => { e.stopPropagation(); setShowTutorial(!showTutorial); }}
                className={`p-2 rounded-full transition-colors ${showTutorial ? 'bg-blue-500/20 text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
             >
                <Info size={18} />
             </button>
             {notes && <div className="w-2 h-2 rounded-full bg-yellow-500" title="Notes présentes"></div>}
             {currentVolume > 0 && <span className="text-xs font-mono text-cyan-500">{currentVolume} kg</span>}
             {isExpanded ? <ChevronDown size={18} className="text-slate-500"/> : <ChevronRight size={18} className="text-slate-500"/>}
        </div>
      </div>

      {isExpanded && (
        <div className="p-2 bg-slate-950/30">
            {/* NEW: Tutorial Section */}
            {showTutorial && (
                <div className="px-3 py-3 mb-3 bg-blue-900/10 border border-blue-500/20 rounded-lg animate-in slide-in-from-top-2">
                    <div className="flex gap-3">
                        <Info size={20} className="text-blue-500 flex-shrink-0 mt-1"/>
                        <div>
                            <p className="text-sm text-blue-100 leading-relaxed mb-3">
                                {exercise.tutorial || "Aucune consigne disponible."}
                            </p>
                            <a 
                                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name + " musculation technique")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors"
                            >
                                <Youtube size={14} /> Voir démo vidéo
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Toolbar */}
            <div className="flex justify-end px-2 mb-2">
                <button 
                    onClick={() => setShowNotes(!showNotes)}
                    className={`text-xs flex items-center gap-1 px-2 py-1 rounded transition-colors ${showNotes || notes ? 'text-yellow-500 bg-yellow-500/10' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <StickyNote size={12}/> {notes ? 'Modifier Notes' : 'Ajouter Notes'}
                </button>
            </div>

            {/* Notes Area */}
            {showNotes && (
                <div className="px-2 mb-4 animate-in slide-in-from-top-2">
                    <textarea 
                        value={localNote}
                        onChange={(e) => setLocalNote(e.target.value)}
                        placeholder="Réglages siège, sensations, douleur..."
                        className="w-full bg-yellow-900/10 border border-yellow-700/30 text-yellow-100 text-xs p-2 rounded focus:outline-none focus:border-yellow-600 h-20"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                        <button onClick={() => setShowNotes(false)} className="text-xs text-slate-500 hover:text-white px-3 py-1">Annuler</button>
                        <button onClick={handleSaveNote} className="text-xs bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1 rounded font-bold">Enregistrer</button>
                    </div>
                </div>
            )}
            
            {!showNotes && notes && (
                <div className="px-2 mb-4">
                    <div className="bg-yellow-900/10 border-l-2 border-yellow-600 p-2 text-xs text-yellow-200/80 italic">
                        {notes}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-10 gap-2 mb-2 px-1">
                <div className="col-span-1 text-center text-[10px] text-slate-500 uppercase font-bold">Set</div>
                <div className="col-span-2 text-center text-[10px] text-slate-500 uppercase font-bold hidden sm:block">Précédent</div>
                <div className="col-span-3 sm:col-span-2 text-center text-[10px] text-slate-500 uppercase font-bold">kg</div>
                <div className="col-span-3 sm:col-span-2 text-center text-[10px] text-slate-500 uppercase font-bold">Reps</div>
                <div className="col-span-2 text-center text-[10px] text-slate-500 uppercase font-bold hidden sm:block">RPE</div>
                <div className="col-span-3 sm:col-span-1 text-center text-[10px] text-slate-500 uppercase font-bold">Valider</div>
            </div>
            {Array.from({ length: exercise.sets }).map((_, i) => (
                <SetRow 
                    key={i}
                    setNumber={i + 1}
                    previousData={history ? history[i + 1] : null}
                    currentData={todaysLog ? todaysLog[i + 1] : null}
                    onChange={(data) => onUpdateLog(exercise.id, i + 1, data)}
                    onValidate={(data) => {
                        onUpdateLog(exercise.id, i + 1, data);
                        if (data.isValidated) onStartTimer(exercise.rest);
                    }}
                />
            ))}
        </div>
      )}
    </div>
  );
};

const Dashboard = ({ logs, profile, habits, onUpdateProfile, onUpdateHabit }) => {
    const chartData = useMemo(() => {
        const volumeByDate = {};
        Object.entries(logs).forEach(([key, sessionData]) => {
            const date = key.split('T')[0];
            let vol = 0;
            Object.values(sessionData).forEach(exo => {
                Object.values(exo).forEach(set => {
                    if(set.isValidated) vol += (parseFloat(set.weight)||0) * (parseFloat(set.reps)||0);
                });
            });
            if(volumeByDate[date]) volumeByDate[date] += vol;
            else volumeByDate[date] = vol;
        });
        return Object.entries(volumeByDate)
            .sort((a,b) => new Date(a[0]) - new Date(b[0]))
            .slice(-7)
            .map(([date, vol]) => ({ date, vol }));
    }, [logs]);

    const bmi = calculateBMI(profile.weight, profile.height);
    const today = new Date().toISOString().split('T')[0];
    const todayHabits = habits[today] || {};

    const habitList = [
      { id: 'protein', icon: Utensils, label: 'Protéines OK' },
      { id: 'water', icon: Droplet, label: '2L Eau' },
      { id: 'sleep', icon: Moon, label: '8h Sommeil' },
      { id: 'creatine', icon: Activity, label: 'Créatine' },
    ];

    return (
        <div className="p-4 space-y-6 animate-in fade-in">
            {/* Header Metrics */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <Activity size={16} />
                        <span className="text-xs font-bold uppercase">Volume (7j)</span>
                    </div>
                    <span className="text-2xl font-mono font-bold text-white">
                        {(chartData.reduce((acc, curr) => acc + curr.vol, 0) / 1000).toFixed(1)}k <span className="text-sm text-slate-500">kg</span>
                    </span>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <Calendar size={16} />
                        <span className="text-xs font-bold uppercase">Séances</span>
                    </div>
                    <span className="text-2xl font-mono font-bold text-white">
                        {chartData.length}
                    </span>
                </div>
            </div>

            {/* Body Metrics Card */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                <div className="p-3 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                        <User size={16} className="text-cyan-500"/> Suivi Corporel
                    </h3>
                    <div className={`text-xs px-2 py-0.5 rounded font-bold ${bmi.color} bg-slate-900`}>
                        IMC: {bmi.value} ({bmi.label})
                    </div>
                </div>
                <div className="p-4 grid grid-cols-2 gap-6">
                    <div>
                         <label className="text-xs text-slate-500 font-bold uppercase block mb-1">Poids (kg)</label>
                         <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg px-3 py-2">
                            <Scale size={16} className="text-slate-500 mr-2"/>
                            <input 
                                type="number" 
                                value={profile.weight || ''}
                                onChange={(e) => onUpdateProfile('weight', e.target.value)}
                                className="bg-transparent text-white font-mono font-bold w-full focus:outline-none"
                                placeholder="00.0"
                            />
                         </div>
                    </div>
                    <div>
                         <label className="text-xs text-slate-500 font-bold uppercase block mb-1">Taille (cm)</label>
                         <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg px-3 py-2">
                            <Ruler size={16} className="text-slate-500 mr-2"/>
                            <input 
                                type="number" 
                                value={profile.height || ''}
                                onChange={(e) => onUpdateProfile('height', e.target.value)}
                                className="bg-transparent text-white font-mono font-bold w-full focus:outline-none"
                                placeholder="175"
                            />
                         </div>
                    </div>
                </div>
            </div>

            {/* Daily Habits Tracker */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                <div className="p-3 bg-slate-900 border-b border-slate-700">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                        <Check size={16} className="text-green-500"/> Habitudes du Jour
                    </h3>
                </div>
                <div className="p-2 grid grid-cols-2 gap-2">
                    {habitList.map(habit => (
                        <button
                            key={habit.id}
                            onClick={() => onUpdateHabit(today, habit.id)}
                            className={`flex items-center gap-3 p-3 rounded-md border transition-all ${todayHabits[habit.id] ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-700'}`}
                        >
                            <div className={`p-1.5 rounded-full ${todayHabits[habit.id] ? 'bg-green-500 text-slate-900' : 'bg-slate-800'}`}>
                                <habit.icon size={14}/>
                            </div>
                            <span className="text-xs font-bold">{habit.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Charts */}
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <h3 className="text-xs font-bold uppercase text-slate-400 mb-4">Progression Volume</h3>
                <div className="flex items-end gap-2 h-32 w-full px-2">
                    {chartData.length === 0 && <div className="text-slate-500 text-xs w-full text-center self-center">Pas assez de données</div>}
                    {chartData.map((d, i) => {
                        const max = Math.max(...chartData.map(o => o.vol));
                        const h = (d.vol / max) * 100;
                        return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                                <div 
                                    className="w-full bg-cyan-900 hover:bg-cyan-500 transition-all rounded-t-sm relative" 
                                    style={{ height: `${h}%` }}
                                ></div>
                                <span className="text-[10px] text-slate-500 font-mono rotate-0">{formatDate(d.date)}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

const ToolsPage = ({ logs }) => {
    const [targetWeight, setTargetWeight] = useState('');
    const [barWeight, setBarWeight] = useState(20);
    const [plates, setPlates] = useState([]);
    const [oneRmWeight, setOneRmWeight] = useState('');
    const [oneRmReps, setOneRmReps] = useState('');
    const [calculatedMax, setCalculatedMax] = useState(null);

    const calculatePlates = () => {
        if (!targetWeight || targetWeight < barWeight) {
            setPlates([]);
            return;
        }
        let remaining = (targetWeight - barWeight) / 2;
        const availablePlates = [20, 10, 5, 2.5, 1.25];
        const result = [];
        availablePlates.forEach(plate => {
            while (remaining >= plate) {
                result.push(plate);
                remaining -= plate;
            }
        });
        setPlates(result);
    };

    useEffect(() => { calculatePlates(); }, [targetWeight, barWeight]);

    useEffect(() => {
        if(oneRmWeight && oneRmReps) {
            const w = parseFloat(oneRmWeight);
            const r = parseFloat(oneRmReps);
            const res = w * (1 + r/30);
            setCalculatedMax(Math.round(res));
        } else {
            setCalculatedMax(null);
        }
    }, [oneRmWeight, oneRmReps]);

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", "rehabpro_export_" + new Date().toISOString() + ".json");
        document.body.appendChild(downloadAnchorNode); 
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div className="p-4 space-y-8 animate-in slide-in-from-right-10">
            <h2 className="text-xl font-bold text-white mb-6">Boîte à Outils Pro</h2>
            
            <section className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                <div className="p-3 bg-slate-900 border-b border-slate-700 flex items-center gap-2">
                     <Disc size={18} className="text-cyan-500" />
                     <h3 className="font-bold text-sm text-slate-200">Calculateur de Charge</h3>
                </div>
                <div className="p-4 space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                             <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Poids total (kg)</label>
                             <input 
                                type="number" 
                                value={targetWeight}
                                onChange={e => setTargetWeight(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white font-mono font-bold"
                                placeholder="Ex: 80"
                             />
                         </div>
                         <div>
                             <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Barre (kg)</label>
                             <select 
                                value={barWeight}
                                onChange={e => setBarWeight(Number(e.target.value))}
                                className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white font-mono"
                             >
                                 <option value={20}>Olympique (20kg)</option>
                                 <option value={15}>Femme (15kg)</option>
                                 <option value={10}>EZ / Technique (10kg)</option>
                             </select>
                         </div>
                     </div>
                     <div className="bg-slate-900 h-24 rounded-lg flex items-center justify-center relative overflow-hidden px-4">
                         <div className="absolute w-full h-2 bg-slate-600 z-0"></div>
                         <div className="flex items-center gap-1 z-10">
                            {plates.length === 0 && <span className="text-slate-600 text-xs">Entrez un poids</span>}
                            {plates.map((p, i) => {
                                let h = 'h-16'; let color = 'bg-red-600'; 
                                if(p === 20) { h = 'h-16'; color = 'bg-blue-600'; }
                                if(p === 15) { h = 'h-14'; color = 'bg-yellow-500'; }
                                if(p === 10) { h = 'h-12'; color = 'bg-green-600'; }
                                if(p === 5) { h = 'h-10'; color = 'bg-white'; }
                                if(p === 2.5) { h = 'h-8'; color = 'bg-slate-400'; }
                                if(p === 1.25) { h = 'h-6'; color = 'bg-slate-500'; }
                                return (<div key={i} className={`w-3 ${h} ${color} rounded-sm border border-black/20 shadow-sm`} title={`${p}kg`}></div>)
                            })}
                         </div>
                         {plates.length > 0 && (
                             <div className="absolute bottom-1 right-2 text-xs font-mono text-slate-400">
                                 {plates.join('+')} <span className="text-slate-600">x2</span>
                             </div>
                         )}
                     </div>
                </div>
            </section>

            <section className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                <div className="p-3 bg-slate-900 border-b border-slate-700 flex items-center gap-2">
                     <Activity size={18} className="text-purple-500" />
                     <h3 className="font-bold text-sm text-slate-200">Calculateur 1RM (Epley)</h3>
                </div>
                <div className="p-4 grid grid-cols-2 gap-4">
                     <div>
                         <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Poids levé</label>
                         <input 
                            type="number" 
                            value={oneRmWeight}
                            onChange={e => setOneRmWeight(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white font-mono font-bold"
                            placeholder="kg"
                         />
                     </div>
                     <div>
                         <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Répétitions</label>
                         <input 
                            type="number" 
                            value={oneRmReps}
                            onChange={e => setOneRmReps(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white font-mono font-bold"
                            placeholder="reps"
                         />
                     </div>
                </div>
                {calculatedMax && (
                    <div className="bg-purple-900/20 p-4 border-t border-purple-500/30 flex justify-between items-center">
                        <span className="text-sm text-purple-200">Max Théorique :</span>
                        <span className="text-2xl font-black text-white">{calculatedMax} <span className="text-sm font-normal text-slate-400">kg</span></span>
                    </div>
                )}
            </section>

            <section className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                <div className="p-3 bg-slate-900 border-b border-slate-700 flex items-center gap-2">
                     <Share2 size={18} className="text-green-500" />
                     <h3 className="font-bold text-sm text-slate-200">Export Données</h3>
                </div>
                <div className="p-4">
                    <button 
                        onClick={handleExport}
                        className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded border border-slate-500 flex justify-center items-center gap-2 text-sm font-bold transition"
                    >
                        <Download size={16}/> Télécharger JSON
                    </button>
                </div>
            </section>
        </div>
    );
};

// NEW: Updated Settings Page with Import & Options
const SettingsPage = ({ profile, settings, onUpdateProfile, onUpdateSettings, onResetData, onImportData }) => {
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
            
            {/* NEW: App Preferences */}
            <section className="space-y-4">
                <h3 className="text-xs font-bold uppercase text-slate-500">Préférences</h3>
                <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                     <button 
                        onClick={() => onUpdateSettings('sound', !settings.sound)}
                        className="w-full p-4 border-b border-slate-700 flex justify-between items-center hover:bg-slate-700/50"
                     >
                        <div className="flex items-center gap-3">
                            {settings.sound ? <Volume2 size={20} className="text-cyan-500"/> : <VolumeX size={20} className="text-slate-500"/>}
                            <span className="text-sm font-medium text-slate-200">Sons (Timer)</span>
                        </div>
                        <div className={`w-10 h-5 rounded-full relative transition-colors ${settings.sound ? 'bg-cyan-600' : 'bg-slate-600'}`}>
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.sound ? 'left-6' : 'left-1'}`}></div>
                        </div>
                     </button>
                     <button 
                        onClick={() => onUpdateSettings('vibration', !settings.vibration)}
                        className="w-full p-4 border-b border-slate-700 flex justify-between items-center hover:bg-slate-700/50"
                     >
                        <div className="flex items-center gap-3">
                            <Activity size={20} className={settings.vibration ? "text-cyan-500" : "text-slate-500"}/>
                            <span className="text-sm font-medium text-slate-200">Vibrations</span>
                        </div>
                        <div className={`w-10 h-5 rounded-full relative transition-colors ${settings.vibration ? 'bg-cyan-600' : 'bg-slate-600'}`}>
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.vibration ? 'left-6' : 'left-1'}`}></div>
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

// --- MAIN APP ---

export default function App() {
  const [activeTab, setActiveTab] = useState('workout'); 
  const [activeWeek, setActiveWeek] = useStickyState("A", "pro_active_week");
  const [activeDay, setActiveDay] = useStickyState("Jour 1 (Push)", "pro_active_day");
  
  // États persistants
  const [logs, setLogs] = useStickyState({}, "pro_workout_logs");
  const [profile, setProfile] = useStickyState({ name: '', height: '', weight: '', age: '' }, "pro_user_profile");
  const [habits, setHabits] = useStickyState({}, "pro_daily_habits");
  const [notes, setNotes] = useStickyState({}, "pro_exercise_notes");
  const [settings, setSettings] = useStickyState({ sound: true, vibration: true }, "pro_user_settings"); // NEW
  
  const [timer, setTimer] = useState(null);
  const [showWarmUp, setShowWarmUp] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const sessionKey = `${today}-${activeWeek}-${activeDay}`;

  const getLastSessionData = (exerciseId) => {
    const keys = Object.keys(logs).filter(k => k.includes(`${activeWeek}-${activeDay}`) && k !== sessionKey).sort().reverse();
    if (keys.length > 0) return logs[keys[0]]?.[exerciseId];
    return null;
  };

  const handleUpdateLog = (exoId, setNum, data) => {
    setLogs(prev => ({
        ...prev,
        [sessionKey]: { ...prev[sessionKey], [exoId]: { ...prev[sessionKey]?.[exoId], [setNum]: data } }
    }));
  };

  const handleUpdateProfile = (field, value) => setProfile(prev => ({ ...prev, [field]: value }));
  const handleUpdateSettings = (field, value) => setSettings(prev => ({ ...prev, [field]: value }));
  const handleUpdateHabit = (date, habitId) => setHabits(prev => ({ ...prev, [date]: { ...prev[date], [habitId]: !prev[date]?.[habitId] } }));
  const handleSaveNotes = (exoId, note) => setNotes(prev => ({ ...prev, [exoId]: note }));

  const handleResetData = () => {
      if(window.confirm("Êtes-vous sûr de vouloir tout effacer ?")) {
          localStorage.clear();
          window.location.reload();
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
                  setLogs(importedData);
                  alert("Import réussi !");
              }
          } catch (error) {
              alert("Erreur: Fichier invalide.");
          }
      };
      reader.readAsText(file);
  };

  const currentExercises = ProgramData.weeks[activeWeek][activeDay];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-24">
      
      {/* HEADER */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
           <div className="flex items-center gap-3">
               <div className="flex items-center gap-2">
                   <div className="w-6 h-6 bg-cyan-500 rounded flex items-center justify-center">
                       <span className="font-bold text-slate-900 text-xs">R</span>
                   </div>
                   <span className="font-bold tracking-tight text-slate-100 hidden sm:inline">REHAB<span className="text-cyan-500">PRO</span></span>
               </div>
               <SessionTimer />
           </div>
           
           {activeTab === 'workout' && (
               <div className="flex gap-1 bg-slate-800 p-1 rounded border border-slate-700">
                   {['A', 'B'].map(w => (
                       <button 
                         key={w} 
                         onClick={() => setActiveWeek(w)}
                         className={`text-xs font-mono px-3 py-1 rounded transition-colors ${activeWeek === w ? 'bg-cyan-500 text-slate-900 font-bold' : 'text-slate-400 hover:text-white'}`}
                       >
                           Sem {w}
                       </button>
                   ))}
               </div>
           )}
        </div>
        
        {activeTab === 'workout' && (
            <div className="max-w-md mx-auto px-4 py-2 flex overflow-x-auto gap-2 no-scrollbar bg-slate-900/50 backdrop-blur-sm border-b border-slate-800">
                {Object.keys(ProgramData.weeks[activeWeek]).map(day => (
                    <button
                        key={day}
                        onClick={() => setActiveDay(day)}
                        className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${activeDay === day ? 'bg-slate-100 text-slate-900 border-white' : 'bg-slate-900 text-slate-500 border-slate-700 hover:border-slate-500'}`}
                    >
                        {day}
                    </button>
                ))}
            </div>
        )}
      </header>

      {/* CONTENT */}
      <main className="max-w-md mx-auto pt-4">
        
        {activeTab === 'dashboard' && (
            <Dashboard 
                logs={logs} 
                profile={profile}
                habits={habits}
                onUpdateProfile={handleUpdateProfile}
                onUpdateHabit={handleUpdateHabit}
            />
        )}

        {activeTab === 'workout' && (
            <div className="px-4 animate-in fade-in duration-300">
                <button 
                    onClick={() => setShowWarmUp(true)}
                    className="w-full mb-6 bg-gradient-to-r from-orange-900/40 to-slate-900 border border-orange-700/30 p-3 rounded-lg flex items-center justify-between group hover:border-orange-500/50 transition-all"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-500/20 p-2 rounded-full text-orange-500 group-hover:scale-110 transition-transform">
                            <Flame size={18} fill="currentColor" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-sm text-orange-100">Routine Échauffement</h3>
                            <p className="text-[10px] text-orange-300/60">Coiffe des rotateurs & Mobilité</p>
                        </div>
                    </div>
                    <PlayCircle size={20} className="text-orange-500 opacity-50 group-hover:opacity-100"/>
                </button>

                <div className="flex justify-between items-end mb-4 px-1">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">{activeDay.split('(')[0]} <span className="text-cyan-500 text-sm normal-case tracking-normal">{activeDay.match(/\((.*)\)/)?.[0]}</span></h2>
                    <span className="text-xs font-mono text-slate-500">{new Date().toLocaleDateString()}</span>
                </div>

                {currentExercises.map(exo => (
                    <ExerciseModule 
                        key={exo.id}
                        exercise={exo}
                        history={getLastSessionData(exo.id)}
                        todaysLog={logs[sessionKey]?.[exo.id]}
                        notes={notes[exo.id]}
                        onUpdateLog={handleUpdateLog}
                        onStartTimer={setTimer}
                        onSaveNotes={handleSaveNotes}
                    />
                ))}

                <button 
                    onClick={() => {
                        if(confirm("Séance terminée ! Voir le récapitulatif ?")) {
                            setActiveTab('dashboard');
                        }
                    }}
                    className="w-full mt-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg uppercase tracking-widest shadow-lg shadow-cyan-900/20 transition-all active:scale-[0.98]"
                >
                    Terminer la séance
                </button>
            </div>
        )}
        
        {activeTab === 'tools' && (
            <ToolsPage logs={logs} />
        )}

        {activeTab === 'settings' && (
             <SettingsPage 
                profile={profile}
                settings={settings}
                onUpdateProfile={handleUpdateProfile}
                onUpdateSettings={handleUpdateSettings}
                onResetData={handleResetData}
                onImportData={handleImportData}
             />
        )}
      </main>

      {/* OVERLAYS */}
      {timer && <TimerBar duration={timer} settings={settings} onReset={() => setTimer(null)} onClose={() => setTimer(null)} />}
      {showWarmUp && <WarmUpModal onClose={() => setShowWarmUp(false)} />}

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50 pb-safe">
          <div className="max-w-md mx-auto flex justify-between items-center h-16 px-6">
              <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 w-12 ${activeTab === 'dashboard' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>
                  <BarChart2 size={20} />
                  <span className="text-[10px] font-bold uppercase">Suivi</span>
              </button>
              
              <button onClick={() => setActiveTab('tools')} className={`flex flex-col items-center gap-1 w-12 ${activeTab === 'tools' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>
                  <Calculator size={20} />
                  <span className="text-[10px] font-bold uppercase">Outils</span>
              </button>

              <button onClick={() => setActiveTab('workout')} className="flex flex-col items-center gap-1 w-12 -mt-8">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-slate-900 transition-all ${activeTab === 'workout' ? 'bg-cyan-500 text-slate-900 scale-110' : 'bg-slate-700 text-slate-400'}`}>
                    <Play size={24} fill="currentColor" className={activeTab === 'workout' ? 'ml-1' : ''} />
                  </div>
              </button>
              
              <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 w-12 ${activeTab === 'settings' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>
                  <Settings size={20} />
                  <span className="text-[10px] font-bold uppercase">Profil</span>
              </button>
          </div>
      </nav>

    </div>
  );
}
