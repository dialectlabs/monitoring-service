export class AddressDto {
  readonly key!: string;
  readonly verified!: boolean;
}

export class DappAddressDto extends AddressDto {
  readonly dapp!: string;
  readonly enabled!: boolean;
}

export class PostDappAddressDto {
  readonly key!: string;
  readonly value!: string;
  readonly enabled!: boolean;
}

export class PutDappAddressDto {
  readonly key!: string;
  readonly value?: string;
  readonly enabled!: boolean;
}

export class DeleteDappAddressDto {
  readonly key!: string;
}
