import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { invoices, customers, revenue, users } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

type Tx = postgres.TransactionSql;

// Databases seeded before workspaces existed have customers, invoices and
// revenue rows with no owner. They are all handed to this account, which
// was the only user back then, so its dashboard looks exactly as before.
const LEGACY_OWNER_ID = users[0].id;

async function seedUsers(tx: Tx) {
  await tx`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await tx`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await tx`
      INSERT INTO users (id, name, email, password)
      VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
      ON CONFLICT (id) DO NOTHING;
    `;
  }
}

async function seedCustomers(tx: Tx) {
  // Fresh database: create the table with its owner column from the start.
  await tx`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL,
      CONSTRAINT customers_id_user_id_key UNIQUE (id, user_id)
    );
  `;

  // Existing database: add the owner column and give old rows an owner.
  // Every statement is safe to run again on an already-upgraded table.
  await tx`
    ALTER TABLE customers
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users (id) ON DELETE CASCADE
  `;
  await tx`UPDATE customers SET user_id = ${LEGACY_OWNER_ID} WHERE user_id IS NULL`;
  await tx`ALTER TABLE customers ALTER COLUMN user_id SET NOT NULL`;
  // Lets invoices point at "this customer of this user" (see invoices).
  await tx`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'customers_id_user_id_key'
      ) THEN
        ALTER TABLE customers
        ADD CONSTRAINT customers_id_user_id_key UNIQUE (id, user_id);
      END IF;
    END $$;
  `;
  await tx`CREATE INDEX IF NOT EXISTS customers_user_id_idx ON customers (user_id)`;

  for (const customer of customers) {
    await tx`
      INSERT INTO customers (id, user_id, name, email, image_url)
      VALUES (${customer.id}, ${customer.user_id}, ${customer.name}, ${customer.email}, ${customer.image_url})
      ON CONFLICT (id) DO NOTHING;
    `;
  }
}

async function seedInvoices(tx: Tx) {
  // The composite foreign key (customer_id, user_id) means an invoice can
  // only reference a customer that belongs to the same user. The database
  // itself refuses a cross-workspace invoice, even if app code has a bug.
  await tx`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID NOT NULL,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL,
      CONSTRAINT invoices_customer_owner_fkey
        FOREIGN KEY (customer_id, user_id)
        REFERENCES customers (id, user_id)
        ON DELETE CASCADE
    );
  `;

  // Existing database: an old invoice inherits the owner of its customer.
  await tx`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS user_id UUID`;
  await tx`
    UPDATE invoices
    SET user_id = customers.user_id
    FROM customers
    WHERE invoices.customer_id = customers.id AND invoices.user_id IS NULL
  `;
  await tx`ALTER TABLE invoices ALTER COLUMN user_id SET NOT NULL`;
  await tx`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'invoices_customer_owner_fkey'
      ) THEN
        ALTER TABLE invoices
        ADD CONSTRAINT invoices_customer_owner_fkey
          FOREIGN KEY (customer_id, user_id)
          REFERENCES customers (id, user_id)
          ON DELETE CASCADE;
      END IF;
    END $$;
  `;
  // Every invoice query filters by user and most sort by date.
  await tx`
    CREATE INDEX IF NOT EXISTS invoices_user_id_date_idx
    ON invoices (user_id, date DESC)
  `;

  // Invoices have no fixed ids in the demo data, so ON CONFLICT cannot
  // stop duplicates. Instead, only seed a workspace that has no invoices.
  for (const user of users) {
    const [{ count }] = await tx`
      SELECT COUNT(*) FROM invoices WHERE user_id = ${user.id}
    `;
    if (Number(count) > 0) continue;

    for (const invoice of invoices.filter((i) => i.user_id === user.id)) {
      await tx`
        INSERT INTO invoices (customer_id, user_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.user_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
      `;
    }
  }
}

async function seedRevenue(tx: Tx) {
  // Each user has their own twelve months, so the key is (user_id, month).
  await tx`
    CREATE TABLE IF NOT EXISTS revenue (
      user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
      month VARCHAR(4) NOT NULL,
      revenue INT NOT NULL,
      PRIMARY KEY (user_id, month)
    );
  `;

  // Existing database: months used to be unique across the whole table.
  await tx`
    ALTER TABLE revenue
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users (id) ON DELETE CASCADE
  `;
  await tx`UPDATE revenue SET user_id = ${LEGACY_OWNER_ID} WHERE user_id IS NULL`;
  await tx`ALTER TABLE revenue ALTER COLUMN user_id SET NOT NULL`;
  await tx`ALTER TABLE revenue DROP CONSTRAINT IF EXISTS revenue_month_key`;
  await tx`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'revenue_pkey'
      ) THEN
        ALTER TABLE revenue ADD PRIMARY KEY (user_id, month);
      END IF;
    END $$;
  `;

  for (const rev of revenue) {
    await tx`
      INSERT INTO revenue (user_id, month, revenue)
      VALUES (${rev.user_id}, ${rev.month}, ${rev.revenue})
      ON CONFLICT (user_id, month) DO NOTHING;
    `;
  }
}

export async function GET() {
  try {
    // One transaction: if any step fails, nothing is changed. The steps
    // run in order because each table references the one before it.
    await sql.begin(async (tx) => {
      await seedUsers(tx);
      await seedCustomers(tx);
      await seedInvoices(tx);
      await seedRevenue(tx);
    });

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
