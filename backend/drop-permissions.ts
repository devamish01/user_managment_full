import { connectDB } from "./src/core/database/index.js";
import { Permission } from "./src/modules/permissions/model/index.js";

async function main() {
  await connectDB();
  await Permission.collection.dropIndexes();
  console.log('Indexes dropped');
  await Permission.collection.drop();
  console.log('Collection dropped');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });