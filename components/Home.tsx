import React from 'react';
import { FuelEntry, MaintenanceEntry, Vehicle } from '../types';
import { AlertCircle, Wallet, Gauge, Zap, TrendingDown, ChevronRight, Droplet } from 'lucide-react';

interface HomeProps {
  vehicle: Vehicle;
  entries: FuelEntry[];
  maintenance: MaintenanceEntry[];
  onAddClick: () => void;
  onEntrySelect: (id: string) => void;
  onUpdateVehicle: (v: Vehicle) => void;
}

const Home: React.FC<HomeProps> = ({ vehicle, entries, maintenance }) => {
  
  // Calculate Avg Consumption
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  let avgConsumption = "---";
  if (sortedEntries.length >= 2) {
     const validSegments = [];
     for(let i=0; i<sortedEntries.length - 1; i++) {
        if (sortedEntries[i].isFullTank) {
           const dist = sortedEntries[i].odometer - sortedEntries[i+1].odometer;
           const vol = sortedEntries[i].volume;
           if(dist > 0 && vol > 0) validSegments.push({ dist, vol });
        }
     }
     if (validSegments.length > 0) {
       const totalDist = validSegments.reduce((acc, c) => acc + c.dist, 0);
       const totalVol = validSegments.reduce((acc, c) => acc + c.vol, 0);
       avgConsumption = ((totalVol / totalDist) * 100).toFixed(1);
     }
  }

  // Calculate Autonomy
  let estimatedRange = "---";
  if (avgConsumption !== "---" && vehicle.tankCapacity) {
    estimatedRange = Math.round((vehicle.tankCapacity / parseFloat(avgConsumption)) * 100).toLocaleString();
  }

  // Cost Per KM
  const totalFuelCost = entries.reduce((acc, e) => acc + e.amount, 0);
  const totalMaintCost = maintenance.reduce((acc, m) => acc + m.cost, 0);
  const totalDist = sortedEntries.length > 1 ? sortedEntries[0].odometer - sortedEntries[sortedEntries.length-1].odometer : 0;
  const cpk = totalDist > 0 ? ((totalFuelCost + totalMaintCost) / totalDist).toFixed(2) : "0.00";

  // Alerts
  const alerts = [];
  // Documents
  const checkDoc = (dateStr: string | undefined, label: string) => {
    if(!dateStr) return;
    const days = Math.ceil((new Date(dateStr).getTime() - new Date().getTime()) / (86400000));
    if(days < 0) alerts.push({ label: `${label} expirée`, sub: `Votre ${label.toLowerCase()} a expiré il y a ${Math.abs(days)} jours`, type: 'error' });
    else if(days < 30) alerts.push({ label: `${label} expire bientôt`, sub: `${days} jours restants`, type: 'warning' });
  };
  checkDoc(vehicle.insuranceExpiry, 'Assurance');
  checkDoc(vehicle.vignetteExpiry, 'Vignette');
  checkDoc(vehicle.techVisitExpiry, 'Visite Technique');

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Cockpit</h1>
          <p className="text-gray-400 text-sm">Vue d'ensemble de votre véhicule</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
          <Gauge size={20} />
        </div>
      </div>

      {/* Vehicle Card */}
      <div className="bg-[#1e293b] rounded-2xl p-6 border border-gray-800 shadow-sm flex flex-col md:flex-row items-center gap-6">
         <div className="w-32 h-32 bg-gray-900 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-800">
            <img src={vehicle.image} alt="Car" className="w-full h-full object-cover opacity-80" />
         </div>
         <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
               <h2 className="text-xl font-bold text-white">{vehicle.name}</h2>
               <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-700 text-gray-300 uppercase">{vehicle.fuelType}</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">{vehicle.year}</p>
            
            <div className="flex items-center justify-center md:justify-start gap-6 text-sm">
               <div className="flex items-center gap-2 text-gray-300">
                  <Gauge size={16} className="text-gray-500" />
                  <span>{sortedEntries[0]?.odometer.toLocaleString()} km</span>
               </div>
               <div className="flex items-center gap-2 text-gray-300">
                  <Droplet size={16} className="text-gray-500" />
                  <span>{vehicle.tankCapacity} L</span>
               </div>
            </div>

            <div className="mt-4 inline-block px-3 py-1 bg-gray-800 rounded-lg text-xs font-mono text-gray-400 border border-gray-700">
               {vehicle.plate}
            </div>
         </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {/* Consumption */}
         <div className="bg-[#1e293b] p-5 rounded-2xl border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3">
               <Droplet size={18} />
            </div>
            <p className="text-gray-500 text-xs font-medium uppercase mb-1">Consommation</p>
            <div className="flex items-baseline gap-1">
               <span className="text-2xl font-bold text-white">{avgConsumption}</span>
               <span className="text-xs text-gray-400">L/100km</span>
            </div>
         </div>

         {/* Autonomy */}
         <div className="bg-[#1e293b] p-5 rounded-2xl border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
               <Zap size={18} />
            </div>
            <p className="text-gray-500 text-xs font-medium uppercase mb-1">Autonomie</p>
            <div className="flex items-baseline gap-1">
               <span className="text-2xl font-bold text-white">{estimatedRange}</span>
               <span className="text-xs text-gray-400">km</span>
            </div>
         </div>

         {/* Cost/KM */}
         <div className="bg-[#1e293b] p-5 rounded-2xl border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center mb-3">
               <Wallet size={18} />
            </div>
            <p className="text-gray-500 text-xs font-medium uppercase mb-1">Coût/KM</p>
            <div className="flex items-baseline gap-1">
               <span className="text-2xl font-bold text-white">{cpk}</span>
               <span className="text-xs text-gray-400">MAD</span>
            </div>
         </div>

         {/* Total Spent */}
         <div className="bg-[#1e293b] p-5 rounded-2xl border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="flex justify-between items-start mb-3">
               <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
                  <TrendingDown size={18} />
               </div>
               <span className="text-[10px] text-red-500 font-medium">↓ -12%</span>
            </div>
            <p className="text-gray-500 text-xs font-medium uppercase mb-1">Total Carburant</p>
            <div className="flex items-baseline gap-1">
               <span className="text-2xl font-bold text-white">{totalFuelCost.toLocaleString()}</span>
               <span className="text-xs text-gray-400">MAD</span>
            </div>
         </div>
      </div>

      {/* Alerts Section */}
      <div>
         <h3 className="text-gray-400 text-sm font-medium uppercase mb-3">Alertes ({alerts.length})</h3>
         <div className="space-y-3">
            {alerts.length === 0 && <p className="text-gray-600 text-sm">Aucune alerte.</p>}
            {alerts.map((alert, idx) => (
               <div key={idx} className="bg-[#1e293b] rounded-xl p-4 border border-red-900/30 flex items-center justify-between group cursor-pointer hover:bg-red-900/10 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20">
                        <AlertCircle size={20} />
                     </div>
                     <div>
                        <h4 className="text-white font-bold text-sm">{alert.label}</h4>
                        <p className="text-gray-500 text-xs">{alert.sub}</p>
                     </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-600 group-hover:text-white" />
               </div>
            ))}
         </div>
      </div>

      {/* Bottom Monthly Summary */}
      <div className="bg-[#1e293b] rounded-2xl p-5 border border-gray-800">
         <h3 className="text-xs font-bold text-gray-500 uppercase mb-4">Résumé du Mois</h3>
         <div className="grid grid-cols-3 gap-4 text-center">
            <div>
               <div className="text-xl font-bold text-white">{entries.filter(e => new Date(e.date).getMonth() === new Date().getMonth()).length}</div>
               <div className="text-[10px] text-gray-500 uppercase">Pleins</div>
            </div>
            <div className="border-x border-gray-800">
               <div className="text-xl font-bold text-white">{entries.filter(e => new Date(e.date).getMonth() === new Date().getMonth()).reduce((acc,e)=>acc+e.volume,0).toFixed(0)}</div>
               <div className="text-[10px] text-gray-500 uppercase">Litres</div>
            </div>
            <div>
               <div className="text-xl font-bold text-white">{entries.filter(e => new Date(e.date).getMonth() === new Date().getMonth()).reduce((acc,e)=>acc+(e.odometer-40000),0).toLocaleString()}</div>
               <div className="text-[10px] text-gray-500 uppercase">km parcourus</div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default Home;