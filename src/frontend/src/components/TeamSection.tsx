import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { SEED_STAFF } from "../data/seedData";
import { useStaff } from "../hooks/useQueries";

function StaffCard({
  name,
  role,
  bio,
  specializations,
  image,
  index,
}: {
  name: string;
  role: string;
  bio: string;
  specializations: string[];
  image: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className="card-luxury overflow-hidden group text-center"
      data-ocid={`team.item.${index + 1}`}
    >
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-500 object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl font-bold uppercase tracking-wide text-foreground mb-1">
          {name}
        </h3>
        <p className="text-gold text-xs tracking-widest uppercase mb-3">
          {role}
        </p>
        <div className="gold-divider mb-4" />
        <p className="text-muted-foreground text-xs leading-relaxed mb-4">
          {bio}
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {specializations.map((spec) => (
            <Badge
              key={spec}
              variant="outline"
              className="border-border text-muted-foreground text-[10px] tracking-wide uppercase"
            >
              {spec}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function TeamSection() {
  const { data: staff, isLoading } = useStaff();
  const displayStaff = staff && staff.length > 0 ? staff : SEED_STAFF;

  return (
    <section id="team" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-4">
            The Experts
          </p>
          <h2 className="section-heading mb-4">Meet Our Master Stylists</h2>
          <div className="gold-divider" />
        </motion.div>

        {isLoading ? (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            data-ocid="team.loading_state"
          >
            {["t1", "t2", "t3"].map((k) => (
              <div key={k} className="card-luxury overflow-hidden">
                <Skeleton className="w-full aspect-[4/5]" />
                <div className="p-6 space-y-3 text-center">
                  <Skeleton className="h-6 w-2/3 mx-auto" />
                  <Skeleton className="h-3 w-1/2 mx-auto" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayStaff.map((member, i) => (
              <StaffCard
                key={member.id}
                name={member.name}
                role={member.role}
                bio={member.bio}
                specializations={member.specializations}
                image={
                  (member as any).image ||
                  SEED_STAFF[i % SEED_STAFF.length]?.image ||
                  ""
                }
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
