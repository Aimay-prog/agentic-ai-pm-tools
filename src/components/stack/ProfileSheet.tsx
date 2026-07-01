import { ArrowUpRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { profileData } from "@/data/profile";

export function ProfileSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-l border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-2xl sm:max-w-md"
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

        <div className="mt-8 grid grid-cols-1 gap-3 px-1 pb-6">
          {profileData.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 backdrop-blur-xl transition-all hover:border-foreground/30 hover:shadow-[0_0_24px_-8px_var(--stage-sky)]"
            >
              <div>
                <div className="text-sm font-medium text-foreground">{link.title}</div>
                <div className="text-xs text-muted-foreground">{link.subtitle}</div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
            </a>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
