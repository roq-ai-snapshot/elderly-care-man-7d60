import axios from 'axios';
import queryString from 'query-string';
import { CareHomeInterface, CareHomeGetQueryInterface } from 'interfaces/care-home';
import { GetQueryInterface } from '../../interfaces';

export const getCareHomes = async (query?: CareHomeGetQueryInterface) => {
  const response = await axios.get(`/api/care-homes${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCareHome = async (careHome: CareHomeInterface) => {
  const response = await axios.post('/api/care-homes', careHome);
  return response.data;
};

export const updateCareHomeById = async (id: string, careHome: CareHomeInterface) => {
  const response = await axios.put(`/api/care-homes/${id}`, careHome);
  return response.data;
};

export const getCareHomeById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/care-homes/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCareHomeById = async (id: string) => {
  const response = await axios.delete(`/api/care-homes/${id}`);
  return response.data;
};
