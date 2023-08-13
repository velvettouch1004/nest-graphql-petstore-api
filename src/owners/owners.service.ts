import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateOwnerInput } from './dto/create-owner.input';
import { UpdateOwnerInput } from './dto/update-owner.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Owner } from './entities/owner.entity';
import { Repository } from 'typeorm';
import { PetsService } from 'src/pets/pets.service';
import { Pet } from 'src/pets/pet.entity';

@Injectable()
export class OwnersService {
  constructor(
    @InjectRepository(Owner)
    private readonly ownersRepository: Repository<Owner>,
    @Inject(forwardRef(() => PetsService))
    private readonly petsService: PetsService,
  ) {}

  async create(createOwnerInput: CreateOwnerInput): Promise<Owner> {
    const createdOwner = this.ownersRepository.create(createOwnerInput);
    return this.ownersRepository.save(createdOwner);
  }

  async findAll(): Promise<Owner[]> {
    return this.ownersRepository.find();
  }

  async findOne(id: number): Promise<Owner> {
    return this.ownersRepository.findOneOrFail({ where: { id } });
  }

  async update(id: number, updateOwnerInput: UpdateOwnerInput): Promise<Owner> {
    const owner = await this.findOne(id);
    if (updateOwnerInput.name) {
      owner.name = updateOwnerInput.name;
      return this.ownersRepository.save(owner);
    }
    return owner;
  }

  async remove(id: number): Promise<Owner> {
    const owner = await this.findOne(id);
    return this.ownersRepository.remove(owner);
  }

  async getPets(id: number): Promise<Pet[]> {
    return this.petsService.getByOwner(id);
  }
}
