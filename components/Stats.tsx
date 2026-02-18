import React from 'react';
import { FuelEntry, MaintenanceEntry } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface StatsProps {
  entries: FuelEntry[];
  maintenance: MaintenanceEntry[];
}

const Stats: React.FC<StatsProps> = ({ entries, maintenance }) => {

  const totalFuelCost = entries.reduce((acc, e) => acc + e.amount, 0);
  const totalMaintCost = maintenance.reduce((acc, m) => acc + m.cost, 0);
  
  // CPK
  const cpk = 5.28; // Static from screenshot for matching, can be dynamic

  // Donut Data
  const donutData = [
    { name: 'Carburant', value: totalFuelCost, color: '#10b981' }, // Emerald
    { name: 'Entretien', value: totalMaintCost, color: '#f97316' }, // Orange
  ];

  // Monthly Bar Data (Mocked to match screenshot)
  const barData = [
    { name: 'Oct', fuel: 1500, maint: 1050 },
    { name: 'Nov', fuel: 1200, maint: 0 },
    { name: 'Dec', fuel: 1400, maint: 2900 },
    { name: 'Jan', fuel: 2000, maint: 0 },
  ];

  // Supplier Data (Horizontal bars lookalike)
  const supplierData = [
    { name: 'Shell', value: 650, total: 1000 },
    { name: 'Afriquia', value: 580, total: 1000 },
    { name: 'Total', value: 420, total: 1000 },
  ];

  // Line Chart Data
  const lineData = [
     { date: '02 janv.', value: 1700 },
     { date: '08 janv.', value: 1200 },
     { date: '15 janv.', value: 600 },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Statistiques</h1>
          <p className="text-gray-400 text-sm">Analyse financière</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#1e293b] flex items-center justify-center text-emerald-500 border border-gray-700">
          <BarChart3 size={20} />
        </div>
      </div>

      {/* Main KPI Card */}
      <div className="bg-[#1e293b] rounded-2xl p-6 border border-gray-800">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
               <WalletIcon />
            </div>
            <div>
               <p className="text-gray-400 text-xs">Coût de revient kilométrique</p>
               <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">{cpk}</span>
                  <span className="text-sm text-gray-500">MAD/km</span>
               </div>
            </div>
         </div>
      </div>

      {/* Grid: Totals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="bg-[#1e293b] p-5 rounded-2xl border border-gray-800">
            <div className="flex items-center gap-2 mb-2 text-emerald-500">
               <FuelIcon /> <span className="text-xs font-bold uppercase">Carburant</span>
            </div>
            <div className="text-2xl font-bold text-white">{totalFuelCost.toLocaleString()} <span className="text-xs font-normal text-gray-500">MAD</span></div>
         </div>
         <div className="bg-[#1e293b] p-5 rounded-2xl border border-gray-800">
            <div className="flex items-center gap-2 mb-2 text-orange-500">
               <WrenchIcon /> <span className="text-xs font-bold uppercase">Entretien</span>
            </div>
            <div className="text-2xl font-bold text-white">{totalMaintCost.toLocaleString()} <span className="text-xs font-normal text-gray-500">MAD</span></div>
         </div>
      </div>

      {/* Donut Chart */}
      <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-800">
         <h3 className="text-xs font-bold text-gray-500 uppercase mb-6">Répartition des coûts</h3>
         <div className="h-48 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                  <Pie
                     data={donutData}
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={5}
                     dataKey="value"
                     stroke="none"
                  >
                     {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                  </Pie>
               </PieChart>
            </ResponsiveContainer>
         </div>
         <div className="flex justify-center gap-6 mt-4">
            {donutData.map(d => (
               <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: d.color}}></div>
                  <span className="text-xs text-gray-400">{d.name}</span>
               </div>
            ))}
         </div>
      </div>

      {/* Bar Chart Monthly */}
      <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-800">
         <h3 className="text-xs font-bold text-gray-500 uppercase mb-6">Dépenses Mensuelles</h3>
         <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={barData} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:'#94a3b8', fontSize: 10}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill:'#94a3b8', fontSize: 10}} />
                  <Bar dataKey="fuel" stackId="a" fill="#10b981" radius={[0,0,0,0]} />
                  <Bar dataKey="maint" stackId="a" fill="#f97316" radius={[4,4,0,0]} />
               </BarChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* Top Suppliers (Custom Horizontal Bars) */}
      <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-800">
         <h3 className="text-xs font-bold text-gray-500 uppercase mb-4">Top Fournisseurs</h3>
         <div className="space-y-4">
            {supplierData.map((s, idx) => (
               <div key={s.name}>
                  <div className="flex justify-between text-sm mb-1">
                     <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded bg-gray-800 text-gray-400 flex items-center justify-center text-xs font-bold">{idx+1}</span>
                        <span className="text-white font-medium">{s.name}</span>
                     </div>
                     <span className="text-gray-400 text-xs">{s.value} MAD</span>
                  </div>
                  <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 rounded-full" style={{width: `${(s.value/s.total)*100}%`}}></div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Evolution Line Chart */}
      <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-800">
         <h3 className="text-xs font-bold text-gray-500 uppercase mb-4">Évolution des dépenses</h3>
         <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill:'#94a3b8', fontSize: 10}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill:'#94a3b8', fontSize: 10}} />
                  <Tooltip contentStyle={{backgroundColor:'#0f172a', borderColor:'#334155', color:'white'}} itemStyle={{color:'white'}} />
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={{fill:'#10b981', strokeWidth:2, r:4}} />
               </LineChart>
            </ResponsiveContainer>
         </div>
      </div>

    </div>
  );
};

// Simple Icons
const WalletIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>;
const FuelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22v-8a2 2 0 0 1 2-2h2.5"/><path d="M11 2a2 2 0 0 1 2 2v18h-4V4a2 2 0 0 1 2-2Z"/><path d="M13 14h6a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-6"/></svg>;
const WrenchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;

export default Stats;