"use client";
import React, { createContext, useContext, useMemo } from "react";
import type { Config } from "@/lib/config.types";

const ConfigContext = createContext<Config | null>(null);

export function ConfigProvider({ initialConfig, children }: { initialConfig: Config; children: React.ReactNode; }) {
// Memo para evitar re-renders
const value = useMemo(() => initialConfig, [initialConfig]);
return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}

export function useConfig() {
const ctx = useContext(ConfigContext);
if (!ctx) throw new Error("useConfig must be used within <ConfigProvider>");
return ctx;
}
