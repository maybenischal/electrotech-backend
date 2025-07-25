import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';
import Role from '../models/Role';
import { sendSuccess } from '../ControllerWrapper';

const CUSTOMER_ROLE = "customer";

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;
  let role = req.body.role;

  if (!role) {
    const defaultRole = await Role.findOne({ name: CUSTOMER_ROLE }).exec();
    if (!defaultRole) {
      throw new Error(`Role "${CUSTOMER_ROLE}" not found`);
    }
    role = defaultRole._id;
  }

  const user = await User.create({ username, email, password, role });
  sendSuccess(res, 'User created successfully', user, 201);
};

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await User.find().populate('role');
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch users' });
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).populate('role');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch user' });
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update user' });
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ message: 'User deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete user' });
  }
};

