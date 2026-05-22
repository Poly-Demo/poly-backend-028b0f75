import { describe, it, expect, vi, beforeEach } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { cartRoutes } from './cart.routes.js';

vi.mock('@polydemo/service-cart', () => ({
  cartService: {
    getCart: vi.fn().mockImplementation((cartId: string) => {
      if (cartId === 'cart-123') {
        return {
          id: 'cart-123',
          items: [
            {
              productId: '1',
              name: 'Test Product',
              price: 99.99,
              quantity: 2,
              image: 'x.jpg',
            },
          ],
          total: 199.98,
        };
      }
      return { id: cartId, items: [], total: 0 };
    }),
    addItem: vi.fn().mockReturnValue({
      id: 'cart-123',
      items: [
        {
          productId: '1',
          name: 'Test Product',
          price: 99.99,
          quantity: 2,
          image: 'x.jpg',
        },
      ],
      total: 199.98,
    }),
    updateItem: vi.fn().mockReturnValue({
      id: 'cart-123',
      items: [
        {
          productId: '1',
          name: 'Test Product',
          price: 99.99,
          quantity: 2,
          image: 'x.jpg',
        },
      ],
      total: 199.98,
    }),
    removeItem: vi
      .fn()
      .mockReturnValue({ id: 'cart-123', items: [], total: 0 }),
  },
}));

describe('Cart Routes', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = Fastify();
    await app.register(cartRoutes);
    await app.ready();
  });

  describe('GET /api/cart/:cartId', () => {
    it('should return cart', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/cart/cart-123',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.id).toBe('cart-123');
      expect(Array.isArray(body.items)).toBe(true);
      expect(typeof body.total).toBe('number');
    });

    it('should return empty cart for unknown id', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/cart/new-cart',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.items).toHaveLength(0);
      expect(body.total).toBe(0);
    });
  });

  describe('POST /api/cart/:cartId/items', () => {
    it('should add item and return updated cart', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/cart/cart-123/items',
        payload: { productId: '1', quantity: 2 },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.items).toHaveLength(1);
    });
  });

  describe('PATCH /api/cart/:cartId/items/:productId', () => {
    it('should update item quantity and return updated cart', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: '/api/cart/cart-123/items/1',
        payload: { quantity: 5 },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.id).toBe('cart-123');
    });
  });

  describe('DELETE /api/cart/:cartId/items/:productId', () => {
    it('should remove item and return updated cart', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/api/cart/cart-123/items/1',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.items).toHaveLength(0);
      expect(body.total).toBe(0);
    });
  });
});
