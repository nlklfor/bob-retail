import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RequestProductTab } from "@/components/product-request/RequestProductTab";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <RequestProductTab />
    </>
  );
}
