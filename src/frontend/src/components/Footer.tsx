import { Separator } from "@/components/ui/separator";
import { SiInstagram, SiWhatsapp } from "react-icons/si";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
              <div className="w-10 h-10 gold-gradient rounded-sm flex items-center justify-center">
                <span className="font-display font-bold text-xl text-primary-foreground">
                  B
                </span>
              </div>
              <div>
                <p className="font-display text-foreground font-bold tracking-widest uppercase text-sm">
                  Beyond
                </p>
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                  Salon
                </p>
              </div>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-xs mx-auto md:mx-0">
              Mumbai's premier luxury salon. Experience the art of beauty.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-xs tracking-[0.3em] uppercase text-gold mb-5">
              Quick Links
            </h4>
            <div className="flex flex-col gap-3">
              {["#home", "#services", "#team", "#gallery", "#contact"].map(
                (href) => (
                  <a
                    key={href}
                    href={href}
                    className="text-xs tracking-widest uppercase text-muted-foreground hover:text-gold transition-colors"
                    data-ocid="nav.link"
                  >
                    {href.replace("#", "")}
                  </a>
                ),
              )}
            </div>
          </div>

          {/* Social */}
          <div className="text-center md:text-right">
            <h4 className="text-xs tracking-[0.3em] uppercase text-gold mb-5">
              Follow Us
            </h4>
            <div className="flex gap-4 justify-center md:justify-end">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-gold/30 hover:border-gold rounded-sm flex items-center justify-center text-gold hover:bg-gold/10 transition-all"
                data-ocid="nav.link"
              >
                <SiWhatsapp size={16} />
              </a>
              <a
                href="https://instagram.com/bbeyondsalon"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-gold/30 hover:border-gold rounded-sm flex items-center justify-center text-gold hover:bg-gold/10 transition-all"
                data-ocid="nav.link"
              >
                <SiInstagram size={16} />
              </a>
            </div>
            <div className="mt-6">
              <a
                href="/admin"
                className="text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                data-ocid="nav.link"
              >
                Admin
              </a>
            </div>
          </div>
        </div>

        <Separator className="bg-border mb-6" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {year} B Beyond Salon. All rights reserved.</p>
          <p>
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
