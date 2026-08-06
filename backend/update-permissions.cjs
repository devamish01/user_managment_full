const mongoose = require('mongoose');
require('dotenv').config();

async function updatePermissions() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/backend_db');
  
  // Get all roles with their permissionIds
  const roles = await mongoose.connection.db.collection('roles').find({}).toArray();
  
  // Calculate assignedRolesCount for each permission
  const roleCountMap = new Map();
  for (const role of roles) {
    for (const permId of role.permissionIds || []) {
      roleCountMap.set(permId, (roleCountMap.get(permId) || 0) + 1);
    }
  }
  
  console.log('Role count map:', Object.fromEntries(roleCountMap));
  
  // Update each permission with assignedRolesCount
  for (const [permId, count] of roleCountMap) {
    await mongoose.connection.db.collection('permissions').updateOne(
      { id: permId },
      { $set: { assignedRolesCount: count } }
    );
    console.log('Updated', permId, 'with assignedRolesCount:', count);
  }
  
  // For permissions not in any role, set to 0
  const allPermissions = await mongoose.connection.db.collection('permissions').find({}).toArray();
  for (const perm of allPermissions) {
    if (!roleCountMap.has(perm.id)) {
      await mongoose.connection.db.collection('permissions').updateOne(
        { id: perm.id },
        { $set: { assignedRolesCount: 0 } }
      );
      console.log('Updated', perm.id, 'with assignedRolesCount: 0');
    }
  }
  
  console.log('Done!');
  await mongoose.disconnect();
}

updatePermissions().catch(console.error);