import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Pet } from './pet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePetInput } from './dto/create-pet.input';
import { OwnersService } from 'src/owners/owners.service';
import { Owner } from 'src/owners/entities/owner.entity';
import { UpdatePetInput } from './dto/update-pet.input';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet) private readonly petsRepository: Repository<Pet>,
    @Inject(forwardRef(() => OwnersService))
    private readonly onwersService: OwnersService,
  ) {}

  async create(createPetInput: CreatePetInput): Promise<Pet> {
    const createdPet = this.petsRepository.create(createPetInput);
    return this.petsRepository.save(createdPet);
  }

  async findAll(): Promise<Pet[]> {
    return this.petsRepository.find();
  }

  async findOne(id: number): Promise<Pet> {
    return this.petsRepository.findOneOrFail({ where: { id } });
  }

  async update(id: number, updatePetInput: UpdatePetInput): Promise<Pet> {
    const pet = await this.findOne(id);
    if (updatePetInput.name) {
      pet.name = updatePetInput.name;
    }
    if (updatePetInput.type) {
      pet.type = updatePetInput.type;
    }
    if (updatePetInput.ownerId) {
      pet.ownerId = updatePetInput.ownerId;
    }

    return this.petsRepository.save(pet);
  }

  async remove(id: number): Promise<Pet> {
    const pet = await this.findOne(id);
    return this.petsRepository.remove(pet);
  }

  async getOwner(ownerId: number): Promise<Owner> {
    return this.onwersService.findOne(ownerId);
  }

  async getByOwner(ownerId: number): Promise<Pet[]> {
    return this.petsRepository.find({ where: { ownerId } });
  }
}
