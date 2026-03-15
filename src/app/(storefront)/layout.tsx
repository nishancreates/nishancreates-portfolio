import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
