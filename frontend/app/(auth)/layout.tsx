import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen w-full flex bg-primaryWhite">
      <section className="flex-1 bg-slate-400 m-3 rounded-xl overflow-hidden">
        <div className="w-full h-full relative">
          <Image
            src="/images/auth-banner.jpg"
            alt="neu-social"
            priority
            layout="fill"
            objectFit="cover"
          />
        </div>
      </section>
      <section className="flex-1 bg-primaryWhite">{children}</section>
    </main>
  );
}
