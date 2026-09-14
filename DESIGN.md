# Design System & Brand

## Personality
Trustworthy, official, extremely clear, calm, and high-contrast. It must inspire confidence without feeling flashy or modern-web "trendy."

## Typography
- **Primary font (all UI, headings, and body, every language)**: `Noto Sans`, paired with `Noto Sans Devanagari`, `Noto Sans Bengali`, `Noto Sans Tamil`, and `Noto Sans Telugu` for their respective scripts. Deliberate choice, not a fallback: it's the one family engineered to keep matching x-height and weight across every script this product supports. Do not substitute Inter, Geist, or any Latin-only face — it will silently break 5 of 6 languages.
- **Data/monospace font (English-only: scheme codes, figures, admin dashboard numbers)**: `IBM Plex Mono`

## Color Tokens
- **Primary Brand**: `#0B3D91` (Deep Government Blue)
- **Primary Hover**: `#1a4fa0`
- **Accent** (sparingly — one CTA or highlight at a time, never a gradient): `#C2410C`
- **Background Base**: `#F9FAFB` (Gray-50)
- **Surface**: `#FFFFFF`
- **Text Main**: `#111827` (Gray-900)
- **Text Muted**: `#4B5563` (Gray-600)
- **Success**: `#15803D` (Green-700)
- **Warning**: `#B45309` (Amber-700)
- **Danger**: `#B91C1C` (Red-700)
- **Borders**: `#E5E7EB` (Gray-200)

## Spacing, Radius, & Shadows
- **Spacing Scale**: Base-4 scale (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px).
- **Border Radius**: Strictly `rounded-md` (6px) for cards, inputs, and buttons. No heavy rounding (`rounded-full` is only for avatars or badges).
- **Shadow Scale**: Strictly `shadow-sm` for cards. No heavy elevations, no floating elements.

## Motion Rules
- Keep motion to an absolute minimum.
- Use only `duration-200 ease-in-out` for hover states and opacity transitions.
- No layout animations, no spring physics, no staggered entrances.

## Strict Denylist (Do NOT use)
- No 3D effects or isometric illustrations.
- No gradients anywhere.
- No decorative blur, backdrop-blur, or glassmorphism.
- No `shadow-xl`, `shadow-2xl`, or heavy dropshadows.
- No `outline-none` without an explicit focus ring replacement.
