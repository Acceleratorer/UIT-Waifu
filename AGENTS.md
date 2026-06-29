# UIT-Waifu Agent Rules

## Project

UIT-Waifu is a Next.js + TypeScript AI companion web app.

The product direction is:
- Useful first.
- Cute second.
- Scalable later.

## Current avatar architecture

- The 3D avatar is loaded by `components/avatar/model-stage.tsx`.
- The chat UI already passes the default model path:
  `public/models/chisa/chisa.glb`.
- Do not rewrite the chat UI unless explicitly requested.
- Do not remove or replace the current fallback image behavior.

## Avatar pipeline

Use this structure:

- Blender automation scripts:
  `tools/blender/`

- Blender source files:
  `assets/blender/chisa/`

- Browser-ready avatar files:
  `public/models/chisa/`

Expected primary output:

```txt
public/models/chisa/chisa.glb 
```

Expected optional outputs:
```
assets/blender/chisa/chisa_placeholder.blend
public/models/chisa/chisa-preview.png
```


## Blender constraints
- Use Blender Python through bpy.
- Prefer deterministic procedural generation over manual GUI steps.
- Keep generated GLB files small for web loading.
- Prefer simple geometry, simple materials, and low-poly/chibi style for early MVP.
-Do not copy copyrighted character designs or private reference assets.
 -Do not add absolute local paths.
- Do not add secrets.
- Web app constraints
- This app uses Next.js + React + TypeScript.
- Do not add new production dependencies unless necessary.
- Keep ModelStage compatible with GLB assets loaded through Three.js.
- Preserve graceful fallback behavior when the model fails to load.
- Validation

## After avatar-related changes, run when available:
After avatar-related changes, run when available:
```
npm run avatar:build
npm run typecheck
npm test
npm run build
```

If Blender is not installed, do not fake success. Report that npm run avatar:build could not be executed and continue with TypeScript/build validation when possible.

## Reporting

After work, summarize:

Changed files.
Generated files.
Commands run.
Commands that failed.
Any manual follow-up needed.

