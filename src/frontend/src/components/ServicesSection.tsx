import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock } from "lucide-react";
import { motion } from "motion/react";
import type { ServiceCategory } from "../backend.d";
import { SEED_SERVICES } from "../data/seedData";
import { useServices } from "../hooks/useQueries";

const CATEGORY_LABELS: Record<string, string> = {
  haircut: "Haircut",
  color: "Color",
  treatment: "Treatment",
  bridal: "Bridal",
};

interface ServiceCardProps {
  name: string;
  description: string;
  priceInr: bigint;
  durationMins: bigint;
  category: ServiceCategory | string;
  image: string;
  index: number;
  onBook: () => void;
}

function ServiceCard({
  name,
  description,
  priceInr,
  durationMins,
  category,
  image,
  index,
  onBook,
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="card-luxury overflow-hidden group hover:border-gold/50 transition-colors"
      data-ocid={`services.item.${index + 1}`}
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-gold/20 text-gold border-gold/30 text-xs tracking-widest uppercase">
            {CATEGORY_LABELS[String(category)] || String(category)}
          </Badge>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-foreground mb-2">
          {name}
        </h3>
        <p className="text-muted-foreground text-xs leading-relaxed mb-4">
          {description}
        </p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-gold font-semibold text-sm">
            From ₹{Number(priceInr).toLocaleString("en-IN")}
          </span>
          <span className="text-muted-foreground text-xs flex items-center gap-1">
            <Clock size={12} />
            {Number(durationMins)} mins
          </span>
        </div>
        <Button
          onClick={onBook}
          variant="outline"
          className="w-full border-gold/40 text-gold hover:bg-gold hover:text-primary-foreground text-xs tracking-widest uppercase rounded-sm transition-all"
          data-ocid={`services.primary_button.${index + 1}`}
        >
          Book Now
        </Button>
      </div>
    </motion.div>
  );
}

interface ServicesSectionProps {
  onBookClick: (serviceId?: string) => void;
}

export function ServicesSection({ onBookClick }: ServicesSectionProps) {
  const { data: services, isLoading } = useServices();
  const displayServices =
    services && services.length > 0 ? services : SEED_SERVICES;

  return (
    <section id="services" className="py-24 bg-charcoal-light">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-4">
            What We Offer
          </p>
          <h2 className="section-heading mb-4">Our Services</h2>
          <div className="gold-divider" />
        </motion.div>

        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            data-ocid="services.loading_state"
          >
            {["s1", "s2", "s3", "s4"].map((k) => (
              <div key={k} className="card-luxury overflow-hidden">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-8 w-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayServices.map((svc, i) => (
              <ServiceCard
                key={svc.id}
                name={svc.name}
                description={svc.description}
                priceInr={svc.priceInr}
                durationMins={svc.durationMins}
                category={svc.category}
                image={
                  (svc as any).image ||
                  SEED_SERVICES[i % SEED_SERVICES.length]?.image ||
                  ""
                }
                index={i}
                onBook={() => onBookClick(svc.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
