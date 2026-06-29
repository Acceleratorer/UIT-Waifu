# Task: Avatar Pipeline V1

You are working inside the Acceleratorer/UIT-Waifu repository.

## Goal

Create the first Blender-generated 3D avatar pipeline for the existing UIT Waifu app.

## Current app context

- The chat UI already uses `components/avatar/model-stage.tsx`.
- `ChatWindow` already passes `modelUrl="/models/chisa/chisa.glb"`.
- Do not rewrite the chat UI.
- Do not replace the current fallback image behavior.

## Tasks

1. Add `tools/blender/create_chisa_placeholder.py`.
2. The script must use Blender Python `bpy` to create a small low-poly/chibi 3D mascot named Chisa.
3. The model style should be original: cute, school/AI companion vibe, UIT blue + pink accents, not copied from any existing character.
4. Export GLB to `public/models/chisa/chisa.glb`.
5. Save the source blend to `assets/blender/chisa/chisa_placeholder.blend`.
6. Render a preview PNG to `public/models/chisa/chisa-preview.png`.
7. Add this package script:

```json
"avatar:build": "blender --background --python tools/blender/create_chisa_placeholder.py"