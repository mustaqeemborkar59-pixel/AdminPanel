
"use client";

import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sun, Moon, Laptop } from "lucide-react";

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Appearance</CardTitle>
        <CardDescription className="font-body">
          Customize the look and feel of the application. Select your preferred theme.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={theme} onValueChange={setTheme} className="space-y-2">
          <Label
            htmlFor="theme-light"
            className="flex items-center space-x-3 p-3 rounded-md border hover:bg-accent/50 cursor-pointer data-[state=checked]:border-primary data-[state=checked]:bg-accent"
          >
            <RadioGroupItem value="light" id="theme-light" className="sr-only" />
            <Sun className="h-5 w-5 text-muted-foreground" />
            <span className="font-body text-sm">Light</span>
          </Label>
          <Label
            htmlFor="theme-dark"
            className="flex items-center space-x-3 p-3 rounded-md border hover:bg-accent/50 cursor-pointer data-[state=checked]:border-primary data-[state=checked]:bg-accent"
          >
            <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
            <Moon className="h-5 w-5 text-muted-foreground" />
            <span className="font-body text-sm">Dark</span>
          </Label>
          <Label
            htmlFor="theme-system"
            className="flex items-center space-x-3 p-3 rounded-md border hover:bg-accent/50 cursor-pointer data-[state=checked]:border-primary data-[state=checked]:bg-accent"
          >
            <RadioGroupItem value="system" id="theme-system" className="sr-only" />
            <Laptop className="h-5 w-5 text-muted-foreground" />
            <span className="font-body text-sm">System</span>
          </Label>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
