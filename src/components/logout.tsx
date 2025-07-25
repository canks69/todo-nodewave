"use client";

import {useLogoutStore} from "@/store/useLogout";
import {ConfirmDialog} from "@/components/dialogs/confirm-dialog";
import { AlertCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export const LogoutDialog = () => {
  const navigate = useRouter();
  const {isOpen, setOpen} = useLogoutStore();
  const { clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    setOpen(false);
    navigate.push('/sign-in');
  }

  return (
    <ConfirmDialog
      open={isOpen}
      onOpenChange={() => setOpen(false)}
      handleConfirm={handleLogout}
      title={
        <span className='text-destructive'>
        <AlertCircleIcon
          className='stroke-destructive mr-1 inline-block'
          size={18}
        />{' '}
          Logout Confirmation
      </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to log out?
            <br />
            You will need to log in again to access the system.
          </p>
        </div>
      }
      confirmText='Logout'
      destructive
    />
  )
}