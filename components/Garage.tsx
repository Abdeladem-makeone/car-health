import React from 'react';
import { Vehicle, MaintenanceEntry, User } from '../types';
import { Plus, Shield, Receipt, FileText, Droplet, ChevronRight, Flame, Disc } from 'lucide-react';

interface GarageProps {
  vehicle: Vehicle;
  maintenance: MaintenanceEntry[];
  currentOdometer: number;
  onAddMaintenance: (entry: Omit<MaintenanceEntry, 'id' | 'vehicleId'>) => void;
  onDeleteMaintenance: (id: string) => void;
  onUpdateVehicle: (vehicle: Vehicle) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  user: User;
  onLogout: () => void;
}

const Garage: React.FC<GarageProps> = ({ vehicle, maintenance }) => {
  
  // Doc Status
  const getDocStatus = (dateStr: string | undefined) => {
    if(!dateStr) return { status: 'unknown', days: 0 };
    const days = Math.ceil((new Date(dateStr).getTime() - new Date().getTime()) / 86400000);
    if(days < 0) return { status: 'expired', days: Math.abs(days) };
    return { status: 'valid', days };
  };

  const assurance = getDocStatus(vehicle.insuranceExpiry);
  const vignette = getDocStatus(vehicle.vignetteExpiry);
  const visite = getDocStatus(vehicle.techVisitExpiry);

  const DocCard = ({ icon: Icon, label, date, statusInfo, cost }: { icon: any, label: string, date: string, statusInfo: any, cost: number }) => (
    <div className={`bg-[#1e293b] p-4 rounded-xl border flex items-center justify-between group cursor-pointer transition-all ${statusInfo.status === 'expired' ? 'border-red-900/50 bg-red-900/5' : 'border-gray-800 hover:border-gray-700'}`}>
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${statusInfo.status === 'expired' ? 'bg-red-500/10 text-red-500' : 'bg-gray-800 text-gray-400'}`}>
                <Icon size={20} />
            </div>
            <div>
                <h4 className="text-white font-bold text-sm">{label}</h4>
                <p className="text-gray-500 text-xs flex items-center gap-2">
                    <span className="opacity-70">Expire le {new Date(date).toLocaleDateString()}</span>
                </p>
            </div>
        </div>
        <div className="text-right">
            {statusInfo.status === 'expired' ? (
                <span className="text-xs font-bold text-red-500 block">Expiré</span>
            ) : (
                <span className="text-xs font-bold text-emerald-500 block">Valide</span>
            )}
            <span className="text-[10px] text-gray-500">{cost} MAD</span>
        </div>
        <ChevronRight size={16} className="text-gray-600" />
    </div>
  );

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto pb-24">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Garage</h1>
          <p className="text-gray-400 text-sm">Documents & Entretiens</p>
        </div>
        <button className="w-10 h-10 rounded-full bg-[#1e293b] flex items-center justify-center text-white border border-gray-700 hover:bg-gray-800">
          <Plus size={20} />
        </button>
      </div>

      <div>
          <h3 className="text-gray-400 text-xs font-bold uppercase mb-4">Documents</h3>
          <div className="space-y-3">
              <DocCard icon={Shield} label="Assurance" date={vehicle.insuranceExpiry || ''} statusInfo={assurance} cost={4500} />
              <DocCard icon={Receipt} label="Vignette" date={vehicle.vignetteExpiry || ''} statusInfo={vignette} cost={650} />
              <DocCard icon={FileText} label="Visite Technique" date={vehicle.techVisitExpiry || ''} statusInfo={visite} cost={300} />
          </div>
      </div>

      {/* Oil Change Progress */}
      <div className="bg-[#1e293b] p-5 rounded-xl border border-gray-800">
         <div className="flex items-center gap-3 mb-4">
             <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                 <Droplet size={18} />
             </div>
             <div>
                 <h4 className="text-white font-bold text-sm">Vidange huile moteur</h4>
                 <p className="text-gray-500 text-xs">Dans 7,770 km</p>
             </div>
         </div>
         
         <div className="w-full bg-gray-900 rounded-full h-2 mb-2">
             <div className="bg-emerald-500 h-2 rounded-full" style={{width: '48%'}}></div>
         </div>
         <div className="flex justify-between text-[10px] text-gray-500">
             <span>Progression</span>
             <span>48%</span>
         </div>
         <div className="flex justify-between text-[10px] text-gray-600 mt-1">
             <span>38,000 km</span>
             <span>53,000 km</span>
         </div>
      </div>

      {/* History */}
      <div>
         <h3 className="text-gray-400 text-xs font-bold uppercase mb-4">Historique Entretiens</h3>
         <div className="space-y-3">
             <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-800 flex justify-between items-center group cursor-pointer hover:border-gray-700">
                 <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
                         <Flame size={20} />
                     </div>
                     <div>
                         <h4 className="text-white font-bold text-sm">Vidange</h4>
                         <p className="text-gray-500 text-xs">Vidange huile moteur + filtre</p>
                         <p className="text-gray-600 text-[10px] mt-0.5">20/11/2023 • 38,000 km</p>
                     </div>
                 </div>
                 <div className="flex items-center gap-4">
                     <span className="text-sm font-bold text-white">850 MAD</span>
                     <ChevronRight size={16} className="text-gray-600" />
                 </div>
             </div>

             <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-800 flex justify-between items-center group cursor-pointer hover:border-gray-700">
                 <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-lg bg-gray-800 text-gray-400 flex items-center justify-center">
                         <Disc size={20} />
                     </div>
                     <div>
                         <h4 className="text-white font-bold text-sm">Pneus</h4>
                         <p className="text-gray-500 text-xs">Pneus avant Michelin Primacy 4</p>
                         <p className="text-gray-600 text-[10px] mt-0.5">15/09/2023 • 35,000 km</p>
                     </div>
                 </div>
                 <div className="flex items-center gap-4">
                     <span className="text-sm font-bold text-white">3200 MAD</span>
                     <ChevronRight size={16} className="text-gray-600" />
                 </div>
             </div>
         </div>
      </div>

    </div>
  );
};

export default Garage;