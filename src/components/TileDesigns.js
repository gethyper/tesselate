const TileDesigns= {
  'shadowBox': {
    'tileDesign': "diamond",
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
    'tileDesign': "diamond",
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
    'tileDesign': "diamond",
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
    'tileDesign': "pizza",
    'tilePattern': [
      [
        {color: "light", stroke: "dark", img: ""},
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

  'palermoMeander': {
    'tileDesign': "diamond",
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

  'tripleHex': {
    'tileDesign': "diamond",
    'tilePattern': [
      [
        {color: "light", stroke: "accent"},
        {color: "medium", stroke: "accent"},
        {color: "light", stroke: "accent"},
        {color: "medium", stroke: "accent"},
        {color: "dark", stroke: "accent"},
        {color: "medium", stroke: "accent"}
      ],
      [
        {color: "medium", stroke: "accent"},
        {color: "medium", stroke: "accent"},
        {color: "medium", stroke: "accent"},
        {color: "medium", stroke: "accent"},
        {color: "dark", stroke: "accent"},
        {color: "medium", stroke: "accent"}
      ],
      [
        {color: "medium", stroke: "accent"},
        {color: "medium", stroke: "accent"},
        {color: "dark", stroke: "accent"},
        {color: "medium", stroke: "accent"},
        {color: "dark", stroke: "accent"},
        {color: "medium", stroke: "accent"}
      ]
    ]
  },

  'quadHex': {
    'tileDesign': "diamond",
    'tilePattern': [
      [
        {color: "light", stroke: "accent"},
        {color: "medium", stroke: "accent"},
        {color: "light", stroke: "accent"},
        {color: "medium", stroke: "accent"},
        {color: "dark", stroke: "accent"},
        {color: "medium", stroke: "accent"}
      ],
      [
        {color: "medium", stroke: "accent"},
        {color: "medium", stroke: "accent"},
        {color: "medium", stroke: "accent"},
        {color: "medium", stroke: "accent"},
        {color: "dark", stroke: "accent"},
        {color: "medium", stroke: "accent"}
      ],
      [
        {color: "medium", stroke: "accent"},
        {color: "medium", stroke: "accent"},
        {color: "dark", stroke: "accent"},
        {color: "medium", stroke: "accent"},
        {color: "dark", stroke: "accent"},
        {color: "medium", stroke: "accent"}
      ],
      [
        {color: "dark", stroke: "accent"},
        {color: "dark", stroke: "accent"},
        {color: "dark", stroke: "accent"},
        {color: "light", stroke: "accent"},
        {color: "dark", stroke: "accent"},
        {color: "dark", stroke: "accent"}
      ]
    ]
  },

  'chamferedHex': {
    'tileDesign': "pizza",
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
    'tileDesign': "diamond",
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
    tileDesign: "diamond",
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
