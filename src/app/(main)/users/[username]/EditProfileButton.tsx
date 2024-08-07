'use client'

import React, {useState} from 'react';
import {UserData} from "@/lib/types";
import {Button} from "@/components/ui/button";
import EditProfileDialog from "@/app/(main)/users/[username]/EditProfileDialog";

interface IEditProfileButtonProps {
    user: UserData
}

const EditProfileButton = ({user}: IEditProfileButtonProps) => {
    const [showDialog, setShowDialog] = useState(false);
    return (
        <>
            <Button variant='outline' onClick={() => {setShowDialog(true)}}>
                Edit Profile
            </Button>
            <EditProfileDialog user={user} open={showDialog} onOpenChange={setShowDialog} />
        </>
    );
};

export default EditProfileButton;