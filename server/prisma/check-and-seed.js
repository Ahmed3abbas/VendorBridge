import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new PrismaClient();

async function checkAndSeed() {
  try {
    console.log('🔍 Checking database for existing data...');

    // Check if any users exist
    const userCount = await db.user.count();
    
    if (userCount === 0) {
      console.log('📭 No data found in database.');
      console.log('🌱 Running seed file...\n');
      
      // Run the seed file
      try {
        execSync('node prisma/seed.js', { 
          cwd: path.resolve(__dirname, '..'),
          stdio: 'inherit' 
        });
        console.log('\n✅ Database seeded successfully!');
      } catch (error) {
        console.error('❌ Error running seed file:', error.message);
        process.exit(1);
      }
    } else {
      console.log(`✅ Database already contains data (${userCount} users found).`);
      console.log('ℹ️  Skipping seed. To reseed, delete data first.');
    }
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

checkAndSeed();
