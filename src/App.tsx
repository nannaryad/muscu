import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, Info, AlertCircle, Activity, CheckCircle, 
  Clock, Search, PlayCircle, Hash, Timer, RotateCcw, 
  Dumbbell, Save, X, ChevronRight, Trophy, FileText, Trash2 
} from 'lucide-react';

// --- DONNÉES DU PROGRAMME (Identique, structure préservée) ---
const WarmUpRoutine = [
  { name: "Rotations externes élastique (L-Fly)", reps: "2 x 15-20" },
  { name: "Dislocations élastique/bâton", reps: "2 x 10" },
  { name: "Scapular Push-ups (Serratus)", reps: "2 x 12" },
  { name: "Élévations Y-T-W au sol", reps: "2 x 10" }
];

const ProgramData = {
  speciality: "Spécial Conflit Sous-Acromial",
  weeks: {
    "A": {
      "Jour 1 (Pecs / Épaules / Triceps)": [
        { id: 101, name: "Développé incliné haltères (prise neutre)", sets: 4, reps: "8-12", rest: 90, tutorial: "Banc 25-35°, prise neutre, descente vers l'aisselle." },
        { id: 102, name: "Presse pectoraux guidée", sets: 4, reps: "10-12", rest: 90, tutorial: "Poignées au niveau des pectoraux, coudes sous l'horizontale." },
        { id: 103, name: "Écarté poulie bas → haut", sets: 3, reps: "12-15", rest: 60, tutorial: "Bras semi-fléchis, trajectoire vers haut de pec." },
        { id: 104, name: "Élévations latérales bras fléchis", sets: 4, reps: "15-20", rest: 60, tutorial: "Monter 30-70° coudes fléchis 20°, léger." },
        { id: 105, name: "Développé haltères amplitude réduite", sets: 3, reps: "10-12", rest: 90, tutorial: "Descendre aux oreilles, pousser diagonale." },
        { id: 106, name: "Face pull", sets: 4, reps: "15-20", rest: 60, tutorial: "Tirer vers le front, coudes ouverts." },
        { id: 107, name: "Extension corde triceps", sets: 4, reps: "10-15", rest: 60, tutorial: "Coudes serrés, tirer vers l'extérieur." },
        { id: 108, name: "Extension unilatérale dos à la poulie", sets: 3, reps: "12-15", rest: 60, tutorial: "Amplitude réduite, bras proche tête." }
      ],
      "Jour 2 (Dos / Biceps)": [
        { id: 201, name: "Tractions prise neutre", sets: 4, reps: "8-10", rest: 120, tutorial: "Griffes vers toi, tirage poitrine." },
        { id: 202, name: "Rowing haltère sur banc", sets: 4, reps: "10-12", rest: 90, tutorial: "Dos fixe, tirage vers hanche." },
        { id: 203, name: "Tirage horizontal neutre", sets: 3, reps: "10-12", rest: 90, tutorial: "Coude proche du corps, tirage ligne droite." },
        { id: 204, name: "Tirage vertical neutre serré", sets: 3, reps: "10-12", rest: 90, tutorial: "Tirer vers clavicule, pas trop large." },
        { id: 205, name: "Shrugs haltères", sets: 4, reps: "12-15", rest: 60, tutorial: "Monter épaules verticalement." },
        { id: 206, name: "Face pull", sets: 4, reps: "15-20", rest: 60, tutorial: "Tirer vers visage, coude haut." },
        { id: 207, name: "Curl incliné", sets: 3, reps: "10-12", rest: 60, tutorial: "Coudes fixes, étirement important." },
        { id: 208, name: "Curl marteau", sets: 3, reps: "10-12", rest: 60, tutorial: "Poignets neutres." }
      ],
      "Jour 3 (Jambes / Abdos)": [
        { id: 301, name: "Presse à cuisses", sets: 4, reps: "10-15", rest: 120, tutorial: "Pieds largeur épaules." },
        { id: 302, name: "Fentes marchées", sets: 3, reps: "12 pas", rest: 90, tutorial: "Grand pas, genou aligné." },
        { id: 303, name: "Leg extension", sets: 3, reps: "12-15", rest: 60, tutorial: "Contraction quadriceps, léger." },
        { id: 304, name: "Leg curl assis", sets: 4, reps: "10-15", rest: 60, tutorial: "Contrôle et amplitude complète." },
        { id: 305, name: "SDT jambes semi-fléchies", sets: 3, reps: "10-12", rest: 90, tutorial: "Hanche en pivot, dos droit." },
        { id: 306, name: "Mollets debout", sets: 4, reps: "15-20", rest: 45, tutorial: "Monter sur pointe, descendre lentement." },
        { id: 307, name: "Gainage", sets: 3, reps: "45-60s", rest: 60, tutorial: "Dos neutre, serrer abdos." },
        { id: 308, name: "Relevé de genoux", sets: 3, reps: "12-15", rest: 60, tutorial: "Monter genoux sans cambrer." }
      ]
    },
    "B": {
      "Jour 1 (Pecs / Épaules / Triceps)": [
        { id: 401, name: "Développé incliné Smith neutre", sets: 4, reps: "8-12", rest: 90, tutorial: "Poignets neutres, descendre contrôlé." },
        { id: 402, name: "Développé couché haltères prise neutre", sets: 4, reps: "8-12", rest: 90, tutorial: "Coudes serrés, trajectoire naturelle." },
        { id: 403, name: "Câbles croisés haut → bas", sets: 3, reps: "12-15", rest: 60, tutorial: "Mouvement en arc, contraction pec interne." },
        { id: 404, name: "Élévations latérales poulie", sets: 4, reps: "15-20", rest: 60, tutorial: "Monter jusqu'à 70°, travail unilatéral." },
        { id: 405, name: "Rowing horizontal poulie", sets: 3, reps: "10-12", rest: 90, tutorial: "Pas de tirage vertical, tirer vers nombril." },
        { id: 406, name: "Face pull", sets: 4, reps: "15-20", rest: 60, tutorial: "Identique séance A." },
        { id: 407, name: "Barre V triceps", sets: 4, reps: "10-15", rest: 60, tutorial: "Poignets neutres, coudes serrés." },
        { id: 408, name: "Kickback haltère", sets: 3, reps: "12-15", rest: 60, tutorial: "Bras fixe, ne bouge que l'avant-bras." }
      ],
      "Jour 2 (Dos / Biceps)": [
        { id: 501, name: "Tirage vertical neutre", sets: 4, reps: "8-12", rest: 90, tutorial: "Tirer bas, contraction dorsaux." },
        { id: 502, name: "Rowing machine convergent", sets: 3, reps: "10-12", rest: 90, tutorial: "Tirage naturel, trajectoire sécurisée." },
        { id: 503, name: "Rowing poulie basse neutre", sets: 3, reps: "10-12", rest: 90, tutorial: "Dos gainé, tirage nombril." },
        { id: 504, name: "Pull-over poulie", sets: 3, reps: "12-15", rest: 60, tutorial: "Bras semi-tendus, mouvement en arc." },
        { id: 505, name: "Shrugs Smith", sets: 4, reps: "12-15", rest: 60, tutorial: "Tirage vertical strict." },
        { id: 506, name: "Rowing épaules poulie basse", sets: 3, reps: "15-20", rest: 60, tutorial: "Très léger, éviter tout pincement." },
        { id: 507, name: "Curl EZ", sets: 3, reps: "10-12", rest: 60, tutorial: "Poignets en supination naturelle." },
        { id: 508, name: "Curl concentration", sets: 3, reps: "10-12", rest: 60, tutorial: "Contrôle maximal." }
      ],
      "Jour 3 (Jambes / Abdos)": [
        { id: 601, name: "Squat guidé", sets: 4, reps: "8-12", rest: 120, tutorial: "Pieds légèrement tournés, descente contrôlée." },
        { id: 602, name: "Hip Thrust", sets: 4, reps: "10-12", rest: 90, tutorial: "Menton rentré, extension hanche." },
        { id: 603, name: "Bulgarian split squat", sets: 3, reps: "10-12", rest: 90, tutorial: "Grand pas, genou stable." },
        { id: 604, name: "Leg curl allongé", sets: 4, reps: "10-15", rest: 60, tutorial: "Monter explosif, descente lente." },
        { id: 605, name: "Good morning haltères", sets: 3, reps: "12-15", rest: 60, tutorial: "Léger, dos droit." },
        { id: 606, name: "Mollets presse", sets: 4, reps: "15-20", rest: 45, tutorial: "Amplitude max." },
        { id: 607, name: "Crunch poulie haute", sets: 3, reps: "15-20", rest: 60, tutorial: "Arrondir colonne, tirer avec abdos." },
        { id: 608, name: "Planche latérale", sets: 3, reps: "45s", rest: 60, tutorial: "Hanche élevée, gainage oblique." }
      ]
    }
  }
};

// --- HOOKS ---
// Hook pour gérer le localStorage
const useStickyState = (defaultValue, key) => {
  const [value, setValue] = useState(() => {
    try {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    } catch (err) {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error("Erreur de sauvegarde localStorage", err);
    }
  }, [key, value]);

  return [value, setValue];
};

// --- COMPONENTS ---

const FloatingTimer = ({ targetTime, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(targetTime);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const progress = ((targetTime - timeLeft) / targetTime) * 100;

  return (
    <div className="fixed bottom-4 right-4 bg-slate-900 text-white p-4 rounded-xl shadow-2xl z-50 w-64 border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-sm text-slate-300">Repos</span>
        <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={16}/></button>
      </div>
      <div className="flex items-center justify-between mb-2">
        <div className={`text-3xl font-mono font-bold ${timeLeft === 0 ? 'text-green-400' : 'text-blue-400'}`}>
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTimeLeft(t => t + 10)} className="bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-xs font-bold">+10s</button>
          <button onClick={() => setIsActive(!isActive)} className={`px-3 py-1 rounded text-xs font-bold ${isActive ? 'bg-yellow-600' : 'bg-green-600'}`}>
            {isActive ? 'Pause' : 'Go'}
          </button>
        </div>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-1000 linear ${timeLeft === 0 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${Math.max(0, 100 - progress)}%` }} />
      </div>
    </div>
  );
};

const WarmUpModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in">
    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Activity className="text-orange-500"/> Échauffement
        </h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"><X size={24} /></button>
      </div>
      <div className="space-y-3">
        {WarmUpRoutine.map((exo, i) => (
           <div key={i} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-100">
             <span className="font-medium text-slate-800">{exo.name}</span>
             <span className="text-xs font-bold bg-white px-2 py-1 rounded border border-orange-200 text-orange-600">{exo.reps}</span>
           </div>
        ))}
      </div>
      <button onClick={onClose} className="w-full mt-6 bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition">
        C'est parti !
      </button>
    </div>
  </div>
);

const ExerciseCard = ({ exercise, index, onStartTimer, data, onUpdateData }) => {
  const [showNotes, setShowNotes] = useState(false);
  const totalSets = exercise.sets;
  
  // Initialiser les sets complétés si pas encore dans le state
  const completedSets = data?.completedSets || Array(totalSets).fill(false);
  const isFullyCompleted = completedSets.every(Boolean);
  
  const toggleSet = (idx) => {
    const newSets = [...completedSets];
    newSets[idx] = !newSets[idx];
    
    // Si on coche une série, on lance le timer automatiquement si c'est pas la dernière
    if (newSets[idx] && idx < totalSets - 1) {
       onStartTimer(exercise.rest);
    }

    onUpdateData({ ...data, completedSets: newSets });
  };

  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name + " musculation exécution")}`;
  const imageUrl = `https://placehold.co/300x200/f1f5f9/334155?text=${encodeURIComponent(exercise.name.split(" ").slice(0, 2).join(" "))}`;

  return (
    <div className={`rounded-xl shadow-md overflow-hidden transition-all duration-300 border flex flex-col h-full group ${isFullyCompleted ? 'bg-green-50/50 border-green-200 order-last opacity-75' : 'bg-white border-gray-100'}`}>
      
      {/* En-tête simplifié si complété */}
      {isFullyCompleted && (
         <div className="p-2 bg-green-100 text-green-800 text-center font-bold text-xs flex justify-between px-4 items-center">
            <span>Exercice terminé</span>
            <button onClick={() => onUpdateData({ ...data, completedSets: Array(totalSets).fill(false) })} className="text-green-600 hover:text-green-900"><RotateCcw size={14}/></button>
         </div>
      )}

      {/* Zone Image */}
      <div className={`relative bg-gray-200 overflow-hidden ${isFullyCompleted ? 'h-20' : 'h-40'} transition-all duration-500`}>
        <img 
          src={imageUrl} 
          alt={exercise.name} 
          className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-xs font-bold px-2.5 py-1 rounded-md z-10">
          #{index + 1}
        </div>
         <a 
          href={searchUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute bottom-2 right-2 bg-white/90 p-2 rounded-full text-blue-600 hover:scale-110 transition shadow-sm z-10"
        >
          <PlayCircle size={20} />
        </a>
      </div>

      {/* Zone Contenu */}
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
            <h3 className={`font-bold text-lg leading-tight ${isFullyCompleted ? 'text-green-800 line-through decoration-2' : 'text-gray-800'}`}>
                {exercise.name}
            </h3>
        </div>

        {/* Info Grid */}
        <div className="flex items-center gap-2 mb-4 text-sm text-slate-600">
           <span className="bg-slate-100 px-2 py-1 rounded font-mono">{exercise.sets} séries</span>
           <span className="bg-slate-100 px-2 py-1 rounded font-mono">{exercise.reps} reps</span>
           <button 
              onClick={() => onStartTimer(exercise.rest)}
              className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-1 rounded hover:bg-orange-100 font-bold ml-auto"
            >
              <Timer size={14}/> {exercise.rest}s
           </button>
        </div>

        {/* Tracker de Séries (Interactive Dots) */}
        <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Validation des séries</span>
            </div>
            <div className="flex gap-2">
                {Array.from({ length: totalSets }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => toggleSet(i)}
                        className={`
                            h-10 flex-1 rounded-lg border-2 font-bold text-sm transition-all flex items-center justify-center
                            ${completedSets[i] 
                                ? 'bg-green-500 border-green-500 text-white shadow-sm scale-95' 
                                : 'bg-white border-slate-200 text-slate-300 hover:border-blue-400 hover:text-blue-400'}
                        `}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>

        {/* Input Charge & Notes */}
        <div className="mt-auto space-y-2">
             <div className="flex gap-2">
                <div className="relative flex-1">
                    <input 
                        type="number" 
                        placeholder="Poids (kg)" 
                        value={data?.weight || ""}
                        onChange={(e) => onUpdateData({ ...data, weight: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition font-bold text-slate-700"
                    />
                    <Dumbbell size={14} className="absolute right-2 top-3 text-gray-400" />
                </div>
                <button 
                    onClick={() => setShowNotes(!showNotes)}
                    className={`px-3 rounded border border-gray-200 hover:bg-gray-50 transition ${data?.notes ? 'text-blue-500 bg-blue-50 border-blue-200' : 'text-gray-400'}`}
                >
                    <FileText size={18} />
                </button>
             </div>
             
             {showNotes && (
                 <textarea
                    placeholder="Notes (douleur, facilité, réglage machine...)"
                    value={data?.notes || ""}
                    onChange={(e) => onUpdateData({ ...data, notes: e.target.value })}
                    className="w-full text-xs p-2 bg-yellow-50 border border-yellow-200 rounded text-slate-600 focus:outline-none resize-none h-16"
                 />
             )}
        </div>
        
        {/* Tutorial Hint */}
        {!isFullyCompleted && (
            <div className="mt-3 pt-3 border-t border-dashed border-gray-100">
                <p className="text-xs text-slate-500 leading-snug flex gap-2">
                    <Info size={14} className="flex-shrink-0 mt-0.5 text-blue-400" />
                    {exercise.tutorial}
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [activeWeek, setActiveWeek] = useStickyState("A", "workout_active_week");
  const [timerDuration, setTimerDuration] = useState(null);
  const [showWarmUp, setShowWarmUp] = useState(false);
  const [workoutData, setWorkoutData] = useStickyState({}, "workout_data_v1");

  // Calcul de la progression
  const currentExercises = ProgramData.weeks[activeWeek];
  let totalSetsCount = 0;
  let completedSetsCount = 0;

  Object.values(currentExercises).flat().forEach(exo => {
      totalSetsCount += exo.sets; // Total théorique
      const sets = workoutData[`${activeWeek}-${exo.id}`]?.completedSets;
      if (sets) {
          completedSetsCount += sets.filter(Boolean).length;
      }
  });

  const progressPercentage = Math.round((completedSetsCount / totalSetsCount) * 100) || 0;

  // Fonction pour mettre à jour les données d'un exercice spécifique
  const updateExerciseData = (exoId, newData) => {
      setWorkoutData(prev => ({
          ...prev,
          [`${activeWeek}-${exoId}`]: newData
      }));
  };

  const resetWeekData = () => {
    if(window.confirm("Voulez-vous vraiment effacer toutes les données de la semaine " + activeWeek + " ?")) {
        // On ne supprime que les clés de la semaine active
        const newData = { ...workoutData };
        Object.values(currentExercises).flat().forEach(exo => {
            delete newData[`${activeWeek}-${exo.id}`];
        });
        setWorkoutData(newData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-24">
      
      {/* Header Avancé */}
      <header className="bg-slate-900 text-white pt-4 pb-6 sticky top-0 z-30 shadow-lg rounded-b-3xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="font-bold text-xl leading-none mb-1">Programme <span className="text-blue-400">Rehab</span></h1>
              <p className="text-xs text-slate-400 font-medium">Semaine {activeWeek} • {completedSetsCount}/{totalSetsCount} séries</p>
            </div>
            
            <div className="flex bg-slate-800 p-1 rounded-lg">
                {['A', 'B'].map((week) => (
                  <button
                    key={week}
                    onClick={() => setActiveWeek(week)}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                      activeWeek === week ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Semaine {week}
                  </button>
                ))}
            </div>
          </div>

          {/* Barre de progression */}
          <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
               <div 
                 className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-700 ease-out"
                 style={{ width: `${progressPercentage}%` }}
               />
          </div>

          <div className="flex gap-3 justify-between">
             <button 
                onClick={() => setShowWarmUp(true)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-orange-400 border border-slate-700 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition"
             >
                <Activity size={16} /> Échauffement
             </button>
             <button 
                onClick={resetWeekData}
                className="bg-slate-800 hover:bg-red-900/30 text-slate-400 hover:text-red-400 border border-slate-700 p-2 rounded-lg transition"
                title="Réinitialiser la semaine"
             >
                <Trash2 size={16} />
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-8">
          {Object.entries(currentExercises).map(([dayName, exercises]) => (
            <div key={dayName} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="flex items-center gap-3 mb-4 sticky top-40 z-10 bg-gray-50/95 backdrop-blur py-2 border-b border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm">
                      {dayName.match(/Jour (\d)/)[1]}
                  </div>
                  <h2 className="text-lg font-bold text-gray-800 leading-tight">
                    {dayName.split('(')[1].replace(')', '')}
                  </h2>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {exercises.map((exo, idx) => (
                    <ExerciseCard 
                        key={exo.id} 
                        exercise={exo} 
                        index={idx} 
                        onStartTimer={setTimerDuration}
                        data={workoutData[`${activeWeek}-${exo.id}`] || {}}
                        onUpdateData={(newData) => updateExerciseData(exo.id, newData)}
                    />
                  ))}
               </div>
            </div>
          ))}
        </div>
      </main>
      
      {/* Modals & Overlays */}
      {timerDuration && (
        <FloatingTimer targetTime={timerDuration} onClose={() => setTimerDuration(null)} />
      )}
      
      {showWarmUp && (
        <WarmUpModal onClose={() => setShowWarmUp(false)} />
      )}

    </div>
  );
}
