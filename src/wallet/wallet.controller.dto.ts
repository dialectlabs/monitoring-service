export class AddressDto {
  readonly key!: string;
  readonly verified!: boolean;
}

export class DappAddressDto extends AddressDto {
  readonly dapp!: string;
  readonly enabled!: boolean;
}
