import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    console.log('📊 Running database migrations...\n');

    // Get all migration files
    const migrationsDir = path.join(__dirname, '../migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log(`Found ${migrationFiles.length} migration(s) to run:\n`);

    for (const migrationFile of migrationFiles) {
      console.log(`📄 Running ${migrationFile}...`);
      const migrationPath = path.join(migrationsDir, migrationFile);
      const sql = fs.readFileSync(migrationPath, 'utf8');

      // Split by semicolon and filter out empty statements
      const statements = sql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      // Execute each statement
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        try {
          await db.query(statement);
        } catch (error) {
          // Ignore duplicate errors (already exists)
          if (!error.message.includes('Duplicate') && !error.message.includes('already exists')) {
            throw error;
          }
        }
      }

      console.log(`  ✅ ${migrationFile} completed\n`);
    }

    console.log('✅ All migrations completed successfully!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('\nPlease check:');
    console.error('  1. Database connection is working');
    console.error('  2. User has necessary permissions');
    console.error('  3. Migration file exists and is valid\n');
    process.exit(1);
  }
}

runMigration();
