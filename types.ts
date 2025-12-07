export type SceneId = 
  | 'intro'
  | 'scene0' 
  | 'sceneA1' 
  | 'sceneA2' 
  | 'sceneB1' 
  | 'sceneC1' 
  | 'sceneC2' 
  | 'sceneC3' 
  | 'sceneC4' 
  | 'sceneD1' 
  | 'sceneD2' 
  | 'sceneD3' 
  | 'sceneE1' 
  | 'sceneE2' 
  | 'sceneE3' 
  | 'sceneF1' 
  | 'sceneF2'
  | 'endingAtmospheric'
  | 'endingIntelligent'
  | 'endingHumanCiv'
  | 'endingArchaeology';

export type MiniGameType = 'DODGE' | 'COLLECT' | 'EXCAVATE' | 'CONNECT';

export interface Choice {
  text: string;
  nextId: SceneId;
  description?: string; // Additional context like "Drift to a nebula"
  miniGame?: MiniGameType; // Play this game BEFORE transitioning to nextId
}

export interface Scene {
  id: SceneId;
  title: string;
  narration: string;
  npcName?: string;
  npcDialogue?: string;
  npcImage?: string; // Path to image in public folder
  backgroundImage?: string; // Path to image in public folder
  backgroundClass: string; // Tailwind fallback
  choices: Choice[];
  miniGame?: MiniGameType; // Play this game INSIDE the scene (interaction step)
  isEnding?: boolean;
}

export interface GameState {
  currentSceneId: SceneId;
  history: SceneId[];
  miniGameCompleted: boolean;
}