import { ItemResponse, PropertyListItemResponse } from '@/lib/@type';
import { resolveCatalogDisplayValue, resolveCatalogApiValue } from '@/lib/utils/catalog';
import type { PropertyState } from './propertyContext';

export interface PropertyCatalogs {
  propertyTypes: ItemResponse[];
  operationCatalog: ItemResponse[];
  propertyStateCatalog: ItemResponse[];
  conservationStatusCatalog: ItemResponse[];
}

export function mapPropertyApiToFormState(
  data: PropertyListItemResponse,
  catalogs: PropertyCatalogs
): PropertyState {
  const rawAddress = data.address;
  const address = Array.isArray(rawAddress) ? rawAddress[0] : rawAddress;

  // Helper para resolver conservation_status que viene como string "5" del API
  const resolveConservationStatus = (raw: any): string => {
    if (!raw) return '';
    // Si es un objeto con name, usar resolveCatalogDisplayValue
    if (typeof raw === 'object' && raw.name) {
      return resolveCatalogDisplayValue(raw.name, catalogs.conservationStatusCatalog);
    }
    // Si es string/number (como "5"), buscar por value/key y devolver name
    const trimmed = String(raw).trim();
    if (!catalogs.conservationStatusCatalog.length) return trimmed;
    const match = catalogs.conservationStatusCatalog.find(
      item => String(item.value) === trimmed || String(item.key) === trimmed || String(item.catalogItemID) === trimmed
    );
    return match?.name || trimmed;
  };

  console.log('Mapping property data, ambientes:', data.ambientes);

  return {
    number_mls: data.number_mls || '',
    title: data.title || '',
    property_type: resolveCatalogDisplayValue(data.property_type?.name, catalogs.propertyTypes),
    operation_type: resolveCatalogDisplayValue((data.operation_type as any)?.name ?? data.operation_type, catalogs.operationCatalog),
    price: data.price ? parseFloat(data.price) : null,
    property_status: resolveCatalogDisplayValue((data.property_status as any)?.name ?? data.property_status, catalogs.propertyStateCatalog),
    description: data.description || '',
    terrain_size: data.terrain_size ? Number(data.terrain_size) : null,
    construction_size: data.construction_size ? Number(data.construction_size) : null,
    rooms: data.rooms ? Number(data.rooms) : null,
    bathrooms: data.bathrooms ? Number(data.bathrooms) : null,
    parking_spaces: data.parking_spaces ? Number(data.parking_spaces) : null,
    terrain_type: (data.terrain_type as any)?.name ?? data.terrain_type ?? '',
    floors: data.floors ? Number(data.floors) : null,
    construction_year: data.construction_year ? Number(data.construction_year) : null,
    ambientes: (data as any).ambientes ? Number((data as any).ambientes) : null,
    conservation_status: resolveConservationStatus(data.conservation_status),
    full_address: address
      ? `${address.street} ${address.exterior_number || address.street_number || ''}${address.neighborhood ? ', ' + address.neighborhood : ''}`
      : '',
    street: address?.street || '',
    street_number: address?.exterior_number || address?.street_number || '',
    interior_number: address?.interior_number || '',
    neighborhood: address?.neighborhood || '',
    addressId: address?.property_address_id ?? null,
    estado: String(address?.state || ''),
    city: String(address?.city || ''),
    postal_code: address?.zip_code || address?.postal_code || '',
    status_publication: (data.property_post_status as any)?.name ?? data.property_post_status ?? '',
    note: (data as any).note || '',
    is_featured: data.is_featured || false,
    amenities: data.amenities?.map((a) => String(a.catalogItemID)) || [],
    images:
      data.images?.map((img) => ({
        fileID: img.property_image_id,
        file: img.image,
        is_main: img.is_main,
      })) || [],
    plans:
      data.plans?.map((p) => ({
        fileID: p.property_plan_id,
        file: p.plan,
      })) || [],
  };
}
