import axios from 'axios';
import queryString from 'query-string';
import { CaregiverInterface, CaregiverGetQueryInterface } from 'interfaces/caregiver';
import { GetQueryInterface } from '../../interfaces';

export const getCaregivers = async (query?: CaregiverGetQueryInterface) => {
  const response = await axios.get(`/api/caregivers${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCaregiver = async (caregiver: CaregiverInterface) => {
  const response = await axios.post('/api/caregivers', caregiver);
  return response.data;
};

export const updateCaregiverById = async (id: string, caregiver: CaregiverInterface) => {
  const response = await axios.put(`/api/caregivers/${id}`, caregiver);
  return response.data;
};

export const getCaregiverById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/caregivers/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCaregiverById = async (id: string) => {
  const response = await axios.delete(`/api/caregivers/${id}`);
  return response.data;
};
