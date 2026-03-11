"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { GetPropertyById } from '@/lib/api/property/property-api';
import { PropertyListItemResponse } from '@/lib/@type';

export interface PropertyState {
  titleProperty: string;
  typeProperty: string;
  operation: string;
  price: string;
  statusProperty: string;
  description: string;
  superficie: string;
  ambientes: string;
  dormitorios: string;
  baños: string;
  cocheras: string;
  direccion: string;
  ciudad: string;
  cp: string;
  statusPublication: string;
  webDescription: string;
  isFeatured: boolean;
  amenities: string[];
}

const initialState: PropertyState = {
  titleProperty: '',
  typeProperty: '',
  operation: '',
  price: '',
  statusProperty: '',
  description: '',
  superficie: '',
  ambientes: '',
  dormitorios: '',
  baños: '',
  cocheras: '',
  direccion: '',
  ciudad: '',
  cp: '',
  statusPublication: '',
  webDescription: '',
  isFeatured: false,
  amenities: [],
};

interface PropertyContextType {
  state: PropertyState;
  loading: boolean;
  updateField: (field: keyof PropertyState, value: any) => void;
  fetchProperty: (id: string) => Promise<void>;
  resetState: () => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PropertyState>(initialState);
  const [loading, setLoading] = useState(false);

  const updateField = useCallback((field: keyof PropertyState, value: any) => {
    setState(prev => ({ ...prev, [field]: value }));
  }, []);

  const fetchProperty = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await GetPropertyById(id);
      const data: PropertyListItemResponse = response.data;
      
      setState({
        titleProperty: data.title || '',
        typeProperty: data.property_type?.name || '',
        operation: data.operation_type || '',
        price: data.price || '',
        statusProperty: data.property_status || '',
        description: data.description || '',
        superficie: data.terrain_size || '',
        ambientes: String(data.rooms || ''), // Ambientes != Rooms usually, but mapping for now
        dormitorios: String(data.rooms || ''),
        baños: String(data.bathrooms || ''),
        cocheras: String(data.parking_spaces || ''),
        direccion: data.address?.[0] ? `${data.address[0].street} ${data.address[0].street_number}` : '',
        ciudad: String(data.address?.[0]?.city || ''),
        cp: data.address?.[0]?.postal_code || '',
        statusPublication: data.property_post_status?.name || '',
        webDescription: '', // Should be updated if API supports it
        isFeatured: data.is_featured || false,
        amenities: data.amenities?.map(a => String(a.catalogItemID)) || [],
      });
    } catch (error) {
      console.error("Error fetching property:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetState = useCallback(() => setState(initialState), []);

  return (
    <PropertyContext.Provider value={{ state, loading, updateField, fetchProperty, resetState }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) throw new Error("useProperty must be used within a PropertyProvider");
  return context;
};
