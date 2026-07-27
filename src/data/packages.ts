export interface PackageData {
  id: string;
  name: string;
  items: string[];
  demoPricePerDay: number;
  image: string;
}

export const preMadePackages: PackageData[] = [
  {
    id: 'pkg-wedding',
    name: 'Wedding Reception Package',
    items: [
      '2 full-range speakers',
      '2 subwoofers',
      '2 wireless microphones',
      '1 digital mixer',
      '8 PAR lights',
      '2 moving heads',
      '1 haze machine',
      '1 technician for setup'
    ],
    demoPricePerDay: 28000,
    image: '/images/packages/wedding.jpg'
  },
  {
    id: 'pkg-corporate',
    name: 'Corporate Seminar Package',
    items: [
      '2 powered speakers',
      '1 handheld wireless mic',
      '2 lapel microphones',
      '1 mixer',
      '4 white wash lights',
      '1 projector support truss'
    ],
    demoPricePerDay: 18500,
    image: '/images/packages/corporate.jpg'
  },
  {
    id: 'pkg-live-band',
    name: 'Live Band Package',
    items: [
      '4 main speakers',
      '2 subwoofers',
      '6 microphones',
      '1 digital mixer',
      '6 stage monitors',
      '10 lighting fixtures'
    ],
    demoPricePerDay: 42000,
    image: '/images/packages/live-band.jpg'
  },
  {
    id: 'pkg-dj-night',
    name: 'DJ Night Package',
    items: [
      '2 high-output speakers',
      '2 subwoofers',
      '2 wireless mics',
      '6 moving lights',
      '1 haze machine',
      '1 lighting controller'
    ],
    demoPricePerDay: 24000,
    image: '/images/packages/dj-night.jpg'
  }
];
