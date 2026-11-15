export type CollectionSlug = 'led-matrix' | 'laser' | 'kinetic';

export interface FigmaProductModel {
  id: string;
  collection: CollectionSlug;
  collectionName: string;
  kicker: string;
  shortLabel: string;
  titleLine1: string;
  titleLine2: string;
  fullName: string;
  cardTag: string;
  cardSubtitle?: string;
  heroSummary: string;
  imageUrl: string;
  specs: { label: string; value: string }[];
  specsFootnote: string;
  applicationsLead: string;
  applicationsBody: string;
  applicationsFootnote: string;
}

export interface CollectionPageData {
  slug: CollectionSlug;
  name: string;
  kicker: string;
  heroLine1: string;
  heroLine2: string;
  heroDescription: string;
  heroImage: string;
  rangeKicker: string;
  rangeTitle: string;
  inspirationKicker: string;
  inspirationTitle: string;
  inspirationItems: { num: string; title: string; body: string }[];
  bannerKicker: string;
  bannerTitle: string;
}

export const FIGMA_ASSETS = {
  heroConcert: '/assets/squaresnake/hero-concert.jpg',
  ledMatrix: '/assets/squaresnake/led-matrix.jpg',
  laser: '/assets/squaresnake/laser.jpg',
  kineticBalls: '/assets/squaresnake/kinetic-balls.jpg',
  kineticRings: '/assets/squaresnake/kinetic-rings.jpg',
  kineticLanterns: '/assets/squaresnake/kinetic-lanterns.jpg',
  kineticMilkDrop: '/assets/squaresnake/kinetic-milk-drop.jpg',
  kineticMetalSpheres: '/assets/squaresnake/kinetic-metal-spheres.jpg',
};

export const COLLECTIONS: Record<CollectionSlug, CollectionPageData> = {
  'led-matrix': {
    slug: 'led-matrix',
    name: 'LED Matrix',
    kicker: '01 / LED MATRIX',
    heroLine1: 'Every pixel.',
    heroLine2: 'Every possibility.',
    heroDescription:
      'Shape your show with expressive pixel effects.\nExplore 20-pixel and 60-pixel LED Matrix variants.',
    heroImage: FIGMA_ASSETS.ledMatrix,
    rangeKicker: 'FIND YOUR FORMAT',
    rangeTitle: 'The LED Matrix range',
    inspirationKicker: 'PROGRAM INSPIRATION',
    inspirationTitle: 'A new language of light.',
    inspirationItems: [
      {
        num: '01 / Pixel chase',
        title: '',
        body: 'Build rhythm with flowing sequences and directional trails.',
      },
      {
        num: '02 / Wave forms',
        title: '',
        body: 'Turn an array into fluid, sculptural movement.',
      },
      {
        num: '03 / Pattern play',
        title: '',
        body: 'Explore geometric textures and choreographed intensity.',
      },
    ],
    bannerKicker: "LET'S TALK PIXELS",
    bannerTitle: 'Your show. Your configuration.',
  },
  laser: {
    slug: 'laser',
    name: 'Laser',
    kicker: '02 / LASER',
    heroLine1: 'Precision light.',
    heroLine2: 'Powerful impact.',
    heroDescription:
      'Explore laser systems in four power options.\nFind a starting point for your next production.',
    heroImage: FIGMA_ASSETS.laser,
    rangeKicker: 'EXPLORE THE COLLECTION',
    rangeTitle: 'The Laser range',
    inspirationKicker: 'BEAM & SHOW INSPIRATION',
    inspirationTitle: 'Make light the main event.',
    inspirationItems: [
      {
        num: '01 / Beam fans',
        title: '',
        body: 'Create bold geometry with sweeping fans of light.',
      },
      {
        num: '02 / Aerial textures',
        title: '',
        body: 'Explore layered beam patterns and atmospheric depth.',
      },
      {
        num: '03 / Show cues',
        title: '',
        body: 'Design moments around music, space and movement.',
      },
    ],
    bannerKicker: "LET'S TALK LASERS",
    bannerTitle: 'A setup shaped around your show.',
  },
  kinetic: {
    slug: 'kinetic',
    name: 'Kinetic',
    kicker: '03 / KINETIC',
    heroLine1: 'Sculpt the air.',
    heroLine2: 'Move the room.',
    heroDescription:
      'Suspended forms. Choreographed movement.\nExplore five shapes for your kinetic installation.',
    heroImage: FIGMA_ASSETS.kineticBalls,
    rangeKicker: 'EXPLORE THE COLLECTION',
    rangeTitle: 'The Kinetic range',
    inspirationKicker: 'MOTION INSPIRATION',
    inspirationTitle: 'More than a lighting fixture.',
    inspirationItems: [
      {
        num: '01 / Wave motion',
        title: '',
        body: 'Imagine fluid shapes travelling across a suspended array.',
      },
      {
        num: '02 / Living sculptures',
        title: '',
        body: 'Explore changing volumes and three-dimensional forms.',
      },
      {
        num: '03 / Light choreography',
        title: '',
        body: 'Bring together movement, light and musical rhythm.',
      },
    ],
    bannerKicker: "LET'S TALK MOVEMENT",
    bannerTitle: 'A setup shaped around your show.',
  },
};

export const PRODUCT_MODELS: FigmaProductModel[] = [
  // LED Matrix (2 models)
  {
    id: 'led-matrix-20-pixel',
    collection: 'led-matrix',
    collectionName: 'LED Matrix',
    kicker: 'LED MATRIX / 20-PIXEL',
    shortLabel: '20-pixel',
    titleLine1: '20-pixel',
    titleLine2: 'LED Matrix',
    fullName: '20-pixel LED Matrix',
    cardTag: 'Discover the 20-pixel format for your next design.',
    heroSummary: 'Build your pixel lighting concept around the 20-pixel LED Matrix variant.',
    imageUrl: FIGMA_ASSETS.ledMatrix,
    specs: [
      { label: 'Variant', value: '20-pixel' },
      { label: 'Dimensions / weight', value: 'To be confirmed' },
      { label: 'Power requirements', value: 'To be confirmed' },
      { label: 'Control protocol', value: 'To be confirmed' },
      { label: 'Mounting / rigging', value: 'To be confirmed' },
      { label: 'Certification / safety', value: 'To be confirmed' },
    ],
    specsFootnote: 'Only the variant is supplied. All other technical details need verification before publication.',
    applicationsLead: 'Pixel chases. Wave forms. Graphic textures.',
    applicationsBody: 'Explore how pixel-based lighting could shape a stage, installation or live performance.',
    applicationsFootnote: 'Illustrative concept. Verified show references and model-specific media to be supplied.',
  },
  {
    id: 'led-matrix-60-pixel',
    collection: 'led-matrix',
    collectionName: 'LED Matrix',
    kicker: 'LED MATRIX / 60-PIXEL',
    shortLabel: '60-pixel',
    titleLine1: '60-pixel',
    titleLine2: 'LED Matrix',
    fullName: '60-pixel LED Matrix',
    cardTag: 'Explore the 60-pixel format and creative possibilities.',
    heroSummary: 'Build your pixel lighting concept around the 60-pixel LED Matrix variant.',
    imageUrl: FIGMA_ASSETS.ledMatrix,
    specs: [
      { label: 'Variant', value: '60-pixel' },
      { label: 'Dimensions / weight', value: 'To be confirmed' },
      { label: 'Power requirements', value: 'To be confirmed' },
      { label: 'Control protocol', value: 'To be confirmed' },
      { label: 'Mounting / rigging', value: 'To be confirmed' },
      { label: 'Certification / safety', value: 'To be confirmed' },
    ],
    specsFootnote: 'Only the variant is supplied. All other technical details need verification before publication.',
    applicationsLead: 'Pixel chases. Wave forms. Graphic textures.',
    applicationsBody: 'Explore how pixel-based lighting could shape a stage, installation or live performance.',
    applicationsFootnote: 'Illustrative concept. Verified show references and model-specific media to be supplied.',
  },

  // Laser (4 models: 20W, 30W, 40W, 60W)
  ...(['20W', '30W', '40W', '60W'] as const).map((power) => ({
    id: `laser-${power.toLowerCase()}`,
    collection: 'laser' as const,
    collectionName: 'Laser',
    kicker: `LASER / ${power}`,
    shortLabel: power,
    titleLine1: power,
    titleLine2: 'Laser',
    fullName: `${power} Laser`,
    cardTag: `Laser system / ${power}`,
    heroSummary: `Explore the ${power} laser option for your next production. Ask for a verified system datasheet.`,
    imageUrl: FIGMA_ASSETS.laser,
    specs: [
      { label: 'Power option', value: power },
      { label: 'Wavelengths / colour', value: 'To be confirmed' },
      { label: 'Scan system / scan angle', value: 'To be confirmed' },
      { label: 'Control protocol', value: 'To be confirmed' },
      { label: 'Dimensions / weight', value: 'To be confirmed' },
      { label: 'Laser safety / certification', value: 'To be confirmed' },
    ],
    specsFootnote: 'Power options are supplied; output ratings and full specifications require manufacturer verification.',
    applicationsLead: 'Beam fans. Aerial patterns. Show moments.',
    applicationsBody:
      'Imagine the visual possibilities for a live show or installation. Final selection requires venue planning and a professional laser safety assessment.',
    applicationsFootnote: 'Illustrative concept. Verified show references and model-specific media to be supplied.',
  })),

  // Kinetic (5 models: Balls, Rings, Lanterns, Milk-drop, Metal spheres)
  {
    id: 'kinetic-balls',
    collection: 'kinetic',
    collectionName: 'Kinetic',
    kicker: 'KINETIC / BALLS',
    shortLabel: 'Balls',
    titleLine1: 'Kinetic',
    titleLine2: 'Balls',
    fullName: 'Kinetic Balls',
    cardTag: 'Kinetic / Balls',
    heroSummary: 'Explore balls as part of a suspended kinetic installation designed around your space.',
    imageUrl: FIGMA_ASSETS.kineticBalls,
    specs: [
      { label: 'Form', value: 'Balls' },
      { label: 'Dimensions / weight', value: 'To be confirmed' },
      { label: 'Power requirements', value: 'To be confirmed' },
      { label: 'Motion / control', value: 'To be confirmed' },
      { label: 'Travel / speed', value: 'To be confirmed' },
      { label: 'Certification / safety', value: 'To be confirmed' },
    ],
    specsFootnote: 'Shapes are supplied. Dimensions, motion, load ratings and safety details need manufacturer verification.',
    applicationsLead: 'Sculptural forms. Choreographed movement.',
    applicationsBody: 'Imagine a moving installation built around balls. Discuss layout, suspension and the visual rhythm of your space.',
    applicationsFootnote: 'Illustrative concept. Verified show references and model-specific media to be supplied.',
  },
  {
    id: 'kinetic-rings',
    collection: 'kinetic',
    collectionName: 'Kinetic',
    kicker: 'KINETIC / RINGS',
    shortLabel: 'Rings',
    titleLine1: 'Kinetic',
    titleLine2: 'Rings',
    fullName: 'Kinetic Rings',
    cardTag: 'Kinetic / Rings',
    heroSummary: 'Explore rings as part of a suspended kinetic installation designed around your space.',
    imageUrl: FIGMA_ASSETS.kineticRings,
    specs: [
      { label: 'Form', value: 'Rings' },
      { label: 'Dimensions / weight', value: 'To be confirmed' },
      { label: 'Power requirements', value: 'To be confirmed' },
      { label: 'Motion / control', value: 'To be confirmed' },
      { label: 'Travel / speed', value: 'To be confirmed' },
      { label: 'Certification / safety', value: 'To be confirmed' },
    ],
    specsFootnote: 'Shapes are supplied. Dimensions, motion, load ratings and safety details need manufacturer verification.',
    applicationsLead: 'Sculptural forms. Choreographed movement.',
    applicationsBody: 'Imagine a moving installation built around rings. Discuss layout, suspension and the visual rhythm of your space.',
    applicationsFootnote: 'Illustrative concept. Verified show references and model-specific media to be supplied.',
  },
  {
    id: 'kinetic-lanterns',
    collection: 'kinetic',
    collectionName: 'Kinetic',
    kicker: 'KINETIC / LANTERNS',
    shortLabel: 'Lanterns',
    titleLine1: 'Kinetic',
    titleLine2: 'Lanterns',
    fullName: 'Kinetic Lanterns',
    cardTag: 'Kinetic / Lanterns',
    heroSummary: 'Explore lanterns as part of a suspended kinetic installation designed around your space.',
    imageUrl: FIGMA_ASSETS.kineticLanterns,
    specs: [
      { label: 'Form', value: 'Lanterns' },
      { label: 'Dimensions / weight', value: 'To be confirmed' },
      { label: 'Power requirements', value: 'To be confirmed' },
      { label: 'Motion / control', value: 'To be confirmed' },
      { label: 'Travel / speed', value: 'To be confirmed' },
      { label: 'Certification / safety', value: 'To be confirmed' },
    ],
    specsFootnote: 'Shapes are supplied. Dimensions, motion, load ratings and safety details need manufacturer verification.',
    applicationsLead: 'Sculptural forms. Choreographed movement.',
    applicationsBody: 'Imagine a moving installation built around lanterns. Discuss layout, suspension and the visual rhythm of your space.',
    applicationsFootnote: 'Illustrative concept. Verified show references and model-specific media to be supplied.',
  },
  {
    id: 'kinetic-milk-drop',
    collection: 'kinetic',
    collectionName: 'Kinetic',
    kicker: 'KINETIC / MILK-DROP',
    shortLabel: 'Milk-drop',
    titleLine1: 'Kinetic',
    titleLine2: 'Milk-drop',
    fullName: 'Kinetic Milk-drop',
    cardTag: 'Kinetic / Milk-drop',
    heroSummary: 'Explore milk-drop as part of a suspended kinetic installation designed around your space.',
    imageUrl: FIGMA_ASSETS.kineticMilkDrop,
    specs: [
      { label: 'Form', value: 'Milk-drop' },
      { label: 'Dimensions / weight', value: 'To be confirmed' },
      { label: 'Power requirements', value: 'To be confirmed' },
      { label: 'Motion / control', value: 'To be confirmed' },
      { label: 'Travel / speed', value: 'To be confirmed' },
      { label: 'Certification / safety', value: 'To be confirmed' },
    ],
    specsFootnote: 'Shapes are supplied. Dimensions, motion, load ratings and safety details need manufacturer verification.',
    applicationsLead: 'Sculptural forms. Choreographed movement.',
    applicationsBody: 'Imagine a moving installation built around milk-drop. Discuss layout, suspension and the visual rhythm of your space.',
    applicationsFootnote: 'Illustrative concept. Verified show references and model-specific media to be supplied.',
  },
  {
    id: 'kinetic-metal-spheres',
    collection: 'kinetic',
    collectionName: 'Kinetic',
    kicker: 'KINETIC / METAL SPHERES',
    shortLabel: 'Metal spheres',
    titleLine1: 'Kinetic',
    titleLine2: 'Metal spheres',
    fullName: 'Kinetic Metal spheres',
    cardTag: 'Kinetic / Metal spheres',
    heroSummary: 'Explore metal spheres as part of a suspended kinetic installation designed around your space.',
    imageUrl: FIGMA_ASSETS.kineticMetalSpheres,
    specs: [
      { label: 'Form', value: 'Metal spheres' },
      { label: 'Dimensions / weight', value: 'To be confirmed' },
      { label: 'Power requirements', value: 'To be confirmed' },
      { label: 'Motion / control', value: 'To be confirmed' },
      { label: 'Travel / speed', value: 'To be confirmed' },
      { label: 'Certification / safety', value: 'To be confirmed' },
    ],
    specsFootnote: 'Shapes are supplied. Dimensions, motion, load ratings and safety details need manufacturer verification.',
    applicationsLead: 'Sculptural forms. Choreographed movement.',
    applicationsBody: 'Imagine a moving installation built around metal spheres. Discuss layout, suspension and the visual rhythm of your space.',
    applicationsFootnote: 'Illustrative concept. Verified show references and model-specific media to be supplied.',
  },
];
