import React, { useEffect, useRef, useState } from 'react';
import { MiniGameType } from '../types';

interface PixelMiniGameProps {
  type: MiniGameType;
  onWin: () => void;
  onLose: () => void;
}

const CANVAS_WIDTH = 560;
const CANVAS_HEIGHT = 420;

const PixelMiniGames: React.FC<PixelMiniGameProps> = ({ type, onWin, onLose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  
  // -- Game State Refs (Mutable) --
  const gameState = useRef<any>({});
  const requestRef = useRef<number>(0);

  // Helper for coordinate mapping
  const getPointerPos = (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;
    if ('touches' in e && e.touches.length > 0) {
       clientX = e.touches[0].clientX;
       clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
       // @ts-ignore
       clientX = e.clientX;
       // @ts-ignore
       clientY = e.clientY;
    } else {
       return { x: 0, y: 0 };
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  useEffect(() => {
    // Reset state on mount
    setGameOver(false);
    setWin(false);

    // Initialize Game Specific State
    if (type === 'DODGE') {
      // "Meteor Path" Game
      const obstacles = [];
      const emojis = ['🪨', '🌑', '☄️', '🪐'];
      const minDistance = 80; // 最小距离，确保不重叠
      const maxAttempts = 1000; // 最大尝试次数
      
      // Generate 10 obstacles without overlap
      for (let i = 0; i < 10; i++) {
        let attempts = 0;
        let valid = false;
        let x = 0, y = 0, size = 0;
        
        while (!valid && attempts < maxAttempts) {
          x = Math.random() * (CANVAS_WIDTH - 150) + 100; // Keep start area clear
          y = Math.random() * (CANVAS_HEIGHT - 60) + 30;
          size = Math.random() * 30 + 30;
          
          // 检查是否与已有障碍物重叠
          valid = true;
          for (const obs of obstacles) {
            const dist = Math.sqrt(Math.pow(x - obs.x, 2) + Math.pow(y - obs.y, 2));
            const minDist = (size / 2) + (obs.size / 2) + minDistance;
            if (dist < minDist) {
              valid = false;
              break;
            }
          }
          attempts++;
        }
        
        if (valid) {
          obstacles.push({
            x,
            y,
            size,
            emoji: emojis[Math.floor(Math.random() * emojis.length)]
          });
        }
      }

      gameState.current = {
        player: { x: 50, y: CANVAS_HEIGHT / 2, r: 15 },
        isDragging: false,
        obstacles,
        trail: [], // To draw the path
        goal: { x: CANVAS_WIDTH - 80, y: 0, w: 80, h: CANVAS_HEIGHT },
        finished: false
      };
    } else if (type === 'COLLECT') {
      gameState.current = {
        playerX: CANVAS_WIDTH / 2,
        playerY: CANVAS_HEIGHT / 2,
        playerSize: 20,
        items: Array.from({ length: 5 }, () => ({
          x: Math.random() * (CANVAS_WIDTH - 40) + 20,
          y: Math.random() * (CANVAS_HEIGHT - 40) + 20,
          active: true
        })),
        score: 0,
        targetScore: 5,
        finished: false
      };
    } else if (type === 'EXCAVATE') {
      const tileSize = 40; // Larger tiles
      const cols = Math.floor(CANVAS_WIDTH / tileSize);
      const rows = Math.floor(CANVAS_HEIGHT / tileSize);
      
      const tiles = [];
      const fossilX = Math.floor(Math.random() * (cols - 2)) + 1;
      const fossilY = Math.floor(Math.random() * (rows - 2)) + 1;
      
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const isFossil = (c === fossilX && r === fossilY) || 
                           (c === fossilX+1 && r === fossilY) ||
                           (c === fossilX && r === fossilY+1) ||
                           (c === fossilX+1 && r === fossilY+1);
          tiles.push({ 
            c, r, 
            x: c * tileSize, 
            y: r * tileSize, 
            w: tileSize, 
            h: tileSize, 
            layer: 3, 
            isFossil 
          });
        }
      }
      gameState.current = { tiles, revealedFossilParts: 0, finished: false };
    } else if (type === 'CONNECT') {
      // Neural Connect Game - Light up all nodes
      const nodes = [];
      const nodeCount = 12;
      const margin = 60;
      
      // Generate non-overlapping random nodes
      for(let i=0; i<nodeCount; i++) {
        let safe = false;
        let x=0, y=0;
        let attempts = 0;
        while(!safe && attempts < 100) {
           x = Math.random() * (CANVAS_WIDTH - 2*margin) + margin;
           y = Math.random() * (CANVAS_HEIGHT - 2*margin) + margin;
           safe = true;
           for(let n of nodes) {
              const dist = Math.sqrt((n.x-x)**2 + (n.y-y)**2);
              if (dist < 80) safe = false; // Min distance
           }
           attempts++;
        }
        nodes.push({ x, y, id: i, active: false, solved: false });
      }

      gameState.current = {
        nodes,
        score: 0,
        targetScore: nodeCount, // Need to light up all nodes
        finished: false,
        errorNode: -1
      };
    }

    // --- Event Listeners ---
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameState.current.keys) gameState.current.keys = {};
      gameState.current.keys[e.key.toLowerCase()] = true;
      gameState.current.keys[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!gameState.current.keys) gameState.current.keys = {};
      gameState.current.keys[e.key.toLowerCase()] = false;
      gameState.current.keys[e.code] = false;
    };
    
    // Mouse/Touch Handlers
    const handleStart = (e: MouseEvent | TouchEvent) => {
      if (gameOver) return;
      const pos = getPointerPos(e);
      
      if (type === 'DODGE') {
        const p = gameState.current.player;
        const dist = Math.sqrt(Math.pow(pos.x - p.x, 2) + Math.pow(pos.y - p.y, 2));
        if (dist < p.r * 4) { // Generous grab radius
          gameState.current.isDragging = true;
        }
      } else if (type === 'CONNECT') {
        const state = gameState.current;

        // Check node clicks - light up any node
        for(let node of state.nodes) {
           const dist = Math.sqrt((node.x - pos.x)**2 + (node.y - pos.y)**2);
           if (dist < 30) {
             if (node.solved) return; // Already clicked

             // Light up the node
             node.solved = true;
             state.score++;
             if (state.score >= state.targetScore) {
                if (!state.finished) {
                   state.finished = true;
                   setWin(true);
                   setGameOver(true);
                   setTimeout(onWin, 1500);
                }
             }
           }
        }
      }
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (gameOver) return;
      const pos = getPointerPos(e);

      if (type === 'DODGE' && gameState.current.isDragging) {
        // Clamp to screen
        const p = gameState.current.player;
        p.x = Math.max(p.r, Math.min(CANVAS_WIDTH - p.r, pos.x));
        p.y = Math.max(p.r, Math.min(CANVAS_HEIGHT - p.r, pos.y));
        
        // Add to trail
        gameState.current.trail.push({x: p.x, y: p.y});
        if (gameState.current.trail.length > 30) gameState.current.trail.shift();

        // Check Goal
        if (p.x > gameState.current.goal.x) {
           if (!gameState.current.finished) {
             gameState.current.finished = true;
             setWin(true);
             setGameOver(true);
             setTimeout(onWin, 1000);
           }
        }
      }
    };

    const handleEnd = () => {
      if (type === 'DODGE') {
        gameState.current.isDragging = false;
      }
    };

    const handleMouseUpExcavate = (e: MouseEvent) => {
      if (type !== 'EXCAVATE' || gameOver) return;
      const pos = getPointerPos(e);
      const tiles = gameState.current.tiles;
      if (!tiles) return;

      for (let t of tiles) {
         if (pos.x >= t.x && pos.x < t.x + t.w && pos.y >= t.y && pos.y < t.y + t.h) {
           if (t.layer > 0) {
             t.layer--;
             if (t.layer === 0 && t.isFossil) {
               gameState.current.revealedFossilParts++;
               if (gameState.current.revealedFossilParts >= 4 && !gameState.current.finished) {
                 gameState.current.finished = true;
                 setWin(true);
                 setGameOver(true);
                 setTimeout(onWin, 1500);
               }
             }
           }
         }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleStart);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchstart', handleStart, {passive: false});
    window.addEventListener('touchmove', handleMove, {passive: false});
    window.addEventListener('touchend', handleEnd);

    if (type === 'EXCAVATE') {
      window.addEventListener('mouseup', handleMouseUpExcavate);
    }

    // Game Loop
    const loop = (time: number) => {
      if (gameOver) return; 
      update(time);
      draw();
      if (!gameOver) {
        requestRef.current = requestAnimationFrame(loop);
      }
    };
    requestRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleStart);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchstart', handleStart);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('mouseup', handleMouseUpExcavate);
      cancelAnimationFrame(requestRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);


  const update = (time: number) => {
    const state = gameState.current;
    if (state.finished) return; // Stop logic if finished

    const keys = state.keys || {};

    if (type === 'DODGE') {
      if (state.isDragging) {
         // Collision detection logic
         const p = state.player;
         for (let obs of state.obstacles) {
            // Simple Circle Collision
            const hitboxR = obs.size / 2 * 0.7; 
            const dist = Math.sqrt(Math.pow(p.x - obs.x, 2) + Math.pow(p.y - obs.y, 2));
            if (dist < p.r + hitboxR) {
               if (!state.finished) {
                 state.finished = true;
                 setGameOver(true);
                 setWin(false);
                 setTimeout(onLose, 1500);
               }
               return;
            }
         }
      }
    } 
    else if (type === 'COLLECT') {
       const speed = 4;
       if (keys['w'] || keys['ArrowUp']) state.playerY -= speed;
       if (keys['s'] || keys['ArrowDown']) state.playerY += speed;
       if (keys['a'] || keys['ArrowLeft']) state.playerX -= speed;
       if (keys['d'] || keys['ArrowRight']) state.playerX += speed;
       
       state.items.forEach((item: any) => {
         if (!item.active) return;
         const dx = state.playerX - item.x;
         const dy = state.playerY - item.y;
         const dist = Math.sqrt(dx*dx + dy*dy);
         if (dist < 30) {
           item.active = false;
           state.score++;
           if (state.score >= state.targetScore) {
             if (!state.finished) {
               state.finished = true;
               setWin(true);
               setGameOver(true);
               setTimeout(onWin, 1500);
             }
           }
         }
       });
    }
    else if (type === 'CONNECT') {
       // No update needed, just click all nodes
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const state = gameState.current;

    if (type === 'DODGE') {
       // Space BG
       ctx.fillStyle = '#110022';
       ctx.fillRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT);
       
       // Goal Zone
       const grad = ctx.createLinearGradient(state.goal.x, 0, state.goal.x + 80, 0);
       grad.addColorStop(0, 'rgba(0, 255, 100, 0.2)');
       grad.addColorStop(1, 'rgba(0, 255, 100, 0.5)');
       ctx.fillStyle = grad;
       ctx.fillRect(state.goal.x, state.goal.y, state.goal.w, state.goal.h);
       ctx.fillStyle = '#fff';
       ctx.font = '30px "VT323"';
       ctx.fillText("EXIT", state.goal.x + 10, CANVAS_HEIGHT/2);

       // Draw Obstacles (Emojis)
       ctx.textAlign = 'center';
       ctx.textBaseline = 'middle';
       state.obstacles.forEach((obs: any) => {
         ctx.font = `${obs.size}px serif`;
         ctx.fillText(obs.emoji, obs.x, obs.y);
       });

       // Draw Trail
       if (state.trail.length > 1) {
         ctx.strokeStyle = 'cyan';
         ctx.lineWidth = 3;
         ctx.beginPath();
         ctx.moveTo(state.trail[0].x, state.trail[0].y);
         for(let i=1; i<state.trail.length; i++) {
           ctx.lineTo(state.trail[i].x, state.trail[i].y);
         }
         ctx.stroke();
       }

       // Draw Player
       const p = state.player;
       ctx.fillStyle = '#00ffff';
       ctx.beginPath();
       ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
       ctx.fill();
       // Glow
       ctx.shadowBlur = 15;
       ctx.shadowColor = 'cyan';
       ctx.stroke();
       ctx.shadowBlur = 0;

       if (!state.isDragging && p.x < 150) {
         ctx.fillStyle = 'white';
         ctx.font = '24px "VT323"';
         ctx.fillText("DRAG ME ->", p.x, p.y - 30);
       }
    }
    else if (type === 'COLLECT') {
       ctx.fillStyle = '#002200';
       ctx.fillRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT);

       state.items.forEach((item: any) => {
         if (item.active) {
           ctx.fillStyle = '#ffff00';
           ctx.fillRect(item.x, item.y, 12, 12);
         }
       });

       ctx.fillStyle = '#00ff00';
       ctx.fillRect(state.playerX, state.playerY, 20, 20);

       ctx.fillStyle = 'white';
       ctx.font = '24px "VT323"';
       ctx.textAlign = 'left';
       ctx.fillText(`ATP: ${state.score}/${state.targetScore}`, 20, 30);
    }
    else if (type === 'EXCAVATE') {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      state.tiles.forEach((t: any) => {
        if (t.isFossil) {
           ctx.fillStyle = '#aaaaaa'; 
           ctx.fillRect(t.x, t.y, t.w, t.h);
           ctx.strokeStyle = '#888';
           ctx.strokeRect(t.x, t.y, t.w, t.h);
        }

        if (t.layer > 0) {
          if (t.layer === 3) ctx.fillStyle = '#5c4033'; 
          else if (t.layer === 2) ctx.fillStyle = '#8b5a2b'; 
          else ctx.fillStyle = '#cd853f'; 
          
          ctx.fillRect(t.x + 1, t.y + 1, t.w - 2, t.h - 2);
        }
      });
      
      ctx.fillStyle = 'white';
      ctx.font = '24px "VT323"';
      ctx.textAlign = 'left';
      ctx.fillText("CLICK TO DIG!", 20, 30);
    }
    else if (type === 'CONNECT') {
       // Neural Memory BG
       ctx.fillStyle = '#050510'; 
       ctx.fillRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT);

       // Draw Connections (Background Mesh)
       ctx.strokeStyle = '#1a1a3a';
       ctx.lineWidth = 2;
       ctx.beginPath();
       for(let i=0; i<state.nodes.length; i++) {
         for(let j=i+1; j<state.nodes.length; j++) {
            const n1 = state.nodes[i];
            const n2 = state.nodes[j];
            const dist = Math.sqrt((n1.x-n2.x)**2 + (n1.y-n2.y)**2);
            if (dist < 150) {
               ctx.moveTo(n1.x, n1.y);
               ctx.lineTo(n2.x, n2.y);
            }
         }
       }
       ctx.stroke();

       // Draw Nodes
       for(let node of state.nodes) {
          const isSolved = node.solved;

          ctx.beginPath();
          ctx.arc(node.x, node.y, 20, 0, Math.PI*2);
          
          if (isSolved) {
             ctx.fillStyle = '#00ff00';
             ctx.shadowColor = 'lime';
             ctx.shadowBlur = 15;
          } 
          else {
             ctx.fillStyle = '#333';
             ctx.shadowBlur = 0;
          }
          
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#555';
          ctx.stroke();
          ctx.shadowBlur = 0;
       }
       
       // UI Text
       ctx.fillStyle = 'white';
       ctx.font = '24px "VT323"';
       ctx.textAlign = 'center';
       ctx.fillText(`LIGHT UP ALL NODES: ${state.score}/${state.targetScore}`, CANVAS_WIDTH/2, 40);
    }

    // Overlay Texts
    if (gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.textAlign = 'center';
      
      if (win) {
         ctx.fillStyle = '#00ff00';
         ctx.font = '64px "VT323"';
         ctx.fillText("SUCCESS!", CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
      } else {
         ctx.fillStyle = '#ff0000';
         ctx.font = '64px "VT323"';
         ctx.fillText("FAILED", CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
         ctx.font = '32px "VT323"';
         ctx.fillStyle = '#aaaaaa';
         ctx.fillText("Try again...", CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 50);
      }
    }
  };

  return (
    <div className="flex flex-col items-center select-none w-full">
       <div className="relative border-4 border-gray-600 rounded-lg overflow-hidden shadow-2xl bg-black w-full max-w-[800px] aspect-[4/3]">
         <canvas 
           ref={canvasRef} 
           width={CANVAS_WIDTH} 
           height={CANVAS_HEIGHT}
           className="block w-full h-full touch-none"
           style={{ imageRendering: 'pixelated', cursor: type === 'DODGE' ? 'grab' : 'crosshair' }}
         />
         {/* Scanline effect */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] pointer-events-none bg-[length:100%_4px,3px_100%] z-10 opacity-60"></div>
       </div>
       <div className="mt-4 p-4 bg-gray-900/80 rounded-lg border border-white/10 w-full text-center">
          <p className="text-yellow-400 font-pixel text-2xl tracking-widest mb-2">MISSION RULES</p>
          <p className="text-white/80 font-pixel text-xl">
            {type === 'DODGE' && "Drag the Blue Atom to the Green Exit! Avoid meteors!"}
            {type === 'COLLECT' && "Use WASD/Arrows to collect energy!"}
            {type === 'EXCAVATE' && "Click squares to reveal the fossil!"}
            {type === 'CONNECT' && "Click all nodes to light them up!"}
          </p>
       </div>
    </div>
  );
};

export default PixelMiniGames;