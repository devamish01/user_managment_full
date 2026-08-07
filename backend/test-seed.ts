import { seedPermissions } from './src/modules/permissions/services/seed.permissions.js';
import { connectDB } from './src/core/database/mongoose.js';

async function main() {
  await connectDB();
  await seedPermissions();
  process.exit(0);
}

main().catch(console.error);