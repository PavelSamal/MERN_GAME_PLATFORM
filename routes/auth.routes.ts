import { Router, Request, Response } from 'express';
import User, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';
import { check, validationResult } from 'express-validator';

const router = Router();

// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Wrong email').isEmail(),
        check('password', 'Minimum password length - 6').isLength({ min: 6 })
    ],
    async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                res.status(400).json({
                    errors: errors.array(),
                    message: 'Wrong register data'
                });
            }

            const { email, password, login } = req.body;

            const candidate = await User.findOne({ email });

            if (candidate) {
                res.status(400).json({ message: 'This user already exists' });
                return;
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const user: IUser = new User({ email, password: hashedPassword, login });
            await user.save();

            res.status(201).json({ message: 'User created' });
            return;
        } catch (e) {
            res.status(500).json({ message: 'Something went wrong' });
            return;
        }
    }
);

// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Wrong email').normalizeEmail().isEmail(),
        check('password', 'Wrong password').exists()
    ],
    async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                res.status(400).json({
                    errors: errors.array(),
                    message: 'Wrong login data'
                });
            }

            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                res.status(400).json({ message: 'User not exist' });
                return;
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                res.status(400).json({ message: 'Wrong password' });
            }


        } catch (e) {
            res.status(500).json({ message: 'Something went wrong' });
            return;
        }
    }
);

export default router;
