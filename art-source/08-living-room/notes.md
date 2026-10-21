# Living-room art — intake (2026-10-21)

18 files, all real files here. Nothing integrated yet.

| File | Verdict | Needs |
|---|---|---|
| sky-day | OK | clean, no frame; skyline at bottom |
| sky-dawn | OK | clean; different skyline (minarets) |
| sky-sunset-FRAMED | crop | thick dark frame baked in: crop to the inner painting |
| sky-dusk-FRAMED | crop | same |
| sky-night-moon-FRAMED | crop | soft painted border; moon + gold stars baked in |
| clouds-on-black | OK | luminance -> alpha; blue-grey undersides go semi-transparent |
| rain-on-glass-black | OK | luminance -> alpha overlay |
| clock-face | OK | pivot hole ~ (968,945) of 1932 preview |
| clock-hands | OK | pivot = the ring at the bottom of each hand |
| feather-cursor | OK | nib bottom-left (~281,1217 of 2000); shrink to ~48px, rotate in code |
| candle-dish | OK | wick tip ~ (965,650) of 1932 preview |
| flame-candle-on-black | OK | luminance -> alpha |
| flame-b-ON-CANVAS | crop | canvas edges + white bg: crop to the inner flame (2nd flicker frame) |
| gramophone | OK | 3/4 view from above (other desk objects are frontal) |
| coat-scarf-hook | OK | hook plate + coat + scarf in one piece |
| rail-rod-5-hooks | OK | THE missing F1 charm rail (5 hooks -> 5 charms per row) |
| film-reel | OK | THE missing M1 reel canister |
| open-book-rotated | rotate | B4 again: rotated 90 deg, wavy gutter shadow |

Known issue: the five sky plates each paint a DIFFERENT city skyline, so a time-of-day
crossfade ghosts two skylines for a moment. Fix at integration: crop the skylines off and
draw one shared skyline layer.

## Integrated (2026-10-21)
- cursor/feather.png -> CustomCursor (nib = click point)
- sky plates (cropped) -> Background `SkyPlates`, cross-faded by time of day; clouds + rain-on-glass in Window
- /api/weather (Open-Meteo, Tashkent, cached 15 min) -> useRealWeather -> sceneStore.weather
- clock face + hands -> WallClock (real local time); coat -> CoatOnHook; shelf + candle + 2 flame frames -> CandleShelf
- gramophone -> Gramophone (the sound switch); rail rod -> panels/fandom/rail.png (5 hooks); reel -> panels/memories/reel.png
- NOT used yet: raw-open-book-rotated, flame-b canvas variant is used as a flicker frame
