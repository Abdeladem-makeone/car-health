import React from 'react';
import { LayoutDashboard, BarChart3, Map, Car, Settings, Fuel } from 'lucide-react';
import { TabView } from '../types';

interface NavBarProps {
  activeTab: TabView;
  onTabChange: (tab: TabView) => void;
  mode?: 'bottom' | 'sidebar';
}

const NavBar: React.FC<NavBarProps> = ({ activeTab, onTabChange, mode = 'bottom' }) => {
  
  const NavItem = ({ tab, icon: Icon, label, customClick }: { tab?: TabView, icon: any, label: string, customClick?: () => void }) => {
    const isActive = tab ? activeTab === tab : false;
    const onClick = customClick || (() => tab && onTabChange(tab));
    
    // Sidebar Style (Desktop)
    if (mode === 'sidebar') {
      return (
        <button 
          onClick={onClick} 
          className={`
            w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 mb-1 group
            ${isActive 
              ? 'bg-emerald-500/10 text-emerald-500 border-l-4 border-emerald-500' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }
          `}
        >
          <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-emerald-500' : 'group-hover:text-white'} />
          <span className={`font-medium text-sm ${isActive ? 'font-semibold' : ''}`}>{label}</span>
        </button>
      );
    }

    // Mobile Bottom Style
    return (
      <button 
        onClick={onClick} 
        className={`
          flex-1 flex flex-col items-center justify-center py-3
          ${isActive ? 'text-emerald-500' : 'text-gray-500'}
        `}
      >
        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
        <span className="text-[10px] mt-1 font-medium">{label}</span>
      </button>
    );
  };

  if (mode === 'sidebar') {
    return (
      <div className="h-full flex flex-col p-4">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-10 px-2 mt-2">
           <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Car size={18} className="text-white" />
           </div>
           <div>
             <h1 className="font-bold text-white text-lg leading-tight">GazoilTrack</h1>
             <p className="text-xs text-gray-500">Assistant Auto</p>
           </div>
        </div>

        {/* Menu */}
        <div className="flex-1 space-y-1">
           <NavItem tab={TabView.HOME} icon={LayoutDashboard} label="Cockpit" />
           <NavItem tab={'CARBURANT' as any} icon={Fuel} label="Carburant" />
           <NavItem tab={TabView.GARAGE} icon={Car} label="Garage" />
           <NavItem tab={TabView.MAP} icon={Map} label="Trajets" />
           <NavItem tab={TabView.STATS} icon={BarChart3} label="Statistiques" />
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-800">
           <NavItem icon={Settings} label="Paramètres" customClick={() => {}} />
        </div>
      </div>
    );
  }

  // Mobile Bottom Bar
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0f172a] border-t border-gray-800 flex justify-around items-center z-50 pb-safe">
      <NavItem tab={TabView.HOME} icon={LayoutDashboard} label="Cockpit" />
      <NavItem tab={'CARBURANT' as any} icon={Fuel} label="Carburant" />
      <NavItem tab={TabView.GARAGE} icon={Car} label="Garage" />
      <NavItem tab={TabView.MAP} icon={Map} label="Trajets" />
      <NavItem tab={TabView.STATS} icon={BarChart3} label="Stats" />
    </div>
  );
};

export default NavBar;