import type { Keystore } from 'ox';

export type UmKeystore = Keystore.Keystore & {
  meta: {
    type: string;
    note: string;
  };
  handle: string;
  name: string;
  address: string;
};