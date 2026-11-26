import postgres from 'postgres';
import { cache } from 'react';
import {
  CustomerField,
  CustomerInvoice,
  CustomerSummary,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';
import { requireUser } from './dal';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Every function below starts with requireUser() and filters by its id.
// Reading the session uses cookies, which also makes Next.js render these
// pages per request, so the old `await connection()` calls are no longer
// needed.

// Ids come from the URL, so they can be anything. Postgres throws on a
// malformed UUID, which would show the error page instead of "not found".
const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

export async function fetchRevenue() {
  const { id: userId } = await requireUser();
  try {
    // Sort Jan..Dec by calendar position, not alphabetically.
    const data = await sql<Revenue[]>`
      SELECT month, revenue
      FROM revenue
      WHERE user_id = ${userId}
      ORDER BY array_position(
        ARRAY['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        month::text
      )
    `;

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  const { id: userId } = await requireUser();
  try {
    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE invoices.user_id = ${userId}
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  const { id: userId } = await requireUser();
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`
      SELECT COUNT(*) FROM invoices WHERE user_id = ${userId}`;
    const customerCountPromise = sql`
      SELECT COUNT(*) FROM customers WHERE user_id = ${userId}`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices
         WHERE user_id = ${userId}`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0][0].count ?? '0');
    const numberOfCustomers = Number(data[1][0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const { id: userId } = await requireUser();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    // The parentheses around the search terms matter: AND binds tighter
    // than OR, so without them any row matching a later OR would slip
    // past the user filter.
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        invoices.user_id = ${userId} AND (
          customers.name ILIKE ${`%${query}%`} OR
          customers.email ILIKE ${`%${query}%`} OR
          invoices.amount::text ILIKE ${`%${query}%`} OR
          invoices.date::text ILIKE ${`%${query}%`} OR
          invoices.status ILIKE ${`%${query}%`}
        )
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  const { id: userId } = await requireUser();
  try {
    const data = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      invoices.user_id = ${userId} AND (
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      )
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  const { id: userId } = await requireUser();
  // The edit page turns undefined into notFound().
  if (!isUuid(id)) return undefined;
  try {
    // Matching the owner as well as the id means another user's invoice
    // id simply finds nothing, and the edit page shows "not found".
    const data = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id} AND invoices.user_id = ${userId};
    `;

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  const { id: userId } = await requireUser();
  try {
    const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      WHERE user_id = ${userId}
      ORDER BY name ASC
    `;

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  const { id: userId } = await requireUser();
  try {
    const data = await sql<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.user_id = ${userId} AND (
		    customers.name ILIKE ${`%${query}%`} OR
		    customers.email ILIKE ${`%${query}%`}
		  )
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.map((customer) => ({
      ...customer,
      // COUNT() is a bigint, which the driver returns as a string.
      total_invoices: Number(customer.total_invoices),
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

// Wrapped in React's `cache` because the customer page calls it twice per
// request: once for the browser tab title (generateMetadata) and once for
// the page itself. The second call reuses the first result.
export const fetchCustomerById = cache(async function fetchCustomerById(
  id: string,
): Promise<CustomerSummary | undefined> {
  const { id: userId } = await requireUser();
  if (!isUuid(id)) return undefined;

  try {
    // Same ownership rule as invoices: another user's customer id finds
    // nothing, so the page shows "not found" rather than their data.
    // COALESCE turns the NULL sums of a customer without invoices into 0.
    const data = await sql<CustomerSummary[]>`
      SELECT
        customers.id,
        customers.name,
        customers.email,
        customers.image_url,
        COUNT(invoices.id)::int AS total_invoices,
        COALESCE(SUM(invoices.amount) FILTER (WHERE invoices.status = 'paid'), 0)::int AS total_paid,
        COALESCE(SUM(invoices.amount) FILTER (WHERE invoices.status = 'pending'), 0)::int AS total_pending,
        MAX(invoices.date)::text AS last_invoice_date
      FROM customers
      LEFT JOIN invoices ON invoices.customer_id = customers.id
      WHERE customers.id = ${id} AND customers.user_id = ${userId}
      GROUP BY customers.id
    `;

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customer.');
  }
});

export async function fetchCustomerInvoices(customerId: string) {
  const { id: userId } = await requireUser();
  if (!isUuid(customerId)) return [];

  try {
    const invoices = await sql<CustomerInvoice[]>`
      SELECT id, amount, date::text AS date, status
      FROM invoices
      WHERE customer_id = ${customerId} AND user_id = ${userId}
      ORDER BY date DESC
    `;

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error("Failed to fetch the customer's invoices.");
  }
}
