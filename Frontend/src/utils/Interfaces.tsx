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

export interface RoleConfiguration {
  [role: string]: {
    navigation: Navigation;
    routes: {
      [path: string]: RouteComponent;
    };
    notifications?: {
      panel?: React.FC<NotificationPanelProps>;
      dialog?: React.FC;
    };
  };
}

export interface NotificationPanelProps {
  visibility: string;
  onClose: () => void;
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

export interface Allergy {
  allergyId: string;
  name?: string;
  type?: string;
  description?: string;
  sideEffects?: string[];
}

export interface ExistingCondition {
  name: string;
  severity?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
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
  scheduleId: string;
  period?: string;
  instruction?: string;
  scheduledTime?: string;
  doseTablets?: number;
  doseQuantity?: string;
}

export interface MedicationPrescribed {
  medicationPrescribedId: string;
  medicationId?: string;
  medication?: MedicationObject;
  totalTabletToTake?: number;
  totalTabletsTook?: number;
  currentTabletsInHand?: number;
  refillAlertThreshold?: number;
  startDate?: string;
  endDate?: string;
  schedule?: Schedule[];
  refillsAllowed?: boolean;
  refillRequired?: boolean;
}

export interface AssociatedPharmacy {
  pharmacyId: string;
  name?: string;
  address?: Address;
  contact?: Contact;
}

export interface Dose {
  scheduleId: string;
  taken?: boolean;
  tabletsTaken?: number;
  actualTimeTaken?: string;
}

export interface Tracker {
  date: string;
  doses?: Dose[];
}

export interface MedicationTracking {
  medicationPrescribedId: string;
  tracker?: Tracker[];
}

export interface AssociatedProvider {
  providerId: string;
  firstName?: string;
  lastName?: string;
  specialization?: string;
  contact?: Contact;
  address?: Address;
}

export interface Prescription {
  prescriptionId: string;
  providerId?: string;
  prescribedBy?: AssociatedProvider;
  medicationsPrescribed?: MedicationPrescribed[];
  associatedPharmacyId?: string;
  associatedPharmacy?: AssociatedPharmacy;
  medicationTracking?: MedicationTracking[];
}

export interface Provider {
  providerId: string;
  firstName?: string;
  lastName?: string;
  specialization?: string;
  contact?: Contact;
  address?: Address;
}

export interface Refill {
  refillId?: string;
  patientId?: string;
  pharmacyId?: string;
  medicationId?: string;
  medication?: MedicationObject;
  status?: string;
  refillQuantityTablets?: number;
  refillQuantityVolume?: number;
  requestDate?: string;
  lastRefillDate?: string;
}

export interface PatientEO {
  _id: string;
  contact?: Contact;
  firstName?: string;
  lastName?: string;
  gender?: string;
  address?: Address;
  bloodGroup?: string;
  dateOfBirth?: string;
  allergyIds?: string[];
  allergies?: Allergy[];
  existingConditions?: ExistingCondition[];
  emergencyContact?: EmergencyContact;
  prescriptions?: Prescription[];
  providerIds?: string[];
  providers?: AssociatedProvider[];
  refillMedications?: Refill[];
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
  _id: string;
  name?: string;
  address?: Address;
  contact?: Contact;
  password?: string;
  pharmacyInventory?: PharmacyInventory[];
  refillMedications?: Refill[];
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
