export interface University {
  id: string;
  name: string;
  shortName: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export const UNIVERSITIES: University[] = [
  {
    id: "ug",
    name: "University of Ghana",
    shortName: "UG",
    coordinates: {
      latitude: 5.6517,
      longitude: -0.1869
    }
  },
  {
    id: "knust",
    name: "Kwame Nkrumah University of Science and Technology",
    shortName: "KNUST",
    coordinates: {
      latitude: 6.6745,
      longitude: -1.5716
    }
  },
  {
    id: "ucc",
    name: "University of Cape Coast",
    shortName: "UCC",
    coordinates: {
      latitude: 5.1067,
      longitude: -1.2881
    }
  },
  {
    id: "academic-city",
    name: "Academic City University College",
    shortName: "Academic City",
    coordinates: {
      latitude: 5.6506,
      longitude: -0.0989
    }
  },
  {
    id: "gimpa",
    name: "Ghana Institute of Management and Public Administration",
    shortName: "GIMPA",
    coordinates: {
      latitude: 5.6503,
      longitude: -0.2151
    }
  },
  {
    id: "wisconsin",
    name: "Wisconsin International University College",
    shortName: "Wisconsin",
    coordinates: {
      latitude: 5.6447,
      longitude: -0.0883
    }
  },
  {
    id: "central",
    name: "Central University",
    shortName: "Central University",
    coordinates: {
      latitude: 5.7054,
      longitude: -0.2293
    }
  }
];

export const MAX_DISTANCE_KM = 5;
