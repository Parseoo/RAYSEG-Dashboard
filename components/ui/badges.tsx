import React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'gray' | 'muted' | 'teal' | 'blue' | 'red' | 'yellow' | 'ghost' | 'green' | 'emerald' | 'indigo' | 'amber';

const variantClasses: Record<Variant, string> = {
  gray: 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-white',
  muted: 'bg-gray-50 text-gray-500 dark:bg-white/10 dark:text-white',
  teal: 'bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-500',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-500',
  red: 'bg-red-50 text-red-600 dark:bg-red-800/20 dark:text-red-400',
  yellow: 'bg-amber-50 text-amber-600 dark:bg-amber-800/20 dark:text-amber-400',
  ghost: 'bg-white/10 text-white',
  green: 'bg-emerald-700 text-white',
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-800/20 dark:text-emerald-400',
  indigo: 'bg-indigo-50 text-indigo-500 dark:bg-indigo-800/20 dark:text-indigo-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-800/20 dark:text-amber-400',
}

export const defaultStatusMap: Record<string, Variant> = {
  Activo: 'green',
  Active: 'green',
  Venta: 'teal',
  Alquiler: 'blue',
  Pendiente: 'yellow',
  Cancelado: 'red',
}

// Mapa de estatus de propiedad (Disponible, Vendido, Reservado)
export const propertyStatusList = [
  { value: 'Disponible', label: 'Disponible' },
  { value: 'Vendido', label: 'Vendido' },
  { value: 'Reservado', label: 'Reservado' },
];

export const propertyStatusMap: Record<string, Variant> = {
  Disponible: 'emerald',
  Vendido: 'blue',
  Reservado: 'yellow',
}

// Mapa de estados de publicación web (Publicado, Oculto, Borrador)
export const publicationStatusList = [
  { value: 'Publicado', label: 'Publicado' },
  { value: 'Oculto', label: 'Oculto' },
  { value: 'Borrador', label: 'Borrador' },
];

export const publicationStatusMap: Record<string, Variant> = {
  Publicado: 'blue',
  Oculto: 'red',
  Borrador: 'gray',
}

type StatusType = 'default' | 'property' | 'publication';

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  status?: string;
  statusMap?: Record<string, Variant>;
  statusType?: StatusType;
}

const base = 'inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium';

export const Tag: React.FC<TagProps> = ({ variant = 'gray', status, statusMap, statusType = 'default', className, children, ...props }) => {
  const map = {
    ...defaultStatusMap,
    ...(statusType === 'property' ? propertyStatusMap : {}),
    ...(statusType === 'publication' ? publicationStatusMap : {}),
    ...(statusMap || {}),
  };
  const v: Variant = (status ? (map[status] as Variant) : undefined) || variant;

  return (
    <span className={cn(base, variantClasses[v], className)} {...props}>
      {children}
    </span>
  );
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: React.ReactNode;
  variant?: Variant;
}

export default function Badge({ label, variant = 'gray', className, ...props }: BadgeProps) {
  // Use Tag but with tighter horizontal padding to match design
  return (
    <Tag variant={variant} className={"mr-2 px-1.5 py-1 " + (className || '')} {...props}>
      {label}
    </Tag>
  );
}
