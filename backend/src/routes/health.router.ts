import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', message: 'Ecossistema Equilibrium API is running!' });
});

export default router;
