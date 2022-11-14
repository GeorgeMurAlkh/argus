import React, {useState} from "react";
import * as Yup from 'yup';
import { vehicleNameSchema } from '../helpers/yup.schemas';
import { VehicleType, vehicleForm, VehicleDocument } from '../models/vehicle.model'
import { updateVehicle, createVehicle, getVehicleById } from '../services/vehicle.service'
import { NavigateFunction, useNavigate } from 'react-router-dom';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { mapUrl, mapCenter, mapZoom } from '../helpers/constants';


const VehicleDetails = () => {
  const vehicleIdFromUrl = window.location.pathname.split('/').pop() || 'new';

  const navigate: NavigateFunction = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [vehicle, setVehicle] = useState<VehicleDocument | null>(null);
  const [initialValues, setInitialValues] = useState<{
    name: string;
    longitude: number;
    latitude: number;
    type: VehicleType
  }>(
  {
    name: '',
    longitude: mapCenter[0],
    latitude: mapCenter[1],
    type: VehicleType.SUV
  });

  if (!vehicle && vehicleIdFromUrl !== 'new') {
    getVehicleById(vehicleIdFromUrl).then(response => {
      setVehicle(response.data);
      const { name, type, lastLocation } = response.data;
      setInitialValues({
        name, 
        type,
        longitude: lastLocation.lng,
        latitude: lastLocation.lat 
      })

      setLoading(false);
    }).catch(error => {
      const resMessage = error.response?.data?.message || error.toString();

      setLoading(false);
      setMessage(resMessage);
    })
  }
  
  const validationSchema = Yup.object().shape({
    longitude: Yup.number().required(),
    latitude: Yup.number().required(),
    name: vehicleNameSchema
  });

  const handleSubmit = (form: vehicleForm) => {
    const { name, type, longitude, latitude } = form;
    setMessage('');
    setLoading(true);

    if (vehicle) {
      updateVehicle(vehicle._id, {
        name,
        type,
        lastLocation: {
          lat: latitude,
          lng: longitude
        }
      }).then(response => {
        setVehicle(response.data);
        setLoading(false);
        setMessage('')
      }).catch(error => {
        const resMessage = error.response?.data?.message || error.toString();

        setLoading(false);
        setMessage(resMessage);
      })
    } else {
      // create new
      createVehicle({
        name,
        type,
        lastLocation: {
          lat: latitude,
          lng: longitude
        }
      }).then(response => {
        setMessage('')
        setLoading(false);
        navigate(`/vehicles/${response.data._id}`)
      }).catch(error => {
        const resMessage = error.response?.data?.message || error.toString();
        setLoading(false);
        setMessage(resMessage);
      })
    }
  }
  
  return (
    <div className="col-md-12">
      <div className="card card-container w-100">
        {vehicle && 
          <div className="map-wrapper">
            <ComposableMap projection="geoMercator">
            <ZoomableGroup center={mapCenter} zoom={mapZoom}>
              <Geographies geography={mapUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography key={geo.rsmKey} geography={geo}/>
                  ))
                }
              </Geographies>
              <Marker coordinates={
                [vehicle.lastLocation.lng, vehicle.lastLocation.lat]
                }>
                <circle r={3} fill="#FF5533" />
              </Marker>
            </ZoomableGroup>
          </ComposableMap>
          </div> 
        }
        <div className="card-body">

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          <Form>
            <div className="form-group">
              <label htmlFor="name">Vehicle Name</label>
              <Field name="name" type="text" className="form-control" />
              <ErrorMessage
                name="name"
                component="div"
                className="alert alert-danger mt-3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Longitude</label>
              <Field name="longitude" type="number" className="form-control" />
              <ErrorMessage
                name="longitude"
                component="div"
                className="alert alert-danger mt-3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Latitude</label>
              <Field name="latitude" type="number" className="form-control" />
              <ErrorMessage
                name="latitude"
                component="div"
                className="alert alert-danger mt-3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Vehicle Type</label>
              <Field name="type" as="select" className="form-control">
                <option value={VehicleType.SUV}>{VehicleType[VehicleType.SUV]}</option>
                <option value={VehicleType.Truck}>{VehicleType[VehicleType.Truck]}</option>
                <option value={VehicleType.Hybrid}>{VehicleType[VehicleType.Hybrid]}</option>
              </Field>
              <ErrorMessage
                name="latitude"
                component="div"
                className="alert alert-danger mt-3"
              />
            </div>
            {vehicle && 
              <div className="form-group mt-3">
                <div>Updated Time: <b>{vehicle.updatedAt}</b></div>
                <div>Created Time: <b>{vehicle.createdAt}</b></div>
                <div>Created Timestamp: <b>{vehicle.createdTimestamp}</b></div>
                <div>Vehicle ID: <b>{vehicle._id}</b></div>
              </div>
              }

            <div className="form-group mt-3">
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>{vehicle ? 'Update Vehicle' : 'Create Vehicle'}</span>
              </button>
            </div>

            {message && (
              <div className="form-group mt-3">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}
          </Form>
        </Formik>
        <button className="btn btn-secondary btn-block mt-3"
        onClick={() => navigate('/vehicles')}>
          <span>Back to Vehicles List</span>
        </button>
        </div>
      </div>
    </div>
  )
}

export default VehicleDetails;