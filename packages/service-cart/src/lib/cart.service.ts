import { Cart } from '@polydemo/api-types';
import { CartRepository, cartRepository } from '@polydemo/data-cart';
import {
  ProductsRepository,
  productsRepository,
} from '@polydemo/data-products';

export class CartService {
  constructor(
    private cartRepo: CartRepository = cartRepository,
    private productsRepo: ProductsRepository = productsRepository
  ) {}

  getCart(cartId: string): Cart {
    return (
      this.cartRepo.findById(cartId) ?? { id: cartId, items: [], total: 0 }
    );
  }

  addItem(cartId: string, productId: string, quantity: number): Cart {
    const product = this.productsRepo.findById(Number(productId));
    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }

    const cart = this.getCart(cartId);
    const existing = cart.items.find((i) => i.productId === productId);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
      });
    }

    cart.total = this.calcTotal(cart);
    return this.cartRepo.upsert(cartId, cart);
  }

  updateItem(cartId: string, productId: string, quantity: number): Cart {
    const cart = this.getCart(cartId);

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.productId !== productId);
    } else {
      const item = cart.items.find((i) => i.productId === productId);
      if (item) {
        item.quantity = quantity;
      }
    }

    cart.total = this.calcTotal(cart);
    return this.cartRepo.upsert(cartId, cart);
  }

  removeItem(cartId: string, productId: string): Cart {
    const cart = this.getCart(cartId);
    cart.items = cart.items.filter((i) => i.productId !== productId);
    cart.total = this.calcTotal(cart);
    return this.cartRepo.upsert(cartId, cart);
  }

  private calcTotal(cart: Cart): number {
    return cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }
}

export const cartService = new CartService();
