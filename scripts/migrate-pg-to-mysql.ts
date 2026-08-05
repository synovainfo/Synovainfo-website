import { Pool as PgPool } from "pg";
import { createPool as createMariadbPool } from "mariadb";

// Make sure to `npm install --no-save pg` before running this script
// and set PG_DATABASE_URL in your .env temporarily for the migration.

const tables = [
  "users",
  "roles",
  "permissions",
  "pages",
  "page_sections",
  "page_versions",
  "services",
  "industries",
  "technologies",
  "service_technologies",
  "service_industries",
  "statistics",
  "testimonials",
  "partners",
  "certifications",
  "core_values",
  "clients",
  "careers",
  "career_applications",
  "blog_categories",
  "blog_posts",
  "tags",
  "tags_on_posts",
  "faq_categories",
  "faqs",
  "resources",
  "downloads",
  "newsletters",
  "subscribers",
  "newsletter_sends",
  "contacts",
  "leads",
  "lead_activities",
  "forms",
  "form_fields",
  "form_submissions",
  "media_folders",
  "media",
  "menus",
  "menu_items",
  "footers",
  "footer_columns",
  "footer_links",
  "redirects",
  "audit_logs",
  "activities",
  "backups",
  "settings",
  "homepage_sections",
];

async function migrate() {
  const pgPool = new PgPool({
    connectionString: process.env.PG_DATABASE_URL,
  });

  const mysqlPool = createMariadbPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5,
  });

  console.log("Starting migration...");

  for (const table of tables) {
    console.log(`Migrating table: ${table}`);
    try {
      const { rows } = await pgPool.query(`SELECT * FROM ${table}`);
      if (rows.length === 0) {
        console.log(`  Skipping ${table} (0 rows)`);
        continue;
      }

      console.log(`  Found ${rows.length} rows`);

      const columns = Object.keys(rows[0]);
      const placeholders = columns.map(() => "?").join(", ");
      const query = `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`;

      const connection = await mysqlPool.getConnection();
      try {
        await connection.beginTransaction();
        for (const row of rows) {
          const values = columns.map((col) => {
            const val = row[col];
            // Handle JSON stringification for MySQL JSON columns
            if (val !== null && typeof val === "object" && !(val instanceof Date)) {
              return JSON.stringify(val);
            }
            return val;
          });
          await connection.query(query, values);
        }
        await connection.commit();
        console.log(`  Success: ${table}`);
      } catch (err) {
        await connection.rollback();
        console.error(`  Error in ${table}:`, err);
      } finally {
        connection.release();
      }
    } catch (err) {
      console.error(`Error querying ${table} from PG:`, err);
    }
  }

  console.log("Migration complete!");
  await pgPool.end();
  await mysqlPool.end();
}

migrate().catch(console.error);
