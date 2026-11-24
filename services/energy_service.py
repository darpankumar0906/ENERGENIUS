import time
from datetime import datetime
from typing import List, Dict, Optional
from schemas import (
    SensorReadingCreate, 
    SensorReading, 
    PVHarvestingStatus, 
    IoTDeviceStatus, 
    EnergySummary
)

class EnergyService:
    def __init__(self):
        self.readings_history: List[SensorReading] = []
        self.device_last_ingest_time: Dict[str, float] = {}
        self.cumulative_generated_wh: float = 2.84
        self.cumulative_consumed_wh: float = 1.31
        self.storage_wh: float = 1.72
        self.storage_capacity_wh: float = 5.0

        # Initialize 20 Prototype Indoor PV Units
        self.pv_units: Dict[str, PVHarvestingStatus] = {}
        for i in range(1, 21):
            pv_id = f"PV-{i:03d}"
            voltage = round(2.70 + (i % 5) * 0.15, 2)
            current_a = round(0.005 + (i % 7) * 0.002, 4)
            power_w = round(voltage * current_a, 6)
            power_mw = round(power_w * 1000.0, 2)
            
            self.pv_units[pv_id] = PVHarvestingStatus(
                id=pv_id,
                name=f"PV Flex Cell Unit {i:03d}",
                location=f"Production Zone {chr(65 + (i % 5))} - Node {(i // 2) + 1}",
                light_intensity=float(420 + (i % 4) * 70),
                voltage=voltage,
                current_ma=round(current_a * 1000.0, 2),
                power_mw=power_mw,
                energy_generated_wh=round(0.12 + i * 0.08, 2),
                performance_pct=round(min(100.0, (power_mw / max(1.0, power_mw * 1.12)) * 100.0), 1),
                status="ACTIVE" if i != 5 else "LOW OUTPUT",
                last_update="Initial baseline"
            )

        # Initialize 10 Prototype IoT Devices
        self.devices: Dict[str, IoTDeviceStatus] = {
            "DEV-001": IoTDeviceStatus(id="DEV-001", name="Production Temp & Humidity Sensor", type="Environmental Sensor", location="Production Hall A - Bay 1", power_consumption_mw=45.0, battery_level_pct=88.0, status="Online", autonomy_hours=11.1, last_update="Initial baseline"),
            "DEV-002": IoTDeviceStatus(id="DEV-002", name="Air Quality Monitoring Node", type="Air Quality Sensor", location="Production Hall A - Bay 3", power_consumption_mw=85.0, battery_level_pct=64.0, status="Online", autonomy_hours=9.4, last_update="Initial baseline"),
            "DEV-003": IoTDeviceStatus(id="DEV-003", name="Assembly Line Vibration Monitor", type="Industrial Vibration", location="Production Hall B - Line 2", power_consumption_mw=60.0, battery_level_pct=92.0, status="Online", autonomy_hours=10.0, last_update="Initial baseline"),
            "DEV-004": IoTDeviceStatus(id="DEV-004", name="Warehouse IoT Gateway Node", type="IoT Gateway", location="Warehouse Main - Rack 4", power_consumption_mw=220.0, battery_level_pct=78.0, status="Online", autonomy_hours=9.1, last_update="Initial baseline"),
            "DEV-005": IoTDeviceStatus(id="DEV-005", name="Logistics Motion Tracker", type="Security Sensor", location="Storage & Logistics", power_consumption_mw=35.0, battery_level_pct=41.0, status="Low Energy", autonomy_hours=4.7, last_update="Initial baseline"),
            "DEV-006": IoTDeviceStatus(id="DEV-006", name="Emergency Exit Lighting Pill", type="Emergency Indicator", location="Assembly Zone - Door 2", power_consumption_mw=110.0, battery_level_pct=95.0, status="Online", autonomy_hours=10.9, last_update="Initial baseline"),
            "DEV-007": IoTDeviceStatus(id="DEV-007", name="Sub-Station Voltage Monitor", type="Electrical Meter", location="Production Hall A - Panel B", power_consumption_mw=50.0, battery_level_pct=83.0, status="Online", autonomy_hours=15.0, last_update="Initial baseline"),
            "DEV-008": IoTDeviceStatus(id="DEV-008", name="Perimeter Optical Sensor", type="Security Sensor", location="Warehouse Main - Gate 1", power_consumption_mw=70.0, battery_level_pct=22.0, status="Critical", autonomy_hours=1.4, last_update="Initial baseline"),
            "DEV-009": IoTDeviceStatus(id="DEV-009", name="Cleanroom Dust Counter", type="Particle Counter", location="Assembly Zone - Bay 4", power_consumption_mw=95.0, battery_level_pct=71.0, status="Online", autonomy_hours=9.5, last_update="Initial baseline"),
            "DEV-010": IoTDeviceStatus(id="DEV-010", name="Backup Relay Controller", type="Actuator", location="Production Hall B - Rack 1", power_consumption_mw=40.0, battery_level_pct=0.0, status="Offline", autonomy_hours=0.0, last_update="12m ago"),
        }

    def process_reading(self, reading_data: SensorReadingCreate) -> SensorReading:
        now = time.time()
        dev_id = reading_data.device_id.upper()

        # Calculate time delta for this specific device (cap to max 10s per step to prevent runaway jumps)
        if dev_id in self.device_last_ingest_time:
            time_delta_seconds = min(10.0, max(0.0, now - self.device_last_ingest_time[dev_id]))
        else:
            time_delta_seconds = 2.0

        self.device_last_ingest_time[dev_id] = now
        time_delta_hours = time_delta_seconds / 3600.0

        # Enforced Physics Formula 1: Power (Watts) = Voltage (V) * Current (A)
        power_watts = reading_data.voltage * reading_data.current
        power_mw = round(power_watts * 1000.0, 2)

        # Enforced Physics Formula 2: Energy (Wh) = Power (W) * time (hours)
        energy_incremental_wh = power_watts * time_delta_hours

        timestamp_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Structured reading object
        reading = SensorReading(
            id=f"READ-{len(self.readings_history) + 1:06d}",
            device_id=reading_data.device_id,
            voltage=round(reading_data.voltage, 2),
            current=round(reading_data.current, 4),
            light_intensity=round(reading_data.light_intensity, 1),
            power=round(power_watts, 4),
            energy=round(energy_incremental_wh, 6),
            timestamp=timestamp_str
        )

        self.readings_history.append(reading)

        # Update PV harvesting unit if device_id matches a PV unit
        if reading_data.device_id in self.pv_units:
            pv = self.pv_units[reading_data.device_id]
            pv.voltage = round(reading_data.voltage, 2)
            pv.current_ma = round(reading_data.current * 1000.0, 2)
            pv.power_mw = power_mw
            pv.light_intensity = round(reading_data.light_intensity, 1)
            pv.energy_generated_wh = round(min(9999.0, pv.energy_generated_wh + energy_incremental_wh), 2)
            
            if power_mw < 10.0:
                pv.status = "LOW OUTPUT"
            else:
                pv.status = "ACTIVE"
            pv.last_update = timestamp_str

        # Update cumulative global energy state with strict 9999.0 Wh cap
        self.cumulative_generated_wh = round(min(9999.0, self.cumulative_generated_wh + energy_incremental_wh), 2)
        
        # Consumed incremental draw (approx 0.65 W total fleet average)
        consumed_inc = 0.65 * time_delta_hours
        self.cumulative_consumed_wh = round(min(9999.0, self.cumulative_consumed_wh + consumed_inc), 2)

        # Supercapacitor Storage Buffer (max capacity 5.0 Wh)
        net_delta = energy_incremental_wh - consumed_inc
        self.storage_wh = round(max(0.1, min(self.storage_capacity_wh, self.storage_wh + net_delta)), 2)

        return reading

    def get_summary(self) -> EnergySummary:
        gen_wh = round(min(9999.0, max(0.0, self.cumulative_generated_wh)), 2)
        con_wh = round(min(9999.0, max(0.0, self.cumulative_consumed_wh)), 2)
        stor_wh = round(min(self.storage_capacity_wh, max(0.0, self.storage_wh)), 2)
        net_balance = round(min(9999.0, max(-9999.0, gen_wh - con_wh)), 2)

        # Calculate system autonomy
        total_dev_draw_w = sum(d.power_consumption_mw for d in self.devices.values() if d.status != "Offline") / 1000.0
        avg_draw_w = max(0.1, total_dev_draw_w)
        autonomy_hours = min(9999.0, stor_wh / avg_draw_w)
        hrs = int(autonomy_hours)
        mins = int((autonomy_hours - hrs) * 60)
        autonomy_fmt = f"{hrs}h {mins}m"

        active_pvs = sum(1 for p in self.pv_units.values() if p.status == "ACTIVE")
        online_devs = sum(1 for d in self.devices.values() if d.status == "Online")

        return EnergySummary(
            generated_wh=gen_wh,
            stored_wh=stor_wh,
            consumed_wh=con_wh,
            balance_wh=net_balance,
            autonomy_formatted=autonomy_fmt,
            active_pv_count=active_pvs,
            total_pv_count=len(self.pv_units),
            online_device_count=online_devs,
            total_device_count=len(self.devices),
            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )

    def get_all_readings(self) -> List[SensorReading]:
        return self.readings_history

    def get_readings_by_device(self, device_id: str) -> List[SensorReading]:
        return [r for r in self.readings_history if r.device_id == device_id]

    def get_harvesting_units(self) -> List[PVHarvestingStatus]:
        return list(self.pv_units.values())

    def get_harvesting_unit_by_id(self, device_id: str) -> Optional[PVHarvestingStatus]:
        return self.pv_units.get(device_id)

    def get_devices(self) -> List[IoTDeviceStatus]:
        return list(self.devices.values())

energy_service = EnergyService()
