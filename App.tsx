import React, { useState, useEffect, useRef } from 'react';
import { SCENES } from './constants';
import { SceneId, MiniGameType } from './types';
import PixelMiniGames from './components/PixelMiniGames';

// Inline Icons
const RestartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74-2.74L3 12" /><path d="M3 3v9h9" /></svg>
);

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);


const App: React.FC = () => {
  const [currentSceneId, setCurrentSceneId] = useState<SceneId>('intro');
  const [sceneStep, setSceneStep] = useState<'narration' | 'interaction'>('narration');
  const [history, setHistory] = useState<SceneId[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showCollection, setShowCollection] = useState(false);
  const [unlockedEndings, setUnlockedEndings] = useState<Set<SceneId>>(new Set());
  const [showUnlockNotification, setShowUnlockNotification] = useState(false);
  const [unlockedEndingId, setUnlockedEndingId] = useState<SceneId | null>(null);
  
  // Mini Game State
  const [activeMiniGame, setActiveMiniGame] = useState<MiniGameType | null>(null);
  const [pendingNextScene, setPendingNextScene] = useState<SceneId | null>(null);
  const [miniGameCompleted, setMiniGameCompleted] = useState(false); // For in-scene games like C2
  
  // Ref for scrolling to top on scene change
  const topRef = useRef<HTMLDivElement>(null);

  const currentScene = SCENES[currentSceneId];

  useEffect(() => {
    // Reset state for new scene
    setActiveMiniGame(null);
    setPendingNextScene(null);
    setMiniGameCompleted(false);
    // 如果是结局场景，直接显示narration和选择，不进入interaction步骤，并解锁该结局
    if (currentScene.isEnding) {
      setSceneStep('narration');
      setUnlockedEndings(prev => {
        if (!prev.has(currentSceneId)) {
          // 新解锁的结局，显示通知
          setUnlockedEndingId(currentSceneId);
          setShowUnlockNotification(true);
          setTimeout(() => {
            setShowUnlockNotification(false);
            setUnlockedEndingId(null);
          }, 5000);
          return new Set([...prev, currentSceneId]);
        }
        return prev;
      });
    } else {
      setSceneStep('narration');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSceneId]);

  const handleNextStep = () => {
    setSceneStep('interaction');
  };

  const handleChoice = (nextId: SceneId, miniGame?: MiniGameType) => {
    if (miniGame) {
      // Trigger mini-game before moving
      setPendingNextScene(nextId);
      setActiveMiniGame(miniGame);
    } else {
      // Direct move
      transitionToScene(nextId);
    }
  };

  // Handle in-scene specific button (e.g., C2 "Start Challenge")
  const handleStartInSceneMiniGame = () => {
     if (currentScene.miniGame) {
       setActiveMiniGame(currentScene.miniGame);
       // No pending scene, just stays in scene after win
     }
  };

  const transitionToScene = (nextId: SceneId) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setHistory((prev) => [...prev, currentSceneId]);
      setCurrentSceneId(nextId);
      setIsTransitioning(false);
    }, 500);
  };

  const handleMiniGameWin = () => {
    // Delay slightly to show "Success"
    setTimeout(() => {
      setActiveMiniGame(null);
      if (pendingNextScene) {
        transitionToScene(pendingNextScene);
      } else {
        // Must be an in-scene game (C2)
        setMiniGameCompleted(true);
      }
    }, 500);
  };

  const handleMiniGameLose = () => {
    // Reset to choice view
    setTimeout(() => {
      setActiveMiniGame(null);
      setPendingNextScene(null);
      // We don't change scene, user can try again
    }, 500);
  };


  const hasInteraction = currentScene.choices.length > 0 || currentScene.npcName;

  return (
    <div className={`relative min-h-screen w-full transition-colors duration-1000 ${currentScene.backgroundClass} overflow-x-hidden`} ref={topRef}>
      
      {/* Background Image / Texture */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {currentScene.backgroundImage ? (
          <div className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000" style={{ backgroundImage: `url(${currentScene.backgroundImage})`, opacity: 0.5 }}></div>
        ) : (
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        )}
        <div className="absolute inset-0 bg-black/40"></div> {/* Overlay for readability */}
      </div>

      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 w-full p-6 z-40 flex items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/20">
            <span className="text-2xl">🌟</span>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide drop-shadow-lg leading-none">
              Carbon Atom's Journey
            </h1>
            <p className="text-xs text-white/60 font-mono mt-1 uppercase tracking-wider">
              {currentScene.title}
            </p>
          </div>
        </div>
      </header>


      {/* --- MAIN SCENE CONTENT --- */}
      <main className="relative z-10 min-h-screen flex flex-col justify-center items-center py-24 px-4 md:pr-24 transition-opacity duration-500">
        
        {/* Transition Blackout */}
        <div className={`fixed inset-0 bg-black pointer-events-none transition-opacity duration-700 z-[60] ${isTransitioning ? 'opacity-100' : 'opacity-0'}`} />

        {/* --- MINI GAME OVERLAY --- */}
        {activeMiniGame && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg animate-in zoom-in-95 overflow-auto p-4">
             <div className="p-8 rounded-2xl border border-white/20 bg-gray-900/50 shadow-2xl max-w-5xl w-full mx-auto flex flex-col items-center">
               <h2 className="text-center text-4xl md:text-6xl font-pixel text-yellow-400 mb-8 tracking-widest animate-pulse">
                 {activeMiniGame === 'DODGE' && "⚠ GRAVITY ALERT ⚠"}
                 {activeMiniGame === 'COLLECT' && "⚡ ENERGY LOW ⚡"}
                 {activeMiniGame === 'EXCAVATE' && "⛏ DISCOVERY MODE ⛏"}
                 {activeMiniGame === 'CONNECT' && "⚡ NEURAL SYNC ⚡"}
               </h2>
               <div className="w-full flex justify-center">
                  <PixelMiniGames type={activeMiniGame} onWin={handleMiniGameWin} onLose={handleMiniGameLose} />
               </div>
             </div>
          </div>
        )}

        {/* Unlock Notification */}
        {showUnlockNotification && unlockedEndingId && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-500">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-full shadow-2xl border-4 border-white/30 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎉</span>
                <div>
                  <p className="text-xl font-bold">New Ending Unlocked!</p>
                  <p className="text-sm opacity-90">{SCENES[unlockedEndingId]?.title}</p>
                </div>
                <button
                  onClick={() => {
                    setShowUnlockNotification(false);
                    setUnlockedEndingId(null);
                    setShowCollection(true);
                  }}
                  className="ml-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full transition-all"
                >
                  View Collection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Ending Collection Interface */}
        {showCollection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg overflow-auto p-4">
            <div className="max-w-7xl w-full mx-auto relative min-h-full flex flex-col">
              <div className="mb-8">
                <h2 className="text-4xl md:text-6xl font-pixel text-yellow-400 tracking-widest">Carbon Footprint Collection</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.values(SCENES)
                  .filter(scene => scene.isEnding)
                  .map((ending) => {
                    const isUnlocked = unlockedEndings.has(ending.id);
                    return (
                      <div
                        key={ending.id}
                        className={`relative group cursor-pointer transition-all duration-300 ${
                          isUnlocked ? 'hover:scale-105' : 'opacity-50'
                        }`}
                      >
                        {/* 扑克牌样式卡片 */}
                        <div className="relative h-96 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl bg-black/40 backdrop-blur-md">
                          {/* 背景图 */}
                          {ending.backgroundImage && (
                            <div 
                              className="absolute inset-0 bg-cover bg-center opacity-60"
                              style={{ backgroundImage: `url(${ending.backgroundImage})` }}
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/80" />
                          
                          {/* NPC卡片图（如果有） */}
                          {ending.npcImage && isUnlocked && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-4 border-white/30 shadow-xl overflow-hidden bg-black/30">
                              <img 
                                src={ending.npcImage} 
                                alt={ending.npcName || ''}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          
                          {/* 标题和描述 */}
                          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <h3 className="text-2xl font-bold mb-2">{ending.title}</h3>
                            <p className="text-sm opacity-80 line-clamp-2">{ending.narration}</p>
                          </div>
                          
                          {/* Unlock Status */}
                          {isUnlocked ? (
                            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                              Unlocked
                            </div>
                          ) : (
                            <div className="absolute top-4 right-4 bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                              Locked
                            </div>
                          )}
                          
                          {/* 悬浮效果 */}
                          <div className="absolute inset-0 border-4 border-transparent group-hover:border-yellow-400/50 transition-all duration-300 rounded-2xl" />
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setShowCollection(false)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/30 hover:scale-105 flex items-center gap-2"
                >
                  <ArrowIcon />
                  <span>Back</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: NARRATION VIEW */}
        {sceneStep === 'narration' && !showCollection && (
           <div className="max-w-3xl w-full text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
              {currentSceneId === 'intro' ? (
                // 简化主页面
                <div className="bg-black/40 p-8 md:p-12 rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl">
                  <p className="text-2xl md:text-4xl text-white font-serif font-light leading-relaxed drop-shadow-md mb-8">
                    {currentScene.narration}
                  </p>
                  <div className="flex flex-col gap-4 items-center">
                    <button
                      onClick={() => handleChoice('scene0')}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-full transition-all border border-white/30 hover:scale-105 shadow-lg text-lg font-bold"
                    >
                      <span>Start Journey</span>
                      <ArrowIcon />
                    </button>
                    <button
                      onClick={() => setShowCollection(true)}
                      className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full transition-all border border-white/30 hover:scale-105 shadow-lg"
                    >
                      <span className="text-xl">📖</span>
                      <span>Ending Collection</span>
                    </button>
                  </div>
                </div>
              ) : (
                // 其他场景保持原样
                <div className="bg-black/40 p-8 md:p-12 rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl">
                  <p className="text-2xl md:text-4xl text-white font-serif font-light leading-relaxed drop-shadow-md mb-8">
                    {currentScene.narration}
                  </p>
                  {hasInteraction && !currentScene.isEnding ? (
                    <button 
                      onClick={handleNextStep}
                      className="inline-flex items-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/30 hover:scale-105"
                    >
                      <span>Continue Journey</span>
                      <ArrowIcon />
                    </button>
                  ) : (
                    <div className="mt-8">
                       {currentScene.choices.map((choice, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleChoice(choice.nextId, choice.miniGame)}
                            className="px-6 py-2 bg-rose-600 rounded-lg text-white font-bold hover:bg-rose-500 transition-colors"
                          >
                            {choice.text}
                          </button>
                       ))}
                    </div>
                  )}
                </div>
              )}
           </div>
        )}

        {/* STEP 2: INTERACTION VIEW */}
        {sceneStep === 'interaction' && !activeMiniGame && !currentScene.isEnding && !showCollection && (
          <div className="w-full max-w-7xl flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-16 mt-4 md:mt-16 animate-in fade-in zoom-in-95 duration-500">
            
            {/* LEFT: NPC */}
            {currentScene.npcName && (
              <div className="flex-shrink-0 flex flex-col items-center md:sticky md:top-32">
                <div className="relative group">
                    {/* Glow Effect */}
                    <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-400 to-purple-600 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition duration-700 animate-pulse"></div>
                    
                    {/* Image */}
                    <div className="relative overflow-hidden rounded-full w-64 h-64 md:w-96 md:h-96 border-4 border-white/20 shadow-2xl bg-black/30">
                      {currentScene.npcImage ? (
                        <img 
                        src={currentScene.npcImage} 
                        alt={currentScene.npcName} 
                        className="w-full h-full object-cover transform transition-transform duration-[10s] hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).parentElement!.innerText = 'No Image';
                        }}
                      />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">✨</div>
                      )}
                    </div>

                    {/* Name Tag */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-1/2">
                      <div className="bg-black/60 backdrop-blur-md border border-white/20 text-white px-6 py-2 rounded-full font-bold text-lg shadow-xl whitespace-nowrap">
                        {currentScene.npcName}
                      </div>
                    </div>
                </div>
              </div>
            )}

            {/* RIGHT: DIALOGUE & CHOICES */}
            <div className="flex-1 flex flex-col space-y-8 w-full max-w-2xl">
              
              {/* Dialogue Bubble */}
              {currentScene.npcDialogue && (
                <div className="relative">
                  <div className="absolute -left-3 top-6 w-6 h-6 bg-white rotate-45 transform origin-center hidden md:block"></div>
                  <div className="relative bg-white text-gray-900 p-6 md:p-8 rounded-2xl shadow-xl transform transition-transform hover:-translate-y-1">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                      {currentScene.npcName} says:
                    </h3>
                    <p className="text-xl md:text-2xl font-medium font-serif italic leading-relaxed">
                      "{currentScene.npcDialogue}"
                    </p>
                  </div>
                </div>
              )}

              {/* Choices / In-Scene Action */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl">
                
                {currentScene.miniGame && !miniGameCompleted ? (
                    <div className="text-center py-4">
                      <h3 className="text-white text-xl font-bold mb-4 font-pixel tracking-wider text-yellow-300">MINI-GAME REQUIRED!</h3>
                      <button
                        onClick={handleStartInSceneMiniGame}
                        className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg bg-gradient-to-b from-gray-700 to-gray-900 border-2 border-white/50 hover:border-yellow-400 transition-all duration-300 shadow-xl transform hover:scale-105"
                      >
                        <span className="animate-bounce">🎮</span>
                        <span className="text-white font-pixel text-xl tracking-widest">START MISSION</span>
                      </button>
                    </div>
                ) : (
                  <div className="space-y-4">
                      <h3 className="text-white/70 text-sm uppercase font-bold tracking-widest mb-4 border-b border-white/10 pb-2">
                        What will you do?
                      </h3>
                      
                      <div className="grid grid-cols-1 gap-4">
                        {currentScene.choices.map((choice, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleChoice(choice.nextId, choice.miniGame)}
                            className={`
                              relative overflow-hidden w-full text-left p-5 rounded-xl transition-all duration-300 
                              border border-white/10 group
                              ${choice.text.includes('Reincarnate') || choice.text.includes('Try Again')
                                ? 'bg-rose-900/60 hover:bg-rose-800/80 border-rose-500/30' 
                                : 'bg-white/5 hover:bg-white/20 hover:border-white/30'
                              }
                            `}
                          >
                            <div className="relative z-10 flex items-center justify-between">
                              <div>
                                <span className="text-white font-bold text-lg md:text-xl block">{choice.text}</span>
                                {choice.description && (
                                  <span className="text-gray-300 text-sm mt-1 block group-hover:text-white transition-colors">
                                    → {choice.description}
                                  </span>
                                )}
                              </div>
                              <div className="text-white/50 group-hover:text-white group-hover:translate-x-2 transition-all transform flex items-center gap-2">
                                {choice.miniGame && <span className="text-yellow-400 text-xs font-pixel border border-yellow-400 px-1 rounded">GAME</span>}
                                {choice.text.includes('Reincarnate') ? <RestartIcon /> : <ArrowIcon />}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;