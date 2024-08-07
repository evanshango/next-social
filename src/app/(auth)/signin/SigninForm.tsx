'use client'

import React, {useState, useTransition} from 'react';
import {useForm} from "react-hook-form";
import {SigninData, signinSchema} from "@/lib/validation";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {signin} from "@/app/(auth)/signin/actions";
import {PasswordInput} from "@/components/PasswordInput";
import LoadingButton from "@/components/LoadingButton";

const SigninForm = () => {
    const [error, setError] = useState<string>();
    const [isPending, startTransition] = useTransition()
    const form = useForm<SigninData>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            username: '',
            password: ''
        }
    })

    const onSubmit = async (values: SigninData) => {
        setError(undefined)
        startTransition(async () => {
            const {error} = await signin(values)
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
                <LoadingButton loading={isPending} type="submit" className='w-full'>
                    Signin
                </LoadingButton>
            </form>
        </Form>
    );
};

export default SigninForm;