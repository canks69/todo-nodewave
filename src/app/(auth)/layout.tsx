export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex-grow flex flex-col items-center pt-24 px-4 sm:px-6 lg:px-8 z-20 overflow-y-scroll">
      {children}
    </main>
  );
}
