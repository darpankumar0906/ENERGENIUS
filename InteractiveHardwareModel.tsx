import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Cpu, 
  BatteryCharging, 
  Activity, 
  Radio, 
  Sparkles,
  RotateCcw,
  X,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { formatEnergy, formatSoC, formatVoltage, formatCurrent, formatPower, formatLux, formatBalance } from '../../utils/telemetrySafety';

export interface HardwareNodeInfo {
  id: 'esp32' | 'pv' | 'pmic' | 'storage' | 'iot';
  title: string;
  subtitle: string;
  specText: string;
  statusText: string;
  detailBadge: string;
  connectedPath: string[];
  metrics: { label: string; value: string }[];
}

export const InteractiveHardwareModel: React.FC<{
  className?: string;
  onNodeSelect?: (nodeId: string) => void;
}> = ({ className = '', onNodeSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { 
    generatedWh, 
    consumedWh, 
    storage, 
    pvUnits, 
    devices,
    balanceWh,
    scenario 
  } = useSimulation();

  const [activeNode, setActiveNode] = useState<'esp32' | 'pv' | 'pmic' | 'storage' | 'iot'>('esp32');
  const [hoveredNode, setHoveredNode] = useState<'esp32' | 'pv' | 'pmic' | 'storage' | 'iot' | null>(null);
  const [inspectedNode, setInspectedNode] = useState<'esp32' | 'pv' | 'pmic' | 'storage' | 'iot' | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  const [isDragging, setIsDragging] = useState(false);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Mouse / Pointer Rotation & Raycasting States
  const pointerPos = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });
  const dragRotation = useRef({ x: 0, y: 0 });
  const baseDragRot = useRef({ x: 0, y: 0 });

  // WebGL Raycasting & Animation Refs
  const hoveredNodeRef = useRef<'esp32' | 'pv' | 'pmic' | 'storage' | 'iot' | null>(null);
  const activeNodeRef = useRef<'esp32' | 'pv' | 'pmic' | 'storage' | 'iot'>('esp32');
  const raycasterRef = useRef<THREE.Raycaster | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const interactiveGroupsRef = useRef<THREE.Group[]>([]);

  useEffect(() => {
    hoveredNodeRef.current = hoveredNode;
  }, [hoveredNode]);

  useEffect(() => {
    activeNodeRef.current = activeNode;
  }, [activeNode]);

  // Live Node Telemetry Lookup
  const activePvCount = pvUnits.filter(p => p.status === 'ACTIVE').length;
  const activeDevCount = devices.filter(d => d.status === 'Online').length;
  const avgPvVoltage = pvUnits.length > 0 ? (pvUnits.reduce((acc, p) => acc + p.voltageV, 0) / pvUnits.length) : 3.10;
  const avgPvCurrent = pvUnits.length > 0 ? (pvUnits.reduce((acc, p) => acc + p.currentMa, 0) / pvUnits.length) : 18.5;
  const avgPvPower = pvUnits.length > 0 ? (pvUnits.reduce((acc, p) => acc + p.powerMw, 0) / pvUnits.length) : 57.3;
  const avgLux = pvUnits.length > 0 ? (pvUnits.reduce((acc, p) => acc + p.lightIntensityLux, 0) / pvUnits.length) : 500;

  const nodeDetails: Record<'esp32' | 'pv' | 'pmic' | 'storage' | 'iot', HardwareNodeInfo> = {
    esp32: {
      id: 'esp32',
      title: 'ESP32-WROOM-32 Energy OS Controller',
      subtitle: 'System Master Controller & Real-Time Telemetry Hub',
      specText: 'Dual-Core Xtensa LX6 • 240 MHz • Wi-Fi 802.11 b/g/n + BLE',
      statusText: `Net Balance: ${formatBalance(balanceWh)} Wh`,
      detailBadge: 'DIGITAL TWIN CORE',
      connectedPath: ['PV Array', 'PMIC Manager', 'Supercapacitor', 'ESP32 Controller', 'IoT Sensor Fleet'],
      metrics: [
        { label: 'System Clock', value: '240 MHz' },
        { label: 'Packet Frequency', value: '1 Hz Live' },
        { label: 'Supply Voltage', value: '3.30 V DC' },
        { label: 'System Status', value: 'ONLINE' }
      ]
    },
    pv: {
      id: 'pv',
      title: 'Distributed Indoor PV Harvester Array',
      subtitle: 'Flexible Photovoltaic Ambient Light Collector Stickers',
      specText: `${activePvCount}/20 Flexible Indoor PV Modules Connected`,
      statusText: `Yield: ${formatEnergy(generatedWh)} Wh (${formatLux(avgLux)} Lux)`,
      detailBadge: 'HARVESTING SOURCE',
      connectedPath: ['Indoor PV Stickers', 'bq25570 PMIC', 'Supercap Storage', 'ESP32 Controller'],
      metrics: [
        { label: 'Light Level', value: `${formatLux(avgLux)} Lux` },
        { label: 'Avg Voltage', value: `${formatVoltage(avgPvVoltage)} V` },
        { label: 'Avg Current', value: `${formatCurrent(avgPvCurrent)} mA` },
        { label: 'Harvest Power', value: `${formatPower(avgPvPower)} mW` }
      ]
    },
    pmic: {
      id: 'pmic',
      title: 'bq25570 MPPT Power Management IC',
      subtitle: 'Ultra-Low-Power Energy Harvesting & Buck Regulator',
      specText: 'Maximum Power Point Tracking (94.2% Dynamic Efficiency)',
      statusText: 'Cold-start @ 330 mV • Quiescent Draw < 1µA',
      detailBadge: 'POWER MANAGEMENT',
      connectedPath: ['PV Array', 'bq25570 PMIC', 'Supercapacitor Storage'],
      metrics: [
        { label: 'MPPT Tracking', value: '80% VOC' },
        { label: 'Efficiency', value: '94.2%' },
        { label: 'Regulated VOUT', value: '3.30 V' },
        { label: 'Cold-Start Threshold', value: '330 mV' }
      ]
    },
    storage: {
      id: 'storage',
      title: 'Hybrid Supercapacitor Bank',
      subtitle: 'Battery-Free Rapid Charge/Discharge Storage Buffer',
      specText: `Capacity: ${storage.capacityWh} Wh (${formatSoC(storage.stateOfChargePct)}% SoC)`,
      statusText: `Current Stored: ${formatEnergy(storage.currentStoredWh)} Wh`,
      detailBadge: 'ENERGY STORAGE',
      connectedPath: ['bq25570 PMIC', 'Supercapacitor Bank', 'ESP32 Controller', 'IoT Loads'],
      metrics: [
        { label: 'State of Charge', value: `${formatSoC(storage.stateOfChargePct)}%` },
        { label: 'Current Stored', value: `${formatEnergy(storage.currentStoredWh)} Wh` },
        { label: 'Cycle Life', value: '>500,000 Cycles' },
        { label: 'Autonomy Window', value: '7.6 Hours' }
      ]
    },
    iot: {
      id: 'iot',
      title: 'Distributed IoT Sensor Fleet & Loads',
      subtitle: 'Low-Power Environmental & Industrial Endpoints',
      specText: `${activeDevCount}/10 Nodes Online • Duty Cycle 10%`,
      statusText: `Demand: ${formatEnergy(consumedWh)} Wh (Avg 0.65 W)`,
      detailBadge: 'LOAD ENDPOINTS',
      connectedPath: ['ESP32 Controller', 'IoT Sensor Fleet', 'Actuators'],
      metrics: [
        { label: 'Temp / Humidity', value: '24°C / 48%' },
        { label: 'Ambient Light', value: `${formatLux(avgLux)} Lux` },
        { label: 'Air Quality Index', value: '98 AQI (Good)' },
        { label: 'Active Draw', value: '0.65 W' }
      ]
    }
  };

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handleChange = () => setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // WebGL 3D Scene & Digital Twin Engine Initialization
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // WebGL Support Check using throwaway canvas
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 440;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 5.5, 9.8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const raycaster = new THREE.Raycaster();
    raycasterRef.current = raycaster;

    // 2. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 3. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const mainDirectional = new THREE.DirectionalLight(0x10b981, 2.8);
    mainDirectional.position.set(6, 10, 6);
    mainDirectional.castShadow = true;
    scene.add(mainDirectional);

    const cyanPointLight = new THREE.PointLight(0x06b6d4, 3.5, 12);
    cyanPointLight.position.set(-5, 3, -3);
    scene.add(cyanPointLight);

    const amberPointLight = new THREE.PointLight(0xf59e0b, 2.0, 10);
    amberPointLight.position.set(4, -2, 3);
    scene.add(amberPointLight);

    // 4. Digital Twin Master Assembly Group
    const systemGroup = new THREE.Group();

    // Base Chassis Workbench Plate
    const basePlateGeo = new THREE.BoxGeometry(9.2, 0.12, 7.0);
    const basePlateMat = new THREE.MeshStandardMaterial({
      color: 0x070c14,
      roughness: 0.3,
      metalness: 0.6,
      transparent: true,
      opacity: 0.92
    });
    const basePlateMesh = new THREE.Mesh(basePlateGeo, basePlateMat);
    basePlateMesh.position.set(0, -0.4, 0);
    basePlateMesh.receiveShadow = true;
    systemGroup.add(basePlateMesh);

    // Standoff Pins
    const standoffGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.35, 16);
    const standoffMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9, roughness: 0.2 });
    [
      [-4.3, -3.2], [4.3, -3.2],
      [-4.3, 3.2], [4.3, 3.2]
    ].forEach(([sx, sz]) => {
      const pin = new THREE.Mesh(standoffGeo, standoffMat);
      pin.position.set(sx, -0.6, sz);
      systemGroup.add(pin);
    });

    // =========================================================================
    // A. CENTER: ESP32-WROOM SYSTEM CONTROLLER BOARD
    // =========================================================================
    const esp32Group = new THREE.Group();
    esp32Group.position.set(0, 0, 0);
    (esp32Group as any).nodeId = 'esp32';

    const pcbGeo = new THREE.BoxGeometry(2.8, 0.08, 4.6);
    const pcbMat = new THREE.MeshStandardMaterial({ color: 0x0d1a16, roughness: 0.4, metalness: 0.3 });
    const pcbMesh = new THREE.Mesh(pcbGeo, pcbMat);
    pcbMesh.castShadow = true;
    esp32Group.add(pcbMesh);

    // ESP Shield Can
    const shieldGeo = new THREE.BoxGeometry(1.6, 0.12, 1.8);
    const shieldMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.2, metalness: 0.85 });
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    shieldMesh.position.set(0, 0.1, -0.5);
    shieldMesh.castShadow = true;
    esp32Group.add(shieldMesh);

    // PCB Antenna Trace
    const antennaGeo = new THREE.BoxGeometry(1.4, 0.04, 0.5);
    const antennaMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.3, metalness: 0.8 });
    const antennaMesh = new THREE.Mesh(antennaGeo, antennaMat);
    antennaMesh.position.set(0, 0.06, -1.9);
    esp32Group.add(antennaMesh);

    // USB Port
    const usbGeo = new THREE.BoxGeometry(0.7, 0.16, 0.5);
    const usbMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.25, metalness: 0.9 });
    const usbMesh = new THREE.Mesh(usbGeo, usbMat);
    usbMesh.position.set(0, 0.1, 2.05);
    esp32Group.add(usbMesh);

    // Header Pins
    const pinGeo = new THREE.BoxGeometry(0.06, 0.35, 0.06);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.2, metalness: 0.9 });
    for (let i = 0; i < 14; i++) {
      const pz = -1.9 + i * 0.3;
      const pinL = new THREE.Mesh(pinGeo, goldMat);
      pinL.position.set(-1.3, 0.1, pz);
      esp32Group.add(pinL);
      const pinR = new THREE.Mesh(pinGeo, goldMat);
      pinR.position.set(1.3, 0.1, pz);
      esp32Group.add(pinR);
    }

    // Status LEDs
    const ledGeo = new THREE.BoxGeometry(0.1, 0.06, 0.1);
    const pwrLedMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const pwrLed = new THREE.Mesh(ledGeo, pwrLedMat);
    pwrLed.position.set(-0.7, 0.08, 1.4);
    esp32Group.add(pwrLed);

    const txLedMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const txLed = new THREE.Mesh(ledGeo, txLedMat);
    txLed.position.set(0.7, 0.08, 1.4);
    esp32Group.add(txLed);

    systemGroup.add(esp32Group);

    // =========================================================================
    // B. TOP LEFT: FLEXIBLE INDOOR PV HARVESTING MODULES
    // =========================================================================
    const pvGroup = new THREE.Group();
    pvGroup.position.set(-2.8, 0.2, -1.8);
    pvGroup.rotation.x = Math.PI / 12;
    (pvGroup as any).nodeId = 'pv';

    const pvBaseGeo = new THREE.BoxGeometry(2.4, 0.06, 1.8);
    const pvBaseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
    const pvBase = new THREE.Mesh(pvBaseGeo, pvBaseMat);
    pvGroup.add(pvBase);

    // PV Surface
    const pvCellGeo = new THREE.BoxGeometry(2.2, 0.02, 1.6);
    const pvCellMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.2, metalness: 0.7 });
    const pvCell = new THREE.Mesh(pvCellGeo, pvCellMat);
    pvCell.position.set(0, 0.04, 0);
    pvGroup.add(pvCell);

    // Busbar Lines
    const busbarMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 });
    for (let i = -0.9; i <= 0.9; i += 0.45) {
      const line = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.03, 1.5), busbarMat);
      line.position.set(i, 0.05, 0);
      pvGroup.add(line);
    }

    systemGroup.add(pvGroup);

    // =========================================================================
    // C. TOP RIGHT: bq25570 MPPT POWER MANAGEMENT (PMIC) BREAKOUT BOARD
    // =========================================================================
    const pmicGroup = new THREE.Group();
    pmicGroup.position.set(2.8, 0.1, -1.8);
    (pmicGroup as any).nodeId = 'pmic';

    const pmicPcbGeo = new THREE.BoxGeometry(1.8, 0.06, 1.8);
    const pmicPcbMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.4 });
    const pmicPcb = new THREE.Mesh(pmicPcbGeo, pmicPcbMat);
    pmicGroup.add(pmicPcb);

    // bq25570 IC Chip
    const pmicChipGeo = new THREE.BoxGeometry(0.5, 0.08, 0.5);
    const pmicChipMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
    const pmicChip = new THREE.Mesh(pmicChipGeo, pmicChipMat);
    pmicChip.position.set(0, 0.07, -0.2);
    pmicGroup.add(pmicChip);

    // Inductor Coil
    const inductorGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.25, 16);
    const inductorMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3, metalness: 0.8 });
    const inductor = new THREE.Mesh(inductorGeo, inductorMat);
    inductor.position.set(-0.4, 0.15, 0.3);
    pmicGroup.add(inductor);

    // Terminal Screw Block
    const termGeo = new THREE.BoxGeometry(0.5, 0.3, 0.4);
    const termMat = new THREE.MeshStandardMaterial({ color: 0x15803d });
    const termBlock = new THREE.Mesh(termGeo, termMat);
    termBlock.position.set(0.5, 0.18, -0.5);
    pmicGroup.add(termBlock);

    systemGroup.add(pmicGroup);

    // =========================================================================
    // D. BOTTOM LEFT: HYBRID SUPERCAPACITOR STORAGE BANK
    // =========================================================================
    const capGroup = new THREE.Group();
    capGroup.position.set(-2.8, 0.15, 1.8);
    (capGroup as any).nodeId = 'storage';

    const capHolderGeo = new THREE.BoxGeometry(2.0, 0.06, 1.6);
    const capHolderMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    const capHolder = new THREE.Mesh(capHolderGeo, capHolderMat);
    capGroup.add(capHolder);

    // Dual Cylindrical Supercapacitors
    const capBodyGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.1, 24);
    const capBodyMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2, metalness: 0.6 });
    const cap1 = new THREE.Mesh(capBodyGeo, capBodyMat);
    cap1.position.set(-0.45, 0.55, 0);
    capGroup.add(cap1);

    const cap2 = new THREE.Mesh(capBodyGeo, capBodyMat);
    cap2.position.set(0.45, 0.55, 0);
    capGroup.add(cap2);

    const capTopGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.06, 16);
    const capTopMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 });
    const top1 = new THREE.Mesh(capTopGeo, capTopMat);
    top1.position.set(-0.45, 1.12, 0);
    capGroup.add(top1);
    const top2 = new THREE.Mesh(capTopGeo, capTopMat);
    top2.position.set(0.45, 1.12, 0);
    capGroup.add(top2);

    systemGroup.add(capGroup);

    // =========================================================================
    // E. BOTTOM RIGHT: INTEGRATED IoT SENSOR FLEET MODULES
    // =========================================================================
    const sensorGroup = new THREE.Group();
    sensorGroup.position.set(2.8, 0.1, 1.8);
    (sensorGroup as any).nodeId = 'iot';

    const sensorPcbGeo = new THREE.BoxGeometry(2.2, 0.06, 1.8);
    const sensorPcbMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
    const sensorPcb = new THREE.Mesh(sensorPcbGeo, sensorPcbMat);
    sensorGroup.add(sensorPcb);

    // DHT22 Temp Sensor
    const tempSensorGeo = new THREE.BoxGeometry(0.5, 0.3, 0.5);
    const tempSensorMat = new THREE.MeshStandardMaterial({ color: 0x0284c7 });
    const tempSensor = new THREE.Mesh(tempSensorGeo, tempSensorMat);
    tempSensor.position.set(-0.5, 0.18, -0.4);
    sensorGroup.add(tempSensor);

    // BH1750 Optical Lens
    const lensGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.15, 16);
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.9 });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.position.set(0.5, 0.12, -0.4);
    sensorGroup.add(lens);

    // MQ-135 Air Quality Dome
    const airGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.4, 16);
    const airMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 });
    const airCanister = new THREE.Mesh(airGeo, airMat);
    airCanister.position.set(-0.5, 0.22, 0.4);
    sensorGroup.add(airCanister);

    // MPU6050 Gyro Chip
    const gyroGeo = new THREE.BoxGeometry(0.4, 0.06, 0.4);
    const gyroMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
    const gyroChip = new THREE.Mesh(gyroGeo, gyroMat);
    gyroChip.position.set(0.5, 0.08, 0.4);
    sensorGroup.add(gyroChip);

    systemGroup.add(sensorGroup);

    // Register interactive 3D groups for raycaster selection
    interactiveGroupsRef.current = [esp32Group, pvGroup, pmicGroup, capGroup, sensorGroup];

    // =========================================================================
    // F. 3D INTERCONNECTING WIRES & DYNAMIC FLOW PARTICLES
    // =========================================================================
    const wireGroup = new THREE.Group();

    const wireCurves = [
      // 0. PV -> PMIC
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.8, 0.2, -1.8),
        new THREE.Vector3(0, 0.4, -2.4),
        new THREE.Vector3(2.0, 0.2, -1.8)
      ]),
      // 1. PMIC -> Supercapacitor
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(2.2, 0.1, -1.0),
        new THREE.Vector3(0, 0.3, 0),
        new THREE.Vector3(-2.0, 0.2, 1.0)
      ]),
      // 2. Supercapacitor -> ESP32
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.8, 0.2, 1.8),
        new THREE.Vector3(-1.4, 0.2, 0.8),
        new THREE.Vector3(-1.2, 0.1, 0)
      ]),
      // 3. ESP32 -> IoT Sensors
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.2, 0.1, 0),
        new THREE.Vector3(1.6, 0.2, 0.8),
        new THREE.Vector3(2.0, 0.1, 1.8)
      ])
    ];

    const wireMeshes: THREE.Mesh[] = [];
    wireCurves.forEach((curve, idx) => {
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.038, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: idx === 3 ? 0xf59e0b : 0x10b981,
        emissive: idx === 3 ? 0xd97706 : 0x059669,
        emissiveIntensity: 0.2,
        roughness: 0.3,
        metalness: 0.5
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      wireMeshes.push(tubeMesh);
      wireGroup.add(tubeMesh);
    });

    // Moving Glow Flow Particles Along Curves
    const flowParticleGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const flowParticleMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    
    const flowParticles = wireCurves.map(() => {
      const pMesh = new THREE.Mesh(flowParticleGeo, flowParticleMat);
      wireGroup.add(pMesh);
      return pMesh;
    });

    systemGroup.add(wireGroup);
    scene.add(systemGroup);

    const wireConnectionMap: Record<'esp32' | 'pv' | 'pmic' | 'storage' | 'iot', number[]> = {
      pv: [0],
      pmic: [0, 1],
      storage: [1, 2],
      esp32: [2, 3],
      iot: [3]
    };

    // 5. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Idle Floating / Oscillation for System Group
      if (!reducedMotion) {
        systemGroup.position.y = Math.sin(elapsedTime * 1.4) * 0.12;
        txLedMat.opacity = 0.5 + Math.sin(elapsedTime * 8) * 0.5;
      }

      // Dynamic Flow Particles Motion Along Wires
      const flowSpeedMultiplier = scenario === 'HIGH_GENERATION' ? 2.0 : scenario === 'LOW_GENERATION' ? 0.5 : 1.0;
      flowParticles.forEach((particle, idx) => {
        const curve = wireCurves[idx];
        const progress = ((elapsedTime * 0.35 * flowSpeedMultiplier) + idx * 0.25) % 1.0;
        const pt = curve.getPoint(progress);
        particle.position.copy(pt);
      });

      // Smooth Pointer Rotation Interpolation (Lerping)
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.08;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.08;

      systemGroup.rotation.x = currentRotation.current.x;
      systemGroup.rotation.y = currentRotation.current.y;

      // 3D Component Hover Scaling & Wire Highlight Animations
      const currentFocus = hoveredNodeRef.current || activeNodeRef.current;
      interactiveGroupsRef.current.forEach((grp) => {
        const nid = (grp as any).nodeId as 'esp32' | 'pv' | 'pmic' | 'storage' | 'iot';
        const isTarget = nid === currentFocus;
        const targetScale = isTarget ? 1.06 : 1.0;
        grp.scale.x = THREE.MathUtils.lerp(grp.scale.x, targetScale, 0.12);
        grp.scale.y = THREE.MathUtils.lerp(grp.scale.y, targetScale, 0.12);
        grp.scale.z = THREE.MathUtils.lerp(grp.scale.z, targetScale, 0.12);
      });

      // Wire connection highlights
      wireMeshes.forEach((mesh, idx) => {
        const isConnected = currentFocus ? wireConnectionMap[currentFocus].includes(idx) : false;
        const targetEmissive = isConnected ? 0.95 : 0.18;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetEmissive, 0.12);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 440;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on Unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      basePlateGeo.dispose();
      basePlateMat.dispose();
      pcbGeo.dispose();
      pcbMat.dispose();
      shieldGeo.dispose();
      shieldMat.dispose();
      goldMat.dispose();
    };
  }, [reducedMotion, scenario]);

  // Pointer Handlers (Pointer Follow, Dragging, Raycasting)
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Normalized Mouse Pos (-1 to +1)
    const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });

    pointerPos.current = { x: normX, y: normY };

    if (isDragging) {
      const deltaX = e.clientX - dragStart.current.x;
      const deltaY = e.clientY - dragStart.current.y;
      dragRotation.current = {
        x: baseDragRot.current.x + deltaY * 0.008,
        y: baseDragRot.current.y + deltaX * 0.008
      };
    }

    targetRotation.current = {
      x: dragRotation.current.x + normY * 0.25,
      y: dragRotation.current.y + normX * 0.35
    };

    // Perform Raycasting if 3D scene camera & raycaster are active
    if (raycasterRef.current && cameraRef.current && interactiveGroupsRef.current.length > 0) {
      raycasterRef.current.setFromCamera(new THREE.Vector2(normX, normY), cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(
        interactiveGroupsRef.current,
        true
      );

      if (intersects.length > 0) {
        let currObj: THREE.Object3D | null = intersects[0].object;
        let detectedNode: 'esp32' | 'pv' | 'pmic' | 'storage' | 'iot' | null = null;
        while (currObj && currObj !== sceneRef.current) {
          if ((currObj as any).nodeId) {
            detectedNode = (currObj as any).nodeId;
            break;
          }
          currObj = currObj.parent;
        }

        if (detectedNode) {
          setHoveredNode(detectedNode);
          if (canvasRef.current) canvasRef.current.style.cursor = 'pointer';
        } else if (!isDragging) {
          setHoveredNode(null);
          if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
        }
      } else if (!isDragging) {
        setHoveredNode(null);
        if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    baseDragRot.current = { ...dragRotation.current };
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const resetOrientation = () => {
    dragRotation.current = { x: 0, y: 0 };
    targetRotation.current = { x: 0, y: 0 };
  };

  const selectHardwareNode = (id: 'esp32' | 'pv' | 'pmic' | 'storage' | 'iot') => {
    setActiveNode(id);
    setInspectedNode(id);
    if (onNodeSelect) onNodeSelect(id);
  };

  const handleCanvasClick = () => {
    if (hoveredNode) {
      selectHardwareNode(hoveredNode);
    }
  };

  return (
    <div 
      className={`relative w-full rounded-2xl overflow-hidden border border-navy-850 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 quiet-surface select-none ${className}`}
      onPointerLeave={() => {
        setIsDragging(false);
        setHoveredNode(null);
        targetRotation.current = { x: dragRotation.current.x, y: dragRotation.current.y };
      }}
    >
      {/* Header Bar with Header Hardware Identification */}
      <div className="px-5 py-3.5 border-b border-navy-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-navy-950/90 font-mono">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              3D DIGITAL TWIN • ENERGENIUS PHYSICAL ASSEMBLY
            </span>
          </div>
          <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            Indoor Energy Harvesting Hardware OS
          </h3>
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>ESP32 HARDWARE CONTROLLER</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 font-normal">Real-time telemetry controller • VNODE-001</span>
          </div>
        </div>

        <div className="flex flex-col sm:items-end space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold text-[10px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE TWIN SYNC
            </span>
          </div>
          <span className="text-slate-400 text-[10px]">Hover or Click to Inspect Nodes</span>
        </div>
      </div>

      {/* 3D Hardware Canvas Container */}
      <div 
        ref={containerRef}
        className="relative w-full h-[420px] sm:h-[480px] cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden"
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onClick={handleCanvasClick}
      >
        {/* Radial Glow Background */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-navy-950/70 to-navy-950" />

        {/* WebGL Canvas or 2D Vector Fallback */}
        {webGlSupported ? (
          <canvas ref={canvasRef} className="w-full h-full block" />
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 p-6 text-center font-mono">
            <div className="w-28 h-40 rounded-xl border-2 border-emerald-500/40 bg-navy-950 p-3 flex flex-col justify-between shadow-lg">
              <span className="text-[10px] text-emerald-400 font-bold">ESP32 SYSTEM</span>
              <div className="w-full h-14 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-[9px] text-slate-400">HARDWARE CORE</div>
              <span className="text-[9px] text-slate-500">2.4 GHz Telemetry</span>
            </div>
            <p className="text-xs text-slate-400">WebGL fallback mode active. Hardware architecture topology running.</p>
          </div>
        )}

        {/* PERIMETER CALLOUT BADGES */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-5">
          
          {/* Top Row: PV ARRAY & PMIC */}
          <div className="flex justify-between items-start">
            {/* PV Array Node */}
            <motion.button
              onClick={() => selectHardwareNode('pv')}
              onMouseEnter={() => setHoveredNode('pv')}
              onMouseLeave={() => setHoveredNode(null)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`pointer-events-auto flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                activeNode === 'pv' || hoveredNode === 'pv'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/60 shadow-lg shadow-emerald-500/10' 
                  : 'bg-navy-950/90 text-slate-400 border-navy-800 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="block font-bold leading-none">PV ARRAY</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <span className="text-[9px] text-slate-400 leading-none">{formatEnergy(generatedWh)} Wh Yield</span>
              </div>
            </motion.button>

            {/* PMIC Node */}
            <motion.button
              onClick={() => selectHardwareNode('pmic')}
              onMouseEnter={() => setHoveredNode('pmic')}
              onMouseLeave={() => setHoveredNode(null)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`pointer-events-auto flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                activeNode === 'pmic' || hoveredNode === 'pmic'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/60 shadow-lg shadow-emerald-500/10' 
                  : 'bg-navy-950/90 text-slate-400 border-navy-800 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="block font-bold leading-none">bq25570 PMIC</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                </div>
                <span className="text-[9px] text-slate-400 leading-none">94.2% MPPT</span>
              </div>
            </motion.button>
          </div>

          {/* Bottom Row: SUPERCAPACITOR & IoT SENSOR FLEET */}
          <div className="flex justify-between items-end">
            {/* Storage Node */}
            <motion.button
              onClick={() => selectHardwareNode('storage')}
              onMouseEnter={() => setHoveredNode('storage')}
              onMouseLeave={() => setHoveredNode(null)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`pointer-events-auto flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                activeNode === 'storage' || hoveredNode === 'storage'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/60 shadow-lg shadow-emerald-500/10' 
                  : 'bg-navy-950/90 text-slate-400 border-navy-800 hover:text-slate-200'
              }`}
            >
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="block font-bold leading-none">SUPERCAPACITOR</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <span className="text-[9px] text-slate-400 leading-none">{formatSoC(storage.stateOfChargePct)}% SoC ({formatEnergy(storage.currentStoredWh)} Wh)</span>
              </div>
            </motion.button>

            {/* IoT Fleet Node */}
            <motion.button
              onClick={() => selectHardwareNode('iot')}
              onMouseEnter={() => setHoveredNode('iot')}
              onMouseLeave={() => setHoveredNode(null)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`pointer-events-auto flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                activeNode === 'iot' || hoveredNode === 'iot'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/60 shadow-lg shadow-emerald-500/10' 
                  : 'bg-navy-950/90 text-slate-400 border-navy-800 hover:text-slate-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-amber-400" />
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="block font-bold leading-none">IoT SENSOR FLEET</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                </div>
                <span className="text-[9px] text-slate-400 leading-none">{formatEnergy(consumedWh)} Wh ({activeDevCount}/10 Active)</span>
              </div>
            </motion.button>
          </div>

        </div>

        {/* DYNAMIC CURSOR HOVER TOOLTIP */}
        <AnimatePresence>
          {hoveredNode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 4 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                left: Math.min(Math.max(mousePos.x + 15, 16), (containerRef.current?.clientWidth || 600) - 275),
                top: Math.min(Math.max(mousePos.y - 20, 16), (containerRef.current?.clientHeight || 480) - 190)
              }}
              className="absolute pointer-events-none z-30 w-64 p-3.5 rounded-xl bg-navy-950/95 backdrop-blur-md border border-emerald-500/40 shadow-2xl shadow-emerald-950/60 font-mono"
            >
              <div className="flex items-center justify-between border-b border-navy-850 pb-2 mb-2">
                <div className="flex items-center space-x-2">
                  {hoveredNode === 'pv' && <Zap className="w-4 h-4 text-emerald-400" />}
                  {hoveredNode === 'pmic' && <Activity className="w-4 h-4 text-cyan-400" />}
                  {hoveredNode === 'storage' && <BatteryCharging className="w-4 h-4 text-emerald-400" />}
                  {hoveredNode === 'esp32' && <Cpu className="w-4 h-4 text-emerald-400" />}
                  {hoveredNode === 'iot' && <Radio className="w-4 h-4 text-amber-400" />}
                  <span className="text-xs font-bold text-slate-100 uppercase tracking-tight">
                    {hoveredNode === 'pv' && 'PV ARRAY'}
                    {hoveredNode === 'pmic' && 'POWER MANAGEMENT / PMIC'}
                    {hoveredNode === 'storage' && 'SUPERCAPACITOR'}
                    {hoveredNode === 'esp32' && 'ESP32 CONTROLLER'}
                    {hoveredNode === 'iot' && 'IoT SENSOR FLEET'}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold border border-emerald-500/30 bg-emerald-950/80 text-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {hoveredNode === 'storage' ? (balanceWh >= 0 ? 'CHARGING' : 'DISCHARGING') : hoveredNode === 'esp32' ? 'ONLINE' : hoveredNode === 'iot' ? 'MONITORING' : 'ACTIVE'}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                {hoveredNode === 'pv' && (
                  <>
                    <div className="flex justify-between items-center"><span className="text-slate-400">Generated Energy</span><span className="font-semibold text-slate-100">{formatEnergy(generatedWh)} Wh</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-400">Current Power</span><span className="font-semibold text-slate-100">{formatPower(avgPvPower)} mW</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-400">Light Intensity</span><span className="font-semibold text-slate-100">{formatLux(avgLux)} Lux</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-400">Status</span><span className="font-semibold text-emerald-400">● ACTIVE</span></div>
                  </>
                )}
                {hoveredNode === 'pmic' && (
                  <>
                    <div className="flex justify-between items-center"><span className="text-slate-400">Efficiency</span><span className="font-semibold text-slate-100">94.2% MPPT</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-400">Input Power</span><span className="font-semibold text-slate-100">{formatPower(avgPvPower)} mW</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-400">Output Power</span><span className="font-semibold text-slate-100">{formatPower(avgPvPower * 0.942)} mW</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-400">Status</span><span className="font-semibold text-cyan-400">● ACTIVE</span></div>
                  </>
                )}
                {hoveredNode === 'storage' && (
                  <>
                    <div className="flex justify-between items-center"><span className="text-slate-400">Stored Energy</span><span className="font-semibold text-slate-100">{formatEnergy(storage.currentStoredWh)} Wh</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-400">State of Charge</span><span className="font-semibold text-slate-100">{formatSoC(storage.stateOfChargePct)}%</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-400">Capacity</span><span className="font-semibold text-slate-100">{storage.capacityWh} Wh</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-400">Status</span><span className="font-semibold text-emerald-400">● {balanceWh >= 0 ? 'CHARGING' : 'DISCHARGING'}</span></div>
                  </>
                )}
                {hoveredNode === 'esp32' && (
                  <>
                    <div className="flex justify-between items-center"><span className="text-slate-400">Node</span><span className="font-semibold text-slate-100">VNODE-001</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-400">Telemetry</span><span className="font-semibold text-emerald-400">ACTIVE</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-400">Connection</span><span className="font-semibold text-slate-100">ONLINE (Wi-Fi/BLE)</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-400">Sampling</span><span className="font-semibold text-slate-100">1 Hz Live</span></div>
                  </>
                )}
                {hoveredNode === 'iot' && (
                  <>
                    <div className="flex justify-between items-center"><span className="text-slate-400">Active Devices</span><span className="font-semibold text-slate-100">{activeDevCount} / {devices.length}</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-400">Total Devices</span><span className="font-semibold text-slate-100">{devices.length} Nodes</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-400">Consumption</span><span className="font-semibold text-slate-100">{formatEnergy(consumedWh)} Wh</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-400">Status</span><span className="font-semibold text-amber-400">● MONITORING</span></div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DETAILED DIGITAL TWIN INSPECTION OVERLAY MODAL */}
        <AnimatePresence>
          {inspectedNode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-4 sm:inset-6 bg-navy-950/95 backdrop-blur-xl border border-emerald-500/40 rounded-2xl p-5 sm:p-6 flex flex-col justify-between z-40 font-mono shadow-2xl overflow-y-auto"
            >
              {/* Inspection Header */}
              <div className="flex items-start justify-between border-b border-navy-850 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase">
                      {nodeDetails[inspectedNode].detailBadge}
                    </span>
                    <h4 className="text-lg font-bold text-slate-100">{nodeDetails[inspectedNode].title}</h4>
                  </div>
                  <p className="text-xs text-slate-400">{nodeDetails[inspectedNode].subtitle}</p>
                </div>

                <button
                  onClick={() => setInspectedNode(null)}
                  className="p-1.5 rounded-xl bg-navy-900 border border-navy-800 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
                  title="Close Inspection Panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Physical Connected Energy Path */}
              <div className="py-3">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
                  PHYSICAL HARVESTING &amp; SIGNAL PATHWAY
                </span>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {nodeDetails[inspectedNode].connectedPath.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <span className="px-2.5 py-1 rounded-lg bg-navy-900 border border-navy-800 text-emerald-400 font-bold">
                        {step}
                      </span>
                      {idx < nodeDetails[inspectedNode].connectedPath.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* 4 Detailed Hardware Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
                {nodeDetails[inspectedNode].metrics.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-navy-900 border border-navy-850 space-y-1">
                    <span className="text-[9px] text-slate-400 block uppercase font-bold">{m.label}</span>
                    <strong className="text-slate-100 text-sm block">{m.value}</strong>
                  </div>
                ))}
              </div>

              {/* Inspection Footer */}
              <div className="pt-3 border-t border-navy-850 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Telemetry verified via live simulation &amp; Python hardware node
                </span>
                <button
                  onClick={() => setInspectedNode(null)}
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 text-navy-950 font-bold hover:bg-emerald-400 transition-colors cursor-pointer"
                >
                  Close Inspection
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Hint Overlay */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none text-[10px] font-mono text-slate-400 bg-navy-950/80 px-3.5 py-1 rounded-full border border-navy-800 flex items-center gap-1.5 z-10">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>Move cursor to inspect 3D components &bull; Drag to rotate 360° &bull; Click to lock inspection</span>
        </div>

        {/* Reset View Button */}
        <button
          onClick={resetOrientation}
          className="absolute top-3 right-3 p-2 rounded-xl bg-navy-950/80 border border-navy-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer z-10"
          title="Reset 3D Orientation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* HARDWARE TELEMETRY METRIC GRID FOOTER */}
      <div className="p-5 bg-navy-950 border-t border-navy-850 space-y-4 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-navy-850 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 uppercase">
                {nodeDetails[activeNode].detailBadge}
              </span>
              <span className="font-bold text-slate-100 text-sm">{nodeDetails[activeNode].title}</span>
            </div>
            <p className="text-[11px] text-slate-400">{nodeDetails[activeNode].subtitle}</p>
          </div>

          <div className="sm:text-right space-y-0.5">
            <div className="text-emerald-400 font-bold">{nodeDetails[activeNode].statusText}</div>
            <div className="text-[10px] text-slate-400">{nodeDetails[activeNode].specText}</div>
          </div>
        </div>

        {/* 4 Live Hardware Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {nodeDetails[activeNode].metrics.map((m, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-navy-900/60 border border-navy-850 space-y-0.5">
              <span className="text-[9px] text-slate-400 block uppercase">{m.label}</span>
              <strong className="text-slate-100 text-xs block">{m.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
