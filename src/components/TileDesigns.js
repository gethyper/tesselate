const TileDesigns= {


  'persianKnots': {
    'tileShape': "flatTopHexagon",
    'tilePattern': []
  },

  'persianTriangles': {
    'tileShape': "flatTopHexagon",
    'tilePattern': []
  },

  'palermoMeander': {
    'tileShape': "flatTopHexagon",
    'tilePattern': [
      [
        [{c:"accent", s:"bg"}],
        [{c:"accent", s: "bg"}],
        [{c:"medium", s: "bg"}],
        [{c:"dark", s: "bg"}],
        [{c:"medium", s: "bg"}],
        [{c:"dark", s: "bg"}]
      ],
      [
        [{c:"dark", s: "bg"}],
        [{c:"dark", s: "bg"}],
        [{c:"accent", s: "bg"}],
        [{c:"medium", s: "bg"}],
        [{c:"accent", s: "bg"}],
        [{c:"medium", s: "bg"}]
      ],
      [
        [{c: "medium", s: "bg"}],
        [{c: "medium", s: "bg"}],
        [{c: "dark", s: "bg"}],
        [{c: "light", s: "bg"}],
        [{c: "dark", s: "bg"}],
        [{c: "light", s: "bg"}]
      ]
    ]
  },

  'shadowBoxes': {
    'tileShape': "flatTopHexatile",
    'tileOffset': 0,
    'tilePattern': [
      [
        [{c:"medium"},{c:"medium"},{c:"medium"},{c:"medium"},{c:"medium"},{c:"medium"}],
        [{c:"medium"},{c:"light"},{c:"light"},{c:"light"},{c:"medium"},{c:"medium"}],   
        [{c:"dark"},{c:"dark"},{c:"light"},{c:"light"},{c:"light"},{c:"dark"}],
        [{c:"dark"},{c:"dark"},{c:"dark"},{c:"dark"},{c:"dark"},{c:"dark"}]
      ],
      [
        
        [{c:"dark"},{c:"dark"},{c:"medium"},{c:"medium"},{c:"light"},{c:"dark"}],   
        [{c:"medium"},{c:"medium"},{c:"medium"},{c:"dark"},{c:"dark"},{c:"dark"}],
        [{c:"medium"},{c:"light"},{c:"dark"},{c:"dark"},{c:"medium"},{c:"medium"}],
        [{c:"light"},{c:"light"},{c:"light"},{c:"light"},{c:"light"},{c:"light"}]
      ],
      [
        [{c:"medium"},{c:"dark"},{c:"dark"},{c:"dark"},{c:"medium"},{c:"medium"}],
        [{c:"light"},{c:"light"},{c:"dark"},{c:"dark"},{c:"dark"},{c:"light"}],   
        [{c:"light"},{c:"medium"},{c:"medium"},{c:"medium"},{c:"light"},{c:"light"}],
        [{c:"dark"},{c:"dark"},{c:"medium"},{c:"medium"},{c:"medium"},{c:"dark"}]
      ],
      [
        [{c:"medium"},{c:"medium"},{c:"medium"},{c:"medium"},{c:"medium"},{c:"medium"}],
        [{c:"medium"},{c:"dark"},{c:"light"},{c:"light"},{c:"medium"},{c:"dark"}],
        [{c:"dark"},{c:"dark"},{c:"dark"},{c:"dark"},{c:"dark"},{c:"dark"}],
        [{c:"light"},{c:"medium"},{c:"medium"},{c:"dark"},{c:"dark"},{c:"light"}]
      ],
      [
        [{c:"dark"},{c:"dark"},{c:"light"},{c:"light"},{c:"light"},{c:"dark"}],
        [{c:"dark"},{c:"dark"},{c:"dark"},{c:"dark"},{c:"dark"},{c:"dark"}],
        [{c:"medium"},{c:"medium"},{c:"medium"},{c:"medium"},{c:"medium"},{c:"medium"}],
        [{c:"medium"},{c:"light"},{c:"light"},{c:"light"},{c:"medium"},{c:"medium"}],

      ],
      [
        [{c:"medium"},{c:"light"},{c:"dark"},{c:"dark"},{c:"medium"},{c:"medium"}],
        [{c:"light"},{c:"light"},{c:"light"},{c:"light"},{c:"light"},{c:"light"}],
        [{c:"dark"},{c:"dark"},{c:"medium"},{c:"medium"},{c:"light"},{c:"dark"}],
        [{c:"medium"},{c:"medium"},{c:"medium"},{c:"dark"},{c:"dark"},{c:"dark"}]
      ],
      [
        [{c:"light"},{c:"medium"},{c:"medium"},{c:"medium"},{c:"light"},{c:"light"}],
        [{c:"dark"},{c:"dark"},{c:"medium"},{c:"medium"},{c:"medium"},{c:"dark"}],
        [{c:"medium"},{c:"dark"},{c:"dark"},{c:"dark"},{c:"medium"},{c:"medium"}],
        [{c:"light"},{c:"light"},{c:"dark"},{c:"dark"},{c:"dark"},{c:"light"}]

      ],
      [
        [{c:"dark"},{c:"dark"},{c:"dark"},{c:"dark"},{c:"dark"},{c:"dark"}],
        [{c:"light"},{c:"medium"},{c:"medium"},{c:"dark"},{c:"dark"},{c:"light"}],
        [{c:"medium"},{c:"medium"},{c:"medium"},{c:"medium"},{c:"medium"},{c:"medium"}],
        [{c:"medium"},{c:"dark"},{c:"light"},{c:"light"},{c:"medium"},{c:"dark"}]
      ]
    ]
  },

  'mosaicMitres': {
    'tileShape': "flatTopHexatile",
    'tileOffset': 0,
    'tileStroke': "",
    'tilePattern': [
      [
        [{c:"dark"},{c:"light"},{c:"dark"},{c:"dark"},{c:"dark"},{c:"dark"}],   
        [{c:"light"},{c:"medium"},{c:"light"},{c:"light"},{c:"light"},{c:"light"}],
        [{c:"medium"},{c:"dark"},{c:"medium"},{c:"medium"},{c:"medium"},{c:"medium"}]

      ],
      [
        [{c:"medium"},{c:"dark"},{c:"medium"},{c:"medium"},{c:"medium"},{c:"medium"}],
        [{c:"dark"},{c:"light"},{c:"dark"},{c:"dark"},{c:"dark"},{c:"dark"}],        [{c:"light"},{c:"medium"},{c:"light"},{c:"light"},{c:"light"},{c:"light"}],
        [{c:"light"},{c:"medium"},{c:"light"},{c:"light"},{c:"light"},{c:"light"}]
      ]
    ]
  },

  'flatTop1x1': {
    'tileShape': "flatTopHexatile",
    'tileOffset': 0,
    'tileStroke': "",
    'tilePattern': [
      [
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"medium", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}]         
      ]
    ]
  },

  'flatTop1x2': {
    'tileShape': "flatTopHexatile",
    'tileOffset': 0,
    'tileStroke': "",
    'tilePattern': [
      [
        [{c:"light"},{c:"light"},{c:"light"},{c:"light"},{c:"light"},{c:"light"}], 
        [{c:"dark"},{c:"dark"},{c:"dark"},{c:"dark"},{c:"dark"},{c:"dark"}]         
      ]
    ]
  },
  'flatTop2x2': {
    'tileShape': "flatTopHexatile",
    'tileOffset': 0,
    'tileStroke': "",
    'tilePattern': [
      [
        [{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"}], 
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"medium", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}], 
      ],
      [
        [{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"}],
        [{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"}]         
         
      ]
    ]
  },
  'flatTop2x1': {
    'tileShape': "flatTopHexatile",
    'tileOffset': 0,
    'tileStroke': "",
    'tilePattern': [
      [
        [{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"}], 
      ],
      [
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"medium", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}], 
      ]
    ]
  },

  'flatTop3x1': {
    'tileShape': "flatTopHexatile",
    'tileOffset': 0,
    'tileStroke': "",
    'tilePattern': [
      [
        [{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"}], 
      ],
      [
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"medium", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}], 
      ],
      [
        [{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"}], 
      ]
    ]
  },

  'flatTop3x3': {
    'tileShape': "flatTopHexatile",
    'tileOffset': 0,
    'tileStroke': "",
    'tilePattern': [
      [
        [{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"}], 
        [{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"}], 
        [{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c: "medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"}]

      ],
      [
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"medium", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}],
        [{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"}], 
        [{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"}] 

      ],
      [
        [{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"}],
        [{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"}], 
        [{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"}]
      ]
    ]
  },

  'flatTop4x4': {
    'tileShape': "flatTopHexatile",
    'tileOffset': 0,
    'tileStroke': "",
    'tilePattern': [
      [
        [{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"}], 
        [{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"}], 
        [{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c: "medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"}], 
        [{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c: "medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"}]

      ],
      [
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"medium", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}],
        [{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"}], 
        [{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"}], 
        [{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c: "medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"}] 

      ],
      [
        [{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"}],
        [{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"}], 
        [{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"}], 
        [{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c: "medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"}]
      ],
      [
        [{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"}],
        [{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"}], 
        [{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"}], 
        [{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c: "medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"}]
      ]
    ]
  },


  'pointyTop1x1': {
    'tileShape': "pointyTopHexatile",
    'tileOffset': 0,
    'tileStroke': "",
    'tilePattern': [
      [
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"medium", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}]         
      ]
    ]
  },
  'pointyTop1x2': {
    'tileShape': "pointyTopHexatile",
    'tileOffset': 0,
    'tileStroke': "",
    'tilePattern': [
      [
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"medium", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}], 
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}]          
      ]
    ]
  },

  'pointyTop2x1': {
    'tileShape': "pointyTopHexatile",
    'tileOffset': 0,
    'tileStroke': "",
    'tilePattern': [
      [
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}]
      ],
      [         
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}] 
      ]
    ]
  },
  'pointyTop2x2': {
    'tileShape': "pointyTopHexatile",
    'tileOffset': 0,
    'tileStroke': "",
    'tilePattern': [
      [
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}],         
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"medium", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}] 
      ], 
      [
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"medium", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}],         
        [{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"}] 
      ]
    ]
  },
  'pointyTop3x3': {
    'tileShape': "pointyTopHexatile",
    'tileXOffset': 0,
    'tileStroke': "",
    'tilePattern': [
      [
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}],         
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}], 
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}] 

      ], 
      [
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}],         
        [{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"},{c:"medium", s:"accent"}], 
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}] 

      ], 
      [
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}],         
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}], 
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}] 

      ]
    ]
  },
  'pointyTop4x4': {
    'tileShape': "pointyTopHexatile",
    'tileOffset': 0,
    'tileStroke': "",
    'tilePattern': [
      [
        [{c:"dark", s:"accent"},{c:"light", sa:"light"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}],         
        [{c:"dark", s:"accent"},{c:"light", sa:"light"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}],         
        [{c:"dark", s:"accent"},{c:"light", sa:"light"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}],         
        [{c:"dark", s:"accent"},{c:"light", sa:"light"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}]         
      ], 
      [
        [{c:"dark", s:"accent"},{c:"light", sb:"light"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}],         
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}], 
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}], 
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}]  

      ], 
      [
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}],         
        [{c:"dark", s:"accent"},{c:"dark", sc:"dark"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"}], 
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}], 
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}]  

      ], 
      [
        [{c:"dark", s:"accent"},{c:"light", sb:"light"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}],         
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}], 
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}], 
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}]  

      ]
    ]
  },

  'pointyTop5x5': {
    'tileShape': "pointyTopHexatile",
    'tileOffset': 0,
    'tileStroke': "",
    'tilePattern': [
      [
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}],         
        [{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"}], 
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}], 
        [{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"}],
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}]
      ], 
      [
        [{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"}],         
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}], 
        [{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"}], 
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}],
        [{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"}]
      ], 
      [
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}],         
        [{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"}], 
        [{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"}], 
        [{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"}],
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}]
      ], 
      [
        [{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"}],         
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}], 
        [{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"}], 
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}],
        [{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"}]
      ],
      [
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}],         
        [{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"}], 
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}], 
        [{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"}],
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}]
      ]
    ]
  },

  'pointyTop6x6': {
    'tileShape': "pointyTopHexatile",
    'tileOffset': 0,
    'tileStroke': "",
    'tilePattern': [
      [
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}],         
        [{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"}], 
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}], 
        [{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"}],
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}],
        [{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"}]
      ], 
      [
        [{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"}],         
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}], 
        [{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"}], 
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}],
        [{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"}],
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}]
      ], 
      [
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}],         
        [{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"}], 
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}], 
        [{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"}],
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}],
        [{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"}]
      ], 
      [
        [{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"}],         
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}], 
        [{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"}], 
        [{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"}], 
        [{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"}],
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}]
      ],
      [
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}],         
        [{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"}], 
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}], 
        [{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"}],
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}],
        [{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"}]
      ],
      [
        [{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"}],         
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}], 
        [{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"}], 
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}],
        [{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"}],
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}]
      ]
    ]
  },

  'monoTileWithStroke': {
    'tileShape': "flatTopHexatile",
    'tileOffset': 0,
    'tileStroke': "",
    'tilePattern': [
      [
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}],         
        [{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"},{c:"dark", s:"accent"},{c:"light", s:"accent"},{c:"dark", s:"accent"}] 
      ]
    ]
  },

  'chamferedHex': {
    'tileShape': "flatTopHexatile",
    'tilePattern': [
      [
        [{c: "light", s: "accent"}],
        [{c: "light", s: "dark"}],
        [{c: "light", s: "dark"}],
        [{c: "light", s: "dark"}],
        [{c: "light", s: "dark"}],
        [{c: "light", s: "dark"}]
      ],
      [
        [{c: "medium"}],
        [{c: "medium", s: "dark"}],
        [{c: "medium", s: "dark"}],
        [{c: "medium", s: "dark"}],
        [{c: "medium", s: "dark"}]
        [{c: "medium", s: "dark"}]
      ],
      [
        [{c: "dark"}],
        [{c: "dark", s: "dark"}],
        [{c: "dark", s: "dark"}],
        [{c: "dark", s: "dark"}],
        [{c: "dark", s: "dark"}],
        [{c: "dark", s: "dark"}]
      ],
      [
        [{c: "dark"}],
        [{c: "medium", s: "dark"}],
        [{c: "dark", s: "dark"}],
        [{c: "medium", s: "dark"}],
        [{c: "dark", s: "dark"}],
        [{c: "medium", s: "dark"}]
      ]
    ]
  },


  'egyptianHexatile': {
    'tileShape': "flatTopHexagon",
    'tilePattern': [

    ]
  },

  'brokeHexatile': {
    "tileShape": "flatTopHexagon",
    'tilePattern': [
    ]
  }
};

export default TileDesigns; 
