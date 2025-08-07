import type {
  NavigationDividerItem,
  NavigationPageItem,
  NavigationSubheaderItem,
  Router,
} from "@toolpad/core/AppProvider";

export interface MainAppProps {
  role: string;
  userId: string;
}

export interface CommonRouteProps {
  pathname?: string;
  userId?: string | undefined;
  user?: PatientEO | PharmacyEO | ProviderEO;
  navigateToRoute?: Router;
}

type RouteComponent = React.ComponentType<CommonRouteProps>;

export type NavigationItem =
  | NavigationPageItem
  | NavigationSubheaderItem
  | NavigationDividerItem;

export type Navigation = NavigationItem[];

export interface NotificationPanelProps {
  visibility: string;
  onClose: () => void;
}

export interface NotificationDialogProps {
  notifications?: (
    | PatientNotificationsRequest
    | RaiseRefillEO
    | InventoryRestockReminderNotification
  )[];
  onRemove?: (id: string) => void;
  navigateToRoute?: Router;
  userId?: string;
}

export interface InventoryRestockReminderNotification {
  inventoryRestockReminderNotificationId?: string;
  checked?: boolean;
  medicationName?: string;
  medicationId?: string;
  inventoryId?: string;
  message?: string;
}

export interface RoleConfiguration {
  [role: string]: {
    navigation: Navigation;
    routes: {
      [path: string]: RouteComponent;
    };
    notifications?: {
      panel?: React.FC<NotificationPanelProps>;
      dialog?: React.FC<NotificationDialogProps>;
    };
  };
}

export interface LoggedInUser {
  firstName: string;
  lastName: string;
  name?: string;
  _id: string;
}

export interface PharmacyInventoryPayload {
  medicationId: string;
  lastRestockDate: string;
  currentStockTablets?: number;
  currentStockVolume?: number;
  reorderThresholdTablets?: number;
  reorderThresholdVolume?: number;
}
export interface Medication {
  _id: string;
  name?: string;
  description?: string;
  oneTablet?: number;
  tabletsInPack?: number;
  unitMeasure?: string;
  volumePerDose?: number;
  totalVolume?: number;
  liquidUnitMeasure?: string;
  type?: string;
}
export interface Contact {
  email?: string;
  phone?: string;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface AllergyEO {
  _id?: string;
  name?: string;
  type?: string;
  description?: string;
  sideEffects?: string[];
}

export interface Allergy {
  allergyId: string;
  name?: string;
  type?: string;
  description?: string;
  sideEffects?: string[];
}

export interface EmergencyContact {
  name?: string;
  relationship?: string;
  phone?: string;
}

export interface PrescribedBy {
  providerId: string;
  firstName?: string;
  lastName?: string;
  specialization?: string;
  contact?: Contact;
  address?: Address;
}

export interface MedicationObject {
  medicationId: string;
  name?: string;
  description?: string;
  oneTablet?: number;
  tabletsInPack?: number;
  unitMeasure?: string;
  volumePerDose?: number;
  totalVolume?: number;
  liquidUnitMeasure?: string;
  type?: string;
}

export interface Schedule {
  scheduleId?: string;
  period?: string;
  instruction?: string;
  scheduledTime?: string;
  doseTablets?: number;
  doseVolume?: number;
}

export interface MedicationPrescribed {
  medicationPrescribedId?: string;
  medicationId?: string;
  medication?: Medication;
  totalTabletToTake?: number;
  totalTabletsTook?: number;
  currentTabletsInHand?: number;
  totalVolumeToTake?: number;
  totalVolumeTook?: number;
  currentVolumeInhand?: number;
  refillAlertThreshold?: number;
  startDate?: string;
  endDate?: string;
  schedule?: Schedule[];
  refillsAllowed?: boolean;
  refillRequired?: boolean;
}

export interface AssociatedPharmacy {
  pharmacyId?: string;
  name?: string;
  address?: Address;
  contact?: Contact;
}

export interface Dose {
  scheduleId?: string;
  taken?: boolean;
  tabletsTaken?: number;
  actualTimeTaken?: string;
}

export interface Tracker {
  date?: string;
  doses?: Dose[];
}

export interface MedicationTracking {
  medicationPrescribedId?: string;
  tracker?: Tracker[];
}

export interface AssociatedProvider {
  providerId?: string;
  firstName?: string;
  lastName?: string;
  specialization?: string;
  contact?: Contact;
  address?: Address;
}

export interface Prescription {
  prescriptionId?: string;
  providerId?: string;
  prescribedBy?: AssociatedProvider;
  prescriptionForDescription?: string;
  medicationsPrescribed?: MedicationPrescribed[];
  medicationTracking?: MedicationTracking[];
}

export interface Provider {
  providerId?: string;
  firstName?: string;
  lastName?: string;
  specialization?: string;
  contact?: Contact;
  address?: Address;
}

export interface SoundPreference {
  doseReminderNotificationSound?: string;
  refillReminderNotificationSound?: string;
}

export interface PatientEO {
  _id?: string;
  contact?: Contact;
  firstName?: string;
  lastName?: string;
  gender?: string;
  address?: Address;
  bloodGroup?: string;
  dateOfBirth?: string;
  allergyIds?: string[];
  allergies?: Allergy[];
  existingConditions?: string[];
  emergencyContact?: EmergencyContact;
  prescriptions?: Prescription[];
  providerIds?: string[];
  providers?: AssociatedProvider[];
  refillMedications?: Refill[];
  soundPreference?: SoundPreference;
  password?: string;
  createdAt?: string;
}

export interface PharmacyInventory {
  medicationId?: string;
  medication?: MedicationObject;
  lastRestockDate?: string;
  currentStockTablets?: number;
  currentStockVolume?: number;
  reorderThresholdVolume?: number;
  reorderThresholdTablets?: number;
  inventoryId?: string;
}

export interface PharmacyEO {
  _id?: string;
  name?: string;
  address?: Address;
  contact?: Contact;
  password?: string;
  pharmacyInventory?: PharmacyInventory[];
  soundPreference?: {
    refillRequestReminderNotificationSound?: string;
    inventoryUpdateNotificationSound?: string;
  };
  refillMedications?: RaiseRefillEO[];
  createdAt?: string;
}

export interface PatientRef {
  patientId: string;
  contact?: Contact;
  firstName?: string;
  lastName?: string;
  address?: Address;
  gender?: string;
  dateOfBirth?: string;
}

export interface ProviderEO {
  _id: string;
  firstName?: string;
  lastName?: string;
  specialization?: string;
  contact?: Contact;
  address?: Address;
  password?: string;
  patientIds?: string[];
  patients?: PatientRef[];
  createdAt?: string;
}

export interface InventoryItem extends PharmacyInventory {
  medicationName?: string;
  medicationType?: string;
  medicationFor?: string;
  status?: string;
  statusColor?: string;
  medicationForm?: string;
}

export interface PatientNotificationsRequest {
  _id?: string;
  patientId?: string;
  medicationName?: string;
  prescriptionId?: string;
  medicationPrescribedId?: string;
  scheduleId?: string;
  period?: string;
  instruction?: string;
  prescriptionDescription?: string;
  scheduledTime?: string;
  dateToTakeOn?: string;
  doseTablets?: number;
  doseVolume?: number;
  message?: string;
  status?: string;
  medicationPrescribed?: MedicationPrescribed;
  soundUrl?: string;
}

export interface Refill {
  refillId?: string;
  patientId?: string;
  pharmacyId?: string;
  medicationId?: string;
  medication?: Medication;
  prescriptionId?: string;
  medicationPrescribedId?: string;
  status?: string;
  refillQuantityTablets?: number;
  refillQuantityVolume?: number;
  requestDate?: string;
  lastRefillDate?: string;
}

export interface DoseStatusSetRequest {
  prescriptionId?: string;
  medicationPrescribedId?: string;
  date?: string;
  scheduleId?: string;
  doseStatusUpdate?: Dose;
}

export interface RaiseRefillEO {
  raiseRefillId?: string;
  patientId?: string;
  providerId?: string;
  medicationId?: string;
  medicationName?: string;
  prescriptionId?: string;
  prescriptionForDescription?: string;
  medicationPrescribedId?: string;
  doseTabletsRequired?: number;
  doseVolumeRequired?: number;
  message?: string;
  medicationPrescribed?: MedicationPrescribed;
  requestDate?: string;
  pharmacyId?: string;
  status?: string;
  refillQuantityTablets?: number;
  refillQuantityVolume?: number;
  lastRefillDate?: string;
  soundUrl?: string;
}

export interface AlarmRingtones {
  _id?: string;
  name?: string;
  url?: string;
}
