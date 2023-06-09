import axios from 'axios';
import queryString from 'query-string';
import { AllergyInterface, AllergyGetQueryInterface } from 'interfaces/allergy';
import { GetQueryInterface } from '../../interfaces';

export const getAllergies = async (query?: AllergyGetQueryInterface) => {
  const response = await axios.get(`/api/allergies${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createAllergy = async (allergy: AllergyInterface) => {
  const response = await axios.post('/api/allergies', allergy);
  return response.data;
};

export const updateAllergyById = async (id: string, allergy: AllergyInterface) => {
  const response = await axios.put(`/api/allergies/${id}`, allergy);
  return response.data;
};

export const getAllergyById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/allergies/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteAllergyById = async (id: string) => {
  const response = await axios.delete(`/api/allergies/${id}`);
  return response.data;
};
