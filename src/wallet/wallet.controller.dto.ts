import { IsNotEmpty, IsIn, IsEmail, IsBoolean } from 'class-validator';
// Addresses

export class AddressDto {
  readonly id!: string;
  readonly type!: string; // e.g. 'email' or 'sms'
  readonly verified!: boolean;
}

export class PutAddressDto {
  @IsNotEmpty()
  @IsEmail()
  readonly value!: string;
}

export class PostAddressDto extends PutAddressDto {
  @IsNotEmpty()
  @IsIn(['email'])
  readonly type!: string;
}

// Dapp Addresses

export class DappAddressDto extends AddressDto {
  readonly addressId!: string;
  readonly dapp!: string;  // e.g. 'friktion'
  readonly enabled!: boolean;
}

export class PutDappAddressDto {
  @IsNotEmpty()
  @IsBoolean()
  readonly enabled!: boolean;
}

export class PostDappAddressDto extends PutDappAddressDto {
  @IsNotEmpty()
  @IsBoolean()
  readonly addressId!: string;
}
