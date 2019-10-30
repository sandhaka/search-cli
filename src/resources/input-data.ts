/**
 * Simplified directed graph maps
 * Costs are the real distances in Kilometers, by the fastest roads
 */

export const NorthItalyDirectedGraph = [
  {
    State: "Milano",
    Cost: 0,
    Neighbors: [
      {
        State: "Monza",
        Cost: 26,
        Neighbors: []
      },
      {
        State: "Treviglio",
        Cost: 64,
        Neighbors: []
      },
      {
        State: "Crema",
        Cost: 46,
        Neighbors: []
      },
      {
        State: "Piacenza",
        Cost: 67,
        Neighbors: []
      },
      {
        State: "Rozzano",
        Cost: 13,
        Neighbors: []
      }
    ]
  },
  {
    State: "Monza",
    Cost: 0,
    Neighbors: [
      {
        State: "Bergamo",
        Cost: 45,
        Neighbors: []
      },
    ]
  },
  {
    State: "Rozzano",
    Cost: 0,
    Neighbors: [
      {
        State: "Pavia",
        Cost: 33,
        Neighbors: []
      },
    ]
  },
  {
    State: "Treviglio",
    Cost: 0,
    Neighbors: [
      {
        State: "Brescia",
        Cost: 57,
        Neighbors: []
      },
    ]
  },
  {
    State: "Crema",
    Cost: 0,
    Neighbors: [
      {
        State: "Cremona",
        Cost: 42,
        Neighbors: []
      },
    ]
  },
  {
    State: "Piacenza",
    Cost: 0,
    Neighbors: [
      {
        State: "Cremona",
        Cost: 43,
        Neighbors: []
      },
    ]
  },
  {
    State: "Brescia",
    Cost: 0,
    Neighbors: [
      {
        State: "Verona",
        Cost: 74,
        Neighbors: []
      },
      {
        State: "Mantua",
        Cost: 101,
        Neighbors: []
      }
    ]
  },
  {
    State: "Cremona",
    Cost: 0,
    Neighbors: [
      {
        State: "Mantua",
        Cost: 72,
        Neighbors: []
      }
    ]
  },
  {
    State: "Verona",
    Cost: 0,
    Neighbors: [
      {
        State: "Vicenza",
        Cost: 58,
        Neighbors: []
      },
      {
        State: "Padova",
        Cost: 88,
        Neighbors: []
      },
      {
        State: "Mantua",
        Cost: 48,
        Neighbors: []
      }
    ]
  },
  {
    State: "Vicenza",
    Cost: 0,
    Neighbors: [
      {
        State: "Treviso",
        Cost: 58,
        Neighbors: []
      },
      {
        State: "Venezia",
        Cost: 70,
        Neighbors: []
      }
    ]
  },
  {
    State: "Padova",
    Cost: 0,
    Neighbors: [
      {
        State: "Venezia",
        Cost: 39,
        Neighbors: []
      }
    ]
  },
  {
    State: "Treviso",
    Cost: 0,
    Neighbors: [
      {
        State: "Venezia",
        Cost: 41,
        Neighbors: []
      }
    ]
  }
];

export const RomaniaRoadMap = [
  {
    State: "Arad",
    Cost: 0,
    Neighbors: [
      {
        State: "Zerind",
        Cost: 75,
        Neighbors: []
      },
      {
        State: "Sibiu",
        Cost: 140,
        Neighbors: []
      },
      {
        State: "Timisoara",
        Cost: 118,
        Neighbors: []
      }
    ]
  },
  {
    State: "Bucharest",
    Cost: 0,
    Neighbors: [
      {
        State: "Urziceni",
        Cost: 85,
        Neighbors: []
      },
      {
        State: "Pitesti",
        Cost: 101,
        Neighbors: []
      },
      {
        State: "Giurgiu",
        Cost: 90,
        Neighbors: []
      },
      {
        State: "Fagaras",
        Cost: 211,
        Neighbors: []
      }
    ]
  },
  {
    State: "Craiova",
    Cost: 0,
    Neighbors: [
      {
        State: "Drobeta",
        Cost: 120,
        Neighbors: []
      },
      {
        State: "Rimnicu",
        Cost: 146,
        Neighbors: []
      },
      {
        State: "Pitesti",
        Cost: 138,
        Neighbors: []
      }
    ]
  },
  {
    State: "Drobeta",
    Cost: 0,
    Neighbors: [
      {
        State: "Mehadia",
        Cost: 75,
        Neighbors: []
      }
    ]
  },
  {
    State: "Eforie",
    Cost: 0,
    Neighbors: [
      {
        State: "Hirsova",
        Cost: 86,
        Neighbors: []
      }
    ]
  },
  {
    State: "Fagaras",
    Cost: 0,
    Neighbors: [
      {
        State: "Sibiu",
        Cost: 99,
        Neighbors: []
      }
    ]
  },
  {
    State: "Hirsova",
    Cost: 0,
    Neighbors: [
      {
        State: "Urziceni",
        Cost: 98,
        Neighbors: []
      }
    ]
  },
  {
    State: "Iasi",
    Cost: 0,
    Neighbors: [
      {
        State: "Vaslui",
        Cost: 92,
        Neighbors: []
      },
      {
        State: "Neamt",
        Cost: 87,
        Neighbors: []
      }
    ]
  },
  {
    State: "Lugoj",
    Cost: 0,
    Neighbors: [
      {
        State: "Timisoara",
        Cost: 111,
        Neighbors: []
      },
      {
        State: "Mehadia",
        Cost: 70,
        Neighbors: []
      }
    ]
  },
  {
    State: "Oradea",
    Cost: 0,
    Neighbors: [
      {
        State: "Zerind",
        Cost: 71,
        Neighbors: []
      },
      {
        State: "Sibiu",
        Cost: 151,
        Neighbors: []
      }
    ]
  },
  {
    State: "Pitesti",
    Cost: 0,
    Neighbors: [
      {
        State: "Rimnicu",
        Cost: 97,
        Neighbors: []
      }
    ]
  },
  {
    State: "Rimnicu",
    Cost: 0,
    Neighbors: [
      {
        State: "Sibiu",
        Cost: 80,
        Neighbors: []
      }
    ]
  },
  {
    State: "Urziceni",
    Cost: 0,
    Neighbors: [
      {
        State: "Vaslui",
        Cost: 142,
        Neighbors: []
      }
    ]
  }
];
