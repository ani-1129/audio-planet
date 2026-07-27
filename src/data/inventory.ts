export type EquipmentCategory = 'audio' | 'lighting' | 'trussing';

export interface Pricing {
  day: number;
  weekend: number;
  month: number;
}

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  description?: string;
  pricing: Pricing;
  images: string[];
  depositPercentage: number;
}

export const inventory: Equipment[] = [
  // Audio
  {
    id: 'audio-srx815p',
    name: 'JBL SRX815P powered speaker',
    category: 'audio',
    pricing: { day: 2500, weekend: 4000, month: 15000 },
    images: ['/images/inventory/srx815p-1.jpg'],
    depositPercentage: 35
  },
  {
    id: 'audio-k12-2',
    name: 'QSC K12.2 powered speaker',
    category: 'audio',
    pricing: { day: 2200, weekend: 3600, month: 13000 },
    images: ['/images/inventory/k12-2-1.jpg'],
    depositPercentage: 35
  },
  {
    id: 'audio-ks118',
    name: 'QSC KS118 subwoofer',
    category: 'audio',
    pricing: { day: 3000, weekend: 4800, month: 18000 },
    images: ['/images/inventory/ks118-1.jpg'],
    depositPercentage: 35
  },
  {
    id: 'audio-sm58',
    name: 'Shure SM58 vocal microphone',
    category: 'audio',
    pricing: { day: 250, weekend: 400, month: 1500 },
    images: ['/images/inventory/sm58-1.jpg'],
    depositPercentage: 25
  },
  {
    id: 'audio-beta58a',
    name: 'Shure Beta 58A wireless handheld microphone',
    category: 'audio',
    pricing: { day: 1200, weekend: 2000, month: 7500 },
    images: ['/images/inventory/beta58a-1.jpg'],
    depositPercentage: 40
  },
  {
    id: 'audio-sm57',
    name: 'Shure SM57 instrument microphone',
    category: 'audio',
    pricing: { day: 250, weekend: 400, month: 1500 },
    images: ['/images/inventory/sm57-1.jpg'],
    depositPercentage: 25
  },
  {
    id: 'audio-ewd',
    name: 'Sennheiser EW-D wireless microphone system',
    category: 'audio',
    pricing: { day: 1500, weekend: 2500, month: 9000 }, // Estimated, not explicitly in pricing list but in equipment list
    images: ['/images/inventory/ewd-1.jpg'],
    depositPercentage: 40
  },
  {
    id: 'audio-x32',
    name: 'Behringer X32 digital mixing console',
    category: 'audio',
    pricing: { day: 4500, weekend: 7000, month: 25000 },
    images: ['/images/inventory/x32-1.jpg'],
    depositPercentage: 35
  },
  {
    id: 'audio-sq5',
    name: 'Allen & Heath SQ-5 digital mixer',
    category: 'audio',
    pricing: { day: 7500, weekend: 11000, month: 40000 },
    images: ['/images/inventory/sq5-1.jpg'],
    depositPercentage: 35
  },
  {
    id: 'audio-prodi',
    name: 'Radial ProDI direct box',
    category: 'audio',
    pricing: { day: 300, weekend: 500, month: 1800 }, // Estimated
    images: ['/images/inventory/prodi-1.jpg'],
    depositPercentage: 25
  },
  {
    id: 'audio-cables',
    name: 'XLR cables, TRS cables, mic stands, boom stands, and snake multicore',
    category: 'audio',
    pricing: { day: 500, weekend: 800, month: 2000 }, // Estimated bundle price
    images: ['/images/inventory/cables-1.jpg'],
    depositPercentage: 25
  },

  // Lighting
  {
    id: 'light-rogue-r2',
    name: 'Chauvet Rogue R2 wash light',
    category: 'lighting',
    pricing: { day: 1800, weekend: 3000, month: 10000 },
    images: ['/images/inventory/rogue-r2-1.jpg'],
    depositPercentage: 40
  },
  {
    id: 'light-focus-spot',
    name: 'ADJ Focus Spot moving head',
    category: 'lighting',
    pricing: { day: 2200, weekend: 3600, month: 12500 },
    images: ['/images/inventory/focus-spot-1.jpg'],
    depositPercentage: 40
  },
  {
    id: 'light-beamz-par',
    name: 'BeamZ LED PAR light',
    category: 'lighting',
    pricing: { day: 450, weekend: 700, month: 2500 },
    images: ['/images/inventory/beamz-par-1.jpg'],
    depositPercentage: 35
  },
  {
    id: 'light-mac-aura',
    name: 'Martin MAC Aura moving wash',
    category: 'lighting',
    pricing: { day: 3500, weekend: 5500, month: 20000 },
    images: ['/images/inventory/mac-aura-1.jpg'],
    depositPercentage: 40
  },
  {
    id: 'light-dmx-controller',
    name: 'DMX lighting controller',
    category: 'lighting',
    pricing: { day: 1500, weekend: 2500, month: 9000 },
    images: ['/images/inventory/dmx-controller-1.jpg'],
    depositPercentage: 35
  },
  {
    id: 'light-haze-machine',
    name: 'Haze machine',
    category: 'lighting',
    pricing: { day: 1000, weekend: 1600, month: 5000 },
    images: ['/images/inventory/haze-machine-1.jpg'],
    depositPercentage: 35
  },
  {
    id: 'light-strobe',
    name: 'Strobe light',
    category: 'lighting',
    pricing: { day: 800, weekend: 1200, month: 4000 }, // Estimated
    images: ['/images/inventory/strobe-1.jpg'],
    depositPercentage: 35
  },
  {
    id: 'light-uplights',
    name: 'LED uplights',
    category: 'lighting',
    pricing: { day: 400, weekend: 600, month: 2000 }, // Estimated
    images: ['/images/inventory/uplights-1.jpg'],
    depositPercentage: 35
  },
  {
    id: 'light-power-distro',
    name: 'Power distribution and dimmer packs',
    category: 'lighting',
    pricing: { day: 1500, weekend: 2500, month: 8000 }, // Estimated
    images: ['/images/inventory/power-distro-1.jpg'],
    depositPercentage: 35
  },

  // Trussing and stage
  {
    id: 'truss-12inch',
    name: '12-inch aluminum box truss section',
    category: 'trussing',
    pricing: { day: 900, weekend: 1400, month: 5000 },
    images: ['/images/inventory/truss-12inch-1.jpg'],
    depositPercentage: 40
  },
  {
    id: 'truss-ground-support',
    name: 'Ground support tower',
    category: 'trussing',
    pricing: { day: 4500, weekend: 7500, month: 25000 },
    images: ['/images/inventory/ground-support-1.jpg'],
    depositPercentage: 40
  },
  {
    id: 'truss-corner-block',
    name: 'Corner blocks and couplers',
    category: 'trussing',
    pricing: { day: 300, weekend: 500, month: 1500 }, // Estimated
    images: ['/images/inventory/corner-block-1.jpg'],
    depositPercentage: 40
  },
  {
    id: 'truss-base-plate',
    name: 'Base plates',
    category: 'trussing',
    pricing: { day: 200, weekend: 300, month: 1000 }, // Estimated
    images: ['/images/inventory/base-plate-1.jpg'],
    depositPercentage: 40
  },
  {
    id: 'truss-safety-sling',
    name: 'Safety slings and clamps',
    category: 'trussing',
    pricing: { day: 100, weekend: 150, month: 500 }, // Estimated
    images: ['/images/inventory/safety-sling-1.jpg'],
    depositPercentage: 40
  },
  {
    id: 'truss-stage-riser',
    name: 'Stage riser',
    category: 'trussing',
    pricing: { day: 2000, weekend: 3500, month: 12000 },
    images: ['/images/inventory/stage-riser-1.jpg'],
    depositPercentage: 40
  },
  {
    id: 'truss-cable-ramp',
    name: 'Cable ramp',
    category: 'trussing',
    pricing: { day: 500, weekend: 800, month: 3000 },
    images: ['/images/inventory/cable-ramp-1.jpg'],
    depositPercentage: 40
  }
];
