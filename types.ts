export interface FuelEntry {
  id: string;
  vehicleId: string; // Link to specific vehicle
  date: string;
  time: string;
  location: string;
  amount: number;
  volume: number; // Litres
  pricePerUnit?: number; // Prix au litre
  currency: string;
  type: 'manual' | 'scan';
  odometer: number; // Compteur Km (Maintenant obligatoire pour des stats précises)
  isFullTank: boolean; // Crucial pour le calcul de consommation exact
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  city?: string;
  supplier?: string;
}

export interface MaintenanceEntry {
  id: string;
  vehicleId: string; // Link to specific vehicle
  type: 'oil_change' | 'tires' | 'insurance' | 'technical_visit' | 'repair' | 'vignette';
  date: string;
  odometer?: number;
  cost: number;
  note?: string;
  nextDueOdometer?: number; // Pour vidange/pneus
  nextDueDate?: string; // Pour assurance
}

export interface VehicleSpecs {
  engine?: string; // ex: 1.4L 16V
  power?: string; // ex: 98 ch
  transmission?: string; // ex: Manuelle 5 vitesses
  fuelTank?: string; // ex: 50 L
  tires?: string; // ex: 175/65 R14
  oilType?: string; // ex: 5W40
  battery?: string; // ex: 12V 50Ah
  dimensions?: string; // L x l x h
  weight?: string;
  topSpeed?: string;
  acceleration?: string; // 0-100
  consumption?: string; // Mixte constructeur
  torque?: string; // Couple
}

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  year: number;
  fuelType: string;
  plate?: string;
  image?: string;
  tankCapacity: number; // Pour estimer l'autonomie
  
  // Document Expirations
  insuranceExpiry?: string;
  techVisitExpiry?: string;
  vignetteExpiry?: string;
  oilChangeInterval?: number; // ex: 10000 km
  
  // Tech Specs AI Generated
  specs?: VehicleSpecs;
}

export interface ReceiptData {
  date?: string;
  time?: string;
  location?: string;
  amount?: number;
  volume?: number;
  pricePerUnit?: number;
  currency?: string;
  odometer?: number;
  isFullTank?: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  city?: string;
  supplier?: string;
}

export interface TripPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
  speed?: number; // m/s
}

export interface Trip {
  id: string;
  vehicleId: string;
  startTime: string; // ISO String
  endTime?: string; // ISO String
  distance: number; // km
  path: TripPoint[];
  startLocation?: string;
  endLocation?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
}

export enum TabView {
  HOME = 'HOME',
  STATS = 'STATS',
  MAP = 'MAP',
  GARAGE = 'GARAGE',
  ADD = 'ADD'
}