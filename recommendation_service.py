from typing import List
from datetime import datetime
from schemas import Recommendation
from services.energy_service import energy_service

class RecommendationService:
    def get_active_recommendations(self) -> List[Recommendation]:
        summary = energy_service.get_summary()
        pv_units = energy_service.get_harvesting_units()
        devices = energy_service.get_devices()

        recs: List[Recommendation] = []
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Rule 1: IF energy availability decreases -> recommend reducing sensor sampling/transmission frequency
        if summary.balance_wh < 0:
            recs.append(Recommendation(
                id="REC-PY-01",
                condition="Net Energy Deficit (-0.4 Wh/hr rate)",
                severity="HIGH",
                explanation="IoT load draw exceeds harvested artificial light input. Supercapacitor depletion imminent.",
                action="Throttle sensor transmission intervals from 5s to 30s across non-critical environmental nodes.",
                expected_benefit="Reduces IoT power consumption by 42% (saves ~0.55 Wh).",
                timestamp=now_str,
                category="SAMPLING",
                executed=False
            ))

        # Rule 2: IF PV output is below expected -> recommend checking position/orientation or increasing harvesting area
        low_pvs = [p for p in pv_units if p.status == "LOW OUTPUT"]
        if low_pvs:
            target_id = low_pvs[0].id
            recs.append(Recommendation(
                id="REC-PY-02",
                condition=f"{len(low_pvs)} PV Flexible Unit(s) operating 31% below expected output",
                severity="MEDIUM",
                explanation=f"Unit {target_id} receiving reduced light flux (< 300 lux) due to fixture shadow or angle tilt.",
                action="Adjust flexible PV sticker orientation towards primary LED fixture or expand surface area by +25 cm².",
                expected_benefit="Restores harvesting efficiency to 94% (+0.42 Wh yield).",
                timestamp=now_str,
                category="POSITION",
                executed=False
            ))

        # Rule 3: IF energy surplus exists -> recommend storing excess energy or enabling non-critical loads
        if summary.balance_wh > 1.0:
            recs.append(Recommendation(
                id="REC-PY-03",
                condition="High Energy Surplus (+1.53 Wh balance)",
                severity="LOW",
                explanation="Supercapacitor buffer is fully charged under high artificial illumination.",
                action="Route excess harvested power to secondary emergency lighting buffer or authorize P2P credit verification.",
                expected_benefit="Prevents energy clipping losses and unlocks +15 Verified Energy Credits (EC).",
                timestamp=now_str,
                category="STORAGE",
                executed=False
            ))

        # Rule 4: IF device energy becomes critical -> recommend reducing operating frequency
        critical_devs = [d for d in devices if d.status == "Critical" or d.battery_level_pct < 25]
        if critical_devs:
            dev_id = critical_devs[0].id
            recs.append(Recommendation(
                id="REC-PY-04",
                condition=f"Critical Reserve on Device {dev_id}",
                severity="CRITICAL",
                explanation=f"Device {dev_id} reserve is at {critical_devs[0].battery_level_pct}%. Risk of brownout.",
                action="Enable Ultra-Low-Power Duty Cycling (ULP) mode and extend sleep interval.",
                expected_benefit="Extends device autonomy by 8.5 hours until next light harvesting cycle.",
                timestamp=now_str,
                category="THROTTLING",
                executed=False
            ))

        return recs

# Global Recommendation Service Singleton
recommendation_service = RecommendationService()
