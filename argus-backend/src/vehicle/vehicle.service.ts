import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VehicleDocument } from './vehicle.schema';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel('Vehicle') private readonly vehicleModel: Model<VehicleDocument>
  ) {}

  async create(
    owner: string,
    name: string, 
    type: string, 
    lastLocation: { lat: number, lng: number }
  ): Promise<VehicleDocument> {
    const newVehicle = new this.vehicleModel({ 
      owner,
      name, 
      type, 
      lastLocation
    })
    return newVehicle.save();
  } 

  async update(
    owner: string,
    vehicleId: string,
    name: string, 
    type: string, 
    lastLocation: { lat: number, lng: number }
  ): Promise<VehicleDocument> {
    let existingVehicle = await this.vehicleModel.findOne(
      { _id: vehicleId, owner }
    ).exec()

    if (!existingVehicle) {
      throw new HttpException(
        `No such vehicle with id: ${vehicleId}!`,
        HttpStatus.CONFLICT
      )
    }

    existingVehicle = Object.assign(existingVehicle, {name, type, lastLocation})

    return existingVehicle.save();
  } 

  async findByOwner(owner: string): Promise<VehicleDocument[]> {
    return this.vehicleModel.find({ owner }).exec();
  }

  async findOneByOwner(owner: string, id: string): Promise<VehicleDocument> {
    return this.vehicleModel.findOne({ _id: id, owner }).exec();
  }

  async delete(owner: string, id: string) {
    return this.vehicleModel.deleteOne({ _id: id, owner }).exec();
  }
}
