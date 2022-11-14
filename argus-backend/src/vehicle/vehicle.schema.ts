import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, now, Types } from 'mongoose';
import { User } from 'src/user/user.schema';

enum VehicleType {
  SUV,
  Truck,
  Hybrid
}

@Schema()
class Location {
  @Prop()
  lat: number;

  @Prop()
  lng: number;
}

// timestamps option automatically create "createdAt" and "updatedAt"
@Schema({ timestamps: true })
export class Vehicle {
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  owner: User;
  
  @Prop({ required: true, maxlength: 50, minlength: 1})
  name: string;

  @Prop({ required: true, type: String, enum: VehicleType, default: VehicleType.SUV })
  type: VehicleType;

  @Prop({ default: now() })
  lastConnected: Date

  @Prop({ type: Location, _id: false })
  lastLocation: Location

  @Prop({ default: Date.now() })
  createdTimestamp: number
}

export type VehicleDocument = Vehicle & Document;
export const VehicleSchema = SchemaFactory.createForClass(Vehicle);