export const users = [
  {
    email: 'etcetc1820@gmail.com',
    telegramId: 346333684,
    fullName: 'Ihor Naidonov',
    badges: [
      { id: 1, name: 'alco' },
      { id: 2, name: 'anime' },
    ],
  },
  {
    email: 'greatanna787@gmail.com',
    telegramId: 442894190,
    fullName: 'Ann Naidonova',
    badges: [
      { id: 1, name: 'alco' },
      { id: 3, name: 'tv shows' },
    ],
  },
  {
    email: 'alex2077@gmail.com',
    telegramId: 419339079,
    fullName: 'Olexy Shevko',
    badges: [
      { id: 2, name: 'anime' },
      { id: 3, name: 'tv shows' },
    ],
  },
];

export type User = typeof users[number];

export type Users = User[];
