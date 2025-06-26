import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import Permission, { IPermission } from '../models/Permission';
import Role, { IRole } from '../models/Role';
import User from '../models/User';

dotenv.config();

import { Document, Types } from 'mongoose';

const permissions = ['create', 'view', 'update', 'delete', 'review'];

const roles: Record<string, string[]> = {
  admin: ['create', 'view', 'update', 'delete', 'review'],
  editor: ['create', 'view', 'update'],
  viewer: ['view'],
  customer: ['view'],
  reviewer: ['view', 'review'],
};

const defaultAdmin = {
  username: 'admin',
  email: 'admin@example.com',
  password: 'Admin@123', // Will be hashed
};

const seed = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables.');
    }

    await mongoose.connect(mongoUri);
    console.log('🔗 Connected to MongoDB');

    // Clear existing data
    await Permission.deleteMany();
    await Role.deleteMany();
    await User.deleteMany();

    // Seed permissions
    const permissionDocs = await Permission.insertMany(
      permissions.map(name => ({ name }))
    );
    console.log('✅ Permissions seeded');

    // Create map of permission name to ObjectId
    const permissionMap: Record<string, mongoose.Types.ObjectId> = {};
    permissionDocs.forEach((perm: IPermission) => {
      permissionMap[perm.name] = perm._id;
    });

    // Seed roles
    const roleMap: Record<string, IRole> = {};
    for (const [roleName, perms] of Object.entries(roles)) {
      const role = await Role.create({
        name: roleName,
        permissions: perms.map(p => permissionMap[p]),
      });
      roleMap[roleName] = role;
    }
    console.log('✅ Roles seeded');

    // Create admin user
    const hashedPassword = await bcrypt.hash(defaultAdmin.password, 10);
    await User.create({
      username: defaultAdmin.username,
      email: defaultAdmin.email,
      password: hashedPassword,
      role: roleMap['admin']._id,
    });
    console.log('✅ Admin user created:');
    console.log(`   Email: ${defaultAdmin.email}`);
    console.log(`   Password: ${defaultAdmin.password}`);

    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Seeding failed:', err.message || err);
    process.exit(1);
  }
};

seed();
