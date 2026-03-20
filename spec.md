# B Beyond Salon

## Current State
New project with empty Motoko backend actor.

## Requested Changes (Diff)

### Add
- Full premium dark-themed salon website
- Service listings with INR pricing (haircuts, coloring, treatments, etc.)
- Real-time appointment booking system (date, time, service, staff selection)
- Stripe payment integration for booking deposits
- Team/staff profiles with photos, specializations
- Photo gallery
- Special offers/promotions section
- Contact section with WhatsApp and Instagram links
- Admin panel for managing bookings, services, offers
- Role-based access (admin vs. customer)

### Modify
- Empty backend actor -> full salon management backend

### Remove
- Nothing

## Implementation Plan
1. Backend: Salon services CRUD, appointment booking with slots, staff profiles, gallery management, offers management, contact info
2. Authorization for admin/customer roles
3. Stripe for deposit payments on bookings
4. Frontend: Landing page with hero, services, team, gallery, offers, booking flow, contact footer
