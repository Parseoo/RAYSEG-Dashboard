"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { GetPropertyById } from '@/lib/api/property/property-api';
import { GetCatalogPropertyTypes, GetCatalogByName, GetCatalogAmenities, GetPropertyTerrainTypes } from '@/lib/api/catalog-api';
import { PropertyListItemResponse, ItemResponse } from '@/lib/@type';
import { mapPropertyApiToFormState } from './mapPropertyToFormState';

export interface PropertyState {
  number_mls: string;
  title: string;
  property_type: string;
  operation_type: string;
  price: number | null;
  property_status: string;
  description: string;
  terrain_size: number | null;
  construction_size: number | null;
  rooms: number | null;
  bathrooms: number | null;
  parking_spaces: number | null;
  terrain_type: string;
  floors: number | null;
  construction_year: number | null;
  outdoor_spaces: number | null;
  conservation_status: string;
  full_address: string;
  street: string;
  street_number: string;
  interior_number: string;
  neighborhood: string;
  addressId: number | null;
  estado: string;
  city: string;
  postal_code: string;
  status_publication: string;
  note: string;
  is_featured: boolean;
  amenities: string[];
  images: { fileID: number; file: string; is_main: boolean }[];
  plans: { fileID: number; file: string }[];
}

const initialState: PropertyState = {
  number_mls: '',
  title: '',
  property_type: '',
  operation_type: '',
  price: null,
  property_status: '',
  description: '',
  terrain_size: null,
  construction_size: null,
  rooms: null,
  bathrooms: null,
  parking_spaces: null,
  terrain_type: '',
  floors: null,
  construction_year: null,
  outdoor_spaces: null,
  conservation_status: '',
  full_address: '',
  street: '',
  street_number: '',
  interior_number: '',
  neighborhood: '',
  addressId: null,
  estado: '',
  city: '',
  postal_code: '',
  status_publication: '',
  note: '',
  is_featured: false,
  amenities: [],
  images: [],
  plans: [],
};

interface PropertyContextType {
  state: PropertyState;
  loading: boolean;
  propertyTypes: ItemResponse[];
  amenitiesCatalog: ItemResponse[];
  operationCatalog: ItemResponse[];
  propertyStateCatalog: ItemResponse[];
  conservationStatusCatalog: ItemResponse[];
  publicationStatusCatalog: ItemResponse[];
  terrainTypeCatalog: ItemResponse[];
  updateField: (field: keyof PropertyState, value: any) => void;
  fetchProperty: (id: string) => Promise<void>;
  resetState: () => void;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  fetchCatalogs: () => Promise<void>;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PropertyState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState<ItemResponse[]>([]);
  const [amenitiesCatalog, setAmenitiesCatalog] = useState<ItemResponse[]>([]);
  const [operationCatalog, setOperationCatalog] = useState<ItemResponse[]>([]);
  const [propertyStateCatalog, setPropertyStateCatalog] = useState<ItemResponse[]>([]);
  const [conservationStatusCatalog, setConservationStatusCatalog] = useState<ItemResponse[]>([]);
  const [publicationStatusCatalog, setPublicationStatusCatalog] = useState<ItemResponse[]>([]);
  const [terrainTypeCatalog, setTerrainTypeCatalog] = useState<ItemResponse[]>([]);
  const [catalogsReady, setCatalogsReady] = useState(false);
  const [pendingPropertyData, setPendingPropertyData] = useState<PropertyListItemResponse | null>(null);

  const fetchCatalogs = useCallback(async () => {
    setCatalogsReady(false);

    const safeCatalogByName = async (name: string, fallbackNames: string[] = []) => {
      const names = [name, ...fallbackNames];
      for (const n of names) {
        try {
          return await GetCatalogByName(n);
        } catch {
          // Ignorar error 404 y continuar con fallback
        }
      }
      return null;
    };

    const results = await Promise.allSettled([
      GetCatalogPropertyTypes(),
      GetCatalogAmenities(),
      safeCatalogByName('operation-type', ['operation_type']),
      safeCatalogByName('property-type-status', ['property_type_status', 'property-status']),
      safeCatalogByName('property-condition', ['property_condition', 'conservation-status']),
      safeCatalogByName('property-post-status', ['publication-status', 'post-status', 'property_post_status']),
      GetPropertyTerrainTypes(),
    ]);

    const [typeRes, amenitiesRes, operationRes, propertyStateRes, conservationStatusRes, publicationStatusRes, terrainTypeRes] = results;

    const extractItems = (res: { data?: { items?: ItemResponse[]; catalogItems?: ItemResponse[] }; catalogItems?: ItemResponse[] } | any) => {
      if (!res) return [];
      if (res.catalogItems) return res.catalogItems;
      if (res.data?.catalogItems) return res.data.catalogItems;
      if (res.data?.items) return res.data.items;
      if (Array.isArray(res.data)) return res.data;
      return [];
    };

    if (typeRes.status === 'fulfilled') {
      setPropertyTypes(extractItems(typeRes.value));
    } else {
      console.warn('Error fetching property types:', typeRes.reason);
    }

    if (amenitiesRes.status === 'fulfilled') {
      setAmenitiesCatalog(extractItems(amenitiesRes.value));
    } else {
      console.warn('Error fetching amenities:', amenitiesRes.reason);
    }

    if (operationRes.status === 'fulfilled' && operationRes.value) {
      setOperationCatalog(extractItems(operationRes.value));
    }

    if (propertyStateRes.status === 'fulfilled' && propertyStateRes.value) {
      setPropertyStateCatalog(extractItems(propertyStateRes.value));
    }

    if (conservationStatusRes.status === 'fulfilled' && conservationStatusRes.value) {
      setConservationStatusCatalog(extractItems(conservationStatusRes.value));
    }

    const defaultPublicationStatuses: ItemResponse[] = [
      { id: 1, name: 'Borrador', description: 'Borrador' },
      { id: 2, name: 'Publicado', description: 'Publicado' },
      { id: 3, name: 'Archivado', description: 'Archivado' }
    ];

    if (publicationStatusRes.status === 'fulfilled' && publicationStatusRes.value) {
      const items = extractItems(publicationStatusRes.value);
      setPublicationStatusCatalog(items.length > 0 ? items : defaultPublicationStatuses);
    } else {
      setPublicationStatusCatalog(defaultPublicationStatuses);
    }

    if (terrainTypeRes.status === 'fulfilled') {
      setTerrainTypeCatalog(extractItems(terrainTypeRes.value));
    } else {
      console.warn('Error fetching terrain type:', terrainTypeRes.reason);
    }

    setCatalogsReady(true);
  }, []);

  useEffect(() => {
    fetchCatalogs();
  }, [fetchCatalogs]);

  useEffect(() => {
    if (!pendingPropertyData || !catalogsReady) return;

    setState(
      mapPropertyApiToFormState(pendingPropertyData, {
        propertyTypes,
        operationCatalog,
        propertyStateCatalog,
        conservationStatusCatalog,
      })
    );
    setPendingPropertyData(null);
  }, [pendingPropertyData, catalogsReady, propertyTypes, operationCatalog, propertyStateCatalog, conservationStatusCatalog]);

  const updateField = useCallback((field: keyof PropertyState, value: any) => {
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

  const fetchProperty = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await GetPropertyById(id);
      setPendingPropertyData(response.data);
    } catch (error) {
      console.error("Error fetching property:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetState = useCallback(() => {
    setState(initialState);
    setErrors({});
    setPendingPropertyData(null);
  }, []);

  return (
    <PropertyContext.Provider value={{
      state,
      loading,
      propertyTypes,
      amenitiesCatalog,
      operationCatalog,
      propertyStateCatalog,
      conservationStatusCatalog,
      publicationStatusCatalog,
      terrainTypeCatalog,
      updateField,
      fetchProperty,
      resetState,
      errors,
      setErrors,
      fetchCatalogs
    }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) throw new Error("useProperty must be used within a PropertyProvider");
  return context;
};
