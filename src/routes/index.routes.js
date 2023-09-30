import { Router } from 'express';

import indexControllers from '../controllers/index.controllers';

const router = Router();

router.get('/', indexControllers.index);

export default router;