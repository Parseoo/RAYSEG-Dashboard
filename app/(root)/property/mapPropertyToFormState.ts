import { ItemResponse, PropertyListItemResponse } from '@/lib/@type';
import { resolveCatalogDisplayValue} from '@/lib/utils/catalog';
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

  // Helper para resolver conservation_status que viene como string "5" o "excellent" del API
  const resolveConservationStatus = (raw: any): string => {
    if (!raw) return '';
    // Si es un objeto con name, usar resolveCatalogDisplayValue
    if (typeof raw === 'object' && raw.name) {
      return resolveCatalogDisplayValue(raw.name, catalogs.conservationStatusCatalog);
    }
    // Si es string/number (como "5" o "excellent"), buscar por value/key y devolver name
    const trimmed = String(raw).trim();
    if (catalogs.conservationStatusCatalog.length) {
      const match = catalogs.conservationStatusCatalog.find(
        item => String(item.value) === trimmed || String(item.key) === trimmed || String(item.catalogItemID) === trimmed
      );
      if (match?.name) return match.name;
    }
    const lower = trimmed.toLowerCase();
    const translations: Record<string, string> = {
      excellent: 'Excelente',
      excelente: 'Excelente',
      good: 'Bueno',
      bueno: 'Bueno',
      new: 'Nuevo',
      nuevo: 'Nuevo',
      regular: 'Regular',
      remodelado: 'Remodelado',
      renovated: 'Remodelado',
      bad: 'Malo',
      malo: 'Malo',
      needs_renovation: 'Para remodelar',
      para_remodelar: 'Para remodelar',
    };
    return translations[lower] || trimmed;
  };

  console.log('Mapping property data, ambientes:', (data as any).ambientes);

  return {
    number_mls: data.number_mls || '',
    title: data.title || '',
    property_type: resolveCatalogDisplayValue(data.property_type?.name, catalogs.propertyTypes),
    operation_type: resolveCatalogDisplayValue((data.operation_type as any)?.name ?? data.operation_type, catalogs.operationCatalog),
    price: data.price ? Number.parseFloat(data.price) : null,
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
    outdoor_spaces: (data as any).outdoor_spaces !== undefined && (data as any).outdoor_spaces !== null ? Number((data as any).outdoor_spaces) : ((data as any).ambientes ? Number((data as any).ambientes) : null),
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
    is_featured: (data.is_featured as any) === true || (data.is_featured as any) === 1 || String(data.is_featured).toLowerCase() === 'true' || String(data.is_featured) === '1',
    amenities: data.amenities?.map((a) => String(a.catalogItemID)) || [],
    images: (() => {
      let fallbackImages: any[] = [];
      if ((data as any).main_image) {
        fallbackImages = [{ image: (data as any).main_image, is_main: true }];
      } else if ((data as any).main_image_url) {
        fallbackImages = [{ image: (data as any).main_image_url, is_main: true }];
      }

      const rawImages: any[] = Array.isArray(data.images) && data.images.length > 0
        ? data.images
        : (data as any).property_images || (data as any).photos || fallbackImages;

      if (!Array.isArray(rawImages)) return [];

      return rawImages.map((img: any, idx: number) => {
        const filePath = typeof img === 'string'
          ? img
          : (img?.image || img?.file || img?.url || img?.image_url || img?.src || '');
        const isMain = img?.is_main === true || img?.is_main === 1 || img?.is_main === 'true' || img?.isMain === true || (idx === 0 && !rawImages.some((i: any) => i?.is_main === true || i?.isMain === true));
        const fileId = Number(img?.property_image_id || img?.id || img?.fileID || (Date.now() + idx));

        return {
          fileID: fileId,
          file: filePath,
          is_main: isMain,
        };
      }).filter((item) => Boolean(item.file));
    })(),
    plans: (() => {
      const fallbackPlans = (data as any).plan ? [{ plan: (data as any).plan }] : [];
      const rawPlans: any[] = Array.isArray(data.plans) && data.plans.length > 0
        ? data.plans
        : (data as any).property_plans || fallbackPlans;

      if (!Array.isArray(rawPlans)) return [];

      return rawPlans.map((p: any, idx: number) => {
        const filePath = typeof p === 'string'
          ? p
          : (p?.plan || p?.file || p?.url || p?.plan_url || p?.src || '');
        const fileId = Number(p?.property_plan_id || p?.id || p?.fileID || (Date.now() + idx));

        return {
          fileID: fileId,
          file: filePath,
        };
      }).filter((item) => Boolean(item.file));
    })(),
  };
}
