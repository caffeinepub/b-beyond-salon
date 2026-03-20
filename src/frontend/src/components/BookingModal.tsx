import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppointmentStatus } from "../backend.d";
import { SEED_SERVICES, SEED_STAFF } from "../data/seedData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useBookAppointment,
  useCreateCheckoutSession,
  useIsStripeConfigured,
  useServices,
  useStaff,
} from "../hooks/useQueries";

type Step = "service" | "stylist" | "datetime" | "details" | "confirm";

const TIME_SLOTS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
];

interface BookingModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  preselectedServiceId?: string;
}

export function BookingModal({
  open,
  onOpenChange,
  preselectedServiceId,
}: BookingModalProps) {
  const { identity, login } = useInternetIdentity();
  const { data: services } = useServices();
  const { data: staff } = useStaff();
  const bookAppointment = useBookAppointment();
  const createCheckout = useCreateCheckoutSession();
  const { data: stripeEnabled } = useIsStripeConfigured();

  const displayServices =
    services && services.length > 0 ? services : SEED_SERVICES;
  const displayStaff = staff && staff.length > 0 ? staff : SEED_STAFF;

  const [step, setStep] = useState<Step>("service");
  const [selectedServiceId, setSelectedServiceId] = useState(
    preselectedServiceId || "",
  );
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [details, setDetails] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const selectedService = displayServices.find(
    (s) => s.id === selectedServiceId,
  );
  const selectedStaff = displayStaff.find((s) => s.id === selectedStaffId);

  const STEPS: Step[] = [
    "service",
    "stylist",
    "datetime",
    "details",
    "confirm",
  ];
  const stepIndex = STEPS.indexOf(step);

  function nextStep() {
    const next = STEPS[stepIndex + 1];
    if (next) setStep(next);
  }

  async function handleBooking() {
    if (!identity) {
      await login();
      return;
    }

    const appointmentId = crypto.randomUUID();
    const [startTime] = timeSlot.split(" - ");
    const endHour = Number.parseInt(startTime) + 1;
    const endTime = `${endHour}:00 ${startTime.includes("PM") ? "PM" : "AM"}`;

    try {
      await bookAppointment.mutateAsync({
        id: appointmentId,
        customerName: details.name,
        email: details.email,
        phone: details.phone,
        notes: details.notes,
        serviceId: selectedServiceId,
        staffId: selectedStaffId || displayStaff[0]?.id || "",
        bookedBy: identity.getPrincipal(),
        date: BigInt(Date.now()),
        status: AppointmentStatus.pending,
        timeSlot: { startTime: timeSlot, endTime },
      });

      if (stripeEnabled && selectedService) {
        const session = await createCheckout.mutateAsync({
          items: [
            {
              productName: selectedService.name,
              productDescription: selectedService.description,
              priceInCents: selectedService.priceInr * BigInt(100),
              quantity: BigInt(1),
              currency: "inr",
            },
          ],
          successUrl: `${window.location.href}?booking=success`,
          cancelUrl: `${window.location.href}?booking=cancel`,
        });
        window.location.href = session;
      } else {
        setStep("confirm");
        toast.success("Appointment booked successfully!");
      }
    } catch (_err) {
      toast.error("Failed to book appointment. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg bg-card border-border text-foreground"
        data-ocid="booking.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl tracking-widest uppercase text-foreground">
            Book Appointment
          </DialogTitle>
        </DialogHeader>

        {/* Progress */}
        <div className="flex items-center gap-1 mb-6">
          {STEPS.filter((s) => s !== "confirm").map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-6 h-6 rounded-full text-[10px] flex items-center justify-center font-bold ${
                  i <= stepIndex - (step === "confirm" ? 1 : 0)
                    ? "bg-gold text-primary-foreground"
                    : "bg-border text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              {i < 3 && (
                <div
                  className={`flex-1 h-px ${i < stepIndex ? "bg-gold" : "bg-border"}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step: Service */}
        {step === "service" && (
          <div className="space-y-3">
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">
              Select a Service
            </p>
            {displayServices.map((svc) => (
              <button
                type="button"
                key={svc.id}
                onClick={() => setSelectedServiceId(svc.id)}
                className={`w-full text-left p-4 rounded-sm border transition-all ${
                  selectedServiceId === svc.id
                    ? "border-gold bg-gold/10"
                    : "border-border hover:border-gold/40"
                }`}
                data-ocid="booking.select"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {svc.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Number(svc.durationMins)} mins
                    </p>
                  </div>
                  <span className="text-gold font-semibold text-sm">
                    ₹{Number(svc.priceInr).toLocaleString("en-IN")}
                  </span>
                </div>
              </button>
            ))}
            <Button
              onClick={nextStep}
              disabled={!selectedServiceId}
              className="w-full gold-gradient text-primary-foreground text-xs tracking-widest uppercase rounded-sm mt-4 border-0"
              data-ocid="booking.primary_button"
            >
              Next <ChevronRight size={14} className="ml-1" />
            </Button>
          </div>
        )}

        {/* Step: Stylist */}
        {step === "stylist" && (
          <div className="space-y-3">
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">
              Choose Your Stylist
            </p>
            {displayStaff.map((member) => (
              <button
                type="button"
                key={member.id}
                onClick={() => setSelectedStaffId(member.id)}
                className={`w-full text-left p-4 rounded-sm border transition-all ${
                  selectedStaffId === member.id
                    ? "border-gold bg-gold/10"
                    : "border-border hover:border-gold/40"
                }`}
                data-ocid="booking.select"
              >
                <p className="text-sm font-semibold text-foreground">
                  {member.name}
                </p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </button>
            ))}
            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setStep("service")}
                className="flex-1 border-border text-muted-foreground text-xs rounded-sm"
                data-ocid="booking.cancel_button"
              >
                Back
              </Button>
              <Button
                onClick={nextStep}
                disabled={!selectedStaffId}
                className="flex-1 gold-gradient text-primary-foreground text-xs tracking-widest uppercase rounded-sm border-0"
                data-ocid="booking.primary_button"
              >
                Next <ChevronRight size={14} className="ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step: DateTime */}
        {step === "datetime" && (
          <div className="space-y-5">
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">
              Pick Date & Time
            </p>
            <div>
              <Label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">
                Date
              </Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="bg-input border-border text-foreground rounded-sm"
                data-ocid="booking.input"
              />
            </div>
            <div>
              <Label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">
                Time Slot
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setTimeSlot(slot)}
                    className={`text-xs py-2 rounded-sm border transition-all ${
                      timeSlot === slot
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-border text-muted-foreground hover:border-gold/40"
                    }`}
                    data-ocid="booking.toggle"
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("stylist")}
                className="flex-1 border-border text-muted-foreground text-xs rounded-sm"
                data-ocid="booking.cancel_button"
              >
                Back
              </Button>
              <Button
                onClick={nextStep}
                disabled={!date || !timeSlot}
                className="flex-1 gold-gradient text-primary-foreground text-xs tracking-widest uppercase rounded-sm border-0"
                data-ocid="booking.primary_button"
              >
                Next <ChevronRight size={14} className="ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step: Details */}
        {step === "details" && (
          <div className="space-y-4">
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">
              Your Details
            </p>
            <div>
              <Label className="text-xs tracking-widest uppercase text-muted-foreground mb-1.5 block">
                Full Name
              </Label>
              <Input
                value={details.name}
                onChange={(e) =>
                  setDetails((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Your name"
                className="bg-input border-border text-foreground rounded-sm"
                data-ocid="booking.input"
              />
            </div>
            <div>
              <Label className="text-xs tracking-widest uppercase text-muted-foreground mb-1.5 block">
                Email
              </Label>
              <Input
                type="email"
                value={details.email}
                onChange={(e) =>
                  setDetails((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="your@email.com"
                className="bg-input border-border text-foreground rounded-sm"
                data-ocid="booking.input"
              />
            </div>
            <div>
              <Label className="text-xs tracking-widest uppercase text-muted-foreground mb-1.5 block">
                Phone
              </Label>
              <Input
                value={details.phone}
                onChange={(e) =>
                  setDetails((p) => ({ ...p, phone: e.target.value }))
                }
                placeholder="+91 98765 43210"
                className="bg-input border-border text-foreground rounded-sm"
                data-ocid="booking.input"
              />
            </div>
            <div>
              <Label className="text-xs tracking-widest uppercase text-muted-foreground mb-1.5 block">
                Notes (Optional)
              </Label>
              <Textarea
                value={details.notes}
                onChange={(e) =>
                  setDetails((p) => ({ ...p, notes: e.target.value }))
                }
                placeholder="Any preferences or special requests..."
                rows={3}
                className="bg-input border-border text-foreground rounded-sm resize-none"
                data-ocid="booking.textarea"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("datetime")}
                className="flex-1 border-border text-muted-foreground text-xs rounded-sm"
                data-ocid="booking.cancel_button"
              >
                Back
              </Button>
              <Button
                onClick={handleBooking}
                disabled={
                  !details.name ||
                  !details.email ||
                  !details.phone ||
                  bookAppointment.isPending
                }
                className="flex-1 gold-gradient text-primary-foreground text-xs tracking-widest uppercase rounded-sm border-0"
                data-ocid="booking.submit_button"
              >
                {bookAppointment.isPending ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  "Confirm & Pay"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step: Confirm */}
        {step === "confirm" && (
          <div
            className="text-center py-6 space-y-4"
            data-ocid="booking.success_state"
          >
            <CheckCircle size={48} className="text-gold mx-auto" />
            <h3 className="font-display text-xl font-bold text-foreground">
              Booking Confirmed!
            </h3>
            <p className="text-muted-foreground text-sm">
              Your appointment for{" "}
              <span className="text-foreground">{selectedService?.name}</span>{" "}
              with{" "}
              <span className="text-foreground">{selectedStaff?.name}</span> has
              been booked.
            </p>
            <p className="text-muted-foreground text-xs">
              {date} at {timeSlot}
            </p>
            <Button
              onClick={() => {
                onOpenChange(false);
                setStep("service");
              }}
              className="gold-gradient text-primary-foreground text-xs tracking-widest uppercase rounded-sm border-0 px-8"
              data-ocid="booking.close_button"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
