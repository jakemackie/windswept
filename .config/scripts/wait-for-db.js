import { Client } from 'pg';

function checkDatabase() {
  return new Promise(async (resolve) => {
    const client = new Client({
      host: 'localhost',
      port: 5432,
      user: 'windswept',
      password: 'windswept',
      database: 'windswept',
      connectionTimeoutMillis: 1000,
    });
    
    try {
      await client.connect();
      await client.query('SELECT 1');
      await client.end();
      resolve(true);
    } catch (error) {
      resolve(false);
    }
  });
}

async function waitForDatabase() {
  const maxAttempts = 15;
  const delayMs = 1000;
  
  console.log('⏳ Waiting for database to be ready...');
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const isReady = await checkDatabase();
    
    if (isReady) {
      console.log('✅ Database is ready!');
      return;
    }
    
    if (attempt === 1) {
      console.log('⏳ First attempt failed - giving database time to initialize...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    } else {
      console.log(`⏳ Attempt ${attempt}/${maxAttempts}: Database not ready yet...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    
    if (attempt === maxAttempts) {
      console.error('❌ Database failed to start within timeout');
      process.exit(1);
    }
  }
}

waitForDatabase();
