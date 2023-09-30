import { validationResult } from 'express-validator';

export const validateSchema = schema => {
    return async (req, res, next) => {
        await schema.run(req);

        const errors = validationResult(req).formatWith(err => {
            return { msg: err.msg, param: err.param };
        });

        if (!errors.isEmpty()) return res.status(401).json({ errors: errors.array() });

        return next();
    };
};
