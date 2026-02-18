import React from 'react';
import { FuelEntry } from '../types';
import { MapPin, Calendar, Fuel } from 'lucide-react';

interface EntryListProps {
  entries: FuelEntry[];
  onEntryClick?: (entry: FuelEntry) => void;
}

const EntryList: React.FC<EntryListProps> = ({ entries, onEntryClick }) => {
  // Empty State
  if (entries.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-40 bg-[#1e293b] rounded-2xl border border-gray-800 border-dashed">
            <Fuel size={32} className="text-gray-600 mb-2" />
            <p className="text-gray-400 text-sm">Aucun plein enregistré</p>
            <p className="text-gray-600 text-xs">Ajoutez votre premier plein!</p>
        </div>
      );
  }

  return (
    <div className="space-y-3 pb-4">
      {entries.map((entry) => (
          <div 
            key={entry.id} 
            onClick={() => onEntryClick && onEntryClick(entry)}
            className="bg-[#1e293b] p-4 rounded-xl border border-gray-800 flex items-center justify-between cursor-pointer hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                 <Fuel size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{entry.location}</h4>
                <div className="flex items-center text-xs text-gray-500 mt-0.5 space-x-2">
                  <span className="flex items-center">{new Date(entry.date).toLocaleDateString('fr-FR')}</span>
                  <span>•</span>
                  <span>{entry.odometer.toLocaleString()} km</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-white">{entry.amount.toFixed(0)} MAD</div>
              <div className="text-xs text-gray-500">{entry.volume} L</div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default EntryList;