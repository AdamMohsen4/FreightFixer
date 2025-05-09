import type React from "react";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Globe, Monitor, Save } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useTheme } from "./theme-provider";

const LANGUAGES = ["en", "fi", "sv"] as const;
type Language = (typeof LANGUAGES)[number];

const THEMES = ["light", "dark", "system"] as const;
type Theme = (typeof THEMES)[number];

const settingsSchema = z.object({
  language: z.enum(LANGUAGES, {
    required_error: "Please select a language.",
  }),
  theme: z.enum(THEMES, {
    required_error: "Please select a theme.",
  }),
});

type SettingsValues = z.infer<typeof settingsSchema>;

function getStoredSettings(): SettingsValues {
  if (typeof window === "undefined") {
    return {
      language: "en",
      theme: "system",
    };
  }

  const storedLanguage = localStorage.getItem("settings:language") || "en";

  return {
    language: storedLanguage as Language,
    theme: "system", // Default value, will be overridden by useTheme
  };
}

function saveSettings(
  settings: SettingsValues,
  setTheme?: (theme: Theme) => void
) {
  localStorage.setItem("settings:language", settings.language);

  if (setTheme) {
    setTheme(settings.theme);
  }
}

interface SettingsDialogProps {
  children: React.ReactNode;
}

export function SettingsDialog({ children }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      language: "en",
      theme: "system",
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      const storedSettings = getStoredSettings();

      form.reset({
        ...storedSettings,
        theme: theme as Theme,
      });
    }
  };

  function onSubmit(data: SettingsValues) {
    saveSettings(data, setTheme);
    toast.success("Settings saved", {
      description: "Your preferences have been updated.",
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your application experience
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-2"
          >
            {/* Language Selection */}
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem className="pb-2">
                  <FormLabel className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Language
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[60%]">
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      {/* Disabled language options with coming soon badge */}
                      {[
                        { code: "fi", name: "Finnish (Suomi)" },
                        { code: "sv", name: "Swedish (Svenska)" },
                      ].map((lang) => (
                        <SelectItem key={lang.code} value={lang.code} disabled>
                          <div className="flex items-center justify-between w-full">
                            <span>{lang.name}</span>
                            <Badge
                              variant="outline"
                              className="ml-2 bg-muted/50 text-xs font-normal"
                            >
                              Coming Soon
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Theme Selection */}
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem className="pb-2 space-y-3">
                  <FormLabel className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    Theme
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      className="flex flex-col space-y-2 sm:flex-row sm:space-x-6 sm:space-y-0 pt-2"
                    >
                      {[
                        { value: "light", label: "Light" },
                        { value: "dark", label: "Dark" },
                        { value: "system", label: "System" },
                      ].map((themeOption) => (
                        <FormItem
                          key={themeOption.value}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={themeOption.value} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {themeOption.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    System will follow your device's theme setting.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="submit" className="gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
