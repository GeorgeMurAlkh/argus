import { authHeader } from './auth.service';
import axios from 'axios';
import { VehicleDocument, VehicleSend } from '../models/vehicle.model';


const API_URL = `http://${process.env.SERVER_IP}:3000/api/vehicle`;


export const getVehicles = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

export const createVehicle = (vehicle: VehicleSend) => {
  return axios.post(API_URL, vehicle, { headers: authHeader() });
};

export const updateVehicle = (id: string, vehicle: VehicleSend) => {
  return axios.put(`${API_URL}/${id}`, vehicle, { headers: authHeader() });
};

export const deleteVehicle = (id: string) => {
  return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
};

export const getVehicleById = (id: string) => {
  return axios.get(`${API_URL}/${id}`, { headers: authHeader() });
};





