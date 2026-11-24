import time
import math
import requests

API_URL = "http://127.0.0.1:8001/api/readings"
DEVICE_ID = "VNODE-001"
INTERVAL_SECONDS = 2


def calculate_pv(light_lux: float):
    """
    Simulated Indoor PV Model (Mathematical Prototype).
    Enforces Physics Formula: Power (W) = Voltage (V) * Current (A).
    Ranges bounded for indoor artificial-light prototype:
      - Voltage: 2.50 V - 3.20 V
      - Current: 1.0 mA - 12.0 mA (0.001 A - 0.012 A)
      - Power: 2.5 mW - 38.4 mW
    """
    light_factor = min(max(light_lux - 100.0, 0.0) / 900.0, 1.0)

    voltage = round(2.50 + (0.70 * light_factor), 2)
    current = round(0.0010 + (0.0110 * light_factor), 4)

    # Enforce P = V * I
    power = round(voltage * current, 6)

    return voltage, current, power


def main():
    print("=" * 50)
    print("ENERGENIUS PYTHON VIRTUAL HARDWARE NODE (VNODE-001)")
    print("=" * 50)
    print(f"Device ID: {DEVICE_ID}")
    print(f"Backend:   {API_URL}")
    print("=" * 50)

    start_time = time.time()

    while True:
        elapsed = time.time() - start_time

        # Smooth, gradual variation of indoor lux between ~350 and ~650 lux
        light_lux = round(500.0 + 150.0 * math.sin(elapsed / 12.0), 1)
        light_lux = min(1000.0, max(100.0, light_lux))

        voltage, current, power = calculate_pv(light_lux)

        payload = {
            "device_id": DEVICE_ID,
            "voltage": voltage,
            "current": current,
            "light_intensity": light_lux
        }

        try:
            response = requests.post(API_URL, json=payload, timeout=5)

            if response.ok:
                print(
                    f"Light: {light_lux:5.1f} lux | "
                    f"Voltage: {voltage:4.2f} V | "
                    f"Current: {current * 1000.0:5.2f} mA | "
                    f"Power: {power * 1000.0:5.2f} mW | "
                    f"Backend: {response.status_code}"
                )
            else:
                print(f"Backend error: {response.status_code} {response.text}")

        except requests.exceptions.RequestException as error:
            print(f"Connection notice: Backend at {API_URL} unreachable ({error})")

        time.sleep(INTERVAL_SECONDS)


if __name__ == "__main__":
    main()