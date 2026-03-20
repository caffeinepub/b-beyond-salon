import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check, Loader2, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { AppointmentStatus, ServiceCategory } from "../backend.d";
import { SEED_CONTACT } from "../data/seedData";
import {
  useAddOrUpdateOffer,
  useAddOrUpdateService,
  useAllAppointments,
  useContactInfo,
  useDeleteOffer,
  useDeleteService,
  useOffers,
  useServices,
  useSetContactInfo,
  useStaff,
  useUpdateAppointmentStatus,
} from "../hooks/useQueries";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
  completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

function AppointmentsTab() {
  const { data: appointments, isLoading } = useAllAppointments();
  const updateStatus = useUpdateAppointmentStatus();
  const { data: services } = useServices();
  const { data: staff } = useStaff();

  const getServiceName = (id: string) =>
    services?.find((s) => s.id === id)?.name || id;
  const getStaffName = (id: string) =>
    staff?.find((s) => s.id === id)?.name || id;

  if (isLoading)
    return (
      <div
        className="flex justify-center py-8"
        data-ocid="admin.appointments.loading_state"
      >
        <Loader2 className="animate-spin text-gold" />
      </div>
    );

  return (
    <div data-ocid="admin.appointments.table">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground text-xs tracking-widest uppercase">
              Customer
            </TableHead>
            <TableHead className="text-muted-foreground text-xs tracking-widest uppercase">
              Service
            </TableHead>
            <TableHead className="text-muted-foreground text-xs tracking-widest uppercase">
              Stylist
            </TableHead>
            <TableHead className="text-muted-foreground text-xs tracking-widest uppercase">
              Date/Time
            </TableHead>
            <TableHead className="text-muted-foreground text-xs tracking-widest uppercase">
              Status
            </TableHead>
            <TableHead className="text-muted-foreground text-xs tracking-widest uppercase">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(!appointments || appointments.length === 0) && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-8"
                data-ocid="admin.appointments.empty_state"
              >
                No appointments yet
              </TableCell>
            </TableRow>
          )}
          {appointments?.map((appt, i) => (
            <TableRow
              key={appt.id}
              className="border-border"
              data-ocid={`admin.appointments.row.${i + 1}`}
            >
              <TableCell>
                <p className="text-sm text-foreground">{appt.customerName}</p>
                <p className="text-xs text-muted-foreground">{appt.email}</p>
              </TableCell>
              <TableCell className="text-sm text-foreground">
                {getServiceName(appt.serviceId)}
              </TableCell>
              <TableCell className="text-sm text-foreground">
                {getStaffName(appt.staffId)}
              </TableCell>
              <TableCell>
                <p className="text-xs text-foreground">
                  {new Date(Number(appt.date)).toLocaleDateString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {appt.timeSlot.startTime}
                </p>
              </TableCell>
              <TableCell>
                <Badge className={STATUS_COLORS[appt.status] || ""}>
                  {appt.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Select
                  value={appt.status}
                  onValueChange={async (val) => {
                    await updateStatus.mutateAsync({
                      id: appt.id,
                      status: val as AppointmentStatus,
                    });
                    toast.success("Status updated");
                  }}
                >
                  <SelectTrigger
                    className="w-32 h-8 text-xs bg-input border-border"
                    data-ocid={`admin.appointments.select.${i + 1}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(AppointmentStatus).map((s) => (
                      <SelectItem key={s} value={s} className="text-xs">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ServicesTab() {
  const { data: services, isLoading } = useServices();
  const addService = useAddOrUpdateService();
  const deleteService = useDeleteService();
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "haircut",
    priceInr: "",
    durationMins: "",
  });

  async function handleAdd() {
    if (!form.name || !form.priceInr) return;
    await addService.mutateAsync({
      id: crypto.randomUUID(),
      name: form.name,
      description: form.description,
      category: form.category as ServiceCategory,
      priceInr: BigInt(Number.parseInt(form.priceInr)),
      durationMins: BigInt(Number.parseInt(form.durationMins) || 60),
    });
    toast.success("Service saved");
    setForm({
      name: "",
      description: "",
      category: "haircut",
      priceInr: "",
      durationMins: "",
    });
  }

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div className="card-luxury p-6 space-y-4">
        <h3 className="text-xs tracking-widest uppercase text-gold">
          Add Service
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Name
            </Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="bg-input border-border text-foreground rounded-sm text-sm"
              data-ocid="admin.services.input"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Category
            </Label>
            <Select
              value={form.category}
              onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
            >
              <SelectTrigger
                className="bg-input border-border text-foreground rounded-sm text-sm"
                data-ocid="admin.services.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ServiceCategory).map((c) => (
                  <SelectItem key={c} value={c} className="text-sm">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Price (₹)
            </Label>
            <Input
              type="number"
              value={form.priceInr}
              onChange={(e) =>
                setForm((p) => ({ ...p, priceInr: e.target.value }))
              }
              className="bg-input border-border text-foreground rounded-sm text-sm"
              data-ocid="admin.services.input"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Duration (mins)
            </Label>
            <Input
              type="number"
              value={form.durationMins}
              onChange={(e) =>
                setForm((p) => ({ ...p, durationMins: e.target.value }))
              }
              className="bg-input border-border text-foreground rounded-sm text-sm"
              data-ocid="admin.services.input"
            />
          </div>
          <div className="col-span-2">
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Description
            </Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              className="bg-input border-border text-foreground rounded-sm text-sm resize-none"
              rows={2}
              data-ocid="admin.services.textarea"
            />
          </div>
        </div>
        <Button
          onClick={handleAdd}
          disabled={addService.isPending}
          className="gold-gradient text-primary-foreground text-xs tracking-widest uppercase rounded-sm border-0"
          data-ocid="admin.services.submit_button"
        >
          {addService.isPending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Plus size={14} />
          )}
          Add Service
        </Button>
      </div>

      {/* Table */}
      <div data-ocid="admin.services.table">
        {isLoading ? (
          <div
            className="py-4 text-center"
            data-ocid="admin.services.loading_state"
          >
            <Loader2 className="animate-spin text-gold mx-auto" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground text-xs uppercase">
                  Name
                </TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase">
                  Category
                </TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase">
                  Price
                </TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase">
                  Duration
                </TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {(!services || services.length === 0) && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-6"
                    data-ocid="admin.services.empty_state"
                  >
                    No services
                  </TableCell>
                </TableRow>
              )}
              {services?.map((svc, i) => (
                <TableRow
                  key={svc.id}
                  className="border-border"
                  data-ocid={`admin.services.row.${i + 1}`}
                >
                  <TableCell className="text-sm text-foreground">
                    {svc.name}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-gold/20 text-gold border-gold/30 text-xs">
                      {svc.category as string}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-foreground">
                    ₹{Number(svc.priceInr).toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-sm text-foreground">
                    {Number(svc.durationMins)} mins
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={async () => {
                        await deleteService.mutateAsync(svc.id);
                        toast.success("Deleted");
                      }}
                      className="text-destructive hover:bg-destructive/10 h-7 w-7 p-0"
                      data-ocid={`admin.services.delete_button.${i + 1}`}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function OffersTab() {
  const { data: offers, isLoading } = useOffers();
  const addOffer = useAddOrUpdateOffer();
  const deleteOffer = useDeleteOffer();
  const [form, setForm] = useState({
    title: "",
    description: "",
    discountPercent: "",
    validUntil: "",
  });

  async function handleAdd() {
    if (!form.title) return;
    await addOffer.mutateAsync({
      id: crypto.randomUUID(),
      title: form.title,
      description: form.description,
      discountPercent: BigInt(Number.parseInt(form.discountPercent) || 0),
      validUntil: BigInt(
        new Date(form.validUntil).getTime() ||
          Date.now() + 30 * 24 * 60 * 60 * 1000,
      ),
    });
    toast.success("Offer saved");
    setForm({
      title: "",
      description: "",
      discountPercent: "",
      validUntil: "",
    });
  }

  return (
    <div className="space-y-6">
      <div className="card-luxury p-6 space-y-4">
        <h3 className="text-xs tracking-widest uppercase text-gold">
          Add Offer
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Title
            </Label>
            <Input
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              className="bg-input border-border text-foreground rounded-sm text-sm"
              data-ocid="admin.offers.input"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Discount %
            </Label>
            <Input
              type="number"
              value={form.discountPercent}
              onChange={(e) =>
                setForm((p) => ({ ...p, discountPercent: e.target.value }))
              }
              className="bg-input border-border text-foreground rounded-sm text-sm"
              data-ocid="admin.offers.input"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Valid Until
            </Label>
            <Input
              type="date"
              value={form.validUntil}
              onChange={(e) =>
                setForm((p) => ({ ...p, validUntil: e.target.value }))
              }
              className="bg-input border-border text-foreground rounded-sm text-sm"
              data-ocid="admin.offers.input"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Description
            </Label>
            <Input
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              className="bg-input border-border text-foreground rounded-sm text-sm"
              data-ocid="admin.offers.input"
            />
          </div>
        </div>
        <Button
          onClick={handleAdd}
          disabled={addOffer.isPending}
          className="gold-gradient text-primary-foreground text-xs tracking-widest uppercase rounded-sm border-0"
          data-ocid="admin.offers.submit_button"
        >
          <Plus size={14} /> Add Offer
        </Button>
      </div>
      <div data-ocid="admin.offers.table">
        {isLoading ? (
          <Loader2
            className="animate-spin text-gold mx-auto"
            data-ocid="admin.offers.loading_state"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground text-xs uppercase">
                  Title
                </TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase">
                  Discount
                </TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase">
                  Valid Until
                </TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {(!offers || offers.length === 0) && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground py-6"
                    data-ocid="admin.offers.empty_state"
                  >
                    No offers
                  </TableCell>
                </TableRow>
              )}
              {offers?.map((offer, i) => (
                <TableRow
                  key={offer.id}
                  className="border-border"
                  data-ocid={`admin.offers.row.${i + 1}`}
                >
                  <TableCell className="text-sm text-foreground">
                    {offer.title}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-gold/20 text-gold border-gold/30 text-xs">
                      {Number(offer.discountPercent)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(Number(offer.validUntil)).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={async () => {
                        await deleteOffer.mutateAsync(offer.id);
                        toast.success("Deleted");
                      }}
                      className="text-destructive hover:bg-destructive/10 h-7 w-7 p-0"
                      data-ocid={`admin.offers.delete_button.${i + 1}`}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function ContactTab() {
  const { data: contactInfo } = useContactInfo();
  const setContact = useSetContactInfo();
  const [form, setForm] = useState(contactInfo || SEED_CONTACT);

  async function handleSave() {
    await setContact.mutateAsync(form);
    toast.success("Contact info saved");
  }

  return (
    <div className="card-luxury p-6 space-y-5 max-w-xl">
      <h3 className="text-xs tracking-widest uppercase text-gold">
        Contact Information
      </h3>
      {(
        ["address", "phone", "whatsapp", "instagram", "workingHours"] as const
      ).map((field) => (
        <div key={field}>
          <Label className="text-xs tracking-widest uppercase text-muted-foreground mb-1.5 block capitalize">
            {field.replace(/([A-Z])/g, " $1")}
          </Label>
          <Input
            value={form[field]}
            onChange={(e) =>
              setForm((p) => ({ ...p, [field]: e.target.value }))
            }
            className="bg-input border-border text-foreground rounded-sm text-sm"
            data-ocid="admin.contact.input"
          />
        </div>
      ))}
      <Button
        onClick={handleSave}
        disabled={setContact.isPending}
        className="gold-gradient text-primary-foreground text-xs tracking-widest uppercase rounded-sm border-0"
        data-ocid="admin.contact.submit_button"
      >
        {setContact.isPending ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Check size={14} />
        )}
        Save Changes
      </Button>
    </div>
  );
}

interface AdminPanelProps {
  onBack: () => void;
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground"
              data-ocid="admin.secondary_button"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Site
            </Button>
            <div className="w-px h-5 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 gold-gradient rounded-sm flex items-center justify-center">
                <span className="font-display font-bold text-sm text-primary-foreground">
                  B
                </span>
              </div>
              <span className="font-display tracking-widest uppercase text-sm text-foreground">
                Admin Panel
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Tabs defaultValue="appointments" className="space-y-6">
            <TabsList className="bg-card border border-border">
              {["appointments", "services", "offers", "contact"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="text-xs tracking-widest uppercase data-[state=active]:bg-gold/20 data-[state=active]:text-gold"
                  data-ocid={`admin.${tab}.tab`}
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="appointments">
              <AppointmentsTab />
            </TabsContent>
            <TabsContent value="services">
              <ServicesTab />
            </TabsContent>
            <TabsContent value="offers">
              <OffersTab />
            </TabsContent>
            <TabsContent value="contact">
              <ContactTab />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
