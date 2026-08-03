export interface ResponseMessage {
  status: boolean;
  message: string;
  data: string;
}

export interface Pagination {
  total: number;
  current_page?: number;
  per_page?: number;
  total_pages?: number;
  pagina_actual?: number;
  registros_por_pagina?: number;
  total_paginas: number;
}

