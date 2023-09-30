import { Router } from 'express';

import { verifyToken } from '../middlewares/authJwt';
import { isSuperAdmin } from '../middlewares/roles';
import userControllers from '../controllers/users.controllers.js';

const router = Router();

router.get('/', [verifyToken], userControllers.getUsers);

router.put('/:userId', [verifyToken, isSuperAdmin], userControllers.updateUser);

router.delete('/:userId', [verifyToken, isSuperAdmin], userControllers.deleteUser);

export default router;