"use client";

import React from "react";
import { ToastProvider } from "@/context/ToastContext";
import ToastContainer from "@/components/ui/Toast";

export default function AdminToastWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      {children}
      <ToastContainer />
    </ToastProvider>
  );
}
