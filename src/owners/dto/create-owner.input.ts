import { InputType, Field } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';

@InputType()
export class CreateOwnerInput {
  @IsAlpha()
  @Field()
  name: string;
}
