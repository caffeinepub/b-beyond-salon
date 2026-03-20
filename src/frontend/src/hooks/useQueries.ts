import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Appointment,
  AppointmentStatus,
  ContactInfo,
  Gallery,
  Offer,
  Service,
  ServiceCategory,
  ShoppingItem,
  Staff,
} from "../backend.d";
import { useActor } from "./useActor";

export function useServices() {
  const { actor, isFetching } = useActor();
  return useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getServices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStaff() {
  const { actor, isFetching } = useActor();
  return useQuery<Staff[]>({
    queryKey: ["staff"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStaff();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useOffers() {
  const { actor, isFetching } = useActor();
  return useQuery<Offer[]>({
    queryKey: ["offers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveOffers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useContactInfo() {
  const { actor, isFetching } = useActor();
  return useQuery<ContactInfo | null>({
    queryKey: ["contactInfo"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getContactInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGallery(category = "all") {
  const { actor, isFetching } = useActor();
  return useQuery<Gallery[]>({
    queryKey: ["gallery", category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGalleryByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyAppointments() {
  const { actor, isFetching } = useActor();
  return useQuery<Appointment[]>({
    queryKey: ["myAppointments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyAppointments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllAppointments() {
  const { actor, isFetching } = useActor();
  return useQuery<Appointment[]>({
    queryKey: ["allAppointments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAppointments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["stripeConfigured"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBookAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (appointment: Appointment) => {
      if (!actor) throw new Error("Not connected");
      return actor.bookAppointment(appointment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["allAppointments"] });
    },
  });
}

export function useCreateCheckoutSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      items,
      successUrl,
      cancelUrl,
    }: {
      items: ShoppingItem[];
      successUrl: string;
      cancelUrl: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createCheckoutSession(items, successUrl, cancelUrl);
    },
  });
}

export function useAddOrUpdateService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (service: Service) => {
      if (!actor) throw new Error("Not connected");
      return actor.addOrUpdateService(service);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["services"] }),
  });
}

export function useDeleteService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteService(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["services"] }),
  });
}

export function useAddOrUpdateStaff() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (member: Staff) => {
      if (!actor) throw new Error("Not connected");
      return actor.addOrUpdateStaff(member as any);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff"] }),
  });
}

export function useDeleteStaff() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteStaff(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff"] }),
  });
}

export function useAddOrUpdateOffer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (offer: Offer) => {
      if (!actor) throw new Error("Not connected");
      return actor.addOrUpdateOffer(offer);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["offers"] }),
  });
}

export function useDeleteOffer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteOffer(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["offers"] }),
  });
}

export function useSetContactInfo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (info: ContactInfo) => {
      if (!actor) throw new Error("Not connected");
      return actor.setContactInfo(info);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["contactInfo"] }),
  });
}

export function useUpdateAppointmentStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: { id: string; status: AppointmentStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateAppointmentStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["myAppointments"] });
    },
  });
}

export function useAddOrUpdateGallery() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: Gallery) => {
      if (!actor) throw new Error("Not connected");
      return actor.addOrUpdateGallery(item as any);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["gallery"] }),
  });
}

export function useDeleteGallery() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteGallery(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["gallery"] }),
  });
}

export type {
  Service,
  Staff,
  Offer,
  Appointment,
  ContactInfo,
  Gallery,
  ServiceCategory,
  AppointmentStatus,
};
