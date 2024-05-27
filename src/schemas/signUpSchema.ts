import { z } from 'zod';

export const usernameValidation = z //Only username to validate so directly apply constraints
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(20, { message: 'Username must be no more than 20 characters long' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username must not contain special characters' });

export const signUpSchema = z.object({ // you make an object schema when you have multiple fields to validate
    username: usernameValidation,
    email: z.string().email({ message: 'Invalid email address' }), // .email has built-in email validation
    password: z.string().min(6 , {message : 'Password must be at least 6 characters long'})
});