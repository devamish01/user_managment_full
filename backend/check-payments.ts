import { connectDB } from './src/core/database/mongoose.js';
import { Payment } from './src/modules/payments/index.js';

async function main() {
  await connectDB();
  const payments = await Payment.find({}).lean();
  console.log('Payments in DB:');
  payments.forEach(p => console.log(JSON.stringify(p, null, 2)));
  process.exit(0);
}

main().catch(console.error);