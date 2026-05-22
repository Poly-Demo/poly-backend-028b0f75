import { Cart } from '@polydemo/api-types';

export class CartRepository {
  private store = new Map<string, Cart>();

  findById(cartId: string): Cart | undefined {
    return this.store.get(cartId);
  }

  upsert(cartId: string, cart: Cart): Cart {
    this.store.set(cartId, cart);
    return cart;
  }
}

export const cartRepository = new CartRepository();
