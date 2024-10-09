import React, { useState } from 'react';
import { OpportunityReport } from './types';
import Modal from './components/Modal';
import ReportForm from './components/ReportForm';
import ReportCard from './components/ReportCard';
import { PlusCircle, Search } from 'lucide-react';

type TabType = 'todos' | 'abierto' | 'en proceso' | 'cerrado';

function App() {
  const [reports, setReports] = useState<OpportunityReport[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateReport = (newReport: Omit<OpportunityReport, 'id' | 'updates' | 'status'>) => {
    const report: OpportunityReport = {
      ...newReport,
      id: Date.now().toString(),
      updates: [],
      status: 'abierto',
    };
    setReports((prevReports) => [report, ...prevReports]);
    setIsModalOpen(false);
  };

  const handleUpdateReport = (id: string, updatedReport: OpportunityReport) => {
    setReports((prevReports) =>
      prevReports.map((report) => (report.id === id ? updatedReport : report))
    );
  };

  const handleDeleteReport = (id: string) => {
    setReports((prevReports) => prevReports.filter((report) => report.id !== id));
    if (expandedReportId === id) {
      setExpandedReportId(null);
    }
  };

  const handleAddUpdate = (id: string, update: string) => {
    const newUpdate = {
      text: update,
      timestamp: new Date().toISOString()
    };
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === id
          ? { ...report, updates: [newUpdate, ...report.updates] }
          : report
      )
    );
  };

  const handleDeleteUpdate = (reportId: string, updateIndex: number) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === reportId
          ? {
              ...report,
              updates: report.updates.filter((_, index) => index !== updateIndex),
            }
          : report
      )
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedReportId(expandedReportId === id ? null : id);
  };

  const filteredReports = reports.filter(report => {
    const matchesTab = activeTab === 'todos' || report.status === activeTab;
    const matchesSearch = searchTerm === '' || 
      report.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabClass = (tab: TabType) =>
    `px-4 py-2 font-semibold ${
      activeTab === tab
        ? 'bg-blue-600 text-white'
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    } rounded-t-lg transition-colors duration-200`;

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-100">Registro de Reportes de Oportunidad</h1>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex space-x-1">
            <button onClick={() => setActiveTab('todos')} className={tabClass('todos')}>
              Todos
            </button>
            <button onClick={() => setActiveTab('abierto')} className={tabClass('abierto')}>
              Abiertos
            </button>
            <button onClick={() => setActiveTab('en proceso')} className={tabClass('en proceso')}>
              En Proceso
            </button>
            <button onClick={() => setActiveTab('cerrado')} className={tabClass('cerrado')}>
              Cerrados
            </button>
          </div>
          <div className="flex space-x-2 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <input
                type="text"
                placeholder="Buscar por habitación o huésped"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg flex items-center"
            >
              <PlusCircle className="mr-2" size={20} />
              Nuevo Reporte
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onUpdate={handleUpdateReport}
              onDelete={handleDeleteReport}
              onAddUpdate={handleAddUpdate}
              onDeleteUpdate={handleDeleteUpdate}
              isExpanded={expandedReportId === report.id}
              onToggleExpand={() => toggleExpand(report.id)}
            />
          ))}
        </div>
        {filteredReports.length === 0 && (
          <p className="text-center text-gray-400 mt-8">No hay reportes para mostrar en esta categoría.</p>
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ReportForm onSubmit={handleCreateReport} />
      </Modal>
    </div>
  );
}

export default App;