import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import Stats from './components/Stats';
import Garage from './components/Garage';
import TripMap from './components/TripMap';
import AddEntry from './components/AddEntry';
import NavBar from './components/NavBar';
import Login from './components/Login';
import Dashboard from './components/Dashboard'; // Using Dashboard as Carburant view
import { FuelEntry, MaintenanceEntry, Vehicle, TabView, User, Trip } from './types';

// Mock Data Initial - Single Vehicle
const INITIAL_VEHICLE: Vehicle = {
  id: 'v1',
  name: 'Peugeot 3008 GT',
  model: '3008 GT Line',
  year: 2022,
  fuelType: 'Diesel',
  plate: '12345-A-67',
  image: 'https://images.caradisiac.com/logos-ref/modele/modele--peugeot-3008-2/S7-modele--peugeot-3008-2.jpg',
  tankCapacity: 53,
  oilChangeInterval: 15000,
  insuranceExpiry: '2023-12-15', 
  vignetteExpiry: '2023-01-31',
  techVisitExpiry: '2024-06-20'
};

const INITIAL_ENTRIES: FuelEntry[] = [
  { 
    id: '1', 
    vehicleId: 'v1',
    date: '2023-10-15', 
    time: '08:30', 
    location: 'Afriquia Rabat', 
    amount: 350, 
    volume: 28.5, 
    pricePerUnit: 12.28,
    currency: 'MAD', 
    type: 'manual', 
    odometer: 44200,
    isFullTank: true,
    coordinates: { latitude: 34.0209, longitude: -6.8416 },
    supplier: 'Afriquia'
  },
  { 
    id: '2', 
    vehicleId: 'v1',
    date: '2023-10-25', 
    time: '18:15', 
    location: 'Shell Casablanca', 
    amount: 650, 
    volume: 52.2, 
    pricePerUnit: 12.45,
    currency: 'MAD', 
    type: 'scan', 
    odometer: 45050,
    isFullTank: true,
    coordinates: { latitude: 33.5731, longitude: -7.5898 },
    supplier: 'Shell'
  },
  { 
    id: '3', 
    vehicleId: 'v1',
    date: '2023-11-12', 
    time: '10:00', 
    location: 'Total Marrakech', 
    amount: 420, 
    volume: 33.0, 
    pricePerUnit: 12.72,
    currency: 'MAD', 
    type: 'scan', 
    odometer: 45600,
    isFullTank: true, 
    coordinates: { latitude: 31.6295, longitude: -7.9811 },
    supplier: 'Total'
  },
];

const INITIAL_MAINTENANCE: MaintenanceEntry[] = [
  {
    id: 'm1',
    vehicleId: 'v1',
    type: 'oil_change',
    date: '2023-09-01',
    odometer: 38000,
    cost: 850,
    note: 'Vidange huile moteur + filtre',
    nextDueOdometer: 53000
  },
  {
    id: 'm2',
    vehicleId: 'v1',
    type: 'tires',
    date: '2023-09-15',
    odometer: 35000,
    cost: 3200,
    note: 'Pneus avant Michelin Primacy 4',
  },
  {
    id: 'm3',
    vehicleId: 'v1',
    type: 'insurance',
    date: '2023-03-15',
    cost: 4500,
    note: 'Wafa Assurance',
    nextDueDate: '2024-03-15'
  },
  {
    id: 'm4',
    vehicleId: 'v1',
    type: 'vignette',
    date: '2023-01-31',
    cost: 650,
    note: 'Taxe annuelle',
    nextDueDate: '2024-01-31'
  }
];

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('gt_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [activeTab, setActiveTab] = useState<TabView>(TabView.HOME);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  
  // Always dark mode for this UI design
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Single Vehicle State
  const [vehicle, setVehicle] = useState<Vehicle>(() => {
    const saved = localStorage.getItem('gt_vehicle_single');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLE;
  });

  const [fuelEntries, setFuelEntries] = useState<FuelEntry[]>(() => {
    const saved = localStorage.getItem('gt_fuel');
    return saved ? JSON.parse(saved) : INITIAL_ENTRIES;
  });

  const [maintenanceEntries, setMaintenanceEntries] = useState<MaintenanceEntry[]>(() => {
    const saved = localStorage.getItem('gt_maintenance');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE;
  });

  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('gt_trips');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence
  useEffect(() => { 
    if (user) {
      localStorage.setItem('gt_vehicle_single', JSON.stringify(vehicle)); 
      localStorage.setItem('gt_fuel', JSON.stringify(fuelEntries)); 
      localStorage.setItem('gt_maintenance', JSON.stringify(maintenanceEntries));
      localStorage.setItem('gt_trips', JSON.stringify(trips));
    }
  }, [vehicle, fuelEntries, maintenanceEntries, trips, user]);

  const handleLogin = () => {
    const mockUser: User = {
      id: 'google_123',
      name: 'Abdeladem',
      email: 'user@example.com',
      photoUrl: 'https://lh3.googleusercontent.com/a/ACg8ocL-w1' 
    };
    setUser(mockUser);
    localStorage.setItem('gt_user', JSON.stringify(mockUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('gt_user');
  };

  // Actions
  const handleSaveFuel = (newEntry: Omit<FuelEntry, 'id' | 'vehicleId'>) => {
    const entry: FuelEntry = { 
      ...newEntry, 
      id: Date.now().toString(),
      vehicleId: vehicle.id 
    };
    setFuelEntries(prev => [entry, ...prev]);
    setActiveTab(TabView.HOME); // Return to Cockpit or Carburant
  };

  const handleSaveMaintenance = (newMaint: Omit<MaintenanceEntry, 'id' | 'vehicleId'>) => {
    const entry: MaintenanceEntry = { 
      ...newMaint, 
      id: Date.now().toString(),
      vehicleId: vehicle.id 
    };
    setMaintenanceEntries(prev => [entry, ...prev]);
  };

  const handleDeleteMaintenance = (id: string) => {
    setMaintenanceEntries(prev => prev.filter(m => m.id !== id));
  };

  const handleSaveTrip = (trip: Trip) => {
    setTrips(prev => [trip, ...prev]);
  };

  const handleEntrySelect = (id: string) => {
    setSelectedEntryId(id);
    setActiveTab(TabView.MAP);
  };

  const updateVehicle = (updated: Vehicle) => {
    setVehicle(updated);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case TabView.HOME: // COCKPIT
        return (
           <Home 
              vehicle={vehicle} 
              entries={fuelEntries} 
              maintenance={maintenanceEntries} 
              onAddClick={() => setActiveTab(TabView.ADD)} 
              onEntrySelect={handleEntrySelect} 
              onUpdateVehicle={updateVehicle}
           />
        );
      case 'CARBURANT' as any: // Use Dashboard component for Carburant Tab
        return (
          <Dashboard 
             entries={fuelEntries} 
             trips={trips}
             onAddClick={() => setActiveTab(TabView.ADD)}
             onEntrySelect={handleEntrySelect}
             onSaveTrip={handleSaveTrip}
             vehicleId={vehicle.id}
          />
        );
      case TabView.STATS:
        return <Stats entries={fuelEntries} maintenance={maintenanceEntries} />;
      case TabView.MAP:
        return (
          <div className="h-full w-full relative">
            <TripMap 
              entries={fuelEntries} 
              selectedEntryId={selectedEntryId} 
              trips={trips}
              onSaveTrip={handleSaveTrip}
              vehicleId={vehicle.id}
            />
          </div>
        );
      case TabView.GARAGE:
        return (
          <Garage 
            vehicle={vehicle} 
            maintenance={maintenanceEntries} 
            currentOdometer={fuelEntries[0]?.odometer || 0} 
            onAddMaintenance={handleSaveMaintenance} 
            onDeleteMaintenance={handleDeleteMaintenance}
            onUpdateVehicle={updateVehicle}
            isDarkMode={true}
            toggleDarkMode={() => {}}
            user={user}
            onLogout={handleLogout}
          />
        );
      case TabView.ADD:
        return (
          <AddEntry 
            onSave={handleSaveFuel} 
            onCancel={() => setActiveTab('CARBURANT' as any)} 
            lastOdometer={fuelEntries[0]?.odometer} 
          />
        );
      default:
        return <Home vehicle={vehicle} entries={fuelEntries} maintenance={maintenanceEntries} onAddClick={() => setActiveTab(TabView.ADD)} onEntrySelect={handleEntrySelect} onUpdateVehicle={updateVehicle} />;
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-[#0f172a] text-white flex font-sans overflow-hidden">
      
      {/* Sidebar Navigation - Fixed Width */}
      <div className="w-64 h-full shrink-0 border-r border-gray-800 bg-[#0f172a] hidden md:block">
        <NavBar 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            mode="sidebar"
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-full relative overflow-hidden flex flex-col bg-[#0f172a]">
        <div className="flex-1 overflow-y-auto no-scrollbar relative w-full h-full">
            {renderContent()}
        </div>

        {/* Mobile Nav (Fallback if screen is small) */}
        <div className="md:hidden">
          {activeTab !== TabView.ADD && (
            <NavBar 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
                mode="bottom"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;