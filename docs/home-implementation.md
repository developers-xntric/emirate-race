# Homepage implementation review

Source: Figma file ZlD4yaJL1iXrujejNPertE, frame 71:3096 (1920 × 8471).

## Existing project
- Next.js 16.3.4 App Router, React 19.2.8, TypeScript and Tailwind CSS 4.
- The initial homepage contained a Coming Soon heading; no existing section components.
- Existing local League Spartan fonts and the supplied hero/About videos were retained.
- Installed Next.js layout, Server/Client Component and Image guides were consulted.

## Implementation
- Separate section components in src/component, composed by src/app/page.tsx.
- All homepage copy, image assignments and navigation destinations live in src/data/home-data/index.ts.
- All downloaded Figma assets are in public/home. scripts/figma-assets.json records the original node and export URL for every download.
- Video posters were extracted from the supplied videos, which Figma exposed as video rectangles without downloadable video URLs.
- Tailwind handles all styling. Shared body typography uses League Spartan for paragraphs and headings.
- Colors sampled from design context: #0b2d4d, #072f4f, #bb0054, #706cb5, #418fcc, #f8f8f8, white and black; overlays retain the specified opacity.
- Content containers consistently use w-[90%] 2xl:max-w-[1440px]. This user-requested maximum is narrower than the Figma frame's 1590px body content and wider hero content, so desktop typography and spacing are adapted to that constraint.
- Mobile layouts adapt the supplied desktop frame: collapsible navigation, stacked sections, two-column Rahhal traits and calendar cards, and stacked FAQs.
- Image crops preserve their section assignments, including the separate prize photo, race-distance photos, FAQ scenery/mascot layers and medal/CTA patterns.
- Calendar SVGs retain their individual intrinsic aspect ratios; raster image containers reserve space to avoid layout shifts.
- Videos pause outside the viewport and respect reduced-motion preference; manual playback controls remain available.

## Verification
- npm run lint: passed.
- npm run build: passed; homepage statically prerendered.
- Chromium at 320, 390, 768, 1024, 1440 and 1920 pixels: no horizontal overflow or broken images.
- Computed font at every tested size: League Spartan.
- Mobile menu opening and closing and FAQ expansion: passed.
- No browser runtime errors observed.
- Desktop and mobile screenshots and machine-readable checks are in artifacts/home.

## Intentionally pending
As requested, registration buttons have no destination, social links are unset, and FAQ answers are empty. The Figma file provides no legal-page destinations; footer legal labels remain text.
The family-run description and Al-t Al-Hilo village spelling are transcribed as supplied by Figma, including apparent copy errors, for the organizer to review.

The implementation was visually compared against Figma. No claim of an automated pixel-diff match is made; mobile behavior is an adaptation of the supplied desktop frame.
