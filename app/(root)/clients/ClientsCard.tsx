import React, { useState, useEffect } from 'react';
import { FileDown, X, Loader2 } from 'lucide-react';
import { GetReportsClients } from '@/lib/api/report-api';
import { GetReportClients } from '@/lib/api/client-api';
import { showToast } from 'nextjs-toast-notify';


const initialCardClient = [
  {
    title: 'Total de clientes',
    number: '0',
    key: 'total'
  },
  {
    title: 'Clientes activos',
    number: '0',
    key: 'active_customers'
  },
  {
    title: 'Nuevos este mes',
    number: '0',
    key: 'new_customers_this_month'
  },
  {
    title: 'Prospectos',
    number: '0',
    key: 'prospects'
  },
];

export const ClientsCard = () => {
  const [cardsData, setCardsData] = useState(initialCardClient);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await GetReportClients();
        const data = response.data?.data || response.data || {};
        
        setCardsData(prev => prev.map(card => ({
          ...card,
          number: data[card.key] !== undefined && data[card.key] !== null ? String(data[card.key]) : card.number
        })));
      } catch (error) {
        console.error("Error fetching clients report:", error);
      }
    };
    fetchReport();
  }, []);
  const [pdfParams, setPdfParams] = useState({
    year: '',
    month: '',
    date_from: '',
    date_to: ''
  });

  const handleGeneratePdf = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const yearNum = pdfParams.year ? Number.parseInt(pdfParams.year) : undefined;
      const monthNum = pdfParams.month ? Number.parseInt(pdfParams.month) : undefined;
      
      const response = await GetReportsClients({
        year: yearNum,
        month: monthNum,
        date_from: pdfParams.date_from || undefined,
        date_to: pdfParams.date_to || undefined
      });

      const blob = response.data;
      const contentType = blob.type;
      if (contentType !== 'application/pdf' && contentType !== 'application/octet-stream') {
        throw new Error("El contenido devuelto no es un reporte PDF válido.");
      }

      const url = window.URL.createObjectURL(blob);
      if (!url.startsWith('blob:')) {
        throw new Error("URL de descarga no segura.");
      }

      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte_general_clientes_${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      showToast.success("PDF generado y descargado correctamente");
      setIsPdfModalOpen(false);
      setPdfParams({ year: '', month: '', date_from: '', date_to: '' });
    } catch (error: any) {
      console.error("Error al generar PDF:", error);
      showToast.error("Error al generar el reporte PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className='bg-white w-full max-h-max rounded-lg p-5 mb-5 shadow-md'>
        <div className='w-full h-full'>
          <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4'>
            <div>
              <h1 className='text-black font-[700] text-2xl'>Clientes</h1>
              <p className='text-md text-gray-500'>Gestión de clientes, prospectos y propietarios</p>
            </div>
            <button 
              type='button'
              onClick={() => setIsPdfModalOpen(true)}
              className='bg-red-50 text-red-600 border border-red-200 w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:bg-red-100 transition-colors font-medium text-sm sm:text-base'
            >
              <FileDown size={20} /> Generar PDF
            </button>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'>
            {cardsData.map((card) => (
              <div key={card.key} className='bg-slate-100 rounded-lg p-4 flex flex-col justify-between'>
                <h2 className='text-gray-600 text-sm font-semibold'>{card.title}</h2>
                <p className='text-2xl font-bold text-black mt-2'>{card.number}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isPdfModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Cerrar modal"
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-all cursor-default border-none"
            onClick={() => setIsPdfModalOpen(false)}
          />
          <dialog
            open
            aria-label="Generar Reporte PDF"
            className="relative bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden p-0 m-0"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-red-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <FileDown className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Generar Reporte PDF</h2>
                  <p className="text-xs text-gray-500 font-medium">Filtrar clientes para el reporte</p>
                </div>
              </div>
              <button type='button' onClick={() => setIsPdfModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleGeneratePdf} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Año */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pdf-year" className="text-xs font-semibold text-gray-700">Año (opcional)</label>
                  <input
                    id="pdf-year"
                    type="number"
                    min="2000"
                    max="2100"
                    placeholder="Ej: 2026"
                    value={pdfParams.year}
                    onChange={(e) => setPdfParams(prev => ({ ...prev, year: e.target.value }))}
                    className="w-full h-[40px] px-3 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500 text-sm transition-all"
                  />
                </div>

                {/* Mes */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pdf-month" className="text-xs font-semibold text-gray-700">Mes (opcional)</label>
                  <select
                    id="pdf-month"
                    value={pdfParams.month}
                    onChange={(e) => setPdfParams(prev => ({ ...prev, month: e.target.value }))}
                    className="w-full h-[40px] px-3 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500 text-sm transition-all bg-white"
                  >
                    <option value="">Todos los meses</option>
                    <option value="1">Enero</option>
                    <option value="2">Febrero</option>
                    <option value="3">Marzo</option>
                    <option value="4">Abril</option>
                    <option value="5">Mayo</option>
                    <option value="6">Junio</option>
                    <option value="7">Julio</option>
                    <option value="8">Agosto</option>
                    <option value="9">Septiembre</option>
                    <option value="10">Octubre</option>
                    <option value="11">Noviembre</option>
                    <option value="12">Diciembre</option>
                  </select>
                </div>
              </div>

              {/* Rango de Fechas */}
              <div className="border-t border-gray-100 pt-3 space-y-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Rango de fechas específico</p>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Desde */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="pdf-date-from" className="text-xs font-semibold text-gray-700">Desde</label>
                    <input
                      id="pdf-date-from"
                      type="date"
                      value={pdfParams.date_from}
                      onChange={(e) => setPdfParams(prev => ({ ...prev, date_from: e.target.value }))}
                      className="w-full h-[40px] px-3 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500 text-sm transition-all"
                    />
                  </div>

                  {/* Hasta */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="pdf-date-to" className="text-xs font-semibold text-gray-700">Hasta</label>
                    <input
                      id="pdf-date-to"
                      type="date"
                      value={pdfParams.date_to}
                      onChange={(e) => setPdfParams(prev => ({ ...prev, date_to: e.target.value }))}
                      className="w-full h-[40px] px-3 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500 text-sm transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsPdfModalOpen(false)}
                  className="flex-1 h-[40px] px-4 rounded-lg font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="flex-1 h-[40px] px-4 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm shadow-md"
                >
                  {isGenerating ? <Loader2 className="animate-spin w-4 h-4" /> : <FileDown className="w-4 h-4" />}
                  {isGenerating ? 'Generando...' : 'Descargar PDF'}
                </button>
              </div>
            </form>
          </dialog>
        </div>
      )}
    </>
  );
};