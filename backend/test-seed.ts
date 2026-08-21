import "dotenv/config";
import { seedPermissions } from './src/modules/permissions/services/seed.permissions.js';
import { seedRoles } from './src/modules/roles/services/seed.roles.js';
import { seedSuperAdminUser } from './src/modules/users/services/seed.users.js';
import { seedNavigation } from './src/modules/navigation/services/seed.navigation.js';
import { seedPayments } from './src/modules/payments/services/seed.payments.js';
import { connectDB } from './src/core/database/mongoose.js';

async function main() {
  await connectDB();
  await seedPermissions();
  await seedRoles();
  await seedSuperAdminUser();
  await seedNavigation();
  await seedPayments();
  process.exit(0);
}

main().catch(console.error);