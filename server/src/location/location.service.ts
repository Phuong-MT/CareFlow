import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Location } from './entities/location.entity';
import { CreateLocationDto} from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ERROR_TYPE, transformError } from 'src/common/config.errors';
import { Tenant } from 'src/tenant/entities/tenant.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LocationService {
  constructor(@InjectModel(Location) private locationModel: typeof Location,
              @InjectModel(Tenant)  private tenantModel : typeof Tenant,
              @InjectModel(User) private userModel : typeof User
  ) {}

  async create(createLocationDto: CreateLocationDto, userId: string): Promise<Location> {
    const user = await this.userModel.findByPk(userId)
    if(!user){
      throw new BadRequestException( transformError(
                 `user : ${userId}`, 
                 ERROR_TYPE.NOT_FOUND
               )
             );
    }
    const tenantCode = user.tenantCode
    const {name, address} = createLocationDto
    const existingTenant = await this.tenantModel.findOne({
      where: {tenantCode}
    });
     if (!existingTenant) {
       throw new BadRequestException( transformError(
                 `tenantCode : ${tenantCode}`, 
                 ERROR_TYPE.NOT_FOUND
               )
             );
     }
    return await this.locationModel.create({tenantCode, name,address });
  }

  async findAll(id: string): Promise<Location[]>  {
    const response = await this.userModel.findByPk(id);
    return  await this.locationModel.findAll(
      {
        where :{
          tenantCode: response.tenantCode
        }, 
        include: [{model: this.tenantModel, attributes: ['name', 'tenantCode']}],
        attributes:['id','name', 'address',]
      }
    );
  }

  async findOne(id: number): Promise<Location> {
    const location = await this.locationModel.findByPk(id,
      {
        include: [{model : this.tenantModel,  attributes: ['name', 'tenantCode']}]
      }
    );
    if (!location) throw new NotFoundException('Location not found');
    return location;
  }

  async update(id: number, updateLocationDto: UpdateLocationDto): Promise<[number]> {
    return this.locationModel.update(updateLocationDto, { where: { id } });
  }

  async remove(id: number): Promise<void> {
    const location = await this.findOne(id);
    await location.destroy();
  }
}
