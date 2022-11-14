import { 
  Controller, 
  Get, 
  Post, 
  Request, 
  UseGuards, 
  Param, 
  Delete,
  Body,
  Put
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VehicleDocument } from './vehicle.schema';
import { VehicleService } from './vehicle.service';

@Controller('vehicle')
export class VehicleController {
  constructor(private vehicleService: VehicleService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getUserVehicles(@Request() req): Promise<VehicleDocument[]> {
    return this.vehicleService.findByOwner(req.user._id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  getVehicleById(
    @Request() req,
    @Param('id') id: string
    ): Promise<VehicleDocument> {
    return this.vehicleService.findOneByOwner(req.user._id, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Request() req,
    @Body('name') name: string,
    @Body('type') type: string,
    @Body('lastLocation') lastLocation: { lat: number, lng: number }
  ): Promise<VehicleDocument> {
    return this.vehicleService.create(req.user._id, name, type, lastLocation);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('type') type: string,
    @Body('lastLocation') lastLocation: { lat: number, lng: number }
  ): Promise<VehicleDocument> {
    return this.vehicleService.update(req.user._id, id, name, type, lastLocation);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteProduct(
    @Request() req,
    @Param('id') id: string
    ) {
    return this.vehicleService.delete(req.user._id, id);
  }
}
