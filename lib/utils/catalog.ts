import { ItemResponse } from '@/lib/@type';

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function findCatalogItem(raw: string, catalog: ItemResponse[]): ItemResponse | undefined {
  const normalized = normalize(raw);
  return catalog.find(
    (item) =>
      String(item.id) === normalized ||
      String(item.catalogItemID) === normalized ||
      normalize(item.name ?? '') === normalized ||
      normalize(item.value ?? '') === normalized ||
      normalize(item.key ?? '') === normalized
  );
}

/** Etiqueta para selects/UI: prioriza `name` del ítem de catálogo */
export function resolveCatalogDisplayValue(
  raw: string | number | undefined | null,
  catalog: ItemResponse[]
): string {
  if (raw === undefined || raw === null) return '';
  const trimmed = String(raw).trim();
  if (!catalog.length) return trimmed;

  const match = findCatalogItem(trimmed, catalog);
  return match?.name ?? trimmed;
}

/** Valor para enviar al API: prioriza `value` o `key` del catálogo */
export function resolveCatalogApiValue(
  raw: string | number | undefined | null,
  catalog: ItemResponse[]
): string {
  if (raw === undefined || raw === null) return '';
  const trimmed = String(raw).trim();
  if (!catalog.length) return trimmed;

  const match = findCatalogItem(trimmed, catalog);
  if (!match) return trimmed;
  return match.value || match.key || match.name || trimmed;
}

/** Valor para enviar al API: devuelve el catalogItemID como número */
export function resolveCatalogItemId(
  raw: string | number | undefined | null,
  catalog: ItemResponse[]
): number | null {
  if (raw === undefined || raw === null) return null;
  const trimmed = String(raw).trim();
  if (!catalog.length) return null;

  const match = findCatalogItem(trimmed, catalog);
  if (!match) return null;
  return match.catalogItemID;
}

/** Normaliza el interés principal para comparaciones y selects uniformes ('compra', 'renta', 'venta') */
export function normalizeInterest(interest?: string | number | null): string {
  if (!interest) return '';
  const lower = String(interest).trim().toLowerCase();
  if (['buy', 'compra', 'comprar', 'quiero_comprar', 'comprador'].includes(lower)) return 'compra';
  if (['rent', 'renta', 'rentar', 'quiero_rentar', 'arrendatario'].includes(lower)) return 'renta';
  if (['sale', 'sell', 'venta', 'vender', 'quiero_vender', 'propietario'].includes(lower)) return 'venta';
  return lower;
}

/** Formatea el interés principal para mostrar en la interfaz (Compra, Renta, Venta) */
export function formatInterestLabel(interest?: string | number | null, catalog: ItemResponse[] = []): string {
  if (!interest) return '';
  if (catalog.length > 0) {
    const display = resolveCatalogDisplayValue(interest, catalog);
    if (display && display.toLowerCase() !== String(interest).toLowerCase()) return display;
  }
  const norm = normalizeInterest(interest);
  if (norm === 'compra') return 'Compra';
  if (norm === 'renta') return 'Renta';
  if (norm === 'venta') return 'Venta';
  const str = String(interest).trim();
  return str.charAt(0).toUpperCase() + str.slice(1);
}
