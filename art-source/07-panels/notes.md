# Panel art — intake notes (2026-10-15)

Notes only: nothing here is integrated. Prompt codes refer to
`docs/panel-art-prompts.md`. Files named `raw-<code>-<name>.jpg` are in this
folder (batch 1, 20 files). **Batch 2 (14 images) arrived inline with no files
on disk**: noted below, but it needs to be dropped into this folder before it
can be cut out.

Measured facts (batch 1): corner/hole colours sampled from the raw files.

## Batch 1 (saved)

| Code | File | Size | Verdict | What the cut-out/integration will need |
|---|---|---|---|---|
| A1 | portrait | 2000² | ✅ Strong painted portrait, warm lamp light | Corners are **pure white (254)**, so key the circle to transparent |
| 2b | desk-surface | 2000×848 | ⚠️ Not the brief | A flat *framed* top-down panel (dark border on all four sides, no perspective), with about 10 overlapping coffee rings instead of 1–2. See batch 2 for the better desk |
| G2 | frame-gold-baroque | 2000² | ✅ Beautiful, ornate | Background is a **grey→tan gradient** (123→183,158,129) and the hole is a muted green (89,161,91); key hole + bg separately. The ornate corners won't stretch: use at fixed aspect |
| G2 | frame-walnut | 1493×2000 | ✅ | Same gradient bg (corner reaches 227,194,145); hole (10,175,85) |
| G2 | frame-black | 1493×2000 | ✅ Cleanest: flat bg (127), hole (8,179,87) | — |
| K1 | address-book | 2000×1091 | ✅ Lovely lined pages + blank coloured tabs | Wood table baked in behind it (not isolated); usable as the panel surface as-is |
| B3 | warkinless-cover | 1342×2000 | ✅ Excellent (ruined castle, crescent moon, gilt border) | Painted dark teal background; cut by the cover's rounded rectangle. Green ribbon tail at the bottom |
| B4 | open-book | 1342×2000 | ⚠️ **Rotated 90°** (spine runs horizontally), wavy gutter shadow | Rotate to landscape; the gutter shadow is uneven, consider re-generating |
| A3 | doodles | 2000² | ✅ Charming ink-and-wash | Compass has **N/S/E/W letters** (breaks the no-text rule, tiny). Soft diagonal shadows on the paper; blend with `multiply` rather than keying |
| L1 | laptop-wallpaper | 2000×848 | ✅ Beautiful night town | 2.36:1 not 16:10 (will crop); a **lamp shade intrudes top-right** (odd on a wallpaper); a stray tiny crescent glyph near the stars |
| B1 | two-tier-bookcase | 1376×768 | ✅ Exactly as briefed | Blue-green painted wall around it; cut by the cabinet outline |
| B1 | alt-tall-bookcase | 1493×2000 | – | Four shelves, not two: unused |
| K2 | envelope | 2000×1493 | ✅ Excellent (crescent wax seal) | Flat grey bg, faint shadow at left |
| J2 | stamp | 2000² | ✅ Nice scalloped border | Background is grey at top and a **blurred dark table** at the bottom (13,7,7), so scallop edges need care; hole (73,151,89) |
| J1 | diary-page | 896×1200 | ✅ Beautiful (forget-me-nots, taped, ring stain) | **Low resolution**, dark navy surround, left edge shows the book |
| B2 | my-writings-cover | 1342×2000 | ✅ Excellent (tooled leather, quill + inkwell) | Dark painted bg; green ribbon tail at bottom |
| G3 | bust-fig | 2000² | ✅ Nice marble bust + fiddle-leaf | Blurry table baked in; fig's pot is smeared into it. Cut each object |
| G3 | ballerina-monstera | 2000² | ✅ Nice bronze ballerina + monstera | Same baked blurry table + a dark smudge between the objects |
| P1 | parchment | 2000² | ⚠️ Not tileable | Strong light gradient: corners (215,195,162) vs top-right (254,240,204). Use as one stretched background, not a tile |
| L2 | folder-icons | 2000² | ✅ Excellent four icons | Flat grey bg, clean |

## Batch 2 (inline only, 14 images)

| Code | Verdict | Notes |
|---|---|---|
| M3 filmstrip | ⚠️ | Two rows of **five** frames (asked for one row); the design reference's UI bar ("Ambient Music", "Tashkent, UZ", "Cloudy", "Feather Cursor") is baked in below the strip. Crop to the strip; green is a muted light green |
| lamp glow | duplicate | Same glow-on-black image already integrated on the landing page |
| G1 gallery wall | ✅ mood | Room-corner view (narrow side walls at both edges), green-black wall over wainscot, a hard-edged bright rectangle at top right (looks like a skylight) |
| M2 reel shelf | ✅ | Walnut plank with two iron brackets on flat grey; clean |
| A2 coffee + notebook | ✅ | Beautiful; steam painted into the cup, a glowing notebook, fountain pen, beans. Flat grey bg |
| (wide gold frame) | ❌ | Wide landscape gilt frame, but the **design reference's desk, plush, easel and UI cards are baked into the background** with garbled text; green hole has a grey smudge. Re-generate |
| F1 charm rail | ✅ | Brass rod, ornate finials, **five S-hooks**; the anime list is data-driven (7 now), so charms will be placed by code along it |
| book spines ×5 | ✅ bonus | Five painted spines (blue, tan, green, rust, brown), no text, flat grey: good for the "Books I've read" shelf |
| M1 reel canister | ✅ | Worn brass tin, three holes, blank label; reads more like a flat lid than a canister, fine |
| C1 ticket | ✅ | Blank, notched, perforated; oxblood band is an odd L-shape; big empty area for text |
| F2 acrylic charm | ✅ | Neon green hole (#0aff0a-ish, different from the others, easy to key). The acrylic is *semi-transparent*: needs alpha from difference, not a hard cut |
| 2b desk v2 | ✅ better | Perspective tabletop, believable grain/rings/scratches. **Trapezoid**: dark triangular corners at the top left/right; a cool vertical glow strip in the centre. Needs overscan/crop to work as a full-width band |

## Still missing from the prompt list

C2 (velvet texture) and the fourth G2 frame (thin brushed-gold); the wide gold
frame above is unusable. Duplicates/extras noted above.
