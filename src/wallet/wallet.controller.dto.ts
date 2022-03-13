// Addresses

export class AddressDto {
  readonly id!: string;
  readonly type!: string; // e.g. 'email' or 'sms'
  readonly verified!: boolean;
}

export class PutAddressDto {
  readonly value!: string;
}

export class PostAddressDto extends PutAddressDto {
  readonly type!: string;
}

// Dapp Addresses


export class DappAddressDto extends AddressDto {
  readonly addressId!: string;
  readonly dapp!: string;  // e.g. 'friktion'
  readonly enabled!: boolean;
}

export class PutDappAddressDto {
  readonly enabled!: boolean;
}

export class PostDappAddressDto extends PutDappAddressDto {
  readonly addressId!: string;
}
