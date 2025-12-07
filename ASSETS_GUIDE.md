# Asset Generation Guide

This game relies on a specific folder structure for images. To make the game look great, you need to create a `public` folder in your project root and add the following subdirectories and files.

## Folder Structure

```
public/
├── images/
│   ├── backgrounds/
│   │   ├── b1.jpg
│   │   ├── b2.jpg
│   │   ├── b3.jpg
│   │   ├── b4.jpg
│   │   ├── b5.jpg
│   │   ├── b6.jpg
│   │   ├── b7.jpg
│   │   ├── b8.jpg
│   │   ├── b9.jpg
│   │   ├── b10.jpg
│   │   ├── b11.jpg
│   │   ├── b12.jpg
│   │   ├── b13.jpg
│   │   ├── b14.jpg
│   │   ├── b15.jpg
│   │   ├── b16.jpg
│   │   ├── b17.jpg
│   │   ├── b18.jpg
│   │   └── b19.jpg
│   └── npcs/
│       ├── npc1.png
│       ├── npc2.png
│       ├── npc3.png
│       ├── npc4.png
│       ├── npc5.png
│       ├── npc6.png
│       ├── npc7.png
│       ├── npc8.png
│       ├── npc9.png
│       ├── npc10.png
│       ├── npc11.png
│       ├── npc12.png
│       ├── npc13.png
│       └── npc14.png
```

## Image Naming Convention

Images use simplified naming:
- **Backgrounds**: `b1.jpg`, `b2.jpg`, `b3.jpg`, etc.
- **NPCs**: `npc1.png`, `npc2.png`, `npc3.png`, etc.

## Image Mapping Reference

### Background Images (b1-b19)

| File | Original Name | Description |
|------|---------------|-------------|
| b1.jpg | space_generic.jpg | Intro scene background |
| b2.jpg | stellar_furnace.jpg | Star core scene |
| b3.jpg | supernova.jpg | Supernova explosion |
| b4.jpg | atmosphere.jpg | Atmosphere scenes |
| b5.jpg | rainy_earth.jpg | Rainy Earth landing |
| b6.jpg | plant_cell.jpg | Plant photosynthesis |
| b7.jpg | animal_internal.jpg | Animal body interior |
| b8.jpg | human_brain.jpg | Human brain scene |
| b9.jpg | neural_network.jpg | Neural network ending |
| b10.jpg | ocean_surface.jpg | Ocean surface |
| b11.jpg | deep_sea.jpg | Deep sea bottom |
| b12.jpg | shells_beach.jpg | Shells on beach |
| b13.jpg | soil_microbes.jpg | Soil microbes |
| b14.jpg | underground_layers.jpg | Underground layers |
| b15.jpg | fossil_fuel.jpg | Fossil fuel |
| b16.jpg | workshop.jpg | Human workshop |
| b17.jpg | museum.jpg | Museum ending |
| b18.jpg | excavation.jpg | Archaeological excavation |
| b19.jpg | excavation_success.jpg | Excavation success ending |

### NPC Images (npc1-npc14)

| File | Original Name | Character |
|------|---------------|-----------|
| npc1.png | hydrogen.png | Hydrogen Atom |
| npc2.png | stardust.png | Stardust |
| npc3.png | wind.png | Wind |
| npc4.png | chloroplast.png | Chloroplast |
| npc5.png | animal_cell.png | Animal Cell |
| npc6.png | brain_cell.png | Brain Cell |
| npc7.png | waves.png | Waves |
| npc8.png | seabed.png | Seabed Layer |
| npc9.png | shell.png | Shell |
| npc10.png | bacteria.png | Bacteria |
| npc11.png | rock_layer.png | Rock Layer |
| npc12.png | oil_barrel.png | Oil Barrel |
| npc13.png | craftsman.png | Craftsman |
| npc14.png | archaeologist.png | Archaeologist |

## AI Image Generation Prompts

You can copy and paste these prompts into Midjourney, DALL-E 3, or Stable Diffusion to generate the assets.

### Backgrounds (Aspect Ratio 16:9)

*   **b1.jpg** (space_generic): "Vast beautiful space nebula background, stardust, cosmic, dark void with colorful stars, cinematic lighting --ar 16:9"
*   **b2.jpg** (stellar_furnace): "Inside the core of a burning star, extreme heat, blinding yellow and orange plasma, nuclear fusion environment, abstract texture --ar 16:9"
*   **b3.jpg** (supernova): "Supernova explosion in space, cosmic fireworks, shockwaves of color, dramatic and chaotic energy, beautiful destruction --ar 16:9"
*   **b4.jpg** (atmosphere): "High altitude view of Earth atmosphere, blue sky fading into space, soft clouds, bright sunlight, peaceful floating --ar 16:9"
*   **b5.jpg** (rainy_earth): "POV falling towards Earth with raindrops, stormy grey and green clouds, wet landscape below, dramatic perspective --ar 16:9"
*   **b6.jpg** (plant_cell): "Microscopic view inside a green plant leaf, chlorophyll structures, biological patterns, bright green organic texture, photosynthesis --ar 16:9"
*   **b7.jpg** (animal_internal): "Abstract biological interior of an animal body, red blood cells, soft tissue, organic warmth, microscopic medical illustration style --ar 16:9"
*   **b8.jpg** (human_brain): "Inside the human brain, synapses firing, neurons connecting, electric blue and pink sparks, complex neural network --ar 16:9"
*   **b9.jpg** (neural_network): "Neural network visualization, interconnected nodes, electric blue and purple sparks, intelligence and consciousness --ar 16:9"
*   **b10.jpg** (ocean_surface): "Beautiful blue ocean surface, sunlight refraction through water, bubbles, underwater view looking up at waves --ar 16:9"
*   **b11.jpg** (deep_sea): "Deep sea bottom, dark blue and black, bioluminescent particles, sedimentary rock floor, mysterious and quiet --ar 16:9"
*   **b12.jpg** (shells_beach): "Seashells on beach, sandy shore, ocean waves, pearlescent shells, natural beauty --ar 16:9"
*   **b13.jpg** (soil_microbes): "Underground soil texture, rich dark earth, roots and microscopic life, macro photography style --ar 16:9"
*   **b14.jpg** (underground_layers): "Underground rock layers, geological strata, compressed earth, deep underground --ar 16:9"
*   **b15.jpg** (fossil_fuel): "Dark underground cavern filled with black viscous oil and coal textures, geological layers, compressed history --ar 16:9"
*   **b16.jpg** (workshop): "Ancient human workshop, primitive tools, soot, fire, crafting table, blurred background --ar 16:9"
*   **b17.jpg** (museum): "Modern museum display case, spotlight on a pedestal, dark room, reflection on glass, high contrast --ar 16:9"
*   **b18.jpg** (excavation): "Archaeological dig site, dirt layers, shovels and brushes, sunlight hitting dust, discovery moment --ar 16:9"
*   **b19.jpg** (excavation_success): "Archaeological discovery, ancient artifact revealed, celebration, historical significance --ar 16:9"

### NPCs (Aspect Ratio 1:1)
*Note: For best results, ask for the subject on a plain background or with a transparent background request (though you may need to remove background manually).*

*   **npc1.png** (hydrogen): "Cute anthropomorphic Hydrogen atom character, simple face, glowing blue, spherical, cartoon style, expressive eyes --ar 1:1"
*   **npc2.png** (stardust): "Magical stardust spirit, glowing particles forming a face, cosmic colors, ethereal and wise character --ar 1:1"
*   **npc3.png** (wind): "Spirit of the wind, swirling white lines forming a face, airy and breezy, light blue and white, cartoon style --ar 1:1"
*   **npc4.png** (chloroplast): "Friendly chloroplast character, green and bean-shaped, factory worker helmet, holding a solar panel, cartoon style --ar 1:1"
*   **npc5.png** (animal_cell): "Bouncy red animal cell character, soft and round, energetic expression, biological cartoon --ar 1:1"
*   **npc6.png** (brain_cell): "Smart neuron character with glasses, electric sparks for hair, looking intelligent, purple and blue glowing --ar 1:1"
*   **npc7.png** (waves): "Water elemental character, made of blue ocean waves, fluid shape, friendly smile, splashing water --ar 1:1"
*   **npc8.png** (seabed): "Wise old rock face embedded in the ocean floor, covered in moss and sediment, sleeping expression --ar 1:1"
*   **npc9.png** (shell): "Fancy spiral seashell character, shiny and pearlescent, proud expression, cartoon style --ar 1:1"
*   **npc10.png** (bacteria): "Funny soil bacteria character, fuzzy and round, looking mischievous but friendly, cartoon style --ar 1:1"
*   **npc11.png** (rock_layer): "Grumpy underground rock layer face, compressed and heavy, stone texture, cartoon style --ar 1:1"
*   **npc12.png** (oil_barrel): "Old rusty oil barrel character, nervous expression, industrial style, cartoon --ar 1:1"
*   **npc13.png** (craftsman): "Ancient human craftsman, historical clothing, holding a tool, wise and skilled look, portrait --ar 1:1"
*   **npc14.png** (archaeologist): "Futuristic archaeologist character, high-tech gear, holding a scanner, excited expression, portrait --ar 1:1"

## Scene Design

The game follows a two-step scene structure:

1. **Narration Step**: Displays the scene's background image and narration text. This is the first view when entering a scene.
2. **Interaction Step**: Uses the same background image, but adds:
   - NPC character image (if the scene has an NPC)
   - NPC dialogue text
   - Player choice buttons

Both steps share the same background image to maintain visual consistency throughout the scene.

## Notes

*   Each scene uses the same background image for both the narration step and the interaction step (NPC dialogue and choices).
*   Background images should be 16:9 aspect ratio for optimal display.
*   NPC images should be 1:1 aspect ratio (square) for best visual consistency.
*   All images should be optimized for web use (compressed but maintaining quality).
