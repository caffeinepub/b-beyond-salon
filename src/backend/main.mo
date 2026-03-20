import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Include blob storage
  include MixinStorage();

  // Include authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profiles
  public type UserProfile = {
    name : Text;
    phone : Text;
    email : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Salon Services
  public type Service = {
    id : Text;
    name : Text;
    description : Text;
    priceInr : Nat;
    durationMins : Nat;
    category : ServiceCategory;
  };

  public type ServiceCategory = {
    #haircut;
    #color;
    #treatment;
    #bridal;
  };

  let services = Map.empty<Text, Service>();

  public shared ({ caller }) func addOrUpdateService(service : Service) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    services.add(service.id, service);
  };

  public shared ({ caller }) func deleteService(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    services.remove(id);
  };

  public query func getServices() : async [Service] {
    services.values().toArray();
  };

  public query func getServicesByCategory(category : ServiceCategory) : async [Service] {
    services.values().toArray().filter(
      func(s) {
        s.category == category;
      }
    );
  };

  // Staff Profiles
  public type Staff = {
    id : Text;
    name : Text;
    role : Text;
    bio : Text;
    specializations : [Text];
    photo : Storage.ExternalBlob;
  };

  let staff = Map.empty<Text, Staff>();

  public shared ({ caller }) func addOrUpdateStaff(member : Staff) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    staff.add(member.id, member);
  };

  public shared ({ caller }) func deleteStaff(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    staff.remove(id);
  };

  public query func getStaff() : async [Staff] {
    staff.values().toArray();
  };

  // Appointments
  public type Appointment = {
    id : Text;
    serviceId : Text;
    staffId : Text;
    date : Time.Time;
    timeSlot : TimeSlot;
    customerName : Text;
    phone : Text;
    email : Text;
    notes : Text;
    status : AppointmentStatus;
    bookedBy : Principal;
  };

  public type TimeSlot = {
    startTime : Text;
    endTime : Text;
  };

  public type AppointmentStatus = {
    #pending;
    #confirmed;
    #cancelled;
    #completed;
  };

  let appointments = Map.empty<Text, Appointment>();

  public shared ({ caller }) func bookAppointment(appointment : Appointment) : async () {
    // Allow any user (including guests) to book appointments
    // Store the caller's principal for ownership tracking
    let appointmentWithCaller = {
      appointment with bookedBy = caller;
    };
    appointments.add(appointmentWithCaller.id, appointmentWithCaller);
  };

  public shared ({ caller }) func updateAppointmentStatus(id : Text, status : AppointmentStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    let existing = switch (appointments.get(id)) {
      case (null) { Runtime.trap("Appointment not found") };
      case (?appt) { appt };
    };
    appointments.add(id, { existing with status });
  };

  public shared ({ caller }) func deleteAppointment(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    appointments.remove(id);
  };

  public query ({ caller }) func getAppointments() : async [Appointment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    appointments.values().toArray();
  };

  public query func getAppointmentsByStaff(staffId : Text) : async [Appointment] {
    appointments.values().toArray().filter(
      func(a) {
        a.staffId == staffId;
      }
    );
  };

  public query ({ caller }) func getMyAppointments() : async [Appointment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their appointments");
    };
    appointments.values().toArray().filter(
      func(a) {
        a.bookedBy == caller;
      }
    );
  };

  // Offers & Promotions
  public type Offer = {
    id : Text;
    title : Text;
    description : Text;
    discountPercent : Nat;
    validUntil : Time.Time;
  };

  let offers = Map.empty<Text, Offer>();

  public shared ({ caller }) func addOrUpdateOffer(offer : Offer) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    offers.add(offer.id, offer);
  };

  public shared ({ caller }) func deleteOffer(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    offers.remove(id);
  };

  public query func getActiveOffers() : async [Offer] {
    let now = Time.now();
    offers.values().toArray().filter(
      func(o) {
        o.validUntil > now;
      }
    );
  };

  // Gallery
  public type Gallery = {
    id : Text;
    image : Storage.ExternalBlob;
    category : Text;
  };

  let gallery = Map.empty<Text, Gallery>();

  public shared ({ caller }) func addOrUpdateGallery(item : Gallery) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    gallery.add(item.id, item);
  };

  public shared ({ caller }) func deleteGallery(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    gallery.remove(id);
  };

  public query func getGalleryByCategory(category : Text) : async [Gallery] {
    gallery.values().toArray().filter(
      func(g) {
        g.category == category;
      }
    );
  };

  // Contact Info
  public type ContactInfo = {
    address : Text;
    phone : Text;
    whatsapp : Text;
    instagram : Text;
    workingHours : Text;
  };

  var contactInfo : ?ContactInfo = null;

  public shared ({ caller }) func setContactInfo(info : ContactInfo) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    contactInfo := ?info;
  };

  public query func getContactInfo() : async ?ContactInfo {
    contactInfo;
  };

  // Stripe Integration
  var stripeConfig : ?Stripe.StripeConfiguration = null;
  let stripeSessions = Map.empty<Text, Principal>();

  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    stripeConfig := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe is not configured") };
      case (?config) { config };
    };
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    // Allow authenticated users to create checkout sessions
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    let sessionId = await Stripe.createCheckoutSession(
      getStripeConfiguration(),
      caller,
      items,
      successUrl,
      cancelUrl,
      transform,
    );
    // Track session ownership
    stripeSessions.add(sessionId, caller);
    sessionId;
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    // Only allow the session creator or admin to check status
    let sessionOwner = stripeSessions.get(sessionId);
    switch (sessionOwner) {
      case (null) {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
          Runtime.trap("Unauthorized: Session not found or access denied");
        };
      };
      case (?owner) {
        if (caller != owner and not (AccessControl.isAdmin(accessControlState, caller))) {
          Runtime.trap("Unauthorized: Can only check your own session status");
        };
      };
    };
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };
};
