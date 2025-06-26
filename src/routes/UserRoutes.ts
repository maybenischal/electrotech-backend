import { Router } from 'express';
import { 
  createUser, 
  getUsers, 
  getUser, 
  updateUser, 
  deleteUser 
} from '../controllers/UserController';

const router = Router();

// Define routes without repeating USER_ROUTE here — mount it in server.ts
router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
