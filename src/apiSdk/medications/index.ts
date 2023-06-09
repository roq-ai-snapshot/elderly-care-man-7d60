import axios from 'axios';
import queryString from 'query-string';
import { MedicationInterface, MedicationGetQueryInterface } from 'interfaces/medication';
import { GetQueryInterface } from '../../interfaces';

export const getMedications = async (query?: MedicationGetQueryInterface) => {
  const response = await axios.get(`/api/medications${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createMedication = async (medication: MedicationInterface) => {
  const response = await axios.post('/api/medications', medication);
  return response.data;
};

export const updateMedicationById = async (id: string, medication: MedicationInterface) => {
  const response = await axios.put(`/api/medications/${id}`, medication);
  return response.data;
};

export const getMedicationById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/medications/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteMedicationById = async (id: string) => {
  const response = await axios.delete(`/api/medications/${id}`);
  return response.data;
};
