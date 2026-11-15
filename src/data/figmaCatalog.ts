import {
  CmsMediaItem,
  CmsProjectCase,
  CollectionSlug,
  FigmaProductModel,
  SiteSettings,
} from '../types/cms';

export type { CollectionSlug, FigmaProductModel } from '../types/cms';

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
    videoUrl: '',
    galleryImages: [],
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
    videoUrl: '',
    galleryImages: [],
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
    videoUrl: '',
    galleryImages: [],
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
    videoUrl: '',
    galleryImages: [],
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
    videoUrl: '',
    galleryImages: [],
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
    videoUrl: '',
    galleryImages: [],
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
    videoUrl: '',
    galleryImages: [],
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
    videoUrl: '',
    galleryImages: [],
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

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  companyName: 'CÔNG TY TNHH SQUARESNAKE FX VIỆT NAM',
  heroKicker: 'LIGHT. MOTION. IMPACT.',
  heroTitleLine1: 'Built for the',
  heroTitleLine2: 'unforgettable.',
  heroDescription:
    'LED Matrix, laser and kinetic systems.\nExtraordinary possibilities for your next show.',
  heroImageUrl: FIGMA_ASSETS.heroConcert,
  heroVideoUrl: '',
  aboutKicker: 'VỀ SQUARESNAKE FX VIỆT NAM',
  aboutTitleLine1: 'Kỹ thuật chính xác.',
  aboutTitleLine2: 'Hiệu ứng đỉnh cao.',
  aboutDescription:
    'Công ty TNHH SquareSnake FX Việt Nam chuyên cung cấp, cho thuê và trực tiếp lập trình vận hành các hệ thống LED Matrix, Laser công suất lớn và cơ khí Kinetic cho concert, triển lãm và sự kiện quy mô lớn tại Hà Nội, TP.HCM và toàn quốc.',
  aboutImageUrl: FIGMA_ASSETS.heroConcert,
  footerDescription:
    'Sự cam kết không ngừng nghỉ của chúng tôi trong việc thúc đẩy công nghệ ánh sáng sân khấu Kinetic, Laser và LED Matrix đã mang lại danh tiếng vững chắc trong ngành tổ chức sự kiện.',
  phone: '+84 909 886 247',
  zalo: '+84 909 886 247',
  email: 'baogia@squaresnake.vn',
  address:
    'Lô B4-12 Khu công nghiệp Thạch Bàn, Quận Long Biên, Hà Nội & 88 Nguyễn Văn Linh, Quận 7, TP.HCM.',
};

export const DEFAULT_PROJECTS: CmsProjectCase[] = [
  {
    id: 'case-song-dem',
    num: '01 / MUSIC FESTIVAL',
    title: 'Đại Nhạc Hội Sóng Đêm — SVĐ Mỹ Đình',
    detail: 'Laser 60W & 40W · Kinetic Balls · Timecode GrandMA3',
    summary:
      'Triển khai đồng bộ hệ thống tia Laser công suất lớn ngoài trời kết hợp ma trận Kinetic trên giàn truss chính cho 35.000 khán giả.',
    imageUrl: FIGMA_ASSETS.laser,
    videoUrl: '',
    slug: 'laser',
  },
  {
    id: 'case-secc-auto',
    num: '02 / AUTO EXHIBITION',
    title: 'Triển Lãm Ô Tô Tương Lai — SECC Quận 7',
    detail: 'Kinetic Rings · Kinetic Metal spheres',
    summary:
      'Hệ thống vòng Kinetic đa trục chuyển động mượt mà phía trên khu trưng bày xe concept suốt 10 giờ/ngày.',
    imageUrl: FIGMA_ASSETS.kineticRings,
    videoUrl: '',
    slug: 'kinetic',
  },
  {
    id: 'case-countdown-hcm',
    num: '03 / LIVE STAGE & TV',
    title: 'Countdown Gala — Phố Đi Bộ Nguyễn Huệ',
    detail: '60-pixel LED Matrix · Laser 30W',
    summary:
      'Tổ hợp bức tường LED Matrix hiệu ứng sóng pixel 3D không nhấp nháy trên camera truyền hình trực tiếp.',
    imageUrl: FIGMA_ASSETS.ledMatrix,
    videoUrl: '',
    slug: 'led-matrix',
  },
];

export const DEFAULT_MEDIA_LIBRARY: CmsMediaItem[] = [
  {
    id: 'media-hero-concert',
    title: 'Concert Stage Concept',
    type: 'image',
    url: FIGMA_ASSETS.heroConcert,
    category: 'Sân khấu chính',
    createdAt: '2026-11-10T08:00:00.000Z',
  },
  {
    id: 'media-led-matrix',
    title: 'LED Matrix Wave Array',
    type: 'image',
    url: FIGMA_ASSETS.ledMatrix,
    category: 'LED Matrix',
    createdAt: '2026-11-10T08:05:00.000Z',
  },
  {
    id: 'media-laser-beams',
    title: 'Laser Fan Array',
    type: 'image',
    url: FIGMA_ASSETS.laser,
    category: 'Laser',
    createdAt: '2026-11-10T08:10:00.000Z',
  },
  {
    id: 'media-kinetic-balls',
    title: 'Kinetic Balls Array',
    type: 'image',
    url: FIGMA_ASSETS.kineticBalls,
    category: 'Kinetic',
    createdAt: '2026-11-10T08:15:00.000Z',
  },
  {
    id: 'media-kinetic-rings',
    title: 'Kinetic Double Axis Rings',
    type: 'image',
    url: FIGMA_ASSETS.kineticRings,
    category: 'Kinetic',
    createdAt: '2026-11-10T08:20:00.000Z',
  },
];
