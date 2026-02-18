import React, { useEffect, useRef } from 'react';
import { FuelEntry, Trip } from '../types';
import { Play, Plus, MapPin, Coffee, ParkingSquare } from 'lucide-react';

interface TripMapProps {
  entries: FuelEntry[];
  selectedEntryId?: string | null;
  trips: Trip[];
  onSaveTrip: (trip: Trip) => void;
  vehicleId: string;
}

const TripMap: React.FC<TripMapProps> = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const defaultCenter: [number, number] = [33.5731, -7.5898]; 
    const defaultZoom = 13;

    // @ts-ignore
    const map = L.map(mapContainerRef.current, { 
        zoomControl: false, 
        attributionControl: false
    }).setView(defaultCenter, defaultZoom);
    
    mapInstanceRef.current = map;

    // OpenStreetMap Standard Tiles
    // @ts-ignore
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    return () => {
        if(mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }
    }
  }, []);

  return (
    <div className="relative h-full w-full bg-gray-900 flex flex-col">
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-[400] p-4 bg-gradient-to-b from-black/80 to-transparent">
         <div className="mb-4">
            <h1 className="text-2xl font-bold text-white">Trajets</h1>
            <p className="text-gray-300 text-sm">Suivi GPS & Historique</p>
         </div>
      </div>

      {/* Map */}
      <div ref={mapContainerRef} className="flex-1 z-0" />

      {/* Floating Bar */}
      <div className="absolute top-24 left-4 right-4 z-[400] flex gap-2 overflow-x-auto no-scrollbar">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] rounded-lg text-white text-xs font-bold border border-gray-700 shadow-lg">
             <MapPin size={14} /> Stations
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] rounded-lg text-white text-xs font-bold border border-gray-700 shadow-lg">
             <Coffee size={14} /> Cafés
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] rounded-lg text-white text-xs font-bold border border-gray-700 shadow-lg">
             <ParkingSquare size={14} /> Parking
          </button>
      </div>

      {/* Driving Mode Card */}
      <div className="absolute bottom-60 left-4 right-4 z-[400]">
         <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-800 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Play size={20} fill="currentColor" />
               </div>
               <div>
                  <h3 className="text-white font-bold text-sm">Mode Conduite</h3>
                  <p className="text-gray-400 text-xs">Démarrer le suivi de trajet</p>
               </div>
            </div>
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">
               Démarrer
            </button>
         </div>
      </div>

      {/* Bottom Sheet Placeholder */}
      <div className="h-48 bg-[#0f172a] border-t border-gray-800 p-6 z-[400]">
          <h3 className="text-gray-400 text-xs font-bold uppercase mb-4">Historique des trajets</h3>
          <div className="w-full h-24 border-2 border-dashed border-gray-800 rounded-xl flex flex-col items-center justify-center text-gray-600">
              <span className="text-2xl mb-1">⚡</span>
              <span className="text-xs">Aucun trajet enregistré</span>
              <span className="text-[10px] text-gray-700">Démarrez votre premier trajet!</span>
          </div>
      </div>
    </div>
  );
};

export default TripMap;