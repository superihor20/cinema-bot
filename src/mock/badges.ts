export const badges = [
  { id: 1, name: 'alco' },
  { id: 2, name: 'anime' },
  { id: 3, name: 'tv shows' },
];

export type Badge = typeof badges[number];

export type Badges = Badge[];
