import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Role from '../models/Role';

const CUSTOMER_ROLE = "customer";

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('Creating user');
    const { username, email, password } = req.body;
    let role = req.body.role;

    // You might want to add validation here!

    // if no role is provided then this is login from external user so default role is assigned
    if (role == null || role.length == 0) {
      const externalUserRole = await Role.findOne({ name: CUSTOMER_ROLE }).exec();
      if (!externalUserRole) {
        throw new Error(`Role with name "${CUSTOMER_ROLE}" not found`);
      }
      role = externalUserRole
    }

    const user = await User.create({ username, email, password, role });
    res.status(201).json({
      message: "User created successfully"
    });
  } catch (err: any) {
    // res.status(400).json({ error: err.message || 'Failed to create user' });
    next(err)
  }
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
