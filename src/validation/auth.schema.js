import { checkSchema } from 'express-validator';

export const signUpSchema = checkSchema({
    email: {
        in: ['body'],
        isEmail: {
            bail: true
        },
        normalizeEmail: {
            options: {
                all_lowercase: false
            }
        },
        errorMessage: 'Invalid email'
    },
    username: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            },
            bail: true
        },
        errorMessage: 'Invalid username'
    },
    role: {
        in: ['body'],
        matches: {
            options: [/^(Super(?: |-|_)Admin)|(Admin)|(Viewer)$/i],
            bail: true
        },
        errorMessage: 'Invalid role'
    },
    password: {
        in: ['body'],
        isStrongPassword: {
            bail: true
        },
        errorMessage: 'Invalid password'
    }
});

export const signInSchema = checkSchema({
    email: {
        in: ['body'],
        normalizeEmail: {
            options: {
                all_lowercase: false
            }
        },
        isEmail: {
            bail: true
        },
        errorMessage: 'Invalid email'
    },
    password: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            },
            bail: true
        },
        errorMessage: 'Invalid password'
    }
});
