import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { AdminPanel } from "./components/AdminPanel";
import { BookingModal } from "./components/BookingModal";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { GallerySection } from "./components/GallerySection";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { OffersSection } from "./components/OffersSection";
import { ServicesSection } from "./components/ServicesSection";
import { TeamSection } from "./components/TeamSection";

export default function App() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<
    string | undefined
  >();
  const [showAdmin, setShowAdmin] = useState(
    window.location.pathname === "/admin",
  );

  function handleBookClick(serviceId?: string) {
    setPreselectedServiceId(serviceId);
    setBookingOpen(true);
  }

  if (showAdmin) {
    return (
      <>
        <AdminPanel onBack={() => setShowAdmin(false)} />
        <Toaster theme="dark" />
      </>
    );
  }

  return (
    <>
      <Header onBookClick={() => handleBookClick()} />
      <main>
        <HeroSection onBookClick={() => handleBookClick()} />
        <ServicesSection onBookClick={handleBookClick} />
        <TeamSection />
        <GallerySection />
        <OffersSection />
        <ContactSection />
      </main>
      <Footer />
      <BookingModal
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        preselectedServiceId={preselectedServiceId}
      />
      <Toaster theme="dark" />
    </>
  );
}
