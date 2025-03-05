const shadowBox  = {
    tilePattern: "tileHexatiles",
    tileDesign: "triangleHexatile",
    tileColumns: 4,
    tileComponents: [
      ["medium"],
      ["medium", "medium", "medium"],
      ["light", "medium", "medium", "medium", "dark"],
      ["light", "light", "light", "medium", "dark", "dark", "dark"],
      ["light", "light", "light", "dark", "medium", "medium", "medium"],
      ["light", "dark", "dark", "dark", "medium"],
      ["dark", "dark", "dark"],
      ["dark"]
    ]
  };
  
  const persianKnots = {
    tilePattern: "regularTilingDiamond",
    tileDesign: "drawDiamondTriangleTile",
    tileColumns:6,
    tileMultiplier: 2.5,
    tileComponents: [
      ["light", "light"],
      ["light", "light", "light", "light"],
      ["medium", "medium", "medium", "medium", "medium", "medium"],
      ["dark", "dark", "dark", "dark"],
      ["dark", "dark"]
    ]
  };
  
  const mosaicMitre = {
    tilePattern: "tileHexatiles",
    tileDesign: "triangleHexatile",
    tileColumns: 3,
    tileMultiplier: .5,
    tiles: [
      ["light"],
      ["light", "light", "light"],
      ["dark", "light", "medium", "light", "dark"],
      ["dark", "medium", "medium", "medium", "dark"],
      ["medium", "dark", "medium"],
      ["dark"]
    ]
  };
  
  
  const altHex = {
    tilePattern: "tileAlternatingHexatile",
    tileDesign: "drawAlternatingPizzaHexatile",
    tileComponents: {
      a: [ 
        {color:"light", stroke:"dark", img:""},
        {color:"medium", stroke:"dark"},
        {color:"light", stroke:"dark"},
        {color:"medium", stroke:"dark"},
        {color:"dark", stroke:"dark"},
        {color:"medium", stroke:"dark"}
        ],
      b: [ 
       {color:"medium"},
       {color:"medium", stroke:"dark"},
       {color:"medium", stroke:"dark"},
       {color:"medium", stroke:"dark"},
       {color:"dark", stroke:"dark"},
       {color:"medium", stroke:"dark"}
      ]
    }
  };
  
  
  const palermoMeander = {
    tilePattern: "tileTripleHexatile",
    tileDesign: "drawTripleHexatile",
    tileComponents: {
      a: [ 
        {color:"accent", stroke:"bg"},
        {color:"accent", stroke:"bg"},
        {color:"medium", stroke:"bg"},
        {color:"dark", stroke:"bg"},
        {color:"medium", stroke:"bg"},
        {color:"dark", stroke:"bg"}
        ],
      b: [ 
       {color:"dark", stroke:"bg"},
       {color:"dark", stroke:"bg"},
       {color:"accent", stroke:"bg"},
       {color:"medium", stroke:"bg"},
       {color:"accent", stroke:"bg"},
       {color:"medium", stroke:"bg"}
      ],
      c: [ 
       {color:"medium", stroke:"bg"},
       {color:"medium", stroke:"bg"},
       {color:"dark", stroke:"bg"},
       {color:"light", stroke:"bg"},
       {color:"dark", stroke:"bg"},
       {color:"light", stroke:"bg"}
      ]
    }
  };
  
  
  const tripleHex = {
    tilePattern: "tileTriplegHexatile",
    tileDesign: "drawTripleHexatile",
    tileComponents: {
      a: [ 
        {color:"light", stroke:"accent"},
        {color:"medium", stroke:"accent"},
        {color:"light", stroke:"accent"},
        {color:"medium", stroke:"accent"},
        {color:"dark", stroke:"accent"},
        {color:"medium", stroke:"accent"}
        ],
      b: [ 
       {color:"medium", stroke:"accent"},
       {color:"medium", stroke:"accent"},
       {color:"medium", stroke:"accent"},
       {color:"medium", stroke:"accent"},
       {color:"dark", stroke:"accent"},
       {color:"medium", stroke:"accent"}
      ],
      c: [ 
       {color:"medium", stroke:"accent"},
       {color:"medium", stroke:"accent"},
       {color:"dark", stroke:"accent"},
       {color:"medium", stroke:"accent"},
       {color:"dark", stroke:"accent"},
       {color:"medium", stroke:"accent"}
      ]
    }
  };
  
  const quadHex = {
    tilePattern: "tileQuadHexatile",
    tileDesign: "drawQuadHexatile",
    tileComponents: {
      a: [ 
        {color:"light", stroke:"accent"},
        {color:"medium", stroke:"accent"},
        {color:"light", stroke:"accent"},
        {color:"medium", stroke:"accent"},
        {color:"dark", stroke:"accent"},
        {color:"medium", stroke:"accent"}
        ],
      b: [ 
       {color:"medium", stroke:"accent"},
       {color:"medium", stroke:"accent"},
       {color:"medium", stroke:"accent"},
       {color:"medium", stroke:"accent"},
       {color:"dark", stroke:"accent"},
       {color:"medium", stroke:"accent"}
      ],
      c: [ 
       {color:"medium", stroke:"accent"},
       {color:"medium", stroke:"accent"},
       {color:"dark", stroke:"accent"},
       {color:"medium", stroke:"accent"},
       {color:"dark", stroke:"accent"},
       {color:"medium", stroke:"accent"}
      ],
      d: [ 
       {color:"dark", stroke:"accent"},
       {color:"dark", stroke:"accent"},
       {color:"dark", stroke:"accent"},
       {color:"light", stroke:"accent"},
       {color:"dark", stroke:"accent"},
       {color:"dark", stroke:"accent"}
      ]
    }
  };
  
  
  
  const chamferedHex = {
  
    tilePattern: "Hexatile",
    tileDesigns: "PizzaHexatile",
    tileComponents: {
      a: [ 
           {color:"light"},
           {color:"light", stroke:{a:"dark"}},
           {color:"light", stroke:"dark"},
           {color:"light", stroke:"dark"},
           {color:"light", stroke:"dark"},
           {color:"light", stroke:"dark"}
         ],
      b: 
        [ 
          {color:"medium"},
          {color:"medium", stroke:{a:"dark"}},
          {color:"medium", stroke:"dark"},
          {color:"medium", stroke:"dark"},
          {color:"medium", stroke:"dark"},
          {color:"medium", stroke:"dark"}
        ],
      c: 
        [ 
          {color:"dark"},
          {color:"dark", stroke:{a:"dark"}},
          {color:"dark", stroke:"dark"},
          {color:"dark", stroke:"dark"},
          {color:"dark", stroke:"dark"},
          {color:"dark", stroke:"dark"}
        ],
      d: 
        [ 
          {color:"dark"},
          {color:"medium", stroke:{a:"dark"}},
          {color:"dark", stroke:"dark"},
          {color:"medium", stroke:"dark"},
          {color:"dark", stroke:"dark"},
          {color:"medium", stroke:"dark"}
        ]
      }
    };
  
  const egyptianHexatile  = {
    tilePattern: "tileHexatiles",
    tileDesign: "triangleHexatile",
    tileRows:24,
    tileColumns:12,
    tiles: [
      ["medium"], //1
      ["light", "medium", "medium"], //3
      ["light", "light", "light", "medium", "medium"], //5
      ["light", "light", "dark", "light", "light", "medium", "medium"], //7
      ["light", "light", "dark", "dark", "medium", "medium", "medium", "medium", "medium"], //9
      ["light", "light", "dark", "dark", "dark", "dark", "dark", "dark", "dark", "dark", "dark"], //11
      ["light", "light", "light", "light", "light", "light", "light", "light", "light", "light", "dark", "dark", "dark"], //13
      ["dark", "light", "light", "medium", "medium", "medium", "medium", "medium", "light", "light", "dark", "dark", "medium", "dark", "dark"], //15
      ["dark", "dark", "dark", "light", "light", "medium", "medium", "dark", "dark", "light", "dark", "dark", "medium", "medium", "medium", "dark", "dark"], //17
      ["dark", "dark", "medium", "dark", "dark", "light", "light", "medium", "medium", "dark", "dark", "dark", "medium", "medium", "light", "medium", "medium", "dark", "dark"], //19
      ["dark", "dark", "medium", "medium", "light", "light", "light", "light", "light", "medium", "medium", "dark", "medium", "medium", "light", "light", "dark", "dark", "dark", "dark", "dark"], //21
      ["dark", "dark", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "light", "light", "light", "light", "light", "light", "light", "light", "light"], //23
      ["dark", "dark", "dark", "dark", "dark", "dark", "dark", "dark", "dark", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "light", "light"], //23
      ["light", "light", "light", "light", "light", "dark", "dark", "medium", "medium", "light", "medium", "medium", "dark", "dark", "dark", "dark", "dark", "medium", "medium", "light", "light"], //21
      ["light", "light", "medium", "medium", "dark", "medium", "medium", "light", "light", "light", "medium", "medium", "dark", "dark", "light", "light", "medium", "light", "light"], //19
      ["light", "light", "medium", "medium", "medium", "light", "light", "dark", "light", "light", "medium", "medium", "dark", "dark", "light", "light", "light"], //17
      ["light", "light", "medium", "light", "light", "dark", "dark", "medium", "medium", "medium", "medium", "medium", "dark", "dark", "light"], //15
      ["light", "light", "light", "dark", "dark", "dark", "dark", "dark", "dark", "dark", "dark", "dark", "dark"], //13
      ["light", "light", "light", "light", "light", "light", "light", "light", "light", "dark", "dark"], //11
      ["medium", "medium", "medium", "medium", "medium", "light", "light", "dark", "dark"], //9
      ["medium", "medium", "dark", "dark", "light", "dark", "dark"], //7
      ["medium", "medium", "dark", "dark", "dark"], //5
      ["medium", "medium", "dark"], //3    
      ["medium"] //1
      ]
  };
  
  const brokeHexatile  = {
    tilePattern: "tileHexatiles",
    tileDesign: "triangleHexatile",
    tileRows:24,
    tileColumns:12,
    tiles: [
      ["medium"], //1
      ["light", "medium", "medium"], //3
      ["light", "light", "light", "medium", "medium"], //5
      ["light", "light", "dark", "light", "light", "medium", "medium"], //7
  
  
      ["light", "light", "dark", "dark", "medium", "medium", "medium", "medium", "medium"], //9
  
  
      ["light", "light", "dark", "dark", "dark", "dark", "dark", "dark", "dark", "dark", "dark"], //11
      ["light", "light", "light", "light", "light", "light", "light", "light", "light", "light", "dark", "dark", "dark"], //13
      ["dark", "light", "light", "medium", "medium", "medium", "medium", "medium", "light", "light", "dark", "dark", "medium", "dark", "dark"], //15
      ["dark", "dark", "dark", "light", "light", "medium", "medium", "dark", "dark", "light", "dark", "dark", "medium", "medium", "medium", "dark", "dark"], //17
      ["dark", "dark", "medium", "dark", "dark", "light", "light", "medium", "medium", "dark", "dark", "dark", "medium", "medium", "light", "medium", "medium", "dark", "dark"], //19
      ["dark", "dark", "medium", "medium", "light", "light", "light", "light", "light", "medium", "medium", "dark", "medium", "medium", "light", "light", "dark", "dark", "dark", "dark", "dark"], //21
      ["dark", "dark", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "light", "light", "light", "light", "light", "light", "light", "light", "light"], //23
      ["dark", "dark", "dark", "dark", "dark", "dark", "dark", "dark", "dark", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "medium", "light", "light"], //23
      ["light", "light", "light", "light", "light", "dark", "dark", "medium", "medium", "light", "medium", "medium", "dark", "dark", "dark", "dark", "dark", "medium", "medium", "light", "light"], //21
      ["light", "light", "medium", "medium", "dark", "medium", "medium", "light", "light", "light", "medium", "medium", "dark", "dark", "light", "light", "medium", "light", "light"], //19
      
  
      ["light", "light", "medium", "medium", "medium", "light", "light", "dark", "light", "light", "medium", "medium", "dark", "dark", "light", "light", "light"], //17
      ["light", "light", "medium", "light", "light", "dark", "dark", "medium", "medium", "medium", "medium", "medium", "dark", "dark", "light"], //15
      ["light", "light", "light", "dark", "dark", "dark", "dark", "dark", "dark", "dark", "dark", "dark", "dark"], //13
      ["light", "light", "light", "light", "light", "light", "light", "light", "light", "dark", "dark"], //11
      
      ["medium", "medium", "medium", "medium", "medium", "light", "light", "dark", "dark"], //9
      ["medium", "medium", "dark", "dark", "light", "dark", "dark"], //7
      ["medium", "medium", "dark", "dark", "dark"], //5
      ["medium", "medium", "dark"], //3    
      ["medium"] //1
      ]
  };