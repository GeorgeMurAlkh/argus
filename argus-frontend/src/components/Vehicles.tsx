import React, { useState, useEffect } from 'react';
import { NavigateFunction, useNavigate, Link } from 'react-router-dom';
import { VehicleDocument, VehicleType } from '../models/vehicle.model'
import { deleteVehicle, getVehicles } from '../services/vehicle.service'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";
import { mapUrl, mapCenter, mapZoom } from '../helpers/constants';


const Vehicles = () => {
  const navigate: NavigateFunction = useNavigate();
  
  const [loading, setLoading] = useState<boolean>(false);
  const [vehicles, setVehicles] = useState<VehicleDocument[]>([]);


  useEffect(() => {
    getVehicles().then(response => {
      setVehicles(response.data)
    }).catch(error => {
      console.log(error)
    });
  }, [])

  const onDeleteVehicle = (vehicleId: string) => {
    setLoading(true)
    deleteVehicle(vehicleId)
    .then(res => {
      setVehicles(vehicles.filter(v => v._id !== vehicleId))
      setLoading(false)
    })
    .catch(error => {
      setLoading(false)
    })
  }

  return (
    <div className="col-md-12">
      <ComposableMap projection="geoMercator">
        <ZoomableGroup center={mapCenter} zoom={mapZoom}>
          <Geographies geography={mapUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography key={geo.rsmKey} geography={geo} />
              ))
            }
          </Geographies>
          {
            vehicles.map((vehicle: VehicleDocument) => {
              return (
              <Marker
              coordinates={[vehicle.lastLocation.lng, vehicle.lastLocation.lat]} 
              onClick={() => navigate(`/vehicles/${vehicle._id}`)}
              key={vehicle._id}
              >
                <circle r={3} fill="#FF5533" />
              </Marker>
              )
            })
          }
          
        </ZoomableGroup>
      </ComposableMap>
      
      <button className="btn btn-primary btn-block mt-3"
        onClick={() => navigate('/vehicles/new')}>Add New Vehicle</button>
      <div className="vihicles-list mt-3">
      <ul className="list-group">
          {
            vehicles.map((vehicle: VehicleDocument) => {
              return (
                <li className="list-group-item" key={vehicle._id}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>Vehicle Name: <b>{vehicle.name}</b></div>
                  <div>Vehicle Type: <b>{VehicleType[vehicle.type]}</b></div>
                  <div>Created Timestamp: <b>{vehicle.createdTimestamp}</b></div>
                  <div className="delete-button">
                    <i onClick={() => navigate(`/vehicles/${vehicle._id}`)} className="bi bi-info-square m-3 logout"></i>
                    {!loading && <i onClick={() => onDeleteVehicle(vehicle._id)} className="bi bi-trash m-3 logout"></i> }
                  </div>
                  </div>
                  </li>
              )
                  })
            
          }
      </ul>
      </div>
    </div>
  );
};

export default Vehicles;
