import { useQuery } from "@tanstack/react-query";
import { fetchItemsRequest, fetchGlobalFacetsRequest } from "./itemsService";

export const useItems = (params, options = {}) => {
  return useQuery({
    queryKey: ["items", params],
    queryFn: () => fetchItemsRequest(params),
    ...options,
  });
};

export const useGlobalFacets = (options = {}) => {
  return useQuery({
    queryKey: ["facets-global"],
    queryFn: () => fetchGlobalFacetsRequest(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};


