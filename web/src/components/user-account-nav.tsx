"use client"

import { type User } from "next-auth"
import { signOut } from "next-auth/react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserAvatar } from "@/components/user-avatar"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { DialogContent, DialogTitle } from "@/components/ui/dialog"
import { EditUserProfile } from "./profile/edit-user-profile"

import { useState } from "react"

import { useTranslations } from "next-intl";

export function UserAccountNav({ user }: {
  user: Pick<User, "id" | "name" | "image" | "email">
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const t = useTranslations("UserAccountNav");
  return (
    <Dialog modal={false} open={dialogOpen} onOpenChange={setDialogOpen}>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger>
          <UserAvatar user={user} className="h-8 w-8" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onCloseAutoFocus={e => e.preventDefault()}>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {user.name && <p className="font-medium">{user.name}</p>}
              {user.email && (
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {user.email}
                </p>
              )}
            </div>
          </div>
          <DropdownMenuSeparator />
          <DialogTrigger
            className="w-full"
            onClick={() => {
              setMenuOpen(false);
              setDialogOpen(true);
            }}
          >
            <DropdownMenuItem>
              <span>{t("profile")}</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={(event) => {
              event.preventDefault()
              signOut({
                callbackUrl: `${window.location.origin}`,
              })
                .catch((error) => {
                  // TODO: Handle error
                  console.error("Error signing out:", error)
                })
            }}
          >
            {t("signOut")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent aria-describedby="edit-profile-description">
        <DialogTitle>{t("editUser")}</DialogTitle>
        <p id="edit-profile-description" className="sr-only">
          {t("editProfileDescription")}
        </p>
        {user.id && <EditUserProfile userId={user.id} />}
      </DialogContent>
    </Dialog>
  )
}