import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

interface HeroSectionProps {
  onBookClick: () => void;
}

export function HeroSection({ onBookClick }: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/assets/generated/hero-salon.dim_1200x600.jpg"
          alt="B Beyond Salon"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-6">
            Welcome to
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-gold tracking-widest uppercase leading-tight mb-6">
            Experience Luxury.
            <br />
            <span className="text-foreground">Beyond Beauty.</span>
          </h1>
          <div className="gold-divider mb-8" />
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Mumbai's premier destination for expert hair styling, color
            artistry, and transformative beauty experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onBookClick}
              className="gold-gradient text-primary-foreground text-xs tracking-widest uppercase font-semibold px-10 py-5 rounded-sm hover:opacity-90 border-0 shadow-gold"
              data-ocid="hero.primary_button"
            >
              Book Your Appointment
            </Button>
            <Button
              variant="outline"
              className="border-gold text-gold bg-transparent hover:bg-gold/10 text-xs tracking-widest uppercase font-semibold px-10 py-5 rounded-sm"
              onClick={() =>
                document
                  .getElementById("services")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              data-ocid="hero.secondary_button"
            >
              View Services
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs tracking-widest uppercase text-muted-foreground">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-muted-foreground to-transparent" />
      </motion.div>
    </section>
  );
}
