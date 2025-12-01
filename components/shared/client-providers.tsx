"use client";

import useCartSidebar from "@/hooks/use-cart-sidebar";
import { ClientSetting } from "@/types";
import React from "react";
import type { Session } from "next-auth";
import { Toaster } from "sonner";
import AppInitializer from "./app-initializer";
import CartSidebar from "./cart-sidebar";
import { ThemeProvider } from "./theme-provider";
import { SessionProvider } from "next-auth/react";

export default function ClientProviders({
  children,
  setting,
  session,
}: {
  children: React.ReactNode;
  setting: ClientSetting;
  session?: Session | null | undefined;
}) {
  const visible = useCartSidebar();

  return (
      <AppInitializer setting={setting}>
        <ThemeProvider
          attribute="class"
          defaultTheme={
            setting?.common?.defaultTheme
              ? setting.common.defaultTheme.toLowerCase()
              : "light"
          }
        >
          <SessionProvider session={session}>
            {visible ? (
              <div className="flex min-h-screen">
                <div className="flex-1 overflow-hidden">{children}</div>
                <CartSidebar />
              </div>
            ) : (
              <div>{children}</div>
            )}
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </AppInitializer>
  );
}
