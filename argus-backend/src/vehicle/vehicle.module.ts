import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { JwtStrategy } from 'src/auth/guards/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { VehicleSchema } from './vehicle.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Vehicle', schema: VehicleSchema}])
  ],
  providers: [VehicleService, JwtStrategy],
  controllers: [VehicleController]
})
export class VehicleModule {}
