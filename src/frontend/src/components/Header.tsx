import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface HeaderProps {
  onBookClick: () => void;
}

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#team", label: "Team" },
  { href: "#gallery", label: "Gallery" },
  { href: "#contact", label: "Contact" },
];

export function Header({ onBookClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-luxury border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          className="flex items-center gap-3 group"
          data-ocid="nav.link"
        >
          <div className="w-10 h-10 gold-gradient rounded-sm flex items-center justify-center">
            <span className="font-display font-bold text-xl text-primary-foreground">
              B
            </span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-foreground font-bold text-sm tracking-widest uppercase">
              Beyond
            </span>
            <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
              Salon
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs tracking-widest uppercase text-muted-foreground hover:text-gold transition-colors"
              data-ocid="nav.link"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            onClick={onBookClick}
            className="gold-gradient text-primary-foreground text-xs tracking-widest uppercase font-semibold px-6 py-2 rounded-sm hover:opacity-90 border-0"
            data-ocid="nav.primary_button"
          >
            Book Online
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="md:hidden text-foreground"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-card border-t border-border px-6 py-4 flex flex-col gap-4"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs tracking-widest uppercase text-muted-foreground hover:text-gold"
                onClick={() => setMenuOpen(false)}
                data-ocid="nav.link"
              >
                {link.label}
              </a>
            ))}
            <Button
              onClick={() => {
                setMenuOpen(false);
                onBookClick();
              }}
              className="gold-gradient text-primary-foreground text-xs tracking-widest uppercase font-semibold rounded-sm mt-2"
              data-ocid="nav.primary_button"
            >
              Book Online
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
