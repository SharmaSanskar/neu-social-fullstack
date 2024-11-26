import SideNav from "@/components/SideNav";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <SideNav />

      <div className="bg-slate-200 ml-[14vw] min-h-screen">{children}</div>
    </main>
  );
}
