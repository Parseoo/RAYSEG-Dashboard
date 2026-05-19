"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { GetPropertyById } from '@/lib/api/property/property-api';
import { GetCatalogPropertyTypes, GetCatalogByName, GetCatalogAmenities } from '@/lib/api/catalog-api';
import { PropertyListItemResponse, ItemResponse } from '@/lib/@type';

export interface PropertyState {
  number_mls: string;
  title: string;
  property_type: string;
  operation_type: string;
  price: string;
  property_status: string;
  description: string;
  terrain_size: string;
  construction_size: string;
  rooms: string;
  bathrooms: string;
  parking_spaces: string;
  terrain_type: string;
  floors: string;
  construction_year: string;
  conservation_status: string;
  full_address: string;
  street: string;
  street_number: string;
  neighborhood: string;
  addressId: number | null;
  city: string;
  postal_code: string;
  status_publication: string;
  web_description: string;
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
  price: '',
  property_status: '',
  description: '',
  terrain_size: '',
  construction_size: '',
  rooms: '',
  bathrooms: '',
  parking_spaces: '',
  terrain_type: '',
  floors: '',
  construction_year: '',
  conservation_status: '',
  full_address: '',
  street: '',
  street_number: '',
  neighborhood: '',
  addressId: null,
  city: '',
  postal_code: '',
  status_publication: '',
  web_description: '',
  is_featured: false,
  amenities: [],
  images: [],
  plans: [],
};

interface PropertyContextType {
  state: PropertyState;
  loading: boolean;
  propertyTypes: ItemResponse[];
  statusCatalog: ItemResponse[];
  amenitiesCatalog: ItemResponse[];
  operationCatalog: ItemResponse[];
  propertyStateCatalog: ItemResponse[];
  updateField: (field: keyof PropertyState, value: any) => void;
  fetchProperty: (id: string) => Promise<void>;
  resetState: () => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PropertyState>(initialState);
  const [loading, setLoading] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState<ItemResponse[]>([]);
  const [statusCatalog, setStatusCatalog] = useState<ItemResponse[]>([]);
  const [amenitiesCatalog, setAmenitiesCatalog] = useState<ItemResponse[]>([]);
  const [operationCatalog, setOperationCatalog] = useState<ItemResponse[]>([]);
  const [propertyStateCatalog, setPropertyStateCatalog] = useState<ItemResponse[]>([]);

  const fetchCatalogs = useCallback(async () => {
    try {
      const [typeRes, statusRes, amenitiesRes, operationRes, propertyStateRes] = await Promise.all([
        GetCatalogPropertyTypes(),
        GetCatalogByName('property-status'),
        GetCatalogAmenities(),
        GetCatalogByName('property-operation'),
        GetCatalogByName('state-property')
      ]);

      // Función auxiliar para extraer los items de forma robusta
      const extractItems = (res: any) => {
        if (!res?.data) return [];
        if (res.data.items) return res.data.items;
        if (res.data.catalogItems) return res.data.catalogItems;
        if (Array.isArray(res.data)) return res.data;
        return [];
      };

      setPropertyTypes(extractItems(typeRes));
      setStatusCatalog(extractItems(statusRes));
      setAmenitiesCatalog(extractItems(amenitiesRes));
      setOperationCatalog(extractItems(operationRes));
      setPropertyStateCatalog(extractItems(propertyStateRes));

    } catch (error) {
      console.error("Error fetching property catalogs:", error);
    }
  }, []);

  useEffect(() => {
    fetchCatalogs();
  }, [fetchCatalogs]);

  const updateField = useCallback((field: keyof PropertyState, value: any) => {
    setState(prev => ({ ...prev, [field]: value }));
  }, []);

  const fetchProperty = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await GetPropertyById(id);
      const data: PropertyListItemResponse = response.data;

      const mapOperation = (op: string) => {
        const mapping: Record<string, string> = { 'sale': 'Venta', 'rent': 'Renta', 'venta': 'Venta', 'renta': 'Renta' };
        return mapping[op.toLowerCase()] || op.charAt(0).toUpperCase() + op.slice(1).toLowerCase();
      };

      const mapStatus = (status: string) => {
        const mapping: Record<string, string> = { 'disponible': 'Disponible', 'vendido': 'Vendido', 'reservado': 'Reservado', 'rentado': 'Rentado' };
        return mapping[status.toLowerCase()] || status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
      };

      // Helper function to map property type (API: Casa -> UI: Casa)
      const mapType = (type: string) => {
        if (!type) return '';
        const mapping: Record<string, string> = { 'casa': 'Casa', 'departamento': 'Departamento', 'local': 'Local', 'terreno': 'Terreno' };
        return mapping[type.toLowerCase()] || type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
      };

      setState({
        number_mls: data.number_mls || '',
        title: data.title || '',
        property_type: mapType(data.property_type?.name || ''),
        operation_type: mapOperation(data.operation_type || ''),
        price: data.price ? String(parseFloat(data.price)) : '',
        property_status: mapStatus(data.property_status || ''),
        description: data.description || '',
        terrain_size: data.terrain_size || '',
        construction_size: data.construction_size || '',
        rooms: String(data.rooms || ''),
        bathrooms: String(data.bathrooms || ''),
        parking_spaces: String(data.parking_spaces || ''),
        terrain_type: data.terrain_type?.name || '',
        floors: String(data.floors || ''),
        construction_year: String(data.construction_year || ''),
        conservation_status: data.conservation_status || '',
        full_address: data.address?.[0] ? `${data.address[0].street} ${data.address[0].street_number}${data.address[0].neighborhood ? ', ' + data.address[0].neighborhood : ''}` : '',
        street: data.address?.[0]?.street || '',
        street_number: data.address?.[0]?.street_number || '',
        neighborhood: data.address?.[0]?.neighborhood || '',
        addressId: data.address?.[0]?.property_address_id || null,
        city: String(data.address?.[0]?.city || ''),
        postal_code: data.address?.[0]?.postal_code || '',
        status_publication: (data.property_post_status?.name || '').toLowerCase(),
        web_description: '',
        is_featured: data.is_featured || false,
        amenities: data.amenities?.map(a => String(a.catalogItemID)) || [],
        images: data.images?.map(img => ({ fileID: img.property_image_id, file: img.image, is_main: img.is_main })) || [],
        plans: data.plans?.map(p => ({ fileID: p.property_plan_id, file: p.plan })) || [],
      });
    } catch (error) {
      console.error("Error fetching property:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetState = useCallback(() => setState(initialState), []);

  return (
    <PropertyContext.Provider value={{
      state,
      loading,
      propertyTypes,
      statusCatalog,
      amenitiesCatalog,
      operationCatalog,
      propertyStateCatalog,
      updateField,
      fetchProperty,
      resetState
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
