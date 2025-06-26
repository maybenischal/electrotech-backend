import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IRole extends Document {
  name: string;
  permissions: mongoose.Types.ObjectId[]; // refs to Permission
}

const roleSchema: Schema<IRole> = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permissions' }],
});

const Role: Model<IRole> = mongoose.model<IRole>('Roles', roleSchema);
export default Role;
