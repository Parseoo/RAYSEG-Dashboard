"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { GetCatalogByName } from '@/lib/api/catalog-api';
import { ItemResponse } from '@/lib/@type';

export interface ClientAddress {
  estado: string;
  ciudad: string;
  colonia: string;
  codigo_postal: string;
  completa: string;
}

export interface ClientState {
  nombre: string;
  tipo_cliente: string;
  persona_tipo: string;
  estatus: string;
  identificacion_fiscal: string;
  email: string;
  telefono: string;
  whatsapp: string;
  medio_contacto_preferido: string;
  direccion: ClientAddress;
  interes_principal: string;
  tipo_propiedad_objetivo: string;
  presupuesto_min: number;
  presupuesto_max: number;
  recamaras: number;
  banos: number;
  estacionamientos: number;
  forma_pago: string;
  tiempo_estimado: string;
  agente_id: number;
  notas_internas: string;
  mensaje: string;
  propiedad_id: number;
  origen_prospecto: string;
  acepta_politicas: boolean;
}

interface ClientContextType {
  state: ClientState;
  loading: boolean;
  taxpayerTypes: ItemResponse[];
  statusTypes: ItemResponse[];
  segmentTypes: ItemResponse[];
  contactPreferenceTypes: ItemResponse[];
  mainInterestTypes: ItemResponse[];
  targetPropertyTypes: ItemResponse[];
  paymentMethodTypes: ItemResponse[];
  leadSourceTypes: ItemResponse[];
  updateField: (field: string, value: any) => void;
  updateAddressField: (field: keyof ClientAddress, value: string) => void;
  fetchClient: (id: string) => Promise<void>;
  resetState: () => void;
}

const initialState: ClientState = {
  nombre: '',
  tipo_cliente: '',
  persona_tipo: '',
  estatus: '',
  identificacion_fiscal: '',
  email: '',
  telefono: '',
  whatsapp: '',
  medio_contacto_preferido: '',
  direccion: {
    estado: '',
    ciudad: '',
    colonia: '',
    codigo_postal: '',
    completa: ''
  },
  interes_principal: '',
  tipo_propiedad_objetivo: '',
  presupuesto_min: 0,
  presupuesto_max: 0,
  recamaras: 0,
  banos: 0,
  estacionamientos: 0,
  forma_pago: '',
  tiempo_estimado: '',
  agente_id: 0,
  notas_internas: '',
  mensaje: '',
  propiedad_id: 0,
  origen_prospecto: '',
  acepta_politicas: true
};

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ClientState>(initialState);
  const [loading, setLoading] = useState(false);
  const [taxpayerTypes, setTaxpayerTypes] = useState<ItemResponse[]>([]);
  const [statusTypes, setStatusTypes] = useState<ItemResponse[]>([]);
  const [segmentTypes, setSegmentTypes] = useState<ItemResponse[]>([]);
  const [contactPreferenceTypes, setContactPreferenceTypes] = useState<ItemResponse[]>([]);
  const [mainInterestTypes, setMainInterestTypes] = useState<ItemResponse[]>([]);
  const [targetPropertyTypes, setTargetPropertyTypes] = useState<ItemResponse[]>([]);
  const [paymentMethodTypes, setPaymentMethodTypes] = useState<ItemResponse[]>([]);
  const [leadSourceTypes, setLeadSourceTypes] = useState<ItemResponse[]>([]);

  const fetchCatalogs = useCallback(async () => {
    try {
      const [taxpayerRes, statusRes, segmentRes, contactRes, interestRes, propertyRes, paymentRes, leadRes] = await Promise.all([
        GetCatalogByName('Tipo de Contribuyente'),
        GetCatalogByName('client-status'),
        GetCatalogByName('client-segment'),
        GetCatalogByName('contact-preference'),
        GetCatalogByName('main-interest'),
        GetCatalogByName('target-property-type'),
        GetCatalogByName('payment-method'),
        GetCatalogByName('lead-source')
      ]);
      
      const extractItems = (res: any) => {
        if (!res?.data) return [];
        if (res.data.items) return res.data.items;
        if (res.data.catalogItems) return res.data.catalogItems;
        if (Array.isArray(res.data)) return res.data;
        return [];
      };

      setTaxpayerTypes(extractItems(taxpayerRes));
      setStatusTypes(extractItems(statusRes));
      setSegmentTypes(extractItems(segmentRes));
      setContactPreferenceTypes(extractItems(contactRes));
      setMainInterestTypes(extractItems(interestRes));
      setTargetPropertyTypes(extractItems(propertyRes));
      setPaymentMethodTypes(extractItems(paymentRes));
      setLeadSourceTypes(extractItems(leadRes));
    } catch (error) {
      console.error("Error fetching client catalogs:", error);
    }
  }, []);

  useEffect(() => {
    fetchCatalogs();
  }, [fetchCatalogs]);

  const updateField = useCallback((field: string, value: any) => {
    setState(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateAddressField = useCallback((field: keyof ClientAddress, value: string) => {
    setState(prev => ({
      ...prev,
      direccion: { ...prev.direccion, [field]: value }
    }));
  }, []);

  const fetchClient = useCallback(async (id: string) => {
    const { GetClientById } = await import('@/lib/api/client-api');
    setLoading(true);
    try {
      const response = await GetClientById(id);
      const data = response.data;
      
      setState({
        nombre: data.nombre || '',
        tipo_cliente: data.tipo_cliente || '',
        persona_tipo: data.persona_tipo || '',
        estatus: data.estatus || '',
        identificacion_fiscal: data.identificacion_fiscal || '',
        email: data.contacto?.email || data.email || '',
        telefono: data.contacto?.telefono || data.telefono || '',
        whatsapp: data.whatsapp || '',
        medio_contacto_preferido: data.medio_contacto_preferido || '',
        direccion: {
          estado: data.direccion?.estado || '',
          ciudad: data.direccion?.ciudad || '',
          colonia: data.direccion?.colonia || '',
          codigo_postal: data.direccion?.codigo_postal || '',
          completa: data.direccion?.completa || ''
        },
        interes_principal: data.interes_principal || '',
        tipo_propiedad_objetivo: data.tipo_propiedad_objetivo || '',
        presupuesto_min: data.presupuesto_min || 0,
        presupuesto_max: data.presupuesto_max || 0,
        recamaras: data.recamaras || 0,
        banos: data.banos || 0,
        estacionamientos: data.estacionamientos || 0,
        forma_pago: data.forma_pago || '',
        tiempo_estimado: data.tiempo_estimado || '',
        agente_id: data.agente?.id || data.agente_id || 0,
        notas_internas: data.notas_internas || '',
        mensaje: data.mensaje || '',
        propiedad_id: data.propiedad?.id || data.propiedad_id || 0,
        origen_prospecto: data.origen_prospecto || '',
        acepta_politicas: data.acepta_politicas ?? true
      });
    } catch (error) {
      console.error("Error fetching client:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetState = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <ClientContext.Provider value={{ 
      state, 
      loading, 
      taxpayerTypes, 
      statusTypes,
      segmentTypes,
      contactPreferenceTypes,
      mainInterestTypes,
      targetPropertyTypes,
      paymentMethodTypes,
      leadSourceTypes,
      updateField, 
      updateAddressField, 
      fetchClient, 
      resetState 
    }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
};
