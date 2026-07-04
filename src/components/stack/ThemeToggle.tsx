import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { trackEvent } from "@/mixpanel";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={() => {
        trackEvent("Theme Switched", {
          from: theme,
          to: theme === "dark" ? "light" : "dark",
        });
        toggle();
      }}
      aria-label="Toggle theme"
      className="glass-card flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-transform hover:scale-105"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ duration: 0.25 }}
          className="flex items-center justify-center"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
