require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env'),
})

const { Client } = require('pg')
const bcrypt = require('bcryptjs')

const email = process.argv[2] || 'admin@passo.com'
const passwordPlain = process.argv[3] || 'Admin123!'
const name = process.argv[4] || 'System Admin'
const phone = process.argv[5] || '0000000000'
const role = process.argv[6] || 'ADMIN'
const status = process.argv[7] || 'ACTIVE'

async function main() {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    console.error('DATABASE_URL not set in .env')
    process.exit(1)
  }

  const client = new Client({ connectionString: dbUrl })
  await client.connect()

  // Ensure required columns exist on the User table (handle older migrations)
  const alterSql = `
    ALTER TABLE "User"
      ADD COLUMN IF NOT EXISTS "password" TEXT,
      ADD COLUMN IF NOT EXISTS "phone" TEXT,
      ADD COLUMN IF NOT EXISTS "profilePicture" TEXT,
      ADD COLUMN IF NOT EXISTS "role" TEXT DEFAULT 'PASSENGER',
      ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'ACTIVE',
      ADD COLUMN IF NOT EXISTS "lastLogin" TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP DEFAULT now();
  `

  try {
    await client.query(alterSql)
  } catch (err) {
    console.warn('Could not ensure User columns:', err.message)
  }

  const hash = bcrypt.hashSync(passwordPlain, 10)

  const query = `
    INSERT INTO "User" (email, password, name, phone, role, status, "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, $5, $6, now(), now())
    ON CONFLICT (email) DO UPDATE SET
      password = EXCLUDED.password,
      name = EXCLUDED.name,
      phone = EXCLUDED.phone,
      role = EXCLUDED.role,
      status = EXCLUDED.status,
      "updatedAt" = now()
    RETURNING *;
  `

  const values = [email, hash, name, phone, role, status]

  try {
    const res = await client.query(query, values)
    console.log('Admin upserted:', res.rows[0])
  } catch (err) {
    console.error('Error inserting admin:', err)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
