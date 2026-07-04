import { ArrowUpRight, User, BookOpen, Github, Linkedin, type LucideIcon } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { profileData } from "@/data/profile";
import { trackEvent } from "@/mixpanel";

const linkIcons: Record<string, LucideIcon> = {
  "About Me": User,
  "Make Me Read": BookOpen,
  GitHub: Github,
  "Connect With Me": Linkedin,
};

export function ProfileSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-l border-border bg-background sm:max-w-md"
      >
        <SheetHeader className="items-center space-y-4 text-center">
          <div className="relative mx-auto mt-2 h-28 w-28 overflow-hidden rounded-full ring-1 ring-[var(--glass-border)] shadow-[0_0_40px_-10px_var(--stage-lilac)]">
            <img
              src={profileData.imageUrl}
              alt={profileData.name}
              className="h-full w-full object-cover"
            />
          </div>
          <SheetTitle className="text-2xl font-semibold tracking-tight">
            {profileData.name}
          </SheetTitle>
          <SheetDescription className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            {profileData.role}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-5 px-1">
          {profileData.bio.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-foreground/90">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-2.5 px-1 pb-6">
          {profileData.links.map((link) => {
            const Icon = linkIcons[link.title] ?? ArrowUpRight;
            return (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  trackEvent("Outbound Link Clicked", { platform: link.title, url: link.url });
                  window.open(link.url, "_blank", "noopener,noreferrer");
                }}
                className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-border bg-card px-4 py-3 transition-all hover:border-foreground/30 hover:shadow-[0_8px_24px_-12px_var(--stage-sky)]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground/80 transition-colors group-hover:text-foreground">
                  <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-foreground">{link.title}</div>
                  <div className="truncate text-xs text-muted-foreground">{link.subtitle}</div>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
              </a>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
