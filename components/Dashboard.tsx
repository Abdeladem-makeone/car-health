import React from 'react';
import { FuelEntry, Trip } from '../types';
import EntryList from './EntryList';
import { Camera, Plus } from 'lucide-react';

interface DashboardProps {
  entries: FuelEntry[];
  trips: Trip[];
  onAddClick: () => void;
  onEntrySelect: (id: string) => void;
  onSaveTrip: (trip: Trip) => void;
  vehicleId: string;
}

const Dashboard: React.FC<DashboardProps> = ({ entries, onAddClick, onEntrySelect }) => {
  // Stats
  const totalSpent = entries.reduce((acc, curr) => acc + curr.amount, 0);
  const totalLitres = entries.reduce((acc, curr) => acc + curr.volume, 0);
  const count = entries.length;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Carburant</h1>
          <p className="text-gray-400 text-sm">Historique des pleins</p>
        </div>
        <button onClick={onAddClick} className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-colors">
          <Plus size={24} />
        </button>
      </div>

      {/* Scanner Banner */}
      <div 
        onClick={onAddClick}
        className="bg-[#1e293b] border border-gray-800 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-emerald-500/50 transition-all group"
      >
         <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <Camera size={24} />
             </div>
             <div>
                <h3 className="text-white font-bold">Scanner IA</h3>
                <p className="text-gray-400 text-xs">Photographiez votre reçu</p>
             </div>
         </div>
         <button className="px-4 py-2 bg-gray-800 rounded-lg text-xs font-bold text-gray-300 border border-gray-700 group-hover:text-white">Scanner</button>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-3 gap-4">
         <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-800 text-center">
             <div className="text-emerald-500 text-xl font-bold">{count}</div>
             <div className="text-[10px] text-gray-500 uppercase">Pleins</div>
         </div>
         <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-800 text-center">
             <div className="text-white text-xl font-bold">{totalLitres.toFixed(0)}</div>
             <div className="text-[10px] text-gray-500 uppercase">Litres</div>
         </div>
         <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-800 text-center">
             <div className="text-white text-xl font-bold">{totalSpent.toFixed(0)}</div>
             <div className="text-[10px] text-gray-500 uppercase">MAD</div>
         </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-hidden flex flex-col">
         <h3 className="text-gray-400 text-xs font-bold uppercase mb-4 mt-2">Historique</h3>
         <div className="flex-1 overflow-y-auto no-scrollbar">
            <EntryList entries={entries} onEntryClick={(entry) => onEntrySelect(entry.id)} />
         </div>
      </div>
    </div>
  );
};

export default Dashboard;