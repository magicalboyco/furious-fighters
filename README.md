# Female Fury — combat prototype

A browser-based **local two-player** 2D fighting prototype, adapted from the Furious Fighters foundation. Eight provisional fighters, six attack buttons, motion specials, blocking, projectiles and first-to-two-round wins. **Not a finished fighting game.** Character art is currently placeholder geometry; there is no online multiplayer, throws, air normals, super meter, or super attacks yet.

## Run
```bash
python3 tools/dev-server.py
```
Open http://localhost:8420 . No dependencies or build step.

## Keyboard controls
| Action | Player 1 | Player 2 |
|---|---|---|
| Move / jump / crouch | A D / W / S | Arrows |
| LP / MP / HP | U / I / O | Numpad 7 / 8 / 9 |
| LK / MK / HK | J / K / L | Numpad 4 / 5 / 6 |

Hold **away** to block standing; hold **down + away** to block low. Special inputs are facing-relative: **down, down-forward, forward + punch** and **down, down-back, back + kick**. The current engine uses these shared inputs for each character's two provisional specials. Use LP to lock your choice on the character-select screen. Keyboard numpad must be available for two-player play.

## Launch-prototype roster
| Color | Fighter | Archetype | Signature item |
|---|---|---|---|
| Red | Chun-Lee | Rushdown | Weighted anklets |
| Orange | June Holiday | Trapper (planned) | Survival kit |
| Yellow | Lana Craft | Mobile | Grappling hook |
| Green | Zika, Dueling Damsel | Grappler | Saw discus |
| Blue | Weather Girl | Zoner | Umbrella |
| Indigo | Samantha Uranus | Heavy zoner | Arm cannon |
| Violet | Princess Plum | All-rounder | Royal parasol |
| Beige | JD Beige | Challenge bruiser | Cargo pockets |

**Balance note:** JD deliberately has low damage as a challenge character, but his attacks still use standard collision and hitstun rules. Stats and specials are initial tuning placeholders, not playtested balance.

## Next milestones
- Validate keyboard input and motion special timing in a real browser.
- Add the six standing/crouching/jumping normals per position and true guard-height rules.
- Add throws, super meter, super attacks and character-specific special mechanics.
- Produce original character sprite sheets and sounds; verify rights before publishing parodies.

The project uses plain HTML5 Canvas and JavaScript; combat is in `src/fighter.js`, `src/combat.js`, input in `src/input.js`, and roster data in `src/characters.js`.
