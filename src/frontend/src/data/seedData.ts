import { ServiceCategory } from "../backend.d";

export const SEED_SERVICES = [
  {
    id: "svc-1",
    name: "Haircut & Styling",
    description:
      "Expert haircut with personalized styling suited to your face shape and lifestyle.",
    category: ServiceCategory.haircut,
    priceInr: BigInt(500),
    durationMins: BigInt(45),
    image: "/assets/generated/service-haircut.dim_400x300.jpg",
  },
  {
    id: "svc-2",
    name: "Hair Coloring",
    description:
      "Full color, highlights, balayage, and ombre using premium salon-grade products.",
    category: ServiceCategory.color,
    priceInr: BigInt(1500),
    durationMins: BigInt(90),
    image: "/assets/generated/service-color.dim_400x300.jpg",
  },
  {
    id: "svc-3",
    name: "Keratin Treatment",
    description:
      "Smooth, frizz-free, silky hair with our signature keratin smoothing system.",
    category: ServiceCategory.treatment,
    priceInr: BigInt(3000),
    durationMins: BigInt(120),
    image: "/assets/generated/service-keratin.dim_400x300.jpg",
  },
  {
    id: "svc-4",
    name: "Bridal Package",
    description:
      "Complete bridal hair and makeup transformation for your most special day.",
    category: ServiceCategory.bridal,
    priceInr: BigInt(8000),
    durationMins: BigInt(240),
    image: "/assets/generated/service-bridal.dim_400x300.jpg",
  },
];

export const SEED_STAFF = [
  {
    id: "staff-1",
    name: "Priya Sharma",
    role: "Senior Stylist",
    bio: "With over 10 years of experience, Priya specializes in precision cuts and creative styling that highlight each client's unique beauty.",
    specializations: ["Precision Cuts", "Blow Drying", "Hair Extensions"],
    image: "/assets/generated/stylist-priya.dim_400x500.jpg",
  },
  {
    id: "staff-2",
    name: "Rahul Mehta",
    role: "Color Specialist",
    bio: "Rahul is our master colorist with expertise in balayage, ombre, and creative color transformations using the finest professional products.",
    specializations: ["Balayage", "Ombre", "Creative Color"],
    image: "/assets/generated/stylist-rahul.dim_400x500.jpg",
  },
  {
    id: "staff-3",
    name: "Anjali Kapoor",
    role: "Bridal Expert",
    bio: "Anjali brings dreams to life on your wedding day with her exceptional skill in traditional and contemporary bridal styling and makeup.",
    specializations: ["Bridal Styling", "Makeup", "Mehendi Looks"],
    image: "/assets/generated/stylist-anjali.dim_400x500.jpg",
  },
];

export const SEED_OFFERS = [
  {
    id: "offer-1",
    title: "Bridal Bliss Package",
    description:
      "20% off on all Bridal Packages this month. Book your dream wedding look at an exclusive price.",
    discountPercent: BigInt(20),
    validUntil: BigInt(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: "offer-2",
    title: "Free Hair Spa",
    description:
      "Get a complimentary Nourishing Hair Spa with any Hair Coloring service. Limited slots available.",
    discountPercent: BigInt(0),
    validUntil: BigInt(Date.now() + 15 * 24 * 60 * 60 * 1000),
  },
  {
    id: "offer-3",
    title: "New Client Special",
    description:
      "First-time clients enjoy 15% off their total bill. Welcome to the B Beyond experience.",
    discountPercent: BigInt(15),
    validUntil: BigInt(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
];

export const SEED_CONTACT: import("../backend.d").ContactInfo = {
  address: "123 Style Street, Bandra West, Mumbai — 400050",
  phone: "+91 98765 43210",
  whatsapp: "+919876543210",
  instagram: "bbeyondsalon",
  workingHours: "Mon–Sat: 10:00 AM – 8:00 PM | Sun: 11:00 AM – 6:00 PM",
};

export const GALLERY_IMAGES = [
  {
    id: "g1",
    src: "/assets/generated/gallery-1.dim_400x300.jpg",
    label: "Salon Interior",
  },
  {
    id: "g2",
    src: "/assets/generated/gallery-2.dim_400x300.jpg",
    label: "Hair Coloring",
  },
  {
    id: "g3",
    src: "/assets/generated/gallery-3.dim_400x300.jpg",
    label: "Bridal Styling",
  },
  {
    id: "g4",
    src: "/assets/generated/gallery-4.dim_400x300.jpg",
    label: "Hair Treatment",
  },
  {
    id: "g5",
    src: "/assets/generated/gallery-5.dim_400x300.jpg",
    label: "Blowout",
  },
  {
    id: "g6",
    src: "/assets/generated/gallery-6.dim_400x300.jpg",
    label: "Reception",
  },
  {
    id: "g7",
    src: "/assets/generated/gallery-7.dim_400x300.jpg",
    label: "Color Art",
  },
  {
    id: "g8",
    src: "/assets/generated/gallery-8.dim_400x300.jpg",
    label: "Hair Spa",
  },
];
