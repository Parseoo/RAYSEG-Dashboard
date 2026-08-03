"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { GetCatalogByName } from '@/lib/api/catalog-api';
import { ItemResponse } from '@/lib/@type';
import { GetAllUsers } from '@/lib/api/user-api';
import { normalizeInterest } from '@/lib/utils/catalog';

export interface ClientAddress {
  state: string;
  city: string;
  neighborhood: string;
  postal_code: string;
  full_address: string;
}

export interface ClientState {
  name: string;
  client_type: string;
  taxpayer_type: string;
  client_status: string;
  tax_id: string;
  email: string;
  phone: string;
  whatsapp: string;
  preferred_contact: string;
  address: ClientAddress;
  main_interest: string;
  target_property_type: string;
  budget_min: number;
  budget_max: number;
  bedrooms: number;
  bathrooms: number;
  parking_spaces: number;
  payment_method: string;
  estimated_time: string;
  agent_id: number;
  internal_notes: string;
  message: string;
  property: number;
  lead_source: string;
  other_source: string;
  profile_photo: string;
  accept_policies: boolean;
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
  clientOriginTypes: ItemResponse[];
  agents: { label: string, value: string }[];
  updateField: (field: string, value: any) => void;
  updateAddressField: (field: keyof ClientAddress, value: string) => void;
  fetchClient: (id: string) => Promise<void>;
  resetState: () => void;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const initialState: ClientState = {
  name: '',
  client_type: '',
  taxpayer_type: '',
  client_status: 'activo',
  tax_id: '',
  email: '',
  phone: '',
  whatsapp: '',
  preferred_contact: '',
  address: {
    state: '',
    city: '',
    neighborhood: '',
    postal_code: '',
    full_address: ''
  },
  main_interest: '',
  target_property_type: '',
  budget_min: 0,
  budget_max: 0,
  bedrooms: 0,
  bathrooms: 0,
  parking_spaces: 0,
  payment_method: '',
  estimated_time: '',
  agent_id: 0,
  internal_notes: '',
  message: '',
  property: 0,
  lead_source: '',
  other_source: '',
  profile_photo: '',
  accept_policies: true
};

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ClientState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [taxpayerTypes, setTaxpayerTypes] = useState<ItemResponse[]>([]);
  const [statusTypes, setStatusTypes] = useState<ItemResponse[]>([]);
  const [segmentTypes, setSegmentTypes] = useState<ItemResponse[]>([]);
  const [contactPreferenceTypes, setContactPreferenceTypes] = useState<ItemResponse[]>([]);
  const [mainInterestTypes, setMainInterestTypes] = useState<ItemResponse[]>([]);
  const [targetPropertyTypes, setTargetPropertyTypes] = useState<ItemResponse[]>([]);
  const [paymentMethodTypes, setPaymentMethodTypes] = useState<ItemResponse[]>([]);
  const [leadSourceTypes, setLeadSourceTypes] = useState<ItemResponse[]>([]);
  const [clientOriginTypes, setClientOriginTypes] = useState<ItemResponse[]>([]);
  const [agents, setAgents] = useState<{ label: string, value: string }[]>([]);

  const fetchCatalogs = useCallback(async () => {
    // Helper que retorna null en caso de 404 (catálogos opcionales)
    const safeCatalog = async (name: string) => {
      try {
        return await GetCatalogByName(name);
      } catch (e: any) {
        console.warn(`Aviso al cargar catálogo ${name}:`, e);
        return null;
      }
    };

    const results = await Promise.allSettled([
      safeCatalog('contribuyente-type'),
      safeCatalog('client-status'),
      safeCatalog('client-type'),
      safeCatalog('preferred-contact-method'),
      safeCatalog('operation-type') || safeCatalog('primary_interest'),
      safeCatalog('property-types'),
      safeCatalog('payment-method'),
      safeCatalog('client-origin'),
      GetAllUsers({ perPage: 100 })
    ]);

    const [taxpayerRes, statusRes, segmentRes, contactRes, interestRes, propertyRes, paymentRes, originRes, usersRes] = results;

    const extractItems = (res: any) => {
      if (!res) return [];
      if (Array.isArray(res)) return res;
      if (res.catalogItems && Array.isArray(res.catalogItems)) return res.catalogItems;
      if (res.items && Array.isArray(res.items)) return res.items;
      if (res.datos && Array.isArray(res.datos)) return res.datos;

      if (res.data) {
        if (Array.isArray(res.data)) return res.data;
        if (res.data.catalogItems && Array.isArray(res.data.catalogItems)) return res.data.catalogItems;
        if (res.data.items && Array.isArray(res.data.items)) return res.data.items;
        if (res.data.datos && Array.isArray(res.data.datos)) return res.data.datos;
      }
      return [];
    };

    if (taxpayerRes.status === 'fulfilled') {
      setTaxpayerTypes(extractItems(taxpayerRes.value));
    }

    if (statusRes.status === 'fulfilled') {
      setStatusTypes(extractItems(statusRes.value));
    }

    if (segmentRes.status === 'fulfilled') {
      setSegmentTypes(extractItems(segmentRes.value));
    }

    if (contactRes.status === 'fulfilled') {
      setContactPreferenceTypes(extractItems(contactRes.value));
    }

    if (interestRes.status === 'fulfilled') {
      setMainInterestTypes(extractItems(interestRes.value));
    }

    if (propertyRes.status === 'fulfilled') {
      setTargetPropertyTypes(extractItems(propertyRes.value));
    }

    if (paymentRes.status === 'fulfilled') {
      setPaymentMethodTypes(extractItems(paymentRes.value));
    }

    if (originRes.status === 'fulfilled') {
      const originItems = extractItems(originRes.value);
      setLeadSourceTypes(originItems);
      setClientOriginTypes(originItems);
    }

    if (usersRes.status === 'fulfilled') {
      const usersData = (usersRes.value as any)?.data?.users || (usersRes.value as any)?.data || [];
      const agentsList = usersData
        .filter((u: any) => u.role === 'Agente' || u.role?.name === 'Agente' || String(u.role).toLowerCase().includes('agente'))
        .map((u: any) => ({ 
          label: `${u.name || ''} ${u.paternal_last_name || ''} ${u.maternal_last_name || ''}`.trim().replace(/\s+/g, ' '), 
          value: String(u.user_id || u.id) 
        }));
      setAgents(agentsList);
    }
  }, []);

  useEffect(() => {
    fetchCatalogs();
  }, [fetchCatalogs]);

  const updateField = useCallback((field: string, value: any) => {
    setState(prev => ({ ...prev, [field]: value }));
    setErrors(prev => {
      if (prev[field]) {
        const next = { ...prev };
        delete next[field];
        return next;
      }
      return prev;
    });
  }, []);

  const updateAddressField = useCallback((field: keyof ClientAddress, value: string) => {
    setState(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
    setErrors(prev => {
      if (prev[field]) {
        const next = { ...prev };
        delete next[field];
        return next;
      }
      return prev;
    });
  }, []);

  const fetchClient = useCallback(async (id: string) => {
    const { GetClientById } = await import('@/lib/api/client-api');
    setLoading(true);
    try {
      const response = await GetClientById(id);
      const data = response.data;
      const rawInterest = data.preferences?.main_interest || (data as any).main_interest || '';

      setState({
        name: data.name || '',
        client_type: data.client_type_name || '',
        taxpayer_type: data.taxpayer_type || '',
        client_status: data.client_status || '',
        tax_id: data.tax_id || '',
        email: data.email || '',
        phone: data.phone || '',
        whatsapp: data.whatsapp || '',
        preferred_contact: data.preferred_contact || '',
        address: {
          state: data.address?.state || '',
          city: data.address?.city || '',
          neighborhood: data.address?.neighborhood || '',
          postal_code: data.address?.postal_code || '',
          full_address: data.address?.full_address || ''
        },
        main_interest: normalizeInterest(rawInterest),
        target_property_type: data.preferences?.target_property_type || (data as any).target_property_type || '',
        budget_min: data.preferences?.budget_min || (data as any).budget_min || 0,
        budget_max: data.preferences?.budget_max || (data as any).budget_max || 0,
        bedrooms: data.preferences?.bedrooms || (data as any).bedrooms || 0,
        bathrooms: data.preferences?.bathrooms || (data as any).bathrooms || 0,
        parking_spaces: data.preferences?.parking_spaces || (data as any).parking_spaces || 0,
        payment_method: data.preferences?.payment_method || (data as any).payment_method || '',
        estimated_time: data.preferences?.estimated_time || (data as any).estimated_time || '',
        agent_id: data.agent?.id || data.agent_id || 0,
        internal_notes: data.internal_notes || '',
        message: data.message || '',
        property: data.property?.id || data.property_id || 0,
        lead_source: data.lead_source_name || '',
        other_source: data.other_source || '',
        profile_photo: data.profile_photo || '',
        accept_policies: data.accept_policies ?? true
      });
    } catch (error) {
      console.error("Error fetching client:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetState = useCallback(() => {
    setState(initialState);
    setErrors({});
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
      clientOriginTypes,
      agents,
      updateField,
      updateAddressField,
      fetchClient,
      resetState,
      errors,
      setErrors
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
