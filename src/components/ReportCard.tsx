import React, { useState } from 'react';
import { OpportunityReport } from '../types';
import Modal from './Modal';
import ReportForm from './ReportForm';
import ConfirmationModal from './ConfirmationModal';
import { ChevronDown, ChevronUp, Edit, Trash, Plus, X, MessageCircle } from 'lucide-react';

interface ReportCardProps {
  report: OpportunityReport;
  onUpdate: (id: string, updatedReport: OpportunityReport) => void;
  onDelete: (id: string) => void;
  onAddUpdate: (id: string, update: string) => void;
  onDeleteUpdate: (reportId: string, updateIndex: number) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onUpdate,
  onDelete,
  onAddUpdate,
  onDeleteUpdate,
  isExpanded,
  onToggleExpand
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newUpdate, setNewUpdate] = useState('');
  const [showAllUpdates, setShowAllUpdates] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteUpdateIndex, setDeleteUpdateIndex] = useState<number | null>(null);

  const handleAddUpdate = () => {
    if (newUpdate.trim()) {
      onAddUpdate(report.id, newUpdate.trim());
      setNewUpdate('');
    }
  };

  const handleStatusChange = (newStatus: OpportunityReport['status']) => {
    onUpdate(report.id, { ...report, status: newStatus });
  };

  const handleDeleteReport = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUpdate = (index: number) => {
    setDeleteUpdateIndex(index);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteUpdateIndex !== null) {
      onDeleteUpdate(report.id, deleteUpdateIndex);
      setDeleteUpdateIndex(null);
    } else {
      onDelete(report.id);
    }
  };

  const latestUpdate = report.updates[0] || { text: 'No hay actualizaciones', timestamp: '' };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'abierto':
        return 'bg-red-600';
      case 'en proceso':
        return 'bg-orange-500';
      case 'cerrado':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden transition-all duration-300 ease-in-out">
      <div className={`p-4 flex justify-between items-center ${getStatusColor(report.status)}`}>
        <div>
          <h3 className="text-lg font-semibold text-white">{report.guestName}</h3>
          <p className="text-sm text-gray-200">Habitación: {report.roomNumber}</p>
        </div>
        <div className="flex items-center">
          <span className="text-sm font-medium text-white mr-2">{report.status}</span>
          <button
            onClick={onToggleExpand}
            className="text-white hover:text-gray-200 transition-colors duration-200"
          >
            {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 border-t border-gray-700">
          <p><strong>Reserva:</strong> {report.reservationNumber}</p>
          <p><strong>Reportado por:</strong> {report.reportedBy}</p>
          <p><strong>Departamento:</strong> {report.department}</p>
          <p><strong>Llegada:</strong> {report.arrivalDate}</p>
          <p><strong>Salida:</strong> {report.departureDate}</p>
          <p><strong>Reporte:</strong> {report.incidentReport}</p>
          <p><strong>Estado de ánimo:</strong> {report.guestMood}</p>
          
          <div className="mt-4">
            <h4 className="font-bold mb-2">Estado del ticket:</h4>
            <select
              value={report.status}
              onChange={(e) => handleStatusChange(e.target.value as OpportunityReport['status'])}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100"
            >
              <option value="abierto">Abierto</option>
              <option value="en proceso">En proceso</option>
              <option value="cerrado">Cerrado</option>
            </select>
          </div>
          
          <div className="mt-4">
            <h4 className="font-bold mb-2">Última actualización:</h4>
            <div className="bg-gray-700 p-2 rounded">
              <p>{latestUpdate.text}</p>
              {latestUpdate.timestamp && (
                <p className="text-xs text-gray-400 mt-1">{formatDate(latestUpdate.timestamp)}</p>
              )}
            </div>
            
            {report.updates.length > 1 && (
              <button
                onClick={() => setShowAllUpdates(!showAllUpdates)}
                className="mt-2 text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center"
              >
                <MessageCircle size={16} className="mr-1" />
                {showAllUpdates ? 'Ocultar actualizaciones' : 'Ver todas las actualizaciones'}
              </button>
            )}
            
            {showAllUpdates && (
              <ul className="space-y-2 mt-2">
                {report.updates.slice(1).map((update, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-700 p-2 rounded">
                    <div>
                      <p>{update.text}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(update.timestamp)}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteUpdate(index + 1)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-200"
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="mt-4">
            <textarea
              value={newUpdate}
              onChange={(e) => setNewUpdate(e.target.value)}
              placeholder="Nueva actualización"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 h-24 resize-none"
            />
            <button
              onClick={handleAddUpdate}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors duration-200 w-full flex items-center justify-center"
            >
              <Plus size={20} className="mr-2" />
              Añadir actualización
            </button>
          </div>
          
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded transition-colors duration-200"
            >
              <Edit size={20} />
            </button>
            <button
              onClick={handleDeleteReport}
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors duration-200"
            >
              <Trash size={20} />
            </button>
          </div>
        </div>
      )}

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ReportForm
          initialData={report}
          onSubmit={(updatedReport) => {
            onUpdate(report.id, { ...report, ...updatedReport });
            setIsEditModalOpen(false);
          }}
        />
      </Modal>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteUpdateIndex(null);
        }}
        onConfirm={confirmDelete}
        message={
          deleteUpdateIndex !== null
            ? "¿Estás seguro de que quieres eliminar esta actualización?"
            : "¿Estás seguro de que quieres eliminar este reporte?"
        }
      />
    </div>
  );
};

export default ReportCard;