import React, { useState } from 'react';
import { FuelEntry } from '../types';
import { X, MapPin, Check } from 'lucide-react';

interface AddEntryProps {
  onSave: (entry: Omit<FuelEntry, 'id' | 'vehicleId'>) => void;
  onCancel: () => void;
  lastOdometer?: number;
}

const AddEntry: React.FC<AddEntryProps> = ({ onSave, onCancel, lastOdometer }) => {
  const [formData, setFormData] = useState({
    amount: '',
    volume: '',
    price: '',
    odometer: lastOdometer ? (lastOdometer + 500).toString() : '',
    station: '',
    isFull: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      location: formData.station || 'Station Inconnue',
      amount: Number(formData.amount),
      volume: Number(formData.volume),
      pricePerUnit: Number(formData.price),
      currency: 'MAD',
      type: 'manual',
      odometer: Number(formData.odometer),
      isFullTank: formData.isFull,
      city: 'Casablanca'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
       <div className="bg-[#0f172a] w-full max-w-md rounded-2xl border border-gray-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          
          <div className="flex justify-between items-center p-4 border-b border-gray-800">
             <h2 className="text-lg font-bold text-white">Ajouter un plein</h2>
             <button onClick={onCancel} className="text-gray-400 hover:text-white"><X size={20} /></button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
             
             {/* Station Selector Mock */}
             <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400">Station</label>
                <div className="relative">
                   <select 
                     className="w-full bg-[#1e293b] text-white border border-gray-700 rounded-lg p-3 text-sm appearance-none focus:border-emerald-500 focus:outline-none"
                     onChange={(e) => setFormData({...formData, station: e.target.value})}
                   >
                      <option>Sélectionner une station</option>
                      <option>Afriquia</option>
                      <option>Shell</option>
                      <option>Total</option>
                   </select>
                   <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">▼</div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-xs font-medium text-gray-400">Montant (MAD)</label>
                   <input 
                      type="number" 
                      placeholder="0.00" 
                      className="w-full bg-[#1e293b] text-white border border-gray-700 rounded-lg p-3 text-sm focus:border-emerald-500 focus:outline-none"
                      value={formData.amount}
                      onChange={e => setFormData({...formData, amount: e.target.value})}
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-medium text-gray-400">Litres</label>
                   <input 
                      type="number" 
                      placeholder="0.00" 
                      className="w-full bg-[#1e293b] text-white border border-gray-700 rounded-lg p-3 text-sm focus:border-emerald-500 focus:outline-none"
                      value={formData.volume}
                      onChange={e => setFormData({...formData, volume: e.target.value})}
                   />
                </div>
             </div>

             <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400">Prix unitaire (MAD/L)</label>
                <input 
                   type="number" 
                   placeholder="14.29" 
                   className="w-full bg-[#1e293b] text-white border border-gray-700 rounded-lg p-3 text-sm focus:border-emerald-500 focus:outline-none"
                   value={formData.price}
                   onChange={e => setFormData({...formData, price: e.target.value})}
                />
             </div>

             <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400">Kilométrage</label>
                <input 
                   type="number" 
                   placeholder={lastOdometer?.toString()} 
                   className="w-full bg-[#1e293b] text-white border border-gray-700 rounded-lg p-3 text-sm focus:border-emerald-500 focus:outline-none"
                   value={formData.odometer}
                   onChange={e => setFormData({...formData, odometer: e.target.value})}
                />
             </div>

             <div className="bg-[#1e293b] p-3 rounded-lg flex items-center justify-between border border-gray-800">
                <div className="flex items-center gap-3">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formData.isFull ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
                      <Check size={16} />
                   </div>
                   <div>
                      <p className="text-sm font-bold text-white">Plein complet</p>
                      <p className="text-[10px] text-gray-500">Pour calcul de consommation</p>
                   </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, isFull: !formData.isFull})}
                  className={`w-10 h-5 rounded-full relative transition-colors ${formData.isFull ? 'bg-emerald-500' : 'bg-gray-600'}`}
                >
                   <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.isFull ? 'left-6' : 'left-1'}`}></div>
                </button>
             </div>

             <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400">Ville</label>
                <div className="relative">
                   <input 
                     type="text"
                     value="Casablanca"
                     readOnly
                     className="w-full bg-[#1e293b] text-white border border-gray-700 rounded-lg p-3 text-sm pl-9"
                   />
                   <MapPin size={16} className="absolute left-3 top-3.5 text-gray-500" />
                </div>
             </div>

             <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg shadow-lg shadow-emerald-500/20 mt-2">
                Enregistrer le plein
             </button>
          </form>
       </div>
    </div>
  );
};

export default AddEntry;