import { Router } from 'express';
import { 
  createUser, 
  getUsers, 
  getUser, 
  updateUser, 
  deleteUser 
} from '../controllers/UserController';
import { controllerWrapper } from '../ControllerWrapper';

const router = Router();

// Define routes without repeating USER_ROUTE here — mount it in server.ts
router.post('/', controllerWrapper(createUser));
router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
