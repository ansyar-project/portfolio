"use client";
import React from "react";
import Button from "@/components/ui/Button";
import { signOut } from "next-auth/react";

export default function SignoutButton() {
  return (
    <div className="flex justify-end">
      <Button
        variant="secondary"
        onClick={() => signOut({ callbackUrl: "/login" })}
      >
        Sign out
      </Button>
    </div>
  );
}
