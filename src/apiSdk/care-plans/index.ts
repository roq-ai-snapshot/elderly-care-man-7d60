import axios from 'axios';
import queryString from 'query-string';
import { CarePlanInterface, CarePlanGetQueryInterface } from 'interfaces/care-plan';
import { GetQueryInterface } from '../../interfaces';

export const getCarePlans = async (query?: CarePlanGetQueryInterface) => {
  const response = await axios.get(`/api/care-plans${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCarePlan = async (carePlan: CarePlanInterface) => {
  const response = await axios.post('/api/care-plans', carePlan);
  return response.data;
};

export const updateCarePlanById = async (id: string, carePlan: CarePlanInterface) => {
  const response = await axios.put(`/api/care-plans/${id}`, carePlan);
  return response.data;
};

export const getCarePlanById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/care-plans/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCarePlanById = async (id: string) => {
  const response = await axios.delete(`/api/care-plans/${id}`);
  return response.data;
};
