'use server'

import {UpdateUserProfileData, updateUserProfileSchema} from "@/lib/validation";
import {validateRequest} from "@/auth";
import prisma from "@/lib/prisma";
import {getUserDataSelect} from "@/lib/types";

export const updateUserProfile = async (values: UpdateUserProfileData) => {
    const validatedValues = updateUserProfileSchema.parse(values);

    const {user} = await validateRequest()

    if (!user) throw new Error("Unauthorized request")

    return prisma.user.update({
        where: {id: user.id},
        data: validatedValues,
        select: getUserDataSelect(user.id)
    });
}