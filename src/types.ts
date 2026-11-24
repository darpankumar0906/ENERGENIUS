export type SimulationScenario = 
  | 'NORMAL'
  | 'HIGH_GENERATION'
  | 'LOW_GENERATION'
  | 'ENERGY_SURPLUS'
  | 'ENERGY_DEFICIT';

export type PVStatus = 'ACTIVE' | 'LOW OUTPUT' | 'OFFLINE' | 'MAINTENANCE';

export type DeviceStatus = 'Online' | 'Offline' | 'Low Energy' | 'Critical';

export type SeverityLevel = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type TransactionType = 'GENERATED' | 'GENERATION' | 'SAVED' | 'CONTRIBUTED' | 'REWARDED' | 'REDEEMED';

export type VerificationStatus = 'HARDWARE VERIFIED' | 'PENDING' | 'SIMULATED HARDWARE VERIFICATION';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export interface Facility {
  id: string;
  name: string;
  location: string;
  zones: FacilityZone[];
  totalPvUnits: number;
  totalDevices: number;
}

export interface FacilityZone {
  id: string;
  name: string;
  pvCount: number;
  deviceCount: number;
  activePowerW: number;
}

export interface PVHarvestingUnit {
  id: string;
  name: string;
  location: string;
  zoneId: string;
  lightIntensityLux: number;
  voltageV: number;
  currentMa: number;
  powerMw: number;
  energyGeneratedWh: number;
  expectedPowerMw: number;
  performancePct: number;
  status: PVStatus;
  lastUpdate: string;
  pvTechnology: string;
  areaCm2: number;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  location: string;
  zoneId: string;
  powerConsumptionMw: number;
  batteryLevelPct: number;
  batteryCapacityMWh: number;
  status: DeviceStatus;
  autonomyHours: number;
  samplingFrequencySec: number;
  lastUpdate: string;
}

export interface EnergyReading {
  timestamp: string;
  generatedWh: number;
  consumedWh: number;
  storedWh: number;
  balanceWh: number;
  pvEfficiencyPct: number;
}

export interface BatteryStorage {
  capacityWh: number;
  currentStoredWh: number;
  stateOfChargePct: number;
  stateOfHealthPct: number;
  batteryType: string;
  maxChargeRateW: number;
  maxDischargeRateW: number;
}

export interface EnergyCredit {
  creditId: string;
  sourcePvId: string;
  energyWh: number;
  voltageV: number;
  currentMa: number;
  durationSec: number;
  timestamp: string;
  status: VerificationStatus;
  verificationHash: string;
  signature: string;
}

export interface WalletTransaction {
  id: string;
  creditId: string;
  sourcePvId: string;
  amountWh: number;
  credits: number;
  timestamp: string;
  type: TransactionType;
  status: VerificationStatus;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  targetWh: number;
  currentWh: number;
  iconName: string;
  progressPct: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Recommendation {
  id: string;
  condition: string;
  severity: SeverityLevel;
  explanation: string;
  action: string;
  expectedBenefit: string;
  timestamp: string;
  category: 'SAMPLING' | 'POSITION' | 'STORAGE' | 'THROTTLING' | 'AUDIT';
  executed: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  severity: SeverityLevel;
  timestamp: string;
  read: boolean;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  event: string;
  details: string;
  type: 'GENERATION' | 'VERIFICATION' | 'OPTIMIZATION' | 'ALERT' | 'SYSTEM';
  pvId?: string;
  deviceId?: string;
}
