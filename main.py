import logging
from datetime import datetime
from typing import List

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from schemas import (
    SensorReadingCreate,
    SensorReading,
    PVHarvestingStatus,
    IoTDeviceStatus,
    EnergySummary,
    Recommendation,
    HealthStatus
)
from models import ws_manager
from services.energy_service import energy_service
from services.recommendation_service import recommendation_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("energy_os")

app = FastAPI(
    title="ENERGY OS Backend",
    description="Python FastAPI backend for Distributed Artificial-Light Energy Harvesting Platform.",
    version="2.4.0"
)

# Configure CORS so React Vite frontend (http://localhost:5173) can communicate during local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------------------------------
# REST Endpoints
# -----------------------------------------------------------------------------

@app.get("/", tags=["Root"])
def read_root():
    return {
        "title": "ENERGY OS FastAPI Engine",
        "version": "2.4.0",
        "status": "ONLINE",
        "docs_url": "/docs",
        "health_url": "/api/health",
        "summary_url": "/api/energy/summary",
        "websocket_endpoint": "/ws/energy"
    }

@app.get("/api/health", response_model=HealthStatus, tags=["Health"])
def get_health():
    return HealthStatus(
        status="OK",
        service="ENERGY OS FastAPI Engine",
        version="2.4.0",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        connected_ws_clients=ws_manager.client_count,
        total_readings_ingested=len(energy_service.get_all_readings())
    )

@app.post("/api/readings", response_model=SensorReading, tags=["Hardware Ingestion"])
async def ingest_sensor_reading(reading_data: SensorReadingCreate):
    """
    Ingest hardware sensor reading from Python Virtual Hardware Node (e.g. VNODE-001).
    Accepts: device_id, voltage (V), current (A), light_intensity (Lux).
    Computes P = V * I (Watts), E = P * t (Wh), adds timestamp, and broadcasts via WebSocket.
    """
    try:
        reading = energy_service.process_reading(reading_data)
        
        # Broadcast newly processed reading to connected WebSockets
        await ws_manager.broadcast({
            "event": "NEW_READING",
            "data": reading.model_dump(),
            "summary": energy_service.get_summary().model_dump()
        })
        
        logger.info(f"Ingested hardware reading from {reading.device_id}: {reading.voltage}V, {reading.current}A -> {reading.power}W")
        return reading
    except Exception as e:
        logger.error(f"Error processing sensor reading: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/readings", response_model=List[SensorReading], tags=["Hardware Telemetry"])
def get_all_readings():
    return energy_service.get_all_readings()

@app.get("/api/readings/{device_id}", response_model=List[SensorReading], tags=["Hardware Telemetry"])
def get_readings_for_device(device_id: str):
    return energy_service.get_readings_by_device(device_id)

@app.get("/api/harvesting", response_model=List[PVHarvestingStatus], tags=["PV Array"])
def get_harvesting_units():
    units = energy_service.get_harvesting_units()
    vnode_readings = energy_service.get_readings_by_device("VNODE-001")
    if vnode_readings:
        latest_reading = vnode_readings[-1]
        accumulated_wh = round(sum(r.energy for r in vnode_readings), 6)
        vnode_unit = PVHarvestingStatus(
            id="VNODE-001",
            name="Virtual Indoor PV Node",
            location="Virtual Production Hall - Node 1",
            light_intensity=latest_reading.light_intensity,
            voltage=latest_reading.voltage,
            current_ma=latest_reading.current * 1000.0,
            power_mw=latest_reading.power * 1000.0,
            energy_generated_wh=accumulated_wh,
            performance_pct=100.0,
            status="ACTIVE",
            last_update=latest_reading.timestamp
        )
        return [vnode_unit if u.id == "PV-001" else u for u in units]
    return units

@app.get("/api/harvesting/{device_id}", response_model=PVHarvestingStatus, tags=["PV Array"])
def get_harvesting_unit(device_id: str):
    unit = energy_service.get_harvesting_unit_by_id(device_id)
    if not unit:
        raise HTTPException(status_code=404, detail=f"PV Harvesting Unit {device_id} not found")
    return unit

@app.get("/api/devices", response_model=List[IoTDeviceStatus], tags=["IoT Fleet"])
def get_iot_devices():
    return energy_service.get_devices()

@app.get("/api/energy/summary", response_model=EnergySummary, tags=["Energy State"])
def get_energy_summary():
    return energy_service.get_summary()

@app.get("/api/recommendations", response_model=List[Recommendation], tags=["Smart Management"])
def get_recommendations():
    return recommendation_service.get_active_recommendations()

# -----------------------------------------------------------------------------
# WebSocket Endpoint
# -----------------------------------------------------------------------------

@app.websocket("/ws/energy")
async def websocket_energy_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        # Send initial state summary upon connection
        await websocket.send_json({
            "event": "INIT_STATE",
            "summary": energy_service.get_summary().model_dump()
        })
        while True:
            # Keep connection open and handle incoming ping/messages
            data = await websocket.receive_text()
            logger.debug(f"Received WS message: {data}")
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        ws_manager.disconnect(websocket)
