import { AppShell } from "@/components/mobile/AppShell";

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
