import { apiClient, API_ENDPOINTS } from "../apiService/apiService";

export const fetchItemsRequest = async (params) => {
  const data = await apiClient.get(API_ENDPOINTS.ITEMS, { params });
  return data;
};

export const fetchGlobalFacetsRequest = async () => {
  const data = await apiClient.get(API_ENDPOINTS.FACETS_GLOBAL);
  return data;
};


