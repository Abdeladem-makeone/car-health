import React, { useEffect, useState } from 'react';
import { Vehicle, VehicleSpecs } from '../types';
import { fetchVehicleSpecs } from '../services/geminiService';
import { X, Cpu, Zap, Move, Droplet, Disc, Battery, Ruler, Gauge, Timer, Scale } from 'lucide-react';

interface VehicleDetailModalProps {
  vehicle: Vehicle;
  onClose: () => void;
  onUpdateVehicle: (v: Vehicle) => void;
}

const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({ vehicle, onClose, onUpdateVehicle }) => {
  const [loading, setLoading] = useState(false);
  const [specs, setSpecs] = useState<VehicleSpecs | undefined>(vehicle.specs);

  useEffect(() => {
    // Si pas de specs, on appelle l'IA
    if (!specs) {
      const loadSpecs = async () => {
        setLoading(true);
        try {
          const data = await fetchVehicleSpecs(vehicle.model, vehicle.year, vehicle.fuelType);
          setSpecs(data);
          // Sauvegarder dans le véhicule
          onUpdateVehicle({ ...vehicle, specs: data });
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      loadSpecs();
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg h-[90vh] sm:max-h-[85vh] sm:rounded-2xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
        
        {/* Header Image */}
        <div className="relative h-48 bg-gray-200 dark:bg-gray-800 shrink-0">
          <img src={vehicle.image} alt={vehicle.model} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
            <div>
              <h2 className="text-2xl font-bold text-white leading-none">{vehicle.model}</h2>
              <p className="text-gray-300 text-sm mt-1">{vehicle.fuelType} • {vehicle.year}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 relative pb-24">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full py-10 space-y-4">
               <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-gray-500 dark:text-gray-400 text-sm animate-pulse">Génération de la fiche technique par IA...</p>
            </div>
          ) : specs ? (
            <div className="space-y-6">
               <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800/50">
                  <Zap size={20} />
                  <span className="font-bold text-sm">Fiche Technique Complète</span>
               </div>

               {/* Engine Section */}
               <div>
                  <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                    <Cpu size={14} className="mr-1" /> Moteur & Transmission
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                     <SpecCard label="Moteur" value={specs.engine} />
                     <SpecCard label="Puissance" value={specs.power} />
                     <SpecCard label="Couple" value={specs.torque} />
                     <SpecCard label="Boîte" value={specs.transmission} />
                  </div>
               </div>

               {/* Performance Section */}
               <div>
                  <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                    <Gauge size={14} className="mr-1" /> Performance
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                     <SpecCard label="Vitesse Max" value={specs.topSpeed ? `${specs.topSpeed} km/h` : '-'} />
                     <SpecCard label="0-100 km/h" value={specs.acceleration ? `${specs.acceleration} s` : '-'} />
                     <SpecCard label="Conso Mixte" value={specs.consumption ? `${specs.consumption}` : '-'} />
                  </div>
               </div>

               {/* Maintenance Section */}
               <div>
                  <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                    <Droplet size={14} className="mr-1" /> Entretien & Fluides
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                     <SpecCard label="Réservoir" value={specs.fuelTank} />
                     <SpecCard label="Huile" value={specs.oilType} icon={<Droplet size={14} className="text-amber-500"/>} />
                     <SpecCard label="Pneus" value={specs.tires} icon={<Disc size={14} className="text-gray-500"/>} />
                     <SpecCard label="Batterie" value={specs.battery} icon={<Battery size={14} className="text-green-500"/>} />
                  </div>
               </div>

                {/* Dimensions Section */}
               <div>
                  <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                    <Ruler size={14} className="mr-1" /> Dimensions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                     <SpecCard label="Dimensions" value={specs.dimensions} className="col-span-2" />
                     <SpecCard label="Poids" value={specs.weight ? `${specs.weight} kg` : '-'} icon={<Scale size={14} />} />
                  </div>
               </div>
               
               <p className="text-[10px] text-gray-400 text-center italic mt-4">Données générées par IA à titre indicatif.</p>
            </div>
          ) : (
             <div className="text-center text-gray-500">Impossible de charger les données.</div>
          )}
        </div>
      </div>
    </div>
  );
};

const SpecCard = ({ label, value, icon, className }: { label: string, value?: string, icon?: React.ReactNode, className?: string }) => (
  <div className={`bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 ${className}`}>
    <div className="flex items-center justify-between mb-1">
      <span className="text-[10px] text-gray-400 uppercase font-medium">{label}</span>
      {icon}
    </div>
    <div className="font-bold text-gray-900 dark:text-gray-200 text-sm truncate" title={value}>{value || '--'}</div>
  </div>
);

export default VehicleDetailModal;