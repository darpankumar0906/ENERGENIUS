import type { 
  PVHarvestingUnit, 
  Device, 
  BatteryStorage, 
  EnergyReading, 
  WalletTransaction, 
  Reward, 
  Recommendation, 
  Notification, 
  ActivityLog, 
  SimulationScenario,
  FacilityZone
} from '../types';

// Mock Initial Facilities
export const INITIAL_ZONES: FacilityZone[] = [
  { id: 'zone-a', name: 'Production Hall A', pvCount: 6, deviceCount: 3, activePowerW: 0.85 },
  { id: 'zone-b', name: 'Production Hall B', pvCount: 5, deviceCount: 2, activePowerW: 0.62 },
  { id: 'zone-c', name: 'Warehouse Main', pvCount: 4, deviceCount: 2, activePowerW: 0.45 },
  { id: 'zone-d', name: 'Assembly Zone', pvCount: 3, deviceCount: 2, activePowerW: 0.50 },
  { id: 'zone-e', name: 'Storage & Logistics', pvCount: 2, deviceCount: 1, activePowerW: 0.28 },
];

// Initial 20 PV Units spread across facilities
const INITIAL_PV_UNITS: PVHarvestingUnit[] = Array.from({ length: 20 }, (_, i) => {
  const num = (i + 1).toString().padStart(3, '0');
  const zoneIndex = i % INITIAL_ZONES.length;
  const zone = INITIAL_ZONES[zoneIndex];
  
  // Baseline physics: 2.8V - 3.4V per flexible PV cell group, 20-50 mA current
  const voltageV = +(2.7 + (i % 5) * 0.15 + Math.random() * 0.1).toFixed(2);
  const currentMa = +(25 + (i % 7) * 4 + Math.random() * 3).toFixed(1);
  const powerMw = +(voltageV * currentMa).toFixed(1); // P = V * I (mW)
  const expectedPowerMw = +(powerMw * 1.15).toFixed(1);
  const lightLux = Math.round(420 + (i % 4) * 70 + Math.random() * 40);

  return {
    id: `PV-${num}`,
    name: `PV Flex Cell Unit ${num}`,
    location: `${zone.name} - Node ${Math.floor(i / 2) + 1}`,
    zoneId: zone.id,
    lightIntensityLux: lightLux,
    voltageV,
    currentMa,
    powerMw,
    energyGeneratedWh: +(0.12 + i * 0.08 + Math.random() * 0.05).toFixed(2),
    expectedPowerMw,
    performancePct: Math.min(100, Math.round((powerMw / expectedPowerMw) * 100)),
    status: i === 4 ? 'LOW OUTPUT' : i === 12 ? 'MAINTENANCE' : i === 17 ? 'OFFLINE' : 'ACTIVE',
    lastUpdate: 'Just now',
    pvTechnology: i % 2 === 0 ? 'Flexible Organic PV (OPV)' : 'Perovskite Indoor Film',
    areaCm2: 50 + (i % 3) * 25,
  };
});

// Initial 10 IoT Devices
const INITIAL_DEVICES: Device[] = [
  { id: 'DEV-001', name: 'Production Temp & Humidity Sensor', type: 'Environmental Sensor', location: 'Production Hall A - Bay 1', zoneId: 'zone-a', powerConsumptionMw: 45, batteryLevelPct: 88, batteryCapacityMWh: 500, status: 'Online', autonomyHours: 11.1, samplingFrequencySec: 10, lastUpdate: 'Just now' },
  { id: 'DEV-002', name: 'Air Quality Monitoring Node', type: 'Air Quality Sensor', location: 'Production Hall A - Bay 3', zoneId: 'zone-a', powerConsumptionMw: 85, batteryLevelPct: 64, batteryCapacityMWh: 800, status: 'Online', autonomyHours: 9.4, samplingFrequencySec: 5, lastUpdate: 'Just now' },
  { id: 'DEV-003', name: 'Assembly Line Vibration Monitor', type: 'Industrial Vibration', location: 'Production Hall B - Line 2', zoneId: 'zone-b', powerConsumptionMw: 60, batteryLevelPct: 92, batteryCapacityMWh: 600, status: 'Online', autonomyHours: 10.0, samplingFrequencySec: 15, lastUpdate: 'Just now' },
  { id: 'DEV-004', name: 'Warehouse IoT Gateway Node', type: 'IoT Gateway', location: 'Warehouse Main - Rack 4', zoneId: 'zone-c', powerConsumptionMw: 220, batteryLevelPct: 78, batteryCapacityMWh: 2000, status: 'Online', autonomyHours: 9.1, samplingFrequencySec: 2, lastUpdate: 'Just now' },
  { id: 'DEV-005', name: 'Logistics Motion Tracker', type: 'Security Sensor', location: 'Storage & Logistics', zoneId: 'zone-e', powerConsumptionMw: 35, batteryLevelPct: 41, batteryCapacityMWh: 400, status: 'Low Energy', autonomyHours: 4.7, samplingFrequencySec: 30, lastUpdate: 'Just now' },
  { id: 'DEV-006', name: 'Emergency Exit Lighting Pill', type: 'Emergency Indicator', location: 'Assembly Zone - Door 2', zoneId: 'zone-d', powerConsumptionMw: 110, batteryLevelPct: 95, batteryCapacityMWh: 1200, status: 'Online', autonomyHours: 10.9, samplingFrequencySec: 60, lastUpdate: 'Just now' },
  { id: 'DEV-007', name: 'Sub-Station Voltage Monitor', type: 'Electrical Meter', location: 'Production Hall A - Panel B', zoneId: 'zone-a', powerConsumptionMw: 50, batteryLevelPct: 83, batteryCapacityMWh: 750, status: 'Online', autonomyHours: 15.0, samplingFrequencySec: 5, lastUpdate: 'Just now' },
  { id: 'DEV-008', name: 'Perimeter Optical Sensor', type: 'Security Sensor', location: 'Warehouse Main - Gate 1', zoneId: 'zone-c', powerConsumptionMw: 70, batteryLevelPct: 22, batteryCapacityMWh: 450, status: 'Critical', autonomyHours: 1.4, samplingFrequencySec: 3, lastUpdate: 'Just now' },
  { id: 'DEV-009', name: 'Cleanroom Dust Counter', type: 'Particle Counter', location: 'Assembly Zone - Bay 4', zoneId: 'zone-d', powerConsumptionMw: 95, batteryLevelPct: 71, batteryCapacityMWh: 900, status: 'Online', autonomyHours: 9.5, samplingFrequencySec: 10, lastUpdate: 'Just now' },
  { id: 'DEV-010', name: 'Backup Relay Controller', type: 'Actuator', location: 'Production Hall B - Rack 1', zoneId: 'zone-b', powerConsumptionMw: 40, batteryLevelPct: 0, batteryCapacityMWh: 300, status: 'Offline', autonomyHours: 0, samplingFrequencySec: 0, lastUpdate: '12m ago' },
];

// Initial Battery / Supercapacitor Storage Bank
const INITIAL_STORAGE: BatteryStorage = {
  capacityWh: 5.0,
  currentStoredWh: 1.72,
  stateOfChargePct: 34.4,
  stateOfHealthPct: 98.2,
  batteryType: 'Hybrid Supercapacitor-LiFePO4 Bank',
  maxChargeRateW: 2.5,
  maxDischargeRateW: 3.0,
};

// Initial Rewards
const INITIAL_REWARDS: Reward[] = [
  { id: 'REW-01', title: 'Energy Starter', description: 'Harvest your first 100 Wh of otherwise-unutilized artificial light energy.', targetWh: 100, currentWh: 100, iconName: 'Zap', progressPct: 100, unlocked: true, unlockedAt: '2026-08-25' },
  { id: 'REW-02', title: 'Energy Saver', description: 'Save 25 Wh through intelligent adaptive sampling reduction.', targetWh: 25, currentWh: 18.5, iconName: 'ShieldCheck', progressPct: 74, unlocked: false },
  { id: 'REW-03', title: 'Energy Contributor', description: 'Contribute 1000 Wh of verified harvested energy to local buffer loads.', targetWh: 1000, currentWh: 284, iconName: 'Award', progressPct: 28.4, unlocked: false },
  { id: 'REW-04', title: 'Energy Positive', description: 'Maintain a net positive energy balance for 7 consecutive days.', targetWh: 7, currentWh: 5, iconName: 'TrendingUp', progressPct: 71.4, unlocked: false },
  { id: 'REW-05', title: 'Consistent Harvester', description: 'Keep at least 90% of PV units active for 30 consecutive days.', targetWh: 30, currentWh: 22, iconName: 'Clock', progressPct: 73.3, unlocked: false },
];

export class SimulationEngine {
  private scenario: SimulationScenario = 'NORMAL';
  private pvUnits: PVHarvestingUnit[] = [...INITIAL_PV_UNITS];
  private devices: Device[] = [...INITIAL_DEVICES];
  private storage: BatteryStorage = { ...INITIAL_STORAGE };
  private generatedWh: number = 2.84;
  private consumedWh: number = 1.31;
  private verifiedWh: number = 128.6;
  private timeSeriesData: EnergyReading[] = [];
  private recommendations: Recommendation[] = [];
  private notifications: Notification[] = [];
  private activityLogs: ActivityLog[] = [];
  private ledgerTransactions: WalletTransaction[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    this.initTimeSeriesData();
    this.initMockRecommendations();
    this.initMockNotifications();
    this.initMockLogs();
    this.initMockLedger();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  public setScenario(newScenario: SimulationScenario) {
    this.scenario = newScenario;
    this.applyScenarioModifiers();
    this.recalculatePhysics();
    this.notify();
  }

  public getScenario(): SimulationScenario {
    return this.scenario;
  }

  public getPvUnits(): PVHarvestingUnit[] {
    return this.pvUnits;
  }

  public getPvUnitById(id: string): PVHarvestingUnit | undefined {
    return this.pvUnits.find(p => p.id === id);
  }

  public getDevices(): Device[] {
    return this.devices;
  }

  public getDeviceById(id: string): Device | undefined {
    return this.devices.find(d => d.id === id);
  }

  public getStorage(): BatteryStorage {
    return this.storage;
  }

  public getGeneratedWh(): number {
    return this.generatedWh;
  }

  public getConsumedWh(): number {
    return this.consumedWh;
  }

  public getBalanceWh(): number {
    const bal = +(this.generatedWh - this.consumedWh).toFixed(2);
    return Math.max(-9999, Math.min(9999, bal));
  }

  public getVerifiedWh(): number {
    return Math.min(9999, Math.max(0, +this.verifiedWh.toFixed(2)));
  }

  // Prototype rule: 1 Energy Credit (EC) = 0.1 Wh verified harvested energy, max 9999 EC
  public getEnergyCredits(): number {
    return Math.min(9999, Math.max(0, Math.round(this.verifiedWh / 0.1)));
  }

  public getTimeSeriesData(): EnergyReading[] {
    return this.timeSeriesData;
  }

  public getRecommendations(): Recommendation[] {
    return this.recommendations;
  }

  public getNotifications(): Notification[] {
    return this.notifications;
  }

  public getActivityLogs(): ActivityLog[] {
    return this.activityLogs;
  }

  public getLedgerTransactions(): WalletTransaction[] {
    return this.ledgerTransactions;
  }

  public getRewards(): Reward[] {
    return INITIAL_REWARDS;
  }

  public executeRecommendation(id: string) {
    const rec = this.recommendations.find(r => r.id === id);
    if (rec) {
      rec.executed = true;
      // Add activity log
      this.addLog({
        event: `Smart Action Executed: ${rec.action}`,
        details: `Executed rule (${rec.condition}). Expected benefit: ${rec.expectedBenefit}`,
        type: 'OPTIMIZATION'
      });
      // Throttle device consumption slightly if optimization was sampling reduction
      if (rec.category === 'SAMPLING') {
        this.devices.forEach(d => {
          if (d.status === 'Online' || d.status === 'Low Energy') {
            d.powerConsumptionMw = Math.max(15, +(d.powerConsumptionMw * 0.82).toFixed(1));
          }
        });
        this.recalculatePhysics();
      }
      this.notify();
    }
  }

  public tick() {
    // 1. Small continuous variation based on current scenario
    const mult = this.getScenarioMultiplier();
    
    this.pvUnits = this.pvUnits.map(unit => {
      if (unit.status === 'OFFLINE' || unit.status === 'MAINTENANCE') return unit;
      
      const noiseLux = (Math.random() - 0.48) * 12 * mult;
      const newLux = Math.max(120, Math.min(1000, Math.round(unit.lightIntensityLux + noiseLux)));
      
      // Physics formula: Voltage 2.5V - 4.8V, Current 0.5 - 45 mA
      const vMult = Math.min(1.2, Math.max(0.6, newLux / 500));
      const newVoltage = Math.min(5.0, Math.max(1.5, +(unit.voltageV * (0.99 + Math.random() * 0.02)).toFixed(2)));
      const newCurrent = Math.min(50.0, Math.max(0.5, +(unit.currentMa * (0.98 + Math.random() * 0.04) * vMult).toFixed(1)));
      const newPowerMw = Math.min(250.0, +(newVoltage * newCurrent).toFixed(1)); // P = V * I (mW)
      const expected = unit.expectedPowerMw;
      const perfPct = Math.min(100, Math.round((newPowerMw / expected) * 100));

      let newStatus = unit.status;
      if (perfPct < 50) newStatus = 'LOW OUTPUT';
      else if (newStatus === 'LOW OUTPUT' && perfPct >= 65) newStatus = 'ACTIVE';

      return {
        ...unit,
        lightIntensityLux: newLux,
        voltageV: newVoltage,
        currentMa: newCurrent,
        powerMw: newPowerMw,
        energyGeneratedWh: Math.min(9999, +(unit.energyGeneratedWh + 0.001).toFixed(2)),
        performancePct: perfPct,
        status: newStatus,
        lastUpdate: 'Just now'
      };
    });

    // 2. Devices power calculation
    this.devices = this.devices.map(dev => {
      if (dev.status === 'Offline') return dev;
      const noiseMw = (Math.random() - 0.5) * 1.5;
      const newDraw = Math.max(10, Math.min(999, +(dev.powerConsumptionMw + noiseMw).toFixed(1)));
      
      // Autonomy (hours) = Available Stored Energy (mWh) / Power Consumption (mW)
      const autonomy = Math.min(9999, +((dev.batteryCapacityMWh * (dev.batteryLevelPct / 100)) / newDraw).toFixed(1));
      
      return {
        ...dev,
        powerConsumptionMw: newDraw,
        autonomyHours: autonomy,
        lastUpdate: 'Just now'
      };
    });

    // 3. Recalculate global energy balances
    this.recalculatePhysics();

    // 4. Update newest time-series point
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const latestReading: EnergyReading = {
      timestamp: nowStr,
      generatedWh: this.generatedWh,
      consumedWh: this.consumedWh,
      storedWh: this.storage.currentStoredWh,
      balanceWh: this.getBalanceWh(),
      pvEfficiencyPct: Math.round(this.pvUnits.reduce((acc, p) => acc + p.performancePct, 0) / this.pvUnits.length),
    };

    this.timeSeriesData = [...this.timeSeriesData.slice(1), latestReading];

    // 5. Occasionally add verification ledger transaction (capped at 9999 Wh)
    if (Math.random() < 0.2) {
      const activePvs = this.pvUnits.filter(p => p.status === 'ACTIVE');
      if (activePvs.length > 0) {
        const randPv = activePvs[Math.floor(Math.random() * activePvs.length)];
        const mintedWh = +(0.15 + Math.random() * 0.35).toFixed(2);
        const mintedEc = Math.round(mintedWh / 0.1);
        this.verifiedWh = Math.min(9999, +(this.verifiedWh + mintedWh).toFixed(2));

        const newTx: WalletTransaction = {
          id: `TX-${Date.now().toString().slice(-6)}`,
          creditId: `EC-${Math.floor(10000 + Math.random() * 90000)}`,
          sourcePvId: randPv.id,
          amountWh: mintedWh,
          credits: mintedEc,
          timestamp: 'Just now',
          type: 'GENERATION',
          status: 'HARDWARE VERIFIED',
        };

        this.ledgerTransactions = [newTx, ...this.ledgerTransactions.slice(0, 19)];
        
        this.addLog({
          event: `${mintedWh} Wh Verified from ${randPv.id}`,
          details: `Minted ${mintedEc} Energy Credits via simulated PMIC hardware telemetry.`,
          type: 'VERIFICATION',
          pvId: randPv.id,
        });
      }
    }

    this.notify();
  }

  private getScenarioMultiplier(): number {
    switch (this.scenario) {
      case 'HIGH_GENERATION': return 1.6;
      case 'LOW_GENERATION': return 0.45;
      case 'ENERGY_SURPLUS': return 1.4;
      case 'ENERGY_DEFICIT': return 0.5;
      default: return 1.0;
    }
  }

  private applyScenarioModifiers() {
    switch (this.scenario) {
      case 'HIGH_GENERATION':
        this.generatedWh = 4.52;
        this.consumedWh = 1.20;
        this.storage.currentStoredWh = 3.85;
        break;
      case 'LOW_GENERATION':
        this.generatedWh = 0.85;
        this.consumedWh = 1.45;
        this.storage.currentStoredWh = 0.92;
        break;
      case 'ENERGY_SURPLUS':
        this.generatedWh = 3.90;
        this.consumedWh = 0.70;
        this.storage.currentStoredWh = 4.40;
        break;
      case 'ENERGY_DEFICIT':
        this.generatedWh = 0.95;
        this.consumedWh = 2.40;
        this.storage.currentStoredWh = 0.55;
        break;
      default:
        this.generatedWh = 2.84;
        this.consumedWh = 1.31;
        this.storage.currentStoredWh = 1.72;
        break;
    }
    this.storage.stateOfChargePct = +((this.storage.currentStoredWh / this.storage.capacityWh) * 100).toFixed(1);
  }

  private recalculatePhysics() {
    // Total Power Generated (W) = sum of all PV power (mW) / 1000
    const totalPvPowerW = this.pvUnits.reduce((acc, p) => p.status !== 'OFFLINE' ? acc + p.powerMw : acc, 0) / 1000;
    
    // Total Power Consumed (W) = sum of all Devices power (mW) / 1000
    const totalDevPowerW = this.devices.reduce((acc, d) => d.status !== 'Offline' ? acc + d.powerConsumptionMw : acc, 0) / 1000;

    // Incremental Wh updates based on instantaneous power (small increments)
    const deltaWhGen = (totalPvPowerW * 0.0003);
    const deltaWhCon = (totalDevPowerW * 0.0003);

    this.generatedWh = Math.min(9999, +(this.generatedWh + deltaWhGen).toFixed(2));
    this.consumedWh = Math.min(9999, +(this.consumedWh + deltaWhCon).toFixed(2));

    // Update storage state of charge (max 5.0 Wh)
    const netDelta = deltaWhGen - deltaWhCon;
    const newStored = Math.max(0.1, Math.min(this.storage.capacityWh, this.storage.currentStoredWh + netDelta));
    this.storage.currentStoredWh = +newStored.toFixed(2);
    this.storage.stateOfChargePct = Math.min(100, +((this.storage.currentStoredWh / this.storage.capacityWh) * 100).toFixed(1));

    // Dynamic Autonomy Calculation (Hours)
    const avgConsumptionW = Math.max(0.1, totalDevPowerW);
    const systemAutonomyHours = Math.min(9999, (this.storage.currentStoredWh / avgConsumptionW));
    const hours = Math.floor(systemAutonomyHours);
    const mins = Math.round((systemAutonomyHours - hours) * 60);
    this.systemAutonomyFormatted = `${hours}h ${mins}m`;

    // Dynamic Rule-based Smart Recommendations
    this.evaluateRules();
  }

  public systemAutonomyFormatted: string = '8h 42m';

  private evaluateRules() {
    const netBalance = this.getBalanceWh();
    const lowPvUnits = this.pvUnits.filter(p => p.status === 'LOW OUTPUT');
    const criticalDevices = this.devices.filter(d => d.batteryLevelPct < 25 || d.status === 'Critical');

    const newRecs: Recommendation[] = [];

    // Rule 1: IF energy availability decreases -> recommend reducing sensor sampling/transmission frequency
    if (netBalance < 0 || this.scenario === 'ENERGY_DEFICIT') {
      newRecs.push({
        id: 'REC-01',
        condition: 'Net Energy Deficit (-0.5 Wh/hr rate)',
        severity: 'HIGH',
        explanation: 'IoT load draw exceeds harvested artificial light input. Supercapacitor depletion imminent in < 2 hours.',
        action: 'Throttle sensor transmission intervals from 5s to 30s across non-critical environmental nodes.',
        expectedBenefit: 'Reduces IoT power consumption by 42% (saves ~0.55 Wh).',
        timestamp: 'Just now',
        category: 'SAMPLING',
        executed: false,
      });
    }

    // Rule 2: IF PV output is below expected -> recommend checking position/orientation or increasing harvesting area
    if (lowPvUnits.length > 0) {
      newRecs.push({
        id: 'REC-02',
        condition: `${lowPvUnits.length} PV Flexible Unit(s) operating 31% below expected output`,
        severity: 'MEDIUM',
        explanation: `Unit ${lowPvUnits[0]?.id} receiving reduced light flux (< 300 lux) due to fixture shadow or angle tilt.`,
        action: 'Adjust flexible PV sticker orientation towards primary LED fixture or expand surface area by +25 cm².',
        expectedBenefit: 'Restores harvesting efficiency to 94% (+0.42 Wh yield).',
        timestamp: '2m ago',
        category: 'POSITION',
        executed: false,
      });
    }

    // Rule 3: IF energy surplus exists -> recommend storing excess energy or enabling non-critical loads
    if (netBalance > 1.5 || this.scenario === 'ENERGY_SURPLUS') {
      newRecs.push({
        id: 'REC-03',
        condition: 'High Energy Surplus (+1.53 Wh balance)',
        severity: 'LOW',
        explanation: 'Supercapacitor buffer is fully charged (98% SoC) under high artificial illumination.',
        action: 'Route excess harvested power to secondary emergency lighting buffer or authorize P2P credit verification.',
        expectedBenefit: 'Prevents energy clipping losses and unlocks +15 Verified Energy Credits (EC).',
        timestamp: '5m ago',
        category: 'STORAGE',
        executed: false,
      });
    }

    // Rule 4: IF device energy becomes critical -> recommend reducing operating frequency
    if (criticalDevices.length > 0) {
      newRecs.push({
        id: 'REC-04',
        condition: `Critical Battery on ${criticalDevices[0]?.name}`,
        severity: 'CRITICAL',
        explanation: `Device ${criticalDevices[0]?.id} reserve is at ${criticalDevices[0]?.batteryLevelPct}%. Risk of brownout in ${criticalDevices[0]?.autonomyHours}h.`,
        action: 'Enable Ultra-Low-Power Duty Cycling (ULP) mode and extend sleep interval.',
        expectedBenefit: 'Extends device autonomy by 8.5 hours until next light harvesting cycle.',
        timestamp: 'Just now',
        category: 'THROTTLING',
        executed: false,
      });
    }

    this.recommendations = newRecs;
  }

  private initTimeSeriesData() {
    const data: EnergyReading[] = [];
    const baseGen = [1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.5, 2.7, 2.8, 2.84, 2.9, 3.0, 2.95, 2.88, 2.84, 2.80, 2.75, 2.82, 2.84, 2.84, 2.85, 2.83, 2.84, 2.84];
    const baseCon = [1.1, 1.1, 1.2, 1.2, 1.25, 1.28, 1.30, 1.31, 1.32, 1.31, 1.30, 1.31, 1.33, 1.31, 1.30, 1.29, 1.31, 1.31, 1.32, 1.31, 1.30, 1.31, 1.31, 1.31];
    
    for (let i = 0; i < 24; i++) {
      const hr = i.toString().padStart(2, '0');
      const gen = baseGen[i];
      const con = baseCon[i];
      data.push({
        timestamp: `${hr}:00`,
        generatedWh: gen,
        consumedWh: con,
        storedWh: +(1.2 + gen * 0.25).toFixed(2),
        balanceWh: +(gen - con).toFixed(2),
        pvEfficiencyPct: Math.round(82 + Math.sin(i) * 6),
      });
    }
    this.timeSeriesData = data;
  }

  private initMockRecommendations() {
    this.evaluateRules();
  }

  private initMockNotifications() {
    this.notifications = [
      { id: 'NOTIF-01', title: 'PV Unit Output Warning', message: 'PV-014 harvesting efficiency dropped by 31% below baseline.', severity: 'MEDIUM', timestamp: '10m ago', read: false },
      { id: 'NOTIF-02', title: 'Supercapacitor High Charge', message: 'Storage bank reached 98% SoC. Surplus routing active.', severity: 'LOW', timestamp: '25m ago', read: false },
      { id: 'NOTIF-03', title: 'Device Low Energy Alert', message: 'DEV-008 (Perimeter Optical Sensor) battery reached critical 22%.', severity: 'CRITICAL', timestamp: '1h ago', read: true },
      { id: 'NOTIF-04', title: 'Energy Credit Verification', message: 'Minted 4.2 EC from PV-002 simulated PMIC telemetry.', severity: 'INFO', timestamp: '2h ago', read: true },
    ];
  }

  private initMockLogs() {
    this.activityLogs = [
      { id: 'LOG-101', timestamp: 'Just now', event: 'PV-014 Telemetry Update', details: 'Generated 0.42 Wh under 340 Lux fixture.', type: 'GENERATION', pvId: 'PV-014' },
      { id: 'LOG-102', timestamp: '2m ago', event: 'Energy Credits Verified', details: '+4.2 EC credited to Energy Wallet via simulated hardware PMIC proof.', type: 'VERIFICATION', pvId: 'PV-002' },
      { id: 'LOG-103', timestamp: '5m ago', event: 'Energy Surplus Detected', details: 'Generation (+2.84 Wh) exceeded consumption (+1.31 Wh). Buffer charging.', type: 'SYSTEM' },
      { id: 'LOG-104', timestamp: '12m ago', event: 'Adaptive Sampling Triggered', details: 'DEV-005 sampling frequency adjusted from 10s to 30s to conserve supercapacitor.', type: 'OPTIMIZATION', deviceId: 'DEV-005' },
      { id: 'LOG-105', timestamp: '30m ago', event: 'Facility Zone B Calibration', details: 'Perovskite flexible PV array recalibrated for LED spectrum 4000K.', type: 'SYSTEM' },
    ];
  }

  private initMockLedger() {
    this.ledgerTransactions = [
      { id: 'TX-90481', creditId: 'EC-20481', sourcePvId: 'PV-014', amountWh: 0.42, credits: 4.2, timestamp: '10m ago', type: 'GENERATION', status: 'HARDWARE VERIFIED' },
      { id: 'TX-90480', creditId: 'EC-20480', sourcePvId: 'PV-002', amountWh: 0.85, credits: 8.5, timestamp: '28m ago', type: 'GENERATION', status: 'HARDWARE VERIFIED' },
      { id: 'TX-90479', creditId: 'EC-20479', sourcePvId: 'SYSTEM', amountWh: 0.25, credits: 2.5, timestamp: '1h ago', type: 'SAVED', status: 'HARDWARE VERIFIED' },
      { id: 'TX-90478', creditId: 'EC-20478', sourcePvId: 'PV-007', amountWh: 1.10, credits: 11.0, timestamp: '2h ago', type: 'GENERATION', status: 'HARDWARE VERIFIED' },
      { id: 'TX-90477', creditId: 'EC-20477', sourcePvId: 'PV-011', amountWh: 0.64, credits: 6.4, timestamp: '3h ago', type: 'CONTRIBUTED', status: 'HARDWARE VERIFIED' },
    ];
  }

  private addLog(log: Omit<ActivityLog, 'id' | 'timestamp'>) {
    const newLog: ActivityLog = {
      ...log,
      id: `LOG-${Date.now().toString().slice(-6)}`,
      timestamp: 'Just now',
    };
    this.activityLogs = [newLog, ...this.activityLogs.slice(0, 49)];
  }
}

// Global Singleton Instance
export const simulationEngine = new SimulationEngine();
