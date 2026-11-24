from pydantic import BaseModel, Field
from typing import List, Optional

class SensorReadingCreate(BaseModel):
    device_id: str = Field(..., description="PV Unit or IoT Device Identifier (e.g. PV-014)")
    voltage: float = Field(..., description="Voltage in Volts (V)")
    current: float = Field(..., description="Current in Amperes (A)")
    light_intensity: float = Field(..., description="Ambient light intensity in Lux")

class SensorReading(SensorReadingCreate):
    id: str
    power: float = Field(..., description="Calculated Power in Watts (P = V * I)")
    energy: float = Field(..., description="Calculated Cumulative Energy in Wh (E = P * t)")
    timestamp: str

class PVHarvestingStatus(BaseModel):
    id: str
    name: str
    location: str
    light_intensity: float
    voltage: float
    current_ma: float
    power_mw: float
    energy_generated_wh: float
    performance_pct: float
    status: str
    last_update: str

class IoTDeviceStatus(BaseModel):
    id: str
    name: str
    type: str
    location: str
    power_consumption_mw: float
    battery_level_pct: float
    status: str
    autonomy_hours: float
    last_update: str

class EnergySummary(BaseModel):
    generated_wh: float
    stored_wh: float
    consumed_wh: float
    balance_wh: float
    autonomy_formatted: str
    active_pv_count: int
    total_pv_count: int
    online_device_count: int
    total_device_count: int
    timestamp: str

class Recommendation(BaseModel):
    id: str
    condition: str
    severity: str
    explanation: str
    action: str
    expected_benefit: str
    timestamp: str
    category: str
    executed: bool

class HealthStatus(BaseModel):
    status: str
    service: str
    version: str
    timestamp: str
    connected_ws_clients: int
    total_readings_ingested: int
