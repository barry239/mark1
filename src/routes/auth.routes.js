import { Router } from 'express';

import authControllers from '../controllers/auth.controllers';
import { validateSchema } from '../middlewares/validation';
import { signInSchema, signUpSchema } from '../validation/auth.schema';

const router = Router();

router.post('/signup', validateSchema(signUpSchema), authControllers.signUp);

router.post('/signin', validateSchema(signInSchema), authControllers.signIn);

export default router;
