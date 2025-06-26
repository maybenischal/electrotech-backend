import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IPermission extends Document {
  name: string;
  _id: Types.ObjectId; // ✅ This is crucial
}

const permissionSchema: Schema<IPermission> = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

const Permission: Model<IPermission> = mongoose.model<IPermission>('Permissions', permissionSchema);
export default Permission;
