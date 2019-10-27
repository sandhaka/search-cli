/**
 * Simplified directed graph map of north italy
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
