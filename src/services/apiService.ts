import { simulationEngine } from './simulationEngine';
import type { 
  PVHarvestingUnit, 
  Device,
  Recommendation
} from '../types';

export type DataSourceMode = 'DEMO' | 'LIVE';

// Default Local FastAPI Endpoints (Port 8001)
const DEFAULT_LOCAL_API = 'http://127.0.0.1:8001/api';
const DEFAULT_LOCAL_WS = 'ws://127.0.0.1:8001/ws/energy';

const INITIAL_API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL ||
  DEFAULT_LOCAL_API;

const INITIAL_WS_BASE_URL =
  import.meta.env?.VITE_WS_BASE_URL ||
  DEFAULT_LOCAL_WS;

export class EnergyApiService {
  private mode: DataSourceMode = 'DEMO';
  private apiBaseUrl: string = INITIAL_API_BASE_URL;
  private wsBaseUrl: string = INITIAL_WS_BASE_URL;

  public setMode(mode: DataSourceMode) {
    this.mode = mode;
  }

  public getMode(): DataSourceMode {
    return this.mode;
  }

  public setApiBaseUrl(url: string) {
    this.apiBaseUrl = url;
  }

  public getApiBaseUrl(): string {
    return this.apiBaseUrl;
  }

  public setWsBaseUrl(url: string) {
    this.wsBaseUrl = url;
  }

  public getWsBaseUrl(): string {
    return this.wsBaseUrl;
  }

  // Health check endpoint
  public async getHealth() {
    try {
      const res = await fetch(`${this.apiBaseUrl}/health`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('FastAPI backend health check failed:', err);
    }
    return { status: 'OFFLINE', mode: this.mode };
  }

  // Fetch summary
  public async getEnergySummary() {
    if (this.mode === 'LIVE') {
      try {
        const res = await fetch(`${this.apiBaseUrl}/energy/summary`);
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('FastAPI backend unreachable, falling back to DEMO simulation engine:', err);
      }
    }
    // Fallback to DEMO mode
    return {
      generated_wh: simulationEngine.getGeneratedWh(),
      stored_wh: simulationEngine.getStorage().currentStoredWh,
      consumed_wh: simulationEngine.getConsumedWh(),
      balance_wh: simulationEngine.getBalanceWh(),
      autonomy_formatted: simulationEngine.systemAutonomyFormatted,
      active_pv_count: simulationEngine.getPvUnits().filter(p => p.status === 'ACTIVE').length,
      total_pv_count: simulationEngine.getPvUnits().length,
      online_device_count: simulationEngine.getDevices().filter(d => d.status === 'Online').length,
      total_device_count: simulationEngine.getDevices().length,
    };
  }

  // Fetch PV Harvesting Units
  public async getPvUnits(): Promise<PVHarvestingUnit[]> {
    if (this.mode === 'LIVE') {
      try {
        const res = await fetch(`${this.apiBaseUrl}/harvesting`);
        if (res.ok) {
          const data = await res.json();
          // Map Python backend fields to TS types
          return data.map((unit: any) => ({
            id: unit.id,
            name: unit.name,
            location: unit.location,
            zoneId: 'zone-a',
            lightIntensityLux: unit.light_intensity,
            voltageV: unit.voltage,
            currentMa: unit.current_ma,
            powerMw: unit.power_mw,
            energyGeneratedWh: unit.energy_generated_wh,
            expectedPowerMw: unit.power_mw * 1.12,
            performancePct: unit.performance_pct,
            status: unit.status,
            lastUpdate: unit.last_update,
            pvTechnology: 'Flexible Organic PV (OPV)',
            areaCm2: 75,
          }));
        }
      } catch (err) {
        console.warn('FastAPI harvesting endpoint unreachable, using DEMO PV units:', err);
      }
    }
    return simulationEngine.getPvUnits();
  }

  // Fetch IoT Load Devices
  public async getDevices(): Promise<Device[]> {
    if (this.mode === 'LIVE') {
      try {
        const res = await fetch(`${this.apiBaseUrl}/devices`);
        if (res.ok) {
          const data = await res.json();
          return data.map((dev: any) => ({
            id: dev.id,
            name: dev.name,
            type: dev.type,
            location: dev.location,
            zoneId: 'zone-a',
            powerConsumptionMw: dev.power_consumption_mw,
            batteryLevelPct: dev.battery_level_pct,
            batteryCapacityMWh: 600,
            status: dev.status,
            autonomyHours: dev.autonomy_hours,
            samplingFrequencySec: 10,
            lastUpdate: dev.last_update,
          }));
        }
      } catch (err) {
        console.warn('FastAPI devices endpoint unreachable, using DEMO devices:', err);
      }
    }
    return simulationEngine.getDevices();
  }

  // Fetch recommendations from backend
  public async getRecommendations(): Promise<Recommendation[]> {
    if (this.mode === 'LIVE') {
      try {
        const res = await fetch(`${this.apiBaseUrl}/recommendations`);
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('FastAPI recommendations endpoint unreachable:', err);
      }
    }
    return simulationEngine.getRecommendations();
  }

  // Ingest sensor reading to hardware API endpoint
  public async postSensorReading(reading: {
    device_id: string;
    voltage: number;
    current: number;
    light_intensity: number;
  }) {
    try {
      const res = await fetch(`${this.apiBaseUrl}/readings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reading)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Failed to ingest sensor reading to backend:', err);
    }
    return null;
  }

  // Connect WebSocket for LIVE mode broadcasts
  public connectWebSocket(onMessage: (data: any) => void): WebSocket | null {
    if (this.mode !== 'LIVE') return null;
    try {
      const ws = new WebSocket(this.wsBaseUrl);
      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          onMessage(payload);
        } catch (e) {
          console.error('Error parsing WS payload:', e);
        }
      };
      ws.onerror = (err) => {
        console.warn('WebSocket connection error:', err);
      };
      return ws;
    } catch (err) {
      console.warn('Could not establish WebSocket connection to FastAPI:', err);
      return null;
    }
  }
}

// Global API Service Singleton
export const apiService = new EnergyApiService();

