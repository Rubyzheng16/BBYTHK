import { Scene } from './types';

// Fallback gradients
const BG_SPACE_HOT = "bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500";
const BG_SPACE_EXPLOSION = "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900 via-indigo-900 to-black";
const BG_SKY = "bg-gradient-to-b from-sky-300 to-blue-100";
const BG_EARTH_RAIN = "bg-gradient-to-b from-gray-400 to-green-800";
const BG_PLANT = "bg-gradient-to-br from-green-400 to-emerald-700";
const BG_ANIMAL = "bg-gradient-to-r from-rose-400 to-red-500";
const BG_HUMAN_BODY = "bg-gradient-to-br from-pink-300 to-rose-400";
const BG_OCEAN_SURFACE = "bg-gradient-to-b from-cyan-400 to-blue-600";
const BG_DEEP_SEA = "bg-gradient-to-b from-blue-800 to-slate-900";
const BG_SOIL = "bg-gradient-to-b from-stone-500 to-stone-800";
const BG_UNDERGROUND = "bg-gradient-to-b from-stone-800 to-black";
const BG_FOSSIL_FUEL = "bg-gradient-to-br from-slate-700 to-black";
const BG_HUMAN_TOOLS = "bg-gradient-to-tr from-slate-200 to-gray-500";

export const SCENES: Record<string, Scene> = {
  intro: {
    id: 'intro',
    title: "Start Journey",
    narration: "Welcome to Carbon Atom's Fantastic Journey! You are about to experience the life cycle of a fundamental building block of the universe.",
    backgroundClass: "bg-black",
    backgroundImage: "/images/backgrounds/b1.jpeg",
    choices: [
      { text: "Start Adventure", nextId: 'scene0' }
    ]
  },
  scene0: {
    id: 'scene0',
    title: "Scene 0: Stellar Furnace",
    narration: "You’re at the core of a star, squeezed in billions of degrees of heat.",
    npcName: "Neighboring Hydrogen Atom",
    npcDialogue: "Bro, if you don’t run, you’ll get squished into a nuclear byproduct!",
    npcImage: "/images/npcs/npc1.jpeg",
    backgroundImage: "/images/backgrounds/b2.jpeg",
    backgroundClass: BG_SPACE_HOT,
    choices: [
      { text: "Run!", nextId: 'sceneA1', miniGame: 'DODGE' },
      { text: "Stay!", nextId: 'sceneA2' }
    ]
  },
  sceneA2: {
    id: 'sceneA2',
    title: "Merged Forever",
    narration: "You decided to stay. The pressure was too great. You fused into a heavier element and eventually the star collapsed.",
    backgroundClass: "bg-black",
    backgroundImage: "/images/backgrounds/b2.jpeg",
    choices: [
      { text: "Try Again", nextId: 'scene0' }
    ],
    isEnding: true
  },
  sceneA1: {
    id: 'sceneA1',
    title: "Scene A1: Supernova Explosion!",
    narration: "A terrifying burst of energy throws you out of the star. Stardust scatters like cosmic fireworks.",
    npcName: "Stardust",
    npcDialogue: "Welcome to the freelance life of the cosmos!",
    npcImage: "/images/npcs/npc2.jpeg",
    backgroundImage: "/images/backgrounds/b3.jpeg",
    backgroundClass: BG_SPACE_EXPLOSION,
    choices: [
      { text: "Drift to a nebula", nextId: 'sceneB1' },
      { text: "Drift to Earth", nextId: 'sceneC1' }
    ]
  },
  sceneB1: {
    id: 'sceneB1',
    title: "Scene B1: First Breath of Atmosphere",
    narration: "You become CO₂, floating joyfully.",
    npcName: "Wind",
    npcDialogue: "Follow me! I’ll take you on a globe-trotting adventure!",
    npcImage: "/images/npcs/npc3.jpeg",
    backgroundImage: "/images/backgrounds/b4.jpeg",
    backgroundClass: BG_SKY,
    choices: [
      { text: "Absorbed by plants", nextId: 'sceneC2' },
      { text: "Absorbed by oceans", nextId: 'sceneD1' },
      { text: "Keep floating", nextId: 'endingAtmospheric' }
    ]
  },
  endingAtmospheric: {
    id: 'endingAtmospheric',
    title: "Atmospheric Roaming Ending",
    narration: "You spend eons floating in the upper atmosphere, watching the world turn below you.",
    backgroundClass: BG_SKY,
    backgroundImage: "/images/backgrounds/b4.jpeg",
    choices: [{ text: "Reincarnate", nextId: 'intro' }],
    isEnding: true
  },
  sceneC1: {
    id: 'sceneC1',
    title: "Scene C1: Landing on Earth",
    narration: "You fall with raindrops onto Earth.",
    backgroundClass: BG_EARTH_RAIN,
    backgroundImage: "/images/backgrounds/b5.jpeg",
    choices: [
      { text: "Seep into the soil (Start Over at Plants)", nextId: 'sceneC2' } 
    ]
  },
  sceneC2: {
    id: 'sceneC2',
    title: "Scene C2: Photosynthesis Snag",
    narration: "A plant absorbs you, turning you into sweet glucose.",
    npcName: "Chloroplast",
    npcDialogue: "Welcome to the solar-powered factory! Want some ATP?",
    npcImage: "/images/npcs/npc4.png",
    backgroundImage: "/images/backgrounds/b6.png",
    backgroundClass: BG_PLANT,
    miniGame: 'COLLECT',
    choices: [
      { text: "Eaten by animals", nextId: 'sceneC3' },
      { text: "Fallen leaves decompose into soil", nextId: 'sceneE1' },
      { text: "Humans cut the plant", nextId: 'sceneF1' }
    ]
  },
  sceneC3: {
    id: 'sceneC3',
    title: "Scene C3: Inside an Animal",
    narration: "You enter an animal’s body and get metabolized.",
    npcName: "Cell",
    npcDialogue: "You’re part of the energy now!",
    npcImage: "/images/npcs/npc5.jpeg",
    backgroundImage: "/images/backgrounds/b7.png",
    backgroundClass: BG_ANIMAL,
    choices: [
      { text: "Animal breathes", nextId: 'sceneB1', description: "Back to atmosphere" },
      { text: "Animal dies", nextId: 'sceneE1', description: "To soil" },
      { text: "Humans eat the animal", nextId: 'sceneC4' }
    ]
  },
  sceneC4: {
    id: 'sceneC4',
    title: "Scene C4: Inside a Human Body",
    narration: "You are absorbed into the bloodstream.",
    npcName: "Brain Cell",
    npcDialogue: "Hey, wanna become me? We do all the thinking.",
    npcImage: "/images/npcs/npc7.jpeg",
    backgroundImage: "/images/backgrounds/b8.png",
    backgroundClass: BG_HUMAN_BODY,
    choices: [
      { text: "Become a neuron carbon", nextId: 'endingIntelligent', miniGame: 'CONNECT' },
      { text: "Exhaled", nextId: 'sceneB1', description: "Atmosphere" },
      { text: "Human dies", nextId: 'sceneE1', description: "To soil" }
    ]
  },
  endingIntelligent: {
    id: 'endingIntelligent',
    title: "Intelligent Life Ending",
    narration: "You became part of a complex thought, an idea that changed the world. You are the spark of intelligence.",
    backgroundClass: "bg-purple-600",
    backgroundImage: "/images/backgrounds/b9.jpeg",
    choices: [{ text: "Reincarnate", nextId: 'intro' }],
    isEnding: true
  },
  sceneD1: {
    id: 'sceneD1',
    title: "Scene D1: Ocean Welcome",
    narration: "You enter seawater, becoming bicarbonate.",
    npcName: "Waves",
    npcDialogue: "Hi there~ Want a plankton tour or a deep-sea spa?",
    npcImage: "/images/npcs/npc8.jpeg",
    backgroundImage: "/images/backgrounds/b9.jpeg",
    backgroundClass: BG_OCEAN_SURFACE,
    choices: [
      { text: "Into plankton", nextId: 'sceneC2', description: "Back to C2" },
      { text: "Sink to deep sea", nextId: 'sceneD2' },
      { text: "Into a shell", nextId: 'sceneD3' }
    ]
  },
  sceneD2: {
    id: 'sceneD2',
    title: "Scene D2: Deep-Sea Sedimentary Nap",
    narration: "You become sedimentary rock. Hundreds of thousands of years pass.",
    npcName: "Seabed Layer",
    npcDialogue: "Sleep, child. Wait for tectonics to wake you.",
    npcImage: "/images/npcs/npc9.jpeg",
    backgroundImage: "/images/backgrounds/b10.jpeg",
    backgroundClass: BG_DEEP_SEA,
    choices: [
      { text: "Volcanic eruption", nextId: 'sceneB1', description: "Atmosphere" },
      { text: "Uplift by plate movement", nextId: 'sceneF1', description: "Human material" }
    ]
  },
  sceneD3: {
    id: 'sceneD3',
    title: "Scene D3: Become a Shell",
    narration: "You become smooth and hard.",
    npcName: "Tiny Spiral",
    npcDialogue: "We're the jewels of the ocean!",
    npcImage: "/images/npcs/npc10.jpeg",
    backgroundImage: "/images/backgrounds/b10.jpeg",
    backgroundClass: BG_OCEAN_SURFACE,
    choices: [
      { text: "Broken by waves", nextId: 'sceneD1', description: "Back to Ocean" },
      { text: "Become a fossil", nextId: 'sceneF2' }
    ]
  },
  sceneE1: {
    id: 'sceneE1',
    title: "Scene E1: Welcomed by Soil Microbes",
    narration: "Microbes consume you.",
    npcName: "Bacteria",
    npcDialogue: "Don't worry, I'll send you back to the air.",
    npcImage: "/images/npcs/npc11.jpeg",
    backgroundImage: "/images/backgrounds/b11.jpeg",
    backgroundClass: BG_SOIL,
    choices: [
      { text: "Microbes respire", nextId: 'sceneB1', description: "Atmosphere" },
      { text: "Buried deep", nextId: 'sceneE2' },
      { text: "Become fossil fuel", nextId: 'sceneE3' }
    ]
  },
  sceneE2: {
    id: 'sceneE2',
    title: "Scene E2: Underground Slumber",
    narration: "You are tightly pressed in the earth.",
    npcName: "Rock Layer",
    npcDialogue: "Few million years here isn't too much, right?",
    npcImage: "/images/npcs/npc12.jpeg",
    backgroundImage: "/images/backgrounds/b12.png",
    backgroundClass: BG_UNDERGROUND,
    choices: [
      { text: "Plate movement", nextId: 'sceneF1' },
      { text: "Volcanic eruption", nextId: 'sceneB1', description: "Atmosphere" }
    ]
  },
  sceneE3: {
    id: 'sceneE3',
    title: "Scene E3: Fossil Fuel Era",
    narration: "You become oil, coal, or natural gas.",
    npcName: "Oil Barrel",
    npcDialogue: "Buddy, you're about to be burned.",
    npcImage: "/images/npcs/npc13.jpeg",
    backgroundImage: "/images/backgrounds/b12.png",
    backgroundClass: BG_FOSSIL_FUEL,
    choices: [
      { text: "Burned by humans", nextId: 'sceneB1', description: "Back to atmosphere" }
    ]
  },
  sceneF1: {
    id: 'sceneF1',
    title: "Scene F1: Birth of Human Tools",
    narration: "You become something: Graphite, Black Pottery, Steel, or Tech Material.",
    npcName: "Craftsman",
    npcDialogue: "You'll witness human history!",
    npcImage: "/images/npcs/npc14.jpeg",
    backgroundImage: "/images/backgrounds/b13.jpeg",
    backgroundClass: BG_HUMAN_TOOLS,
    choices: [
      { text: "Buried by war", nextId: 'sceneF2' },
      { text: "Museum artifact", nextId: 'endingHumanCiv', description: "Civilization ending" },
      { text: "Old and discarded", nextId: 'sceneE1', description: "Soil" }
    ]
  },
  endingHumanCiv: {
    id: 'endingHumanCiv',
    title: "Human Civilization Ending",
    narration: "You sit behind glass, admired by thousands of generations. You are history itself.",
    backgroundClass: "bg-gray-800",
    backgroundImage: "/images/backgrounds/b14.jpeg",
    choices: [{ text: "Reincarnate", nextId: 'intro' }],
    isEnding: true
  },
  sceneF2: {
    id: 'sceneF2',
    title: "Scene F2: Buried in History",
    narration: "You're covered by soil and rocks, sleeping for a century.",
    npcName: "Future Archaeologist",
    npcDialogue: "I think there's something down here…",
    npcImage: "/images/npcs/npc15.jpeg",
    backgroundImage: "/images/backgrounds/b15.jpeg",
    backgroundClass: BG_SOIL,
    choices: [
      { text: "Excavated", nextId: 'endingArchaeology', description: "Revival ending", miniGame: 'EXCAVATE' },
      { text: "Keep buried", nextId: 'sceneE2' }
    ]
  },
  endingArchaeology: {
    id: 'endingArchaeology',
    title: "Archaeological Revival Ending",
    narration: "You are discovered and celebrated, teaching the future about the past.",
    backgroundClass: "bg-yellow-700",
    backgroundImage: "/images/backgrounds/b15.jpeg",
    choices: [{ text: "Reincarnate", nextId: 'intro' }],
    isEnding: true
  }
};