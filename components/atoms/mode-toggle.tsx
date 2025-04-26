"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button variant={"secondary"} size={"icon"} className="rounded-sm"
    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem]  dark:block hidden" />
      <Moon className="h-[1.2rem] w-[1.2rem]  block dark:hidden" />
    </Button>
  )
}
