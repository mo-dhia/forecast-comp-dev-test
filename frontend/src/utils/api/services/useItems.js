import { useQuery } from "@tanstack/react-query";
import { fetchItemsRequest, fetchGlobalFacetsRequest, fetchMetadataRequest } from "./itemsService";

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

export const useMetadata = (options = {}) => {
  return useQuery({
    queryKey: ["metadata"],
    queryFn: () => fetchMetadataRequest(),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};


