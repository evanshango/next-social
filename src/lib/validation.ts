import {z} from "zod";

const requiredString = z.string().trim().min(1, "Required")

export const signupSchema = z.object({
    email: requiredString.email("Invalid email address"),
    username: requiredString.regex(
        /^[a-zA-Z0-9_-]+$/,
        "Only letters, numbers, - and _ allowed"
    ),
    password: requiredString.min(8, "Must be at least 8 characters"),
})

export const signinSchema = z.object({
    username: requiredString,
    password: requiredString
})

export const createPostSchema = z.object({
    content: requiredString
})

export const updateUserProfileSchema = z.object({
    displayName: requiredString,
    bio: z.string().max(1000, 'Must be at most 1000 characters'),
})

export type SignupData = z.infer<typeof signupSchema>;
export type SigninData = z.infer<typeof signinSchema>;
export type UpdateUserProfileData = z.infer<typeof updateUserProfileSchema>;