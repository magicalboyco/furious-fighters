// Female Fury prototype roster — original placeholder visuals, not licensed character art.
const BASE_NORMALS = {
  lp:{dmg:4,startup:3,active:3,recovery:6,hitstun:10,blockstun:7,range:52},
  mp:{dmg:7,startup:5,active:3,recovery:10,hitstun:12,blockstun:9,range:58},
  hp:{dmg:10,startup:8,active:4,recovery:15,hitstun:16,blockstun:12,range:65},
  lk:{dmg:4,startup:4,active:3,recovery:7,hitstun:10,blockstun:7,range:56,low:true},
  mk:{dmg:7,startup:6,active:4,recovery:11,hitstun:13,blockstun:10,range:65,low:true},
  hk:{dmg:11,startup:10,active:4,recovery:17,hitstun:18,blockstun:13,range:75,low:true},
};
function normals(scale=1) {
  return Object.fromEntries(Object.entries(BASE_NORMALS).map(([k,v])=>[k,{...v,dmg:Math.max(1,Math.round(v.dmg*scale))}]));
}

export const ROSTER = [
  {
    "id": "chun-lee",
    "name": "CHUN-LEE",
    "color": "#c92937",
    "accent": "#ffd36c",
    "walkSpeed": 3.8,
    "jumpPower": 12,
    "maxHealth": 92,
    "role": "rushdown",
    "item": "Weighted Anklets",
    "normalsScale": 1.02,
    "specials": [
      {
        "name": "Lantern Rush",
        "motion": {
          "type": "motion",
          "sequence": [
            2,
            3,
            6
          ],
          "buttons": [
            "lp",
            "mp",
            "hp"
          ]
        },
        "kind": "sweep",
        "dmg": 9,
        "startup": 10,
        "active": 6,
        "recovery": 20,
        "range": 55,
        "projectileSpeed": 6,
        "projectileLife": 90,
        "vx": 4.5
      },
      {
        "name": "Crimson Heel",
        "motion": {
          "type": "motion",
          "sequence": [
            2,
            1,
            4
          ],
          "buttons": [
            "lk",
            "mk",
            "hk"
          ]
        },
        "kind": "uppercut",
        "dmg": 12,
        "startup": 6,
        "active": 8,
        "recovery": 23,
        "range": 52,
        "vy": -10,
        "vx": 2,
        "invulnFrames": 4
      }
    ]
  },
  {
    "id": "june",
    "name": "JUNE HOLIDAY",
    "color": "#ed812c",
    "accent": "#455d70",
    "walkSpeed": 2.9,
    "jumpPower": 11,
    "maxHealth": 102,
    "role": "trapper",
    "item": "Survival Kit",
    "normalsScale": 1,
    "specials": [
      {
        "name": "Safety Flare",
        "motion": {
          "type": "motion",
          "sequence": [
            2,
            3,
            6
          ],
          "buttons": [
            "lp",
            "mp",
            "hp"
          ]
        },
        "kind": "projectile",
        "dmg": 8,
        "startup": 10,
        "active": 6,
        "recovery": 20,
        "range": 55,
        "projectileSpeed": 6,
        "projectileLife": 90,
        "vx": 4.5
      },
      {
        "name": "Emergency Exit",
        "motion": {
          "type": "motion",
          "sequence": [
            2,
            1,
            4
          ],
          "buttons": [
            "lk",
            "mk",
            "hk"
          ]
        },
        "kind": "sweep",
        "dmg": 10,
        "startup": 6,
        "active": 8,
        "recovery": 23,
        "range": 52,
        "vy": -10,
        "vx": 2,
        "invulnFrames": 0
      }
    ]
  },
  {
    "id": "lana",
    "name": "LANA CRAFT",
    "color": "#e4c13c",
    "accent": "#5c4238",
    "walkSpeed": 3.7,
    "jumpPower": 12,
    "maxHealth": 93,
    "role": "mobile",
    "item": "Grappling Hook",
    "normalsScale": 1,
    "specials": [
      {
        "name": "Relic Shot",
        "motion": {
          "type": "motion",
          "sequence": [
            2,
            3,
            6
          ],
          "buttons": [
            "lp",
            "mp",
            "hp"
          ]
        },
        "kind": "projectile",
        "dmg": 8,
        "startup": 10,
        "active": 6,
        "recovery": 20,
        "range": 55,
        "projectileSpeed": 6,
        "projectileLife": 90,
        "vx": 4.5
      },
      {
        "name": "Hook Swing",
        "motion": {
          "type": "motion",
          "sequence": [
            2,
            1,
            4
          ],
          "buttons": [
            "lk",
            "mk",
            "hk"
          ]
        },
        "kind": "uppercut",
        "dmg": 11,
        "startup": 6,
        "active": 8,
        "recovery": 23,
        "range": 52,
        "vy": -10,
        "vx": 2,
        "invulnFrames": 4
      }
    ]
  },
  {
    "id": "zika",
    "name": "ZIKA",
    "color": "#236b44",
    "accent": "#bc9959",
    "walkSpeed": 2.8,
    "jumpPower": 10.5,
    "maxHealth": 110,
    "role": "grappler",
    "item": "Saw Discus",
    "normalsScale": 1.08,
    "specials": [
      {
        "name": "Discus Toss",
        "motion": {
          "type": "motion",
          "sequence": [
            2,
            3,
            6
          ],
          "buttons": [
            "lp",
            "mp",
            "hp"
          ]
        },
        "kind": "projectile",
        "dmg": 9,
        "startup": 10,
        "active": 6,
        "recovery": 20,
        "range": 55,
        "projectileSpeed": 6,
        "projectileLife": 90,
        "vx": 4.5
      },
      {
        "name": "Damsel Takedown",
        "motion": {
          "type": "motion",
          "sequence": [
            2,
            1,
            4
          ],
          "buttons": [
            "lk",
            "mk",
            "hk"
          ]
        },
        "kind": "grab",
        "dmg": 16,
        "startup": 6,
        "active": 8,
        "recovery": 23,
        "range": 52,
        "vy": -10,
        "vx": 2,
        "invulnFrames": 0
      }
    ]
  },
  {
    "id": "weather",
    "name": "WEATHER GIRL",
    "color": "#203f78",
    "accent": "#f4d453",
    "walkSpeed": 3,
    "jumpPower": 11,
    "maxHealth": 98,
    "role": "zoner",
    "item": "Umbrella",
    "normalsScale": 1,
    "specials": [
      {
        "name": "Storm Warning",
        "motion": {
          "type": "motion",
          "sequence": [
            2,
            3,
            6
          ],
          "buttons": [
            "lp",
            "mp",
            "hp"
          ]
        },
        "kind": "projectile",
        "dmg": 8,
        "startup": 10,
        "active": 6,
        "recovery": 20,
        "range": 55,
        "projectileSpeed": 6,
        "projectileLife": 90,
        "vx": 4.5
      },
      {
        "name": "Umbrella Lift",
        "motion": {
          "type": "motion",
          "sequence": [
            2,
            1,
            4
          ],
          "buttons": [
            "lk",
            "mk",
            "hk"
          ]
        },
        "kind": "uppercut",
        "dmg": 11,
        "startup": 6,
        "active": 8,
        "recovery": 23,
        "range": 52,
        "vy": -10,
        "vx": 2,
        "invulnFrames": 4
      }
    ]
  },
  {
    "id": "samantha",
    "name": "SAMANTHA URANUS",
    "color": "#523c95",
    "accent": "#98eaf0",
    "walkSpeed": 2.65,
    "jumpPower": 10.5,
    "maxHealth": 110,
    "role": "heavy zoner",
    "item": "Arm Cannon",
    "normalsScale": 1.06,
    "specials": [
      {
        "name": "Reactor Burst",
        "motion": {
          "type": "motion",
          "sequence": [
            2,
            3,
            6
          ],
          "buttons": [
            "lp",
            "mp",
            "hp"
          ]
        },
        "kind": "projectile",
        "dmg": 10,
        "startup": 10,
        "active": 6,
        "recovery": 20,
        "range": 55,
        "projectileSpeed": 6,
        "projectileLife": 90,
        "vx": 4.5
      },
      {
        "name": "Jet Launch",
        "motion": {
          "type": "motion",
          "sequence": [
            2,
            1,
            4
          ],
          "buttons": [
            "lk",
            "mk",
            "hk"
          ]
        },
        "kind": "uppercut",
        "dmg": 12,
        "startup": 6,
        "active": 8,
        "recovery": 23,
        "range": 52,
        "vy": -10,
        "vx": 2,
        "invulnFrames": 4
      }
    ]
  },
  {
    "id": "plum",
    "name": "PRINCESS PLUM",
    "color": "#b59adf",
    "accent": "#6d3d94",
    "walkSpeed": 3.2,
    "jumpPower": 12,
    "maxHealth": 95,
    "role": "all-rounder",
    "item": "Royal Parasol",
    "normalsScale": 1,
    "specials": [
      {
        "name": "Plum Toss",
        "motion": {
          "type": "motion",
          "sequence": [
            2,
            3,
            6
          ],
          "buttons": [
            "lp",
            "mp",
            "hp"
          ]
        },
        "kind": "projectile",
        "dmg": 8,
        "startup": 10,
        "active": 6,
        "recovery": 20,
        "range": 55,
        "projectileSpeed": 6,
        "projectileLife": 90,
        "vx": 4.5
      },
      {
        "name": "Parasol Pop",
        "motion": {
          "type": "motion",
          "sequence": [
            2,
            1,
            4
          ],
          "buttons": [
            "lk",
            "mk",
            "hk"
          ]
        },
        "kind": "uppercut",
        "dmg": 12,
        "startup": 6,
        "active": 8,
        "recovery": 23,
        "range": 52,
        "vy": -10,
        "vx": 2,
        "invulnFrames": 4
      }
    ]
  },
  {
    "id": "jd",
    "name": "JD BEIGE",
    "color": "#c6b494",
    "accent": "#ffffff",
    "walkSpeed": 2.85,
    "jumpPower": 10,
    "maxHealth": 106,
    "role": "challenge bruiser",
    "item": "Cargo Pockets",
    "normalsScale": 0.54,
    "specials": [
      {
        "name": "Tactical Puff",
        "motion": {
          "type": "motion",
          "sequence": [
            2,
            3,
            6
          ],
          "buttons": [
            "lp",
            "mp",
            "hp"
          ]
        },
        "kind": "projectile",
        "dmg": 5,
        "startup": 10,
        "active": 6,
        "recovery": 20,
        "range": 55,
        "projectileSpeed": 6,
        "projectileLife": 90,
        "vx": 4.5
      },
      {
        "name": "Maximum Effort",
        "motion": {
          "type": "motion",
          "sequence": [
            2,
            1,
            4
          ],
          "buttons": [
            "lk",
            "mk",
            "hk"
          ]
        },
        "kind": "uppercut",
        "dmg": 8,
        "startup": 6,
        "active": 8,
        "recovery": 23,
        "range": 52,
        "vy": -10,
        "vx": 2,
        "invulnFrames": 4
      }
    ]
  }
].map(({normalsScale,...c})=>({...c,normals:normals(normalsScale)}));
export function getCharacter(id){return ROSTER.find(c=>c.id===id);}
