import React, { useState, useEffect } from 'react';
import { Activity, Stethoscope, ShieldAlert, Check, RefreshCw, Layers, ClipboardList } from 'lucide-react';

export default function App() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal / Form Interactive State
  const [selectedListing, setSelectedListing] = useState(null);
  const [unitsRequested, setUnitsRequested] = useState(1);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Sync with your Django REST framework backend endpoints
  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/listings/`);
      if (!response.ok) throw new Error('API communication link failure');
      
      const data = await response.json();
      setListings(data);
      setError(null);
    } catch (err) {
      setError('Could not establish link with the DentaLink backend server. Verify your Django runserver is alive on Port 8000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  // Post booking request to your ProcurementOrder endpoint
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    // Safety check check right before running execution block
    if (parseInt(unitsRequested) > selectedListing.quantity_available) {
      alert('Order blocked: Requested quantity exceeds warehouse limits.');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinic: 2, // Hardcoded clinical account profile placeholder for testing
          listing: selectedListing.id,
          units_requested: parseInt(unitsRequested) // Maps to your units integer field
        })
      });

      if (!response.ok) throw new Error('Procurement execution rejected');

      setOrderSuccess(true);
      setTimeout(() => {
        setOrderSuccess(false);
        setSelectedListing(null);
        setUnitsRequested(1);
        fetchMarketData(); // Refresh stock levels dynamically
      }, 2500);
    } catch (err) {
      alert('Order routing fault. Double check validation schema constraints on your backend.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {/* Clinic System Top Navbar Navigation */}
      <header className="bg-cyan-700 text-white shadow-sm sticky top-0 z-40 border-b border-cyan-800">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Stethoscope className="h-6 w-6 text-cyan-200" />
            <div>
              <h1 className="text-lg font-bold tracking-tight">DentaLink</h1>
              <p className="text-[10px] text-cyan-100 uppercase font-semibold tracking-wider">Clinical Procurement Portal</p>
            </div>
          </div>
          <button 
            onClick={fetchMarketData} 
            className="p-2 hover:bg-cyan-800 rounded-lg transition-colors border border-cyan-600/30"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl mb-8 flex items-start space-x-3 text-rose-800 shadow-sm">
            <ShieldAlert className="h-5 w-5 shrink-0 text-rose-500 mt-0.5" />
            <div>
              <p className="font-bold">System Connection Interrupted</p>
              <p className="text-sm opacity-90">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-600 border-t-transparent mb-3"></div>
            <p className="text-sm font-medium text-slate-500">Retrieving wholesale dental distribution indexes...</p>
          </div>
        ) : (
          <>
            {/* Context Summary Bar */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-xl shadow-xs border border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Verified Medical Market Distribution</h2>
                <p className="text-xs text-slate-500">Direct wholesale item channels from authorized commercial dental suppliers</p>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold self-start sm:self-auto">
                <Layers className="h-3.5 w-3.5 text-cyan-600" />
                <span>{listings.length} Active Wholesale Records</span>
              </div>
            </div>

            {/* Grid Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-xl shadow-xs border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-5">
                    {/* Card Head Meta Details */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-50 text-cyan-700 px-2.5 py-0.5 rounded-md border border-cyan-100">
                        {item.product?.category || "EQUIPMENT"}
                      </span>
                      <div className="text-[11px] font-medium text-slate-400 truncate max-w-[140px]">
                        Vendor: {item.distributor || `ID: ${item.distributor_id}`}
                      </div>
                    </div>

                    {/* Commodity Title */}
                    <h3 className="text-base font-bold text-slate-900 line-clamp-2 min-h-[3rem] mb-2">
                      {item.product?.equipment_name || "Dental Procurement Item"}
                    </h3>

                    {/* Pricing Index Array Output */}
                    <div className="my-4 bg-slate-50 p-3 rounded-lg border border-slate-100 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Unit Rate</p>
                        <p className="text-2xl font-black text-slate-900">
                          {parseInt(item.unit_price).toLocaleString()} <span className="text-xs font-bold text-slate-500">PKR</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Available Stock</p>
                        <p className={`text-sm font-bold ${item.quantity_available > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {item.quantity_available > 0 ? `${item.quantity_available} Units` : 'Allocated'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Operational Action Footer */}
                  <div className="px-5 pb-5 pt-0">
                    <button
                      onClick={() => {
                        setSelectedListing(item);
                        setUnitsRequested(1);
                      }}
                      disabled={!(item.quantity_available > 0)}
                      className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all shadow-xs"
                    >
                      <ClipboardList className="h-4 w-4" />
                      <span>Request Material Allocation</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Transaction Overlay Panel Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 border border-slate-200">
            {orderSuccess ? (
              <div className="text-center py-6">
                <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-0.5">Allocation Confirmed</h3>
                <p className="text-xs text-slate-500">Transactional ledger computed and stored inside PostgreSQL database.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Confirm Clinic Purchase Order</h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                      Origin Distributor: {selectedListing.distributor}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedListing(null)}
                    className="text-slate-400 hover:text-slate-600 text-xs p-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 mb-4 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Medical Core Spec:</span>
                    <span className="font-bold text-slate-900">{selectedListing.product?.equipment_name}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Contract Base Rate:</span>
                    <span className="font-bold text-slate-900">{parseInt(selectedListing.unit_price).toLocaleString()} PKR</span>
                  </div>
                </div>

                <form onSubmit={handleSubmitOrder} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Required Stock Vol (Units / Packs)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={selectedListing.quantity_available}
                      value={unitsRequested}
                      onChange={(e) => setUnitsRequested(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg text-sm font-bold focus:outline-hidden transition-all ${
                        parseInt(unitsRequested) > selectedListing.quantity_available
                          ? 'border-rose-500 ring-1 ring-rose-500 text-rose-700 bg-rose-50/30'
                          : 'border-slate-300 focus:ring-1 focus:ring-cyan-600'
                      }`}
                      required
                    />
                    
                    {/* Visual Warning Messaging Block */}
                    {parseInt(unitsRequested) > selectedListing.quantity_available && (
                      <p className="text-[10px] text-rose-600 font-bold tracking-tight mt-1.5 animate-pulse">
                        ⚠️ Requested volume exceeds vendor inventory limits ({selectedListing.quantity_available} max).
                      </p>
                    )}
                  </div>

                  <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                    <span className="text-xs font-semibold text-slate-500">Gross Procurement Invoice:</span>
                    <span className="text-xl font-black text-cyan-600">
                      {(parseFloat(selectedListing.unit_price) * (parseInt(unitsRequested) || 0)).toLocaleString()} <span className="text-xs font-bold">PKR</span>
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={parseInt(unitsRequested) > selectedListing.quantity_available || !unitsRequested || parseInt(unitsRequested) < 1}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-xs py-3 px-4 rounded-lg transition-colors shadow-xs uppercase tracking-wider"
                  >
                    Authorize Procurement Order
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}