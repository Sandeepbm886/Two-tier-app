import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,
  host: process.env.POSTGRES_HOST || "localhost",
  port: process.env.POSTGRES_PORT || 5432,
  database: process.env.POSTGRES_DB || "devopsapp",
  user: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "postgres",
});

export async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

export async function testConnection() {
  await pool.query("SELECT 1");
}

function toMessage(row) {
  return {
    id: row.id,
    message: row.message,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function findMessages() {
  const result = await pool.query(
    "SELECT id, message, created_at, updated_at FROM messages ORDER BY created_at DESC"
  );

  return result.rows.map(toMessage);
}

export async function createMessage(message) {
  const result = await pool.query(
    "INSERT INTO messages (message) VALUES ($1) RETURNING id, message, created_at, updated_at",
    [message.trim()]
  );

  return toMessage(result.rows[0]);
}
