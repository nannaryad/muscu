// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Calendar, Info, AlertCircle, Activity, CheckCircle, Clock, Search, PlayCircle, Hash, Timer, RotateCcw, Dumbbell, Save, X } from 'lucide-react';

// --- DATA ---
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

// --- COMPONENTS ---

// Chronomètre flottant
const FloatingTimer = ({ targetTime, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(targetTime);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Petite vibration si sur mobile (support limité mais possible)
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const progress = ((targetTime - timeLeft) / targetTime) * 100;

  return (
    <div className="fixed bottom-4 right-4 bg-slate-900 text-white p-4 rounded-xl shadow-2xl z-50 w-64 border border-slate-700 animate-slide-up">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-sm text-slate-300">Repos</span>
        <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={16}/></button>
      </div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-3xl font-mono font-bold text-blue-400">
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setTimeLeft(t => t + 10)} 
            className="bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-xs font-bold"
          >
            +10s
          </button>
          <button 
             onClick={() => setIsActive(!isActive)}
             className={`px-3 py-1 rounded text-xs font-bold ${isActive ? 'bg-yellow-600' : 'bg-green-600'}`}
          >
            {isActive ? 'Pause' : 'Reprendre'}
          </button>
        </div>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-1000 linear" 
          style={{ width: `${100 - progress}%` }}
        />
      </div>
    </div>
  );
};

const WarmUpModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Activity className="text-orange-500"/> Échauffement Épaules
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

const ExerciseCard = ({ exercise, index, onStartTimer }) => {
  const [completed, setCompleted] = useState(false);
  const [weight, setWeight] = useState("");
  
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name + " musculation exécution")}`;
  const imageUrl = `https://placehold.co/300x200/f1f5f9/334155?text=${encodeURIComponent(exercise.name.split(" ").slice(0, 2).join(" "))}`;

  return (
    <div className={`rounded-xl shadow-md overflow-hidden transition-all duration-300 border flex flex-col h-full group ${completed ? 'bg-green-50 border-green-200 opacity-80' : 'bg-white border-gray-100'}`}>
      
      {/* Zone Image */}
      <div className="relative h-40 bg-gray-200 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={exercise.name} 
          className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {e.target.src = 'https://placehold.co/300x200/e2e8f0/64748b?text=Exercice';}}
        />
        <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-xs font-bold px-2.5 py-1 rounded-md">
          #{index + 1}
        </div>
         <a 
          href={searchUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute bottom-2 right-2 bg-white/90 p-2 rounded-full text-blue-600 hover:scale-110 transition shadow-sm"
        >
          <PlayCircle size={20} />
        </a>
      </div>

      {/* Zone Contenu */}
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
            <h3 className={`font-bold text-lg leading-tight ${completed ? 'text-green-800 line-through decoration-2' : 'text-gray-800'}`}>
                {exercise.name}
            </h3>
            <button 
                onClick={() => setCompleted(!completed)}
                className={`p-1 rounded-full border-2 transition-colors ${completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 text-gray-300 hover:border-green-500 hover:text-green-500'}`}
            >
                <CheckCircle size={20} className={completed ? "fill-current" : ""} />
            </button>
        </div>

        {/* Stats Grid Interactif */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-slate-50 p-2 rounded border border-slate-100 text-center">
            <span className="block text-xs uppercase text-gray-400 font-bold">Séries</span>
            <span className="font-bold text-slate-700">{exercise.sets}</span>
          </div>
          <div className="bg-slate-50 p-2 rounded border border-slate-100 text-center">
            <span className="block text-xs uppercase text-gray-400 font-bold">Reps</span>
            <span className="font-bold text-slate-700">{exercise.reps}</span>
          </div>
          <button 
            onClick={() => onStartTimer(exercise.rest)}
            className="bg-orange-50 hover:bg-orange-100 p-2 rounded border border-orange-100 text-center cursor-pointer transition-colors group/timer"
          >
            <span className="block text-xs uppercase text-orange-400 font-bold group-hover/timer:text-orange-600">Repos</span>
            <div className="flex items-center justify-center gap-1 font-bold text-orange-600">
               <Timer size={14} /> {exercise.rest}s
            </div>
          </button>
        </div>

        {/* Input Performance */}
        <div className="flex gap-2 mb-3">
             <div className="relative flex-1">
                <input 
                    type="number" 
                    placeholder="Charge (kg)" 
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition"
                />
                <Dumbbell size={14} className="absolute right-2 top-2 text-gray-400" />
             </div>
        </div>
        
        {/* Tutorial */}
        <div className="bg-blue-50/50 p-2 rounded text-xs text-blue-800 leading-snug flex gap-2">
             <Info size={14} className="flex-shrink-0 mt-0.5 text-blue-400" />
             {exercise.tutorial}
        </div>
      </div>
    </div>
  );
};

const DaySection = ({ title, exercises, onStartTimer }) => (
  <div className="mb-8">
    <div className="flex items-center gap-2 mb-4">
      <h2 className="text-xl font-bold text-gray-800 border-l-4 border-blue-500 pl-3">{title}</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {exercises.map((exo, idx) => (
        <ExerciseCard key={exo.id} exercise={exo} index={idx} onStartTimer={onStartTimer} />
      ))}
    </div>
  </div>
);

export default function App() {
  const [activeWeek, setActiveWeek] = useState("A");
  const [timerDuration, setTimerDuration] = useState(null);
  const [showWarmUp, setShowWarmUp] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      
      {/* Header Compact */}
      <header className="bg-slate-900 text-white p-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="font-bold text-lg leading-tight">Programme <span className="text-blue-400">Conflit</span></h1>
            <p className="text-xs text-slate-400">Semaine {activeWeek}</p>
          </div>
          
          <div className="flex gap-2">
             <button 
                onClick={() => setShowWarmUp(true)}
                className="bg-orange-600 hover:bg-orange-500 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-lg shadow-orange-900/20"
             >
                <Activity size={14} /> <span className="hidden sm:inline">Échauffement</span>
             </button>
             <div className="bg-slate-800 p-1 rounded-lg flex">
              {['A', 'B'].map((week) => (
                <button
                  key={week}
                  onClick={() => setActiveWeek(week)}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    activeWeek === week ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {week}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Intro Alert */}
        <div className="bg-white border border-blue-100 rounded-lg p-3 mb-6 shadow-sm flex gap-3 text-sm">
           <AlertCircle className="text-blue-500 flex-shrink-0" size={20}/>
           <p className="text-slate-600">
             Cliquez sur le temps de repos <span className="font-bold text-orange-500 inline-flex items-center gap-0.5"><Timer size={10}/> 90s</span> pour lancer le chrono. Cochez les cases pour valider.
           </p>
        </div>

        {/* Days Display */}
        <div className="space-y-6">
          {Object.entries(ProgramData.weeks[activeWeek]).map(([dayName, exercises]) => (
            <DaySection 
                key={dayName} 
                title={dayName} 
                exercises={exercises} 
                onStartTimer={setTimerDuration}
            />
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
