'use client'

import React, {useState, useTransition} from 'react';
import {useForm} from "react-hook-form";
import {SignupData, signupSchema} from "@/lib/validation";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {signup} from "@/app/(auth)/signup/actions";
import {PasswordInput} from "@/components/PasswordInput";
import LoadingButton from "@/components/LoadingButton";

const SignupForm = () => {
    const [error, setError] = useState<string>();
    const [isPending, startTransition] = useTransition()
    const form = useForm<SignupData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })

    const onSubmit = async (values: SignupData) => {
        setError(undefined)
        startTransition(async () => {
            const {error} = await signup(values)
            if (error) setError(error)
        })
    }
    return (
        <Form {...form}>
            {error && <p className='text-center text-destructive'>{error}</p>}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <FormField
                    control={form.control}
                    name="username"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Username" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Email" {...field} type="email"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput placeholder='Password' {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <LoadingButton loading={isPending}
                               type="submit"
                               className='w-full'
                >
                    Create Account
                </LoadingButton>
            </form>
        </Form>
    );
};

export default SignupForm;