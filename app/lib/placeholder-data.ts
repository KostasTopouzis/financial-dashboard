// Demo data loaded by the /seed route.
//
// Every customer, invoice and revenue row belongs to exactly one user
// (its `user_id`). That ownership is what turns one shared dataset into a
// separate workspace per account. Two demo users are seeded so you can
// sign in as each of them and check that neither can see the other's data.
const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User',
    email: 'user@nextmail.com',
    password: '123456',
  },
  {
    id: '8f3c2a6e-5b1d-4c7e-9a2f-1d6b3e8c4a70',
    name: 'Second User',
    email: 'user2@nextmail.com',
    password: '123456',
  },
];

const [firstUser, secondUser] = users;

const customers = [
  // Workspace of the first user
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    user_id: firstUser.id,
    name: 'Evil Rabbit',
    email: 'evil@rabbit.com',
    image_url: '/customers/evil-rabbit.png',
  },
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    user_id: firstUser.id,
    name: 'Delba de Oliveira',
    email: 'delba@oliveira.com',
    image_url: '/customers/delba-de-oliveira.png',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
    user_id: firstUser.id,
    name: 'Lee Robinson',
    email: 'lee@robinson.com',
    image_url: '/customers/lee-robinson.png',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2f2',
    user_id: firstUser.id,
    name: 'Michael Novotny',
    email: 'michael@novotny.com',
    image_url: '/customers/michael-novotny.png',
  },
  {
    id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
    user_id: firstUser.id,
    name: 'Amy Burns',
    email: 'amy@burns.com',
    image_url: '/customers/amy-burns.png',
  },
  {
    id: '13D07535-C59E-4157-A011-F8D2EF4E0CBB',
    user_id: firstUser.id,
    name: 'Balazs Orban',
    email: 'balazs@orban.com',
    image_url: '/customers/balazs-orban.png',
  },

  // Workspace of the second user (fictional clients, reused avatar images)
  {
    id: 'a1b2c3d4-1111-4a5b-8c9d-0e1f2a3b4c5d',
    user_id: secondUser.id,
    name: 'Marlow & Finch',
    email: 'accounts@marlowfinch.com',
    image_url: '/customers/evil-rabbit.png',
  },
  {
    id: 'a1b2c3d4-2222-4a5b-8c9d-0e1f2a3b4c5d',
    user_id: secondUser.id,
    name: 'Odessa Kerr',
    email: 'odessa@kerr.studio',
    image_url: '/customers/amy-burns.png',
  },
  {
    id: 'a1b2c3d4-3333-4a5b-8c9d-0e1f2a3b4c5d',
    user_id: secondUser.id,
    name: 'Tomasz Wren',
    email: 'tomasz@wren.dev',
    image_url: '/customers/balazs-orban.png',
  },
];

// An invoice always belongs to the same user as its customer, so its
// user_id is copied from the customer instead of being typed by hand.
function invoiceFor(
  customerIndex: number,
  amount: number,
  status: 'pending' | 'paid',
  date: string,
) {
  const customer = customers[customerIndex];
  return {
    customer_id: customer.id,
    user_id: customer.user_id,
    amount,
    status,
    date,
  };
}

const invoices = [
  // First user
  invoiceFor(0, 15795, 'pending', '2022-12-06'),
  invoiceFor(1, 20348, 'pending', '2022-11-14'),
  invoiceFor(4, 3040, 'paid', '2022-10-29'),
  invoiceFor(3, 44800, 'paid', '2023-09-10'),
  invoiceFor(5, 34577, 'pending', '2023-08-05'),
  invoiceFor(2, 54246, 'pending', '2023-07-16'),
  invoiceFor(0, 666, 'pending', '2023-06-27'),
  invoiceFor(3, 32545, 'paid', '2023-06-09'),
  invoiceFor(4, 1250, 'paid', '2023-06-17'),
  invoiceFor(5, 8546, 'paid', '2023-06-07'),
  invoiceFor(1, 500, 'paid', '2023-08-19'),
  invoiceFor(5, 8945, 'paid', '2023-06-03'),
  invoiceFor(2, 1000, 'paid', '2022-06-05'),

  // Second user
  invoiceFor(6, 120000, 'paid', '2023-05-12'),
  invoiceFor(7, 48000, 'pending', '2023-07-02'),
  invoiceFor(8, 7550, 'paid', '2023-08-21'),
  invoiceFor(6, 99000, 'pending', '2023-09-04'),
];

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const firstUserRevenue = [
  2000, 1800, 2200, 2500, 2300, 3200, 3500, 3700, 2500, 2800, 3000, 4800,
];
const secondUserRevenue = [
  900, 1200, 1500, 1100, 2600, 2100, 1900, 2400, 3100, 2700, 3300, 3900,
];

const revenue = [
  ...months.map((month, i) => ({
    user_id: firstUser.id,
    month,
    revenue: firstUserRevenue[i],
  })),
  ...months.map((month, i) => ({
    user_id: secondUser.id,
    month,
    revenue: secondUserRevenue[i],
  })),
];

export { users, customers, invoices, revenue, months };
