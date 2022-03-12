export class Web2AddressDto {
  readonly key!: string;
  readonly verified!: boolean;
}

export class DappWeb2AddressDto extends Web2AddressDto {
  readonly dapp!: string;
  readonly enabled!: boolean;
}
