# ENERGY OS Python FastAPI Backend

Distributed Artificial-Light Energy Harvesting Platform API Engine.

## Features
- **Hardware Telemetry Ingestion**: `POST /api/readings` receives Python Virtual Hardware sensor payloads.
- **Physics Formulas**: Enforces $P = V \times I$ ($V$ in Volts, $I$ in Amperes) and cumulative $E = P \cdot t$ (Wh).
- **Real-time WebSockets**: `/ws/energy` broadcasts live hardware readings to connected React clients.
- **Rule-based Smart Recommendations**: Dynamically advises duty-cycling and tilt adjustments.

## Quick Start

1. Set up Python Virtual Environment:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. Launch FastAPI Server:
```bash
uvicorn main:app --reload --port 8001
```

3. Run Python Virtual Hardware Simulator (in another terminal):
```bash
python simulator/virtual_hardware.py
```

4. Test Hardware Sensor Payload manually:
```bash
curl -X POST http://127.0.0.1:8001/api/readings \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "VNODE-001",
    "voltage": 2.84,
    "current": 0.0055,
    "light_intensity": 500
  }'
```

5. Check Health Status:
```bash
curl http://127.0.0.1:8001/api/health
```
