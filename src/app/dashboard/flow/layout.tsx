export default function Layout({
  children,
  test1,
  test2,
}: { children: React.ReactNode } | any) {
  return (
    <>
      {test1}

      {test2}
      {children}
    </>
  );
}
