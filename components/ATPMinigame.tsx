import React, { useEffect, useRef, useState } from 'react';

interface ATPMinigameProps {
  onWin: () => void;
}

interface Point {
  x: number;
  y: number;
}

const ATPMinigame: React.FC<ATPMinigameProps> = ({ onWin }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  // Game state refs (to avoid closure staleness in loop)
  const playerRef = useRef<Point>({ x: 150, y: 150 });
  const atpsRef = useRef<Point[]>([]);
  const requestRef = useRef<number>(0);
  const keysRef = useRef<{ [key: string]: boolean }>({});

  const TARGET_SCORE = 5;
  const PLAYER_SIZE = 20;
  const ATP_SIZE = 10;
  const SPEED = 3;

  useEffect(() => {
    // Initialize ATPs
    const newAtps = [];
    for (let i = 0; i < TARGET_SCORE; i++) {
      newAtps.push({
        x: Math.random() * 280 + 10,
        y: Math.random() * 280 + 10,
      });
    }
    atpsRef.current = newAtps;

    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const update = () => {
    if (gameOver) return;

    const player = playerRef.current;
    const keys = keysRef.current;
    const canvas = canvasRef.current;

    if (!canvas) return;

    // Movement
    if (keys['w'] || keys['arrowup']) player.y -= SPEED;
    if (keys['s'] || keys['arrowdown']) player.y += SPEED;
    if (keys['a'] || keys['arrowleft']) player.x -= SPEED;
    if (keys['d'] || keys['arrowright']) player.x += SPEED;

    // Boundaries
    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - PLAYER_SIZE) player.x = canvas.width - PLAYER_SIZE;
    if (player.y < 0) player.y = 0;
    if (player.y > canvas.height - PLAYER_SIZE) player.y = canvas.height - PLAYER_SIZE;

    // Collision Detection
    const atps = atpsRef.current;
    for (let i = atps.length - 1; i >= 0; i--) {
      const atp = atps[i];
      const dx = player.x + PLAYER_SIZE / 2 - atp.x;
      const dy = player.y + PLAYER_SIZE / 2 - atp.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < PLAYER_SIZE / 2 + ATP_SIZE / 2) {
        atps.splice(i, 1);
        setScore(prev => {
          const newScore = prev + 1;
          if (newScore >= TARGET_SCORE) {
             setGameOver(true);
             setTimeout(onWin, 1500); // Wait a bit then trigger win
          }
          return newScore;
        });
      }
    }

    draw();
    if (!gameOver) {
      requestRef.current = requestAnimationFrame(update);
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Background
    ctx.fillStyle = 'rgba(0, 50, 0, 0.3)';
    ctx.fillRect(0,0, canvas.width, canvas.height);

    // Draw Player (Carbon)
    ctx.fillStyle = '#3b82f6'; // Blue
    ctx.beginPath();
    ctx.arc(playerRef.current.x + PLAYER_SIZE/2, playerRef.current.y + PLAYER_SIZE/2, PLAYER_SIZE/2, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fff';
    ctx.stroke();
    // Label
    ctx.fillStyle = '#fff';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('C', playerRef.current.x + PLAYER_SIZE/2, playerRef.current.y + PLAYER_SIZE/2 + 3);

    // Draw ATPs
    ctx.fillStyle = '#fbbf24'; // Yellow
    atpsRef.current.forEach(atp => {
      ctx.beginPath();
      ctx.arc(atp.x, atp.y, ATP_SIZE/2, 0, Math.PI * 2);
      ctx.fill();
      // Glow
      ctx.shadowBlur = 10;
      ctx.shadowColor = "yellow";
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    if (gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0,0, canvas.width, canvas.height);
      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('ENERGIZED!', canvas.width/2, canvas.height/2);
    }
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver]); // Re-bind if gameover state changes to stop loop cleanly

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-900/80 rounded-xl backdrop-blur-sm border-2 border-green-400/50 shadow-2xl">
      <h3 className="text-white mb-2 text-lg font-bold">ATP Collector</h3>
      <p className="text-gray-300 text-sm mb-4">Use WASD or Arrows to collect {TARGET_SCORE} ATPs!</p>
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          width={300} 
          height={300} 
          className="bg-black/40 rounded-lg border border-gray-600 shadow-inner cursor-none"
        />
        <div className="absolute top-2 right-2 bg-gray-800/80 px-2 py-1 rounded text-white text-xs font-mono">
          Score: {score}/{TARGET_SCORE}
        </div>
      </div>
      
      {/* Mobile controls for touch devices */}
      <div className="mt-4 grid grid-cols-3 gap-2 md:hidden">
        <div></div>
        <button 
          className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center active:bg-white/40"
          onTouchStart={() => keysRef.current['arrowup'] = true}
          onTouchEnd={() => keysRef.current['arrowup'] = false}
        >⬆️</button>
        <div></div>
        
        <button 
          className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center active:bg-white/40"
          onTouchStart={() => keysRef.current['arrowleft'] = true}
          onTouchEnd={() => keysRef.current['arrowleft'] = false}
        >⬅️</button>
        <button 
          className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center active:bg-white/40"
          onTouchStart={() => keysRef.current['arrowdown'] = true}
          onTouchEnd={() => keysRef.current['arrowdown'] = false}
        >⬇️</button>
        <button 
          className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center active:bg-white/40"
          onTouchStart={() => keysRef.current['arrowright'] = true}
          onTouchEnd={() => keysRef.current['arrowright'] = false}
        >➡️</button>
      </div>
    </div>
  );
};

export default ATPMinigame;