const TileDesigns= {
  'shadowBoxes': {
    'tileShape': "flatTopHexagon",
    'tilePattern': [
      ["medium"],
      ["medium", "medium", "medium"],
      ["light", "medium", "medium", "medium", "dark"],
      ["light", "light", "light", "medium", "dark", "dark", "dark"],
      ["light", "light", "light", "dark", "medium", "medium", "medium"],
      ["light", "dark", "dark", "dark", "medium"],
      ["dark", "dark", "dark"],
      ["dark"]
    ]
  },

  'persianKnots': {
    'tileShape': "flatTopHexagon",
    'tilePattern': [
      [
      ["light", "light"],
      ["light", "light", "light", "light"],
      ["medium", "medium", "medium", "medium", "medium", "medium"],
      ["dark", "dark", "dark", "dark"],
      ["dark", "dark"]
      ]
    ]
  },

  'mosaicMitre': {
    'tileShape': "flatTopHexagon",
    'tilePattern': [
      [
      ["light"],
      ["light", "light", "light"],
      ["dark", "light", "medium", "light", "dark"],
      ["dark", "medium", "medium", "medium", "dark"],
      ["medium", "dark", "medium"],
      ["dark"]
    ]
    ]
  },

  'altHex': {
    'tileShape': "pointyTopHexagon",
    'tilePattern': 
    [
      [{color: "light", stroke: "dark", img: ""},
        {color: "medium", stroke: "dark"},
        {color: "light", stroke: "dark"},
        {color: "medium", stroke: "dark"},
        {color: "dark", stroke: "dark"},
        {color: "medium", stroke: "dark"}
      ],
      [
        {color: "medium"},
        {color: "medium", stroke: "dark"},
        {color: "medium", stroke: "dark"},
        {color: "medium", stroke: "dark"},
        {color: "dark", stroke: "dark"},
        {color: "medium", stroke: "dark"}
      ]
    ]
  },

  'pointyTest': {
    'tileShape': "pointyTopHexagon",
    'tilePattern': [
      [
        {color: "light", stroke: "dark"},
        {color: "light", stroke: "dark"},
        {color: "light", stroke: "dark"},
        {color: "light", stroke: "dark"},
        {color: "light", stroke: "dark"},
        {color: "light", stroke: "dark"}
      ],
      [
        {color: "dark", stroke: "dark"},
        {color: "dark", stroke: "dark"},
        {color: "dark", stroke: "dark"},
        {color: "dark", stroke: "dark"},
        {color: "dark", stroke: "dark"},
        {color: "dark", stroke: "dark"}
      ],
      [
        {color: "medium", stroke: "dark"},
        {color: "medium", stroke: "dark"},
        {color: "medium", stroke: "dark"},
        {color: "medium", stroke: "dark"},
        {color: "medium", stroke: "dark"},
        {color: "medium", stroke: "dark"}
      ],
      [
        {color: "accent", stroke: "dark"},
        {color: "accent", stroke: "dark"},
        {color: "accent", stroke: "dark"},
        {color: "accent", stroke: "dark"},
        {color: "accent", stroke: "dark"},
        {color: "accent", stroke: "dark"}
      ]
    ]
  },

  'test': {
    'tileShape': "flatTopHexagon",
    'tilePattern': [
      [
        {color: "light", stroke: "dark"},
        {color: "light", stroke: "dark"},
        {color: "light", stroke: "dark"},
        {color: "light", stroke: "dark"},
        {color: "light", stroke: "dark"},
        {color: "light", stroke: "dark"}
      ],
      [
        {color: "dark", stroke: "dark"},
        {color: "dark", stroke: "dark"},
        {color: "dark", stroke: "dark"},
        {color: "dark", stroke: "dark"},
        {color: "dark", stroke: "dark"},
        {color: "dark", stroke: "dark"}
      ],
      [
        {color: "medium", stroke: "dark"},
        {color: "medium", stroke: "dark"},
        {color: "medium", stroke: "dark"},
        {color: "medium", stroke: "dark"},
        {color: "medium", stroke: "dark"},
        {color: "medium", stroke: "dark"}
      ],
      [
        {color: "accent", stroke: "dark"},
        {color: "accent", stroke: "dark"},
        {color: "accent", stroke: "dark"},
        {color: "accent", stroke: "dark"},
        {color: "accent", stroke: "dark"},
        {color: "accent", stroke: "dark"}
      ]
    ]
  },

  'palermoMeander': {
    'tileShape': "flatTopHexagon",
    'tilePattern': [
      [
        {color: "accent", stroke: "bg"},
        {color: "accent", stroke: "bg"},
        {color: "medium", stroke: "bg"},
        {color: "dark", stroke: "bg"},
        {color: "medium", stroke: "bg"},
        {color: "dark", stroke: "bg"}
      ],
      [
        {color: "dark", stroke: "bg"},
        {color: "dark", stroke: "bg"},
        {color: "accent", stroke: "bg"},
        {color: "medium", stroke: "bg"},
        {color: "accent", stroke: "bg"},
        {color: "medium", stroke: "bg"}
      ],
      [
        {color: "medium", stroke: "bg"},
        {color: "medium", stroke: "bg"},
        {color: "dark", stroke: "bg"},
        {color: "light", stroke: "bg"},
        {color: "dark", stroke: "bg"},
        {color: "light", stroke: "bg"}
      ]
    ]
  },

  'singleHex': {
    'tileShape': "flatTopHexagon",
    'tilePattern': [
      [
        {color: "light", stroke: "accent"},
        {color: "medium", stroke: "accent"},
        {color: "light", stroke: "accent"},
        {color: "medium", stroke: "accent"},
        {color: "dark", stroke: "accent"},
        {color: "medium", stroke: "accent"}
      ]
    ]
  },

  'tripleHex': {
    'tileShape': "flatTopHexagon",
    'tilePattern': [
      [
        [{c: "light", s: "accent"},{c: "dark", s: "accent"},{c: "light", s: "accent"},{c: "medium", s: "accent"},{c: "dark", s: "accent"},{c: "medium", s: "accent"}],
        [{c: "light", s: "accent"},{c: "medium", s: "accent"},{c: "medium", s: "accent"},{c: "light", s: "accent"},{c: "dark", s: "accent"},{c: "medium", s: "accent"}]
      ],
      [
        [{c: "light", s: "accent"},{c: "dark", s: "accent"},{c: "light", s: "accent"},{c: "medium", s: "accent"},{c: "dark", s: "accent"},{c: "medium", s: "accent"}],
        [{c: "light", s: "accent"},{c: "medium", s: "accent"},{c: "medium", s: "accent"},{c: "light", s: "accent"},{c: "dark", s: "accent"},{c: "medium", s: "accent"}]
      ],
      [
        [{c: "light", s: "accent"},{c: "dark", s: "accent"},{c: "light", s: "accent"},{c: "medium", s: "accent"},{c: "dark", s: "accent"},{c: "medium", s: "accent"}],
        [{c: "light", s: "accent"},{c: "medium", s: "accent"},{c: "medium", s: "accent"},{c: "light", s: "accent"},{c: "dark", s: "accent"},{c: "medium", s: "accent"}]
      ],
      [
        [{c: "light", s: "accent"},{c: "dark", s: "accent"},{c: "light", s: "accent"},{c: "medium", s: "accent"},{c: "dark", s: "accent"},{c: "medium", s: "accent"}],
        [{c: "light", s: "accent"},{c: "medium", s: "accent"},{c: "medium", s: "accent"},{c: "light", s: "accent"},{c: "dark", s: "accent"},{c: "medium", s: "accent"}]
      ],
      [
        [{c: "light", s: "accent"},{c: "dark", s: "accent"},{c: "light", s: "accent"},{c: "medium", s: "accent"},{c: "dark", s: "accent"},{c: "medium", s: "accent"}],
        [{c: "light", s: "accent"},{c: "medium", s: "accent"},{c: "medium", s: "accent"},{c: "light", s: "accent"},{c: "dark", s: "accent"},{c: "medium", s: "accent"}]
      ]
    ]
  },

  'quadHex': {
    'tileShape': "flatTopHexagon",
    'tilePattern': [
        [
          [{c: "light", s: "accent"},{c: "dark", s: "accent"},{c: "light", s: "accent"},{c: "medium", s: "accent"},{c: "dark", s: "accent"},{c: "medium", s: "accent"}],
          [{c: "light", s: "accent"},{c: "medium", s: "accent"},{c: "medium", s: "accent"},{c: "light", s: "accent"},{c: "dark", s: "accent"},{c: "medium", s: "accent"}]
        ],
        [
          [{c: "light", s: "accent"},{c: "dark", s: "accent"},{c: "light", s: "accent"},{c: "medium", s: "accent"},{c: "dark", s: "accent"},{c: "medium", s: "accent"}],
          [{c: "light", s: "accent"},{c: "medium", s: "accent"},{c: "medium", s: "accent"},{c: "light", s: "accent"},{c: "dark", s: "accent"},{c: "medium", s: "accent"}]
        ],
        [
          [{c: "light", s: "accent"},{c: "dark", s: "accent"},{c: "light", s: "accent"},{c: "medium", s: "accent"},{c: "dark", s: "accent"},{c: "medium", s: "accent"}],
          [{c: "light", s: "accent"},{c: "medium", s: "accent"},{c: "medium", s: "accent"},{c: "light", s: "accent"},{c: "dark", s: "accent"},{c: "medium", s: "accent"}]
        ],
        [
          [{c: "light", s: "accent"},{c: "dark", s: "accent"},{c: "light", s: "accent"},{c: "medium", s: "accent"},{c: "dark", s: "accent"},{c: "medium", s: "accent"}],
          [{c: "light", s: "accent"},{c: "medium", s: "accent"},{c: "medium", s: "accent"},{c: "light", s: "accent"},{c: "dark", s: "accent"},{c: "medium", s: "accent"}]
        ],
        [
          [{c: "light", s: "accent"},{c: "dark", s: "accent"},{c: "light", s: "accent"},{c: "medium", s: "accent"},{c: "dark", s: "accent"},{c: "medium", s: "accent"}],
          [{c: "light", s: "accent"},{c: "medium", s: "accent"},{c: "medium", s: "accent"},{c: "light", s: "accent"},{c: "dark", s: "accent"},{c: "medium", s: "accent"}]
        ],
        [
          [{c: "light", s: "accent"},{c: "dark", s: "accent"},{c: "light", s: "accent"},{c: "medium", s: "accent"},{c: "dark", s: "accent"},{c: "medium", s: "accent"}],
          [{c: "light", s: "accent"},{c: "medium", s: "accent"},{c: "medium", s: "accent"},{c: "light", s: "accent"},{c: "dark", s: "accent"},{c: "medium", s: "accent"}]
        ]
    ]
  },

  'chamferedHex': {
    'tileShape': "flatTopHexagon",
    'tilePattern': [
      [
        {color: "light"},
        {color: "light", stroke: {a: "dark"}},
        {color: "light", stroke: "dark"},
        {color: "light", stroke: "dark"},
        {color: "light", stroke: "dark"},
        {color: "light", stroke: "dark"}
      ],
      [
        {color: "medium"},
        {color: "medium", stroke: {a: "dark"}},
        {color: "medium", stroke: "dark"},
        {color: "medium", stroke: "dark"},
        {color: "medium", stroke: "dark"},
        {color: "medium", stroke: "dark"}
      ],
      [
        {color: "dark"},
        {color: "dark", stroke: {a: "dark"}},
        {color: "dark", stroke: "dark"},
        {color: "dark", stroke: "dark"},
        {color: "dark", stroke: "dark"},
        {color: "dark", stroke: "dark"}
      ],
      [
        {color: "dark"},
        {color: "medium", stroke: {a: "dark"}},
        {color: "dark", stroke: "dark"},
        {color: "medium", stroke: "dark"},
        {color: "dark", stroke: "dark"},
        {color: "medium", stroke: "dark"}
      ]
    ]
  },

  'egyptianHexatile': {
    'tileShape': "flatTopHexagon",
    'tilePattern': [
      ["medium"],
      ["light", "medium", "medium"],
      ["light", "light", "light", "medium", "medium"],
      ["light", "light", "dark", "light", "light", "medium", "medium"],
      ["light", "light", "dark", "dark", "medium", "medium", "medium", "medium", "medium"],
      ["light", "light", "dark", "dark", "dark", "dark", "dark", "dark", "dark", "dark", "dark"],
      ["light", "light", "light", "light", "light", "light", "light", "light", "light", "light", "dark", "dark", "dark"],
      ["dark", "light", "light", "medium", "medium", "medium", "medium", "medium", "light", "light", "dark", "dark", "medium", "dark", "dark"],
      ["dark", "dark", "dark", "light", "light", "medium", "medium", "dark", "dark", "light", "dark", "dark", "medium", "medium", "medium", "dark", "dark"],
      ["dark", "dark", "medium", "dark", "dark", "light", "light", "medium", "medium", "dark", "dark", "dark", "medium", "medium", "light", "medium", "medium", "dark", "dark"],
      ["dark", "dark", "medium", "medium", "light", "light", "light", "light", "light", "medium", "medium", "dark", "medium", "medium", "light", "light", "dark", "dark", "dark", "dark", "dark"],
      ["dark", "dark", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "light", "light", "light", "light", "light", "light", "light", "light", "light"],
      ["dark", "dark", "dark", "dark", "dark", "dark", "dark", "dark", "dark", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "light", "light"],
      ["light", "light", "light", "light", "light", "dark", "dark", "medium", "medium", "light", "medium", "medium", "dark", "dark", "dark", "dark", "dark", "medium", "medium", "light", "light"],
      ["light", "light", "medium", "medium", "dark", "medium", "medium", "light", "light", "light", "medium", "medium", "dark", "dark", "light", "light", "medium", "light", "light"],
      ["light", "light", "medium", "medium", "medium", "light", "light", "dark", "light", "light", "medium", "medium", "dark", "dark", "light", "light", "light"],
      ["light", "light", "medium", "light", "light", "dark", "dark", "medium", "medium", "medium", "medium", "medium", "dark", "dark", "light"],
      ["light", "light", "light", "dark", "dark", "dark", "dark", "dark", "dark", "dark", "dark", "dark", "dark"],
      ["light", "light", "light", "light", "light", "light", "light", "light", "light", "dark", "dark"],
      ["medium", "medium", "medium", "medium", "medium", "light", "light", "dark", "dark"],
      ["medium", "medium", "dark", "dark", "light", "dark", "dark"],
      ["medium", "medium", "dark", "dark", "dark"],
      ["medium", "medium", "dark"],
      ["medium"]
    ]
  },

  'brokeHexatile': {
    "tileShape": "flatTopHexagon",
    'tilePattern': [
      ["medium"],
      ["light", "medium", "medium"],
      ["light", "light", "light", "medium", "medium"],
      ["light", "light", "dark", "light", "light", "medium", "medium"],
      ["light", "light", "dark", "dark", "medium", "medium", "medium", "medium", "medium"],
      ["light", "light", "dark", "dark", "dark", "dark", "dark", "dark", "dark", "dark", "dark"],
      ["light", "light", "light", "light", "light", "light", "light", "light", "light", "light", "dark", "dark", "dark"],
      ["dark", "light", "light", "medium", "medium", "medium", "medium", "medium", "light", "light", "dark", "dark", "medium", "dark", "dark"],
      ["dark", "dark", "dark", "light", "light", "medium", "medium", "dark", "dark", "light", "dark", "dark", "medium", "medium", "medium", "dark", "dark"],
      ["dark", "dark", "medium", "dark", "dark", "light", "light", "medium", "medium", "dark", "dark", "dark", "medium", "medium", "light", "medium", "medium", "dark", "dark"],
      ["dark", "dark", "medium", "medium", "light", "light", "light", "light", "light", "medium", "medium", "dark", "medium", "medium", "light", "light", "dark", "dark", "dark", "dark", "dark"],
      ["dark", "dark", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "light", "light", "light", "light", "light", "light", "light", "light", "light"],
      ["dark", "dark", "dark", "dark", "dark", "dark", "dark", "dark", "dark", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "light", "light"],
      ["light", "light", "light", "light", "light", "dark", "dark", "medium", "medium", "light", "medium", "medium", "dark", "dark", "dark", "dark", "dark", "medium", "medium", "light", "light"],
      ["light", "light", "medium", "medium", "dark", "medium", "medium", "light", "light", "light", "medium", "medium", "dark", "dark", "light", "light", "medium", "light", "light"],
      ["light", "light", "medium", "medium", "medium", "light", "light", "dark", "light", "light", "medium", "medium", "dark", "dark", "light", "light", "light"],
      ["light", "light", "medium", "light", "light", "dark", "dark", "medium", "medium", "medium", "medium", "medium", "dark", "dark", "light"],
      ["light", "light", "light", "dark", "dark", "dark", "dark", "dark", "dark", "dark", "dark", "dark", "dark"],
      ["light", "light", "light", "light", "light", "light", "light", "light", "light", "dark", "dark"],
      ["medium", "medium", "medium", "medium", "medium", "light", "light", "dark", "dark"],
      ["medium", "medium", "dark", "dark", "light", "dark", "dark"],
      ["medium", "medium", "dark", "dark", "dark"],
      ["medium", "medium", "dark"],
      ["medium"]
    ]
  }
};

export default TileDesigns; 
