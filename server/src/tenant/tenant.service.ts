import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Tenant } from 'src/tenant/entities/tenant.entity';
import { CreateTenantDto} from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { ERROR_TYPE, transformError } from 'src/common/config.errors';
@Injectable()
export class TenantService {
  constructor(@InjectModel(Tenant) private tenantModel: typeof Tenant) {}

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const {tenantCode, name} = createTenantDto
    const existingTenant = await this.tenantModel.findByPk(tenantCode);
  if (existingTenant) {
    throw new BadRequestException( transformError(
              `tenantCode : ${tenantCode}`, 
              ERROR_TYPE.EXIST
            )
          );
  }
    return await this.tenantModel.create({tenantCode, name});
  }

  async findAll(): Promise<Tenant[]> {
    return await this.tenantModel.findAll();
  }

  async findOne(tenantCode: string): Promise<Tenant> {
    const tenant = await this.tenantModel.findByPk(tenantCode);
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }

  async update(tenantCode: string, updateTenantDto: UpdateTenantDto): Promise<[number]> {
    return this.tenantModel.update(updateTenantDto, { where: { tenantCode } });
  }

  async remove(tenantCode: string): Promise<void> {
    const tenant = await this.tenantModel.findOne({
      where : {tenantCode}
    });
    await tenant.destroy();
  }
}