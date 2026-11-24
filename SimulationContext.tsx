import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  simulationEngine 
} from '../services/simulationEngine';
import { apiService } from '../services/apiService';
import type { DataSourceMode } from '../services/apiService';
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
  SimulationScenario 
} from '../types';

interface SimulationContextType {
  scenario: SimulationScenario;
  pvUnits: PVHarvestingUnit[];
  devices: Device[];
  storage: BatteryStorage;
  generatedWh: number;
  consumedWh: number;
  balanceWh: number;
  verifiedWh: number;
  energyCredits: number;
  systemAutonomyFormatted: string;
  timeSeriesData: EnergyReading[];
  recommendations: Recommendation[];
  notifications: Notification[];
  activityLogs: ActivityLog[];
  ledgerTransactions: WalletTransaction[];
  rewards: Reward[];
  setScenario: (scenario: SimulationScenario) => void;
  executeRecommendation: (id: string) => void;
  markNotificationRead: (id: string) => void;
  isPresentationMode: boolean;
  togglePresentationMode: () => void;
  selectedTimeRange: 'Today' | '7 Days' | '30 Days';
  setSelectedTimeRange: (range: 'Today' | '7 Days' | '30 Days') => void;
  dataSourceMode: DataSourceMode;
  setDataSourceMode: (mode: DataSourceMode) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dataSourceMode, setDataSourceModeState] = useState<DataSourceMode>('DEMO');
  const [scenario, setScenarioState] = useState<SimulationScenario>(simulationEngine.getScenario());
  const [pvUnits, setPvUnits] = useState<PVHarvestingUnit[]>(simulationEngine.getPvUnits());
  const [devices, setDevices] = useState<Device[]>(simulationEngine.getDevices());
  const [storage, setStorage] = useState<BatteryStorage>(simulationEngine.getStorage());
  const [generatedWh, setGeneratedWh] = useState<number>(simulationEngine.getGeneratedWh());
  const [consumedWh, setConsumedWh] = useState<number>(simulationEngine.getConsumedWh());
  const [balanceWh, setBalanceWh] = useState<number>(simulationEngine.getBalanceWh());
  const [verifiedWh, setVerifiedWh] = useState<number>(simulationEngine.getVerifiedWh());
  const [energyCredits, setEnergyCredits] = useState<number>(simulationEngine.getEnergyCredits());
  const [systemAutonomyFormatted, setSystemAutonomyFormatted] = useState<string>(simulationEngine.systemAutonomyFormatted);
  const [timeSeriesData, setTimeSeriesData] = useState<EnergyReading[]>(simulationEngine.getTimeSeriesData());
  const [recommendations, setRecommendations] = useState<Recommendation[]>(simulationEngine.getRecommendations());
  const [notifications, setNotifications] = useState<Notification[]>(simulationEngine.getNotifications());
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(simulationEngine.getActivityLogs());
  const [ledgerTransactions, setLedgerTransactions] = useState<WalletTransaction[]>(simulationEngine.getLedgerTransactions());
  const [rewards] = useState<Reward[]>(simulationEngine.getRewards());
  
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'Today' | '7 Days' | '30 Days'>('Today');

  const setDataSourceMode = (mode: DataSourceMode) => {
    setDataSourceModeState(mode);
    apiService.setMode(mode);
  };

  useEffect(() => {
    let ws: WebSocket | null = null;
    let timer: any = null;

    if (dataSourceMode === 'DEMO') {
      // Subscribe to simulation engine state changes for DEMO mode
      const unsubscribe = simulationEngine.subscribe(() => {
        setScenarioState(simulationEngine.getScenario());
        setPvUnits([...simulationEngine.getPvUnits()]);
        setDevices([...simulationEngine.getDevices()]);
        setStorage({ ...simulationEngine.getStorage() });
        setGeneratedWh(simulationEngine.getGeneratedWh());
        setConsumedWh(simulationEngine.getConsumedWh());
        setBalanceWh(simulationEngine.getBalanceWh());
        setVerifiedWh(simulationEngine.getVerifiedWh());
        setEnergyCredits(simulationEngine.getEnergyCredits());
        setSystemAutonomyFormatted(simulationEngine.systemAutonomyFormatted);
        setTimeSeriesData([...simulationEngine.getTimeSeriesData()]);
        setRecommendations([...simulationEngine.getRecommendations()]);
        setNotifications([...simulationEngine.getNotifications()]);
        setActivityLogs([...simulationEngine.getActivityLogs()]);
        setLedgerTransactions([...simulationEngine.getLedgerTransactions()]);
      });

      // Run ticker loop every 2 seconds for DEMO simulation
      timer = setInterval(() => {
        simulationEngine.tick();
      }, 2000);

      return () => {
        unsubscribe();
        if (timer) clearInterval(timer);
      };
    } else {
      // LIVE Mode Execution
      
      // 1. Initial REST fetch synchronization
      apiService.getEnergySummary().then(sum => {
        if (sum) {
          setGeneratedWh(sum.generated_wh);
          setStorage(prev => ({ 
            ...prev, 
            currentStoredWh: sum.stored_wh,
            stateOfChargePct: Math.min(100, Math.round((sum.stored_wh / prev.capacityWh) * 100))
          }));
          setConsumedWh(sum.consumed_wh);
          setBalanceWh(sum.balance_wh);
          if (sum.autonomy_formatted) setSystemAutonomyFormatted(sum.autonomy_formatted);
        }
      });
      apiService.getPvUnits().then(units => {
        if (units && units.length > 0) setPvUnits(units);
      });
      apiService.getDevices().then(devs => {
        if (devs && devs.length > 0) setDevices(devs);
      });

      // 2. Keep 2-second REST polling as fallback / initial sync
      timer = setInterval(() => {
        apiService.getEnergySummary().then(sum => {
          if (sum) {
            setGeneratedWh(sum.generated_wh);
            setStorage(prev => ({ 
              ...prev, 
              currentStoredWh: sum.stored_wh,
              stateOfChargePct: Math.min(100, Math.round((sum.stored_wh / prev.capacityWh) * 100))
            }));
            setConsumedWh(sum.consumed_wh);
            setBalanceWh(sum.balance_wh);
            if (sum.autonomy_formatted) setSystemAutonomyFormatted(sum.autonomy_formatted);
          }
        });
      }, 2000);

      // 3. Establish WebSocket connection for real-time VNODE-001 broadcasts
      ws = apiService.connectWebSocket((payload) => {
        if (payload && payload.event === 'NEW_READING' && payload.data && payload.data.device_id === 'VNODE-001') {
          console.log('[Energy OS] VNODE-001 telemetry received', payload);

          const reading = payload.data;
          const summary = payload.summary;

          // Update summary values when payload.summary is available
          if (summary) {
            if (typeof summary.generated_wh === 'number') setGeneratedWh(summary.generated_wh);
            if (typeof summary.stored_wh === 'number') {
              setStorage(prev => ({ 
                ...prev, 
                currentStoredWh: summary.stored_wh,
                stateOfChargePct: Math.min(100, Math.round((summary.stored_wh / prev.capacityWh) * 100))
              }));
            }
            if (typeof summary.consumed_wh === 'number') setConsumedWh(summary.consumed_wh);
            if (typeof summary.balance_wh === 'number') setBalanceWh(summary.balance_wh);
            if (summary.autonomy_formatted) setSystemAutonomyFormatted(summary.autonomy_formatted);
          }

          // Update PV unit state for VNODE-001
          setPvUnits(prevUnits => {
            const existingIndex = prevUnits.findIndex(p => p.id === 'VNODE-001');
            const voltageV = reading.voltage;
            const currentMa = reading.current * 1000;
            const powerMw = reading.power * 1000;
            const lightIntensityLux = reading.light_intensity;
            const lastUpdate = reading.timestamp;

            if (existingIndex >= 0) {
              const updatedUnits = [...prevUnits];
              updatedUnits[existingIndex] = {
                ...updatedUnits[existingIndex],
                voltageV,
                currentMa,
                powerMw,
                lightIntensityLux,
                lastUpdate,
                status: 'ACTIVE',
                performancePct: Math.min(100, Math.round((powerMw / 100) * 100))
              };
              return updatedUnits;
            } else {
              const newVirtualNode: PVHarvestingUnit = {
                id: 'VNODE-001',
                name: 'Python Virtual Hardware Node (VNODE-001)',
                location: 'Virtual Production Hall - Node 1',
                zoneId: 'zone-a',
                lightIntensityLux,
                voltageV,
                currentMa,
                powerMw,
                energyGeneratedWh: reading.energy || 0.05,
                expectedPowerMw: 100,
                performancePct: Math.min(100, Math.round((powerMw / 100) * 100)),
                status: 'ACTIVE',
                lastUpdate,
                pvTechnology: 'Virtual Indoor PV Model',
                areaCm2: 75
              };
              return [newVirtualNode, ...prevUnits];
            }
          });

          // Update timeSeriesData with incoming timestamped reading
          setTimeSeriesData(prev => {
            const timeLabel = reading.timestamp.includes(' ') ? reading.timestamp.split(' ')[1] : reading.timestamp;
            const newReadingPoint: EnergyReading = {
              timestamp: timeLabel,
              generatedWh: summary?.generated_wh ?? generatedWh,
              consumedWh: summary?.consumed_wh ?? consumedWh,
              storedWh: summary?.stored_wh ?? storage.currentStoredWh,
              balanceWh: summary?.balance_wh ?? balanceWh,
              pvEfficiencyPct: 94.5
            };
            return [...prev.slice(-23), newReadingPoint];
          });
        }
      });

      if (ws) {
        console.log('[Energy OS] LIVE WebSocket connected');
      }

      return () => {
        if (timer) clearInterval(timer);
        if (ws) {
          ws.close();
          console.log('[Energy OS] LIVE WebSocket disconnected');
        }
      };
    }
  }, [dataSourceMode]);

  const setScenario = (newScenario: SimulationScenario) => {
    simulationEngine.setScenario(newScenario);
  };

  const executeRecommendation = (id: string) => {
    simulationEngine.executeRecommendation(id);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const togglePresentationMode = () => {
    setIsPresentationMode(prev => !prev);
  };

  return (
    <SimulationContext.Provider
      value={{
        scenario,
        pvUnits,
        devices,
        storage,
        generatedWh,
        consumedWh,
        balanceWh,
        verifiedWh,
        energyCredits,
        systemAutonomyFormatted,
        timeSeriesData,
        recommendations,
        notifications,
        activityLogs,
        ledgerTransactions,
        rewards,
        setScenario,
        executeRecommendation,
        markNotificationRead,
        isPresentationMode,
        togglePresentationMode,
        selectedTimeRange,
        setSelectedTimeRange,
        dataSourceMode,
        setDataSourceMode,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
