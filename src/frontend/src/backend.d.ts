import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface TimeSlot {
    startTime: string;
    endTime: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface Service {
    id: string;
    durationMins: bigint;
    name: string;
    description: string;
    category: ServiceCategory;
    priceInr: bigint;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface Gallery {
    id: string;
    category: string;
    image: ExternalBlob;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Staff {
    id: string;
    bio: string;
    name: string;
    role: string;
    photo: ExternalBlob;
    specializations: Array<string>;
}
export interface Offer {
    id: string;
    title: string;
    description: string;
    discountPercent: bigint;
    validUntil: Time;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface Appointment {
    id: string;
    customerName: string;
    status: AppointmentStatus;
    staffId: string;
    bookedBy: Principal;
    date: Time;
    email: string;
    notes: string;
    serviceId: string;
    phone: string;
    timeSlot: TimeSlot;
}
export interface ContactInfo {
    instagram: string;
    whatsapp: string;
    workingHours: string;
    address: string;
    phone: string;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export enum AppointmentStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed"
}
export enum ServiceCategory {
    bridal = "bridal",
    color = "color",
    treatment = "treatment",
    haircut = "haircut"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addOrUpdateGallery(item: Gallery): Promise<void>;
    addOrUpdateOffer(offer: Offer): Promise<void>;
    addOrUpdateService(service: Service): Promise<void>;
    addOrUpdateStaff(member: Staff): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bookAppointment(appointment: Appointment): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    deleteAppointment(id: string): Promise<void>;
    deleteGallery(id: string): Promise<void>;
    deleteOffer(id: string): Promise<void>;
    deleteService(id: string): Promise<void>;
    deleteStaff(id: string): Promise<void>;
    getActiveOffers(): Promise<Array<Offer>>;
    getAppointments(): Promise<Array<Appointment>>;
    getAppointmentsByStaff(staffId: string): Promise<Array<Appointment>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactInfo(): Promise<ContactInfo | null>;
    getGalleryByCategory(category: string): Promise<Array<Gallery>>;
    getMyAppointments(): Promise<Array<Appointment>>;
    getServices(): Promise<Array<Service>>;
    getServicesByCategory(category: ServiceCategory): Promise<Array<Service>>;
    getStaff(): Promise<Array<Staff>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setContactInfo(info: ContactInfo): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<void>;
}
