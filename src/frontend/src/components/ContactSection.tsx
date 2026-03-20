import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Instagram, MapPin, MessageCircle, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { SEED_CONTACT } from "../data/seedData";
import { useContactInfo } from "../hooks/useQueries";

export function ContactSection() {
  const { data: contactInfo } = useContactInfo();
  const contact = contactInfo || SEED_CONTACT;

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <section id="contact" className="py-24 bg-charcoal-light">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-4">
            Find Us
          </p>
          <h2 className="section-heading mb-4">Visit Us</h2>
          <div className="gold-divider" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xs tracking-[0.3em] uppercase text-gold mb-6">
                Contact Info
              </h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <MapPin size={18} className="text-gold mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">
                      Address
                    </p>
                    <p className="text-sm text-foreground">{contact.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone size={18} className="text-gold mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">
                      Phone
                    </p>
                    <a
                      href={`tel:${contact.phone.replace(/\s/g, "")}`}
                      className="text-sm text-foreground hover:text-gold transition-colors"
                    >
                      {contact.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock size={18} className="text-gold mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">
                      Working Hours
                    </p>
                    <p className="text-sm text-foreground">
                      {contact.workingHours}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-xs tracking-[0.3em] uppercase text-gold mb-4">
                Connect With Us
              </h3>
              <div className="flex gap-4">
                <a
                  href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-gold/30 hover:border-gold text-gold text-xs tracking-widest uppercase px-4 py-2.5 rounded-sm transition-colors hover:bg-gold/10"
                  data-ocid="contact.link"
                >
                  <MessageCircle size={14} />
                  WhatsApp
                </a>
                <a
                  href={`https://instagram.com/${contact.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-gold/30 hover:border-gold text-gold text-xs tracking-widest uppercase px-4 py-2.5 rounded-sm transition-colors hover:bg-gold/10"
                  data-ocid="contact.link"
                >
                  <Instagram size={14} />
                  Instagram
                </a>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="rounded-sm overflow-hidden border border-border h-52 bg-charcoal-mid flex items-center justify-center">
              <div className="text-center">
                <MapPin size={32} className="text-gold mx-auto mb-2" />
                <p className="text-muted-foreground text-xs">
                  123 Style Street, Bandra West
                </p>
                <p className="text-muted-foreground text-xs">Mumbai — 400050</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xs tracking-[0.3em] uppercase text-gold mb-6">
              Get In Touch
            </h3>
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              data-ocid="contact.modal"
            >
              <div>
                <Label
                  htmlFor="contact-name"
                  className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block"
                >
                  Your Name
                </Label>
                <Input
                  id="contact-name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Priya Sharma"
                  required
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground/50 rounded-sm"
                  data-ocid="contact.input"
                />
              </div>
              <div>
                <Label
                  htmlFor="contact-email"
                  className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block"
                >
                  Email Address
                </Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="hello@example.com"
                  required
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground/50 rounded-sm"
                  data-ocid="contact.input"
                />
              </div>
              <div>
                <Label
                  htmlFor="contact-message"
                  className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block"
                >
                  Message
                </Label>
                <Textarea
                  id="contact-message"
                  value={form.message}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, message: e.target.value }))
                  }
                  placeholder="Tell us about your hair goals..."
                  rows={5}
                  required
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground/50 rounded-sm resize-none"
                  data-ocid="contact.textarea"
                />
              </div>
              <Button
                type="submit"
                disabled={sending}
                className="w-full gold-gradient text-primary-foreground text-xs tracking-widest uppercase font-semibold rounded-sm py-5 hover:opacity-90 border-0"
                data-ocid="contact.submit_button"
              >
                {sending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
