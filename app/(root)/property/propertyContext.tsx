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
    const results = await Promise.allSettled([
      GetCatalogPropertyTypes(),
      GetCatalogAmenities(),
      GetCatalogByName('operation-type'),
      GetCatalogByName('property-type-status'),
      GetCatalogByName('property-condition'),
      GetCatalogByName('property-post-status'),
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
      console.error('Error fetching property types:', typeRes.reason);
    }

    if (amenitiesRes.status === 'fulfilled') {
      setAmenitiesCatalog(extractItems(amenitiesRes.value));
    } else {
      console.error('Error fetching amenities:', amenitiesRes.reason);
    }

    if (operationRes.status === 'fulfilled') {
      setOperationCatalog(extractItems(operationRes.value));
    } else {
      console.error('Error fetching property operation:', operationRes.reason);
    }

    if (propertyStateRes.status === 'fulfilled') {
      setPropertyStateCatalog(extractItems(propertyStateRes.value));
    } else {
      console.error('Error fetching state property:', propertyStateRes.reason);
    }

    if (conservationStatusRes.status === 'fulfilled') {
      setConservationStatusCatalog(extractItems(conservationStatusRes.value));
    } else {
      console.error('Error fetching conservation status:', conservationStatusRes.reason);
    }

    if (publicationStatusRes.status === 'fulfilled') {
      setPublicationStatusCatalog(extractItems(publicationStatusRes.value));
    } else {
      console.error('Error fetching publication status:', publicationStatusRes.reason);
    }

    if (terrainTypeRes.status === 'fulfilled') {
      setTerrainTypeCatalog(extractItems(terrainTypeRes.value));
    } else {
      console.error('Error fetching terrain type:', terrainTypeRes.reason);
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
