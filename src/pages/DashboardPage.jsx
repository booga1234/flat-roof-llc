import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

export function DashboardPage({ className, onLogout }) {
  return (
    <div
      className={cn(
        "flex h-screen w-full flex-col items-center justify-center gap-6 bg-black text-white",
        className
      )}
    >
      <div className="text-center space-y-2">
        <p className="text-sm uppercase tracking-[0.25em] text-white/70">Status</p>
        <h1 className="text-3xl font-semibold">Successfully logged in</h1>
        <p className="text-base text-white/60">
          This is your placeholder dashboard. Replace it with the full experience whenever you are ready.
        </p>
      </div>
      {typeof onLogout === "function" && (
        <Button variant="secondary" onClick={onLogout}>
          Log out
        </Button>
      )}
    </div>
  );
}

