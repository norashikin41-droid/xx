/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Sword, 
  Trophy, 
  User, 
  Hash, 
  ChevronRight, 
  RotateCcw, 
  Award,
  CheckCircle2,
  XCircle,
  Zap,
  Target,
  ArrowRight,
  Volume2,
  VolumeX
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Level, Question, UserData, GameState } from './types';
import { QUESTIONS_LEVEL_1, QUESTIONS_LEVEL_2, QUESTIONS_LEVEL_3 } from './constants';

export default function App() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const [gameState, setGameState] = useState<GameState>({
    currentLevel: Level.LEVEL_1,
    currentQuestionIndex: 0,
    score: 0,
    points: 0,
    baseHealth: 100,
    upgrades: {
      walls: 0,
      turrets: 0,
    },
    history: [],
  });
  const [answerInput, setAnswerInput] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [showLevelIntro, setShowLevelIntro] = useState(false);
  const [isAttacking, setIsAttacking] = useState(false);
  const [isFiring, setIsFiring] = useState(false);

  useEffect(() => {
    if (userData && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Autoplay blocked:", e));
    }
  }, [userData]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const currentQuestions = useMemo(() => {
    switch (gameState.currentLevel) {
      case Level.LEVEL_1: return QUESTIONS_LEVEL_1;
      case Level.LEVEL_2: return QUESTIONS_LEVEL_2;
      case Level.LEVEL_3: return QUESTIONS_LEVEL_3;
      default: return [];
    }
  }, [gameState.currentLevel]);

  const currentQuestion = currentQuestions[gameState.currentQuestionIndex];

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const matricNo = formData.get('matricNo') as string;
    if (name && matricNo) {
      setUserData({ name, matricNo });
      setShowLevelIntro(true);
    }
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion || feedback) return;

    const isCorrect = parseFloat(answerInput) === currentQuestion.answer;
    const newScore = isCorrect ? gameState.score + 1 : gameState.score;
    const newPoints = isCorrect ? gameState.points + 100 : gameState.points;
    
    if (isCorrect) {
      setIsFiring(true);
      setTimeout(() => setIsFiring(false), 1000);
    } else {
      setIsAttacking(true);
      setTimeout(() => setIsAttacking(false), 1000);
    }

    setFeedback({
      isCorrect,
      message: isCorrect 
        ? 'Tahniah! Jawapan anda tepat. Pertahanan diperkukuhkan!' 
        : `Teruskan usaha! Jawapan yang betul ialah ${currentQuestion.answer}${currentQuestion.unit}.`
    });

    setGameState(prev => ({
      ...prev,
      score: newScore,
      points: newPoints,
      baseHealth: isCorrect ? Math.min(100, prev.baseHealth + 5) : Math.max(0, prev.baseHealth - 15 + (prev.upgrades.walls * 2))
    }));
  };

  const nextQuestion = () => {
    setFeedback(null);
    setAnswerInput('');

    if (gameState.currentQuestionIndex < 9) {
      setGameState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    } else {
      // Level complete check
      const levelScore = gameState.score;
      const passed = levelScore >= 8;

      if (passed) {
        if (gameState.currentLevel === Level.LEVEL_3) {
          setGameState(prev => ({
            ...prev,
            currentLevel: Level.COMPLETED,
            history: [...prev.history, { level: prev.currentLevel, correct: levelScore, total: 10 }]
          }));
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
          });
        } else {
          setGameState(prev => ({
            ...prev,
            currentLevel: prev.currentLevel + 1,
            currentQuestionIndex: 0,
            score: 0,
            history: [...prev.history, { level: prev.currentLevel, correct: levelScore, total: 10 }]
          }));
          setShowLevelIntro(true);
        }
      } else {
        // Failed level
        alert(`Anda hanya mendapat ${levelScore}/10. Anda perlu sekurang-kurangnya 8/10 untuk mara. Sila cuba lagi peringkat ini.`);
        setGameState(prev => ({
          ...prev,
          currentQuestionIndex: 0,
          score: 0
        }));
      }
    }
  };

  const buyUpgrade = (type: 'walls' | 'turrets') => {
    const cost = 300;
    if (gameState.points >= cost) {
      setGameState(prev => ({
        ...prev,
        points: prev.points - cost,
        upgrades: {
          ...prev.upgrades,
          [type]: prev.upgrades[type] + 1
        }
      }));
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="scanline" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card max-w-md w-full"
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-accent" />
            <h1 className="text-2xl font-bold uppercase tracking-tighter">Pertahanan Geometri</h1>
          </div>
          <p className="text-sm opacity-70 mb-8 font-mono">
            Selamat datang, Komander. Sila daftar diri anda untuk memulakan misi pertahanan kawasan.
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase mb-1 flex items-center gap-2">
                <User className="w-3 h-3" /> Nama Penuh
              </label>
              <input name="name" required className="input-field" placeholder="Contoh: Ahmad Bin Ali" />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase mb-1 flex items-center gap-2">
                <Hash className="w-3 h-3" /> No. Matrik
              </label>
              <input name="matricNo" required className="input-field" placeholder="Contoh: D20211099999" />
            </div>
            <button type="submit" className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
              Mula Misi <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (showLevelIntro) {
    const levelInfo = {
      [Level.LEVEL_1]: { title: "Peringkat 1: Misi Perimeter", desc: "Pertahankan sempadan luar. Kira perimeter bentuk asas untuk membina pagar elektrik." },
      [Level.LEVEL_2]: { title: "Peringkat 2: Misi Luas & Permukaan", desc: "Kira luas kawasan dan permukaan bongkah untuk mengukuhkan struktur kubu." },
      [Level.LEVEL_3]: { title: "Peringkat 3: Cabaran Strategi", desc: "Selesaikan masalah harian untuk memastikan kelangsungan hidup pangkalan." },
    }[gameState.currentLevel as 1 | 2 | 3];

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="scanline" />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card max-w-lg w-full text-center"
        >
          <div className="inline-block p-4 bg-ink text-bg rounded-full mb-6">
            <Target className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold mb-4 uppercase tracking-tighter">{levelInfo.title}</h2>
          <p className="text-sm font-mono opacity-80 mb-8 leading-relaxed">
            {levelInfo.desc}
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8 text-left">
            <div className="p-3 border border-line/20 bg-ink/5">
              <span className="block text-[10px] uppercase opacity-50 font-mono">Sasaran</span>
              <span className="font-bold">8/10 Betul</span>
            </div>
            <div className="p-3 border border-line/20 bg-ink/5">
              <span className="block text-[10px] uppercase opacity-50 font-mono">Ganjaran</span>
              <span className="font-bold">1000 Mata</span>
            </div>
          </div>
          <button onClick={() => setShowLevelIntro(false)} className="btn-primary w-full">
            Lancarkan Pertahanan
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameState.currentLevel === Level.COMPLETED) {
    const totalCorrect = gameState.history.reduce((acc, h) => acc + h.correct, 0);
    const totalQuestions = gameState.history.reduce((acc, h) => acc + h.total, 0);
    const percentage = Math.round((totalCorrect / totalQuestions) * 100);

    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center">
        <div className="scanline" />
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl w-full bg-white border-8 border-ink p-12 shadow-2xl relative overflow-hidden"
        >
          {/* Certificate Design */}
          <div className="absolute top-0 left-0 w-full h-4 bg-accent" />
          <div className="absolute bottom-0 left-0 w-full h-4 bg-accent" />
          
          <div className="text-center space-y-8">
            <Award className="w-24 h-24 mx-auto text-accent" />
            <div className="space-y-2">
              <h1 className="text-5xl font-bold uppercase tracking-tighter">Sijil Penghargaan</h1>
              <p className="text-xl font-mono italic">Diberikan kepada:</p>
            </div>
            
            <div className="py-4 border-b-2 border-ink inline-block min-w-[300px]">
              <h2 className="text-4xl font-bold">{userData.name}</h2>
            </div>
            
            <p className="text-sm font-mono opacity-70">No. Matrik: {userData.matricNo}</p>
            
            <p className="max-w-md mx-auto leading-relaxed">
              Kerana telah berjaya menamatkan semua misi dalam <span className="font-bold">Pertahanan Geometri</span> dengan markah keseluruhan sebanyak:
            </p>
            
            <div className="text-6xl font-black text-accent">{percentage}%</div>
            
            <div className="pt-12 grid grid-cols-2 gap-12 text-center">
              <div className="border-t border-ink pt-2">
                <p className="font-mono text-xs uppercase">Tarikh</p>
                <p className="font-bold">{new Date().toLocaleDateString('ms-MY')}</p>
              </div>
              <div className="border-t border-ink pt-2">
                <p className="font-mono text-xs uppercase">Sistem</p>
                <p className="font-bold italic">AI Studio Defense Command</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        <button 
          onClick={() => window.location.reload()} 
          className="mt-12 btn-primary flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Main Semula
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="scanline" />
      
      {/* Red Flash Overlay for Damage */}
      <AnimatePresence>
        {isAttacking && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-danger z-[100] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Background Music */}
      <audio 
        ref={audioRef}
        src="https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3" 
        loop 
      />

      {/* Header / HUD */}
      <header className="border-b border-line p-4 bg-white/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Shield className="w-6 h-6 text-accent" />
            <div>
              <h1 className="text-sm font-bold uppercase tracking-tighter leading-none">Pertahanan Geometri</h1>
              <span className="text-[10px] font-mono opacity-50 uppercase">Level {gameState.currentLevel}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-8">
            <button 
              onClick={toggleMute}
              className="p-2 hover:bg-ink/5 rounded-full transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <div className="text-right">
              <span className="block text-[10px] font-mono uppercase opacity-50">Mata</span>
              <span className="font-bold flex items-center gap-1 justify-end">
                <Zap className="w-3 h-3 text-accent fill-accent" /> {gameState.points}
              </span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] font-mono uppercase opacity-50">Kemajuan</span>
              <span className="font-bold">{gameState.currentQuestionIndex + 1}/10</span>
            </div>
            <div className="hidden md:block text-right">
              <span className="block text-[10px] font-mono uppercase opacity-50">Komander</span>
              <span className="font-bold text-xs">{userData.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Defense Visualization */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            animate={isAttacking ? { 
              x: [0, -20, 20, -20, 20, 0],
              y: [0, 10, -10, 10, -10, 0],
              rotate: [0, -1, 1, -1, 1, 0]
            } : {}}
            transition={{ duration: 0.4 }}
            className={`card h-[300px] md:h-[400px] relative overflow-hidden bg-zinc-900 flex items-center justify-center transition-all duration-300 ${isAttacking ? 'ring-8 ring-danger ring-inset' : ''}`}
          >
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-20" style={{ 
              backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', 
              backgroundSize: '20px 20px' 
            }} />
            
            {/* Health Bar Overlay */}
            <div className="absolute top-4 left-4 right-4 z-10">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-mono text-white/70 uppercase">Integriti Pangkalan</span>
                <span className={`text-[10px] font-mono font-bold ${gameState.baseHealth < 30 ? 'text-danger animate-pulse' : 'text-success'}`}>
                  {gameState.baseHealth}%
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden border border-white/20">
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: `${gameState.baseHealth}%` }}
                  className={`h-full transition-colors ${gameState.baseHealth < 30 ? 'bg-danger' : 'bg-success'}`}
                />
              </div>
            </div>

            {/* Base Visualization */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              <motion.div
                animate={isAttacking ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                className="relative z-20"
              >
                <Shield className={`w-24 h-24 transition-colors ${gameState.baseHealth < 30 ? 'text-danger' : 'text-white/20'}`} />
              </motion.div>
              
              {/* Walls Upgrade */}
              {Array.from({ length: gameState.upgrades.walls }).map((_, i) => (
                <motion.div 
                  key={`wall-${i}`}
                  initial={{ opacity: 0, scale: 1.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-[-10px] border-2 border-accent/50 rounded-lg"
                  style={{ margin: `${i * 6}px` }}
                />
              ))}

              {/* Turrets Upgrade */}
              {Array.from({ length: gameState.upgrades.turrets }).map((_, i) => (
                <motion.div 
                  key={`turret-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute"
                  style={{ transform: `rotate(${i * 90}deg) translateY(-90px)` }}
                >
                  <div className="relative">
                    <Sword className="w-6 h-6 text-accent fill-accent" />
                    {isFiring && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: [1, 2], opacity: 0, y: -100 }}
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-12 bg-accent blur-[2px]"
                      />
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Enemy Attack Animation */}
              <AnimatePresence>
                {isAttacking && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, x: 200 }}
                      animate={{ opacity: 1, scale: 1.2, x: 0 }}
                      exit={{ opacity: 0, scale: 2 }}
                      className="absolute z-30 text-danger"
                    >
                      <Zap className="w-16 h-16 fill-danger" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 0 }}
                      animate={{ opacity: 1, y: -100 }}
                      exit={{ opacity: 0 }}
                      className="absolute z-40 text-danger font-black text-4xl font-mono"
                    >
                      -15 HP
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="absolute bottom-4 left-4 font-mono text-[10px] text-white/50 uppercase flex gap-4">
              <span>Tembok: {gameState.upgrades.walls}</span>
              <span>Turret: {gameState.upgrades.turrets}</span>
            </div>
          </motion.div>

          {/* Upgrades Section */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => buyUpgrade('walls')}
              disabled={gameState.points < 300}
              className="card flex flex-col items-center gap-2 hover:bg-white/80 transition-all disabled:opacity-50 group"
            >
              <Shield className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <span className="block font-bold text-xs uppercase">Naik Taraf Tembok</span>
                <span className="text-[10px] font-mono opacity-50">Kos: 300 Mata</span>
              </div>
            </button>
            <button 
              onClick={() => buyUpgrade('turrets')}
              disabled={gameState.points < 300}
              className="card flex flex-col items-center gap-2 hover:bg-white/80 transition-all disabled:opacity-50 group"
            >
              <Sword className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <span className="block font-bold text-xs uppercase">Bina Turret</span>
                <span className="text-[10px] font-mono opacity-50">Kos: 300 Mata</span>
              </div>
            </button>
          </div>
        </div>

        {/* Right: Question Panel */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div 
              key={gameState.currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card h-full flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-mono uppercase bg-ink text-bg px-2 py-1">Soalan {gameState.currentQuestionIndex + 1}</span>
                <span className="text-xs font-bold text-accent">{gameState.score}/10 Betul</span>
              </div>

              <div className="flex-1">
                <p className="text-lg font-medium leading-tight mb-8">
                  {currentQuestion.text}
                </p>
                
                {currentQuestion.hint && (
                  <div className="p-3 bg-accent/10 border-l-4 border-accent mb-6 text-xs italic">
                    {currentQuestion.hint}
                  </div>
                )}

                <form onSubmit={handleAnswerSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase opacity-50 mb-1">Jawapan ({currentQuestion.unit})</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        step="0.01"
                        required
                        value={answerInput}
                        onChange={(e) => setAnswerInput(e.target.value)}
                        disabled={!!feedback}
                        className="input-field text-2xl h-16"
                        placeholder="0.00"
                        autoFocus
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-sm opacity-50">
                        {currentQuestion.unit}
                      </span>
                    </div>
                  </div>

                  {!feedback ? (
                    <button type="submit" className="btn-primary w-full h-12 flex items-center justify-center gap-2">
                      Hantar Jawapan <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 border ${feedback.isCorrect ? 'border-success bg-success/10 text-success' : 'border-danger bg-danger/10 text-danger'}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {feedback.isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                        <span className="font-bold uppercase text-sm">{feedback.isCorrect ? 'Berjaya!' : 'Gagal!'}</span>
                      </div>
                      <p className="text-xs font-mono">{feedback.message}</p>
                      <button 
                        type="button"
                        onClick={nextQuestion}
                        className="mt-4 w-full py-2 bg-current text-white font-bold uppercase text-[10px] tracking-widest hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: feedback.isCorrect ? '#22C55E' : '#EF4444' }}
                      >
                        {gameState.currentQuestionIndex < 9 ? 'Soalan Seterusnya' : 'Tamat Peringkat'}
                      </button>
                    </motion.div>
                  )}
                </form>
              </div>

              <div className="mt-8 pt-6 border-t border-line/10">
                <div className="flex justify-between text-[10px] font-mono uppercase opacity-50 mb-2">
                  <span>Kemajuan Peringkat</span>
                  <span>{Math.round(((gameState.currentQuestionIndex + 1) / 10) * 100)}%</span>
                </div>
                <div className="h-1 bg-line/10 w-full">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((gameState.currentQuestionIndex + 1) / 10) * 100}%` }}
                    className="h-full bg-accent"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      
      {/* Footer Info */}
      <footer className="p-4 border-t border-line/10 text-center">
        <p className="text-[10px] font-mono opacity-30 uppercase tracking-[0.2em]">
          &copy; 2026 Pertahanan Geometri - Misi Pendidikan Matematik
        </p>
      </footer>
    </div>
  );
}
