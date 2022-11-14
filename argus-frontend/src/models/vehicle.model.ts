export enum VehicleType {
  SUV,
  Truck,
  Hybrid
}

export type Location = {
  lng: number;
  lat: number;
}

export interface VehicleDocument {
  _id: string;
  __v: number;
  owner: string;
  name: string;
  type: VehicleType;
  lastConnected: string;
  lastLocation: Location;
  createdTimestamp: number;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleSend {
  name: string;
  type: VehicleType;
  lastLocation: Location;
}

export type vehicleForm = {
  name: string;
  longitude: number;
  latitude: number;
  type: VehicleType
}