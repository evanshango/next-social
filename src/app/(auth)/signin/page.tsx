import React from 'react';
import {Metadata} from "next";
import signinImage from '@/assets/signin-image.jpg'
import Image from "next/image";
import Link from "next/link";
import SigninForm from "@/app/(auth)/signin/SigninForm";

export const metadata: Metadata = {
    title: 'Signin',
}

const SignupPage = () => {
    return (
        <main className="flex h-screen items-center justify-center p-5">
            <div
                className="flex h-full max-h-[40rem] w-full max-w-[64rem] rounded-2xl overflow-y-auto bg-card shadow-2xl">
                <div className='md:w-1/2 w-full space-y-10 overflow-y-auto p-10'>
                    <div className="space-y-1 text-center">
                        <h1 className="text-center text-3xl font-bold">Signin to bugbook</h1>
                    </div>
                    <div className="space-y-5">
                        <SigninForm/>
                        <Link href={'/signup'} className='block text-center hover:underline'>
                            Don&apos;t have an account? <strong className='text-primary'>Signup</strong>
                        </Link>
                    </div>
                </div>
                <Image src={signinImage} alt="" className='w-1/2 hidden md:block object-cover'/>
            </div>
        </main>
    );
};

export default SignupPage;