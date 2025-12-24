import { useMutation, useQuery } from "@tanstack/react-query"
import { GetAllPropertyApi, GetPropertyApi } from "./property-api"

export const GetAllProperty = () => useQuery({
  queryKey: ['property'],
  queryFn: GetAllPropertyApi,
  select: (data: any) => {
    // Si la respuesta es { data: { property: [...] } }, extraer el array
    if (data?.data?.property && Array.isArray(data.data.property)) {
      return data.data.property
    }
    // Si la respuesta es { data: [...] }, devolver directamente
    if (Array.isArray(data?.data)) {
      return data.data
    }
    // Si la respuesta es directamente un array
    if (Array.isArray(data)) {
      return data
    }
    return []
  },
  retry: 1,
  refetchOnWindowFocus: false
})
export const GetProperty = () => useMutation({
  mutationKey: ['property'],
  mutationFn: (id: number) => GetPropertyApi(id),
})