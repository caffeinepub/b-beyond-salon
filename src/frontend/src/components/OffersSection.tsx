import { Badge } from "@/components/ui/badge";
import { Clock, Tag } from "lucide-react";
import { motion } from "motion/react";
import { SEED_OFFERS } from "../data/seedData";
import { useOffers } from "../hooks/useQueries";

function OfferCard({
  title,
  description,
  discountPercent,
  validUntil,
  index,
}: {
  title: string;
  description: string;
  discountPercent: bigint;
  validUntil: bigint;
  index: number;
}) {
  const validDate = new Date(Number(validUntil));
  const isSpecialOffer = Number(discountPercent) === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative card-luxury p-6 border-gold/20 hover:border-gold/50 transition-colors overflow-hidden group"
      data-ocid={`offers.item.${index + 1}`}
    >
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gold/5 rounded-bl-full" />

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 gold-gradient rounded-sm flex items-center justify-center shrink-0">
          <Tag size={20} className="text-primary-foreground" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-display text-lg font-semibold text-foreground">
              {title}
            </h3>
            {!isSpecialOffer && (
              <Badge className="bg-gold/20 text-gold border-gold/30 text-xs shrink-0">
                {Number(discountPercent)}% OFF
              </Badge>
            )}
            {isSpecialOffer && (
              <Badge className="bg-gold/20 text-gold border-gold/30 text-xs shrink-0">
                FREE
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed mb-3">
            {description}
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock size={11} />
            Valid until{" "}
            {validDate.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function OffersSection() {
  const { data: offers } = useOffers();
  const displayOffers = offers && offers.length > 0 ? offers : SEED_OFFERS;

  return (
    <section id="offers" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-4">
            Limited Time
          </p>
          <h2 className="section-heading mb-4">Exclusive Offers</h2>
          <div className="gold-divider" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayOffers.map((offer, i) => (
            <OfferCard
              key={offer.id}
              title={offer.title}
              description={offer.description}
              discountPercent={offer.discountPercent}
              validUntil={offer.validUntil}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
