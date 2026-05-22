import '@fastify/swagger';
import { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { cartService } from '@polydemo/service-cart';

const cartSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          productId: { type: 'string' },
          name: { type: 'string' },
          price: { type: 'number' },
          quantity: { type: 'number' },
          image: { type: 'string' },
        },
      },
    },
    total: { type: 'number' },
  },
};

export async function cartRoutes(fastify: FastifyInstance) {
  const getCartOpts: RouteShorthandOptions = {
    schema: {
      tags: ['cart'],
      summary: 'Get cart by ID',
      params: {
        type: 'object',
        properties: { cartId: { type: 'string' } },
        required: ['cartId'],
      },
      response: { 200: cartSchema },
    },
  };

  fastify.get<{ Params: { cartId: string } }>(
    '/api/cart/:cartId',
    getCartOpts,
    async (request) => {
      return cartService.getCart(request.params.cartId);
    }
  );

  const addItemOpts: RouteShorthandOptions = {
    schema: {
      tags: ['cart'],
      summary: 'Add item to cart',
      params: {
        type: 'object',
        properties: { cartId: { type: 'string' } },
        required: ['cartId'],
      },
      body: {
        type: 'object',
        properties: {
          productId: { type: 'string' },
          quantity: { type: 'number' },
        },
        required: ['productId', 'quantity'],
      },
      response: { 200: cartSchema },
    },
  };

  fastify.post<{
    Params: { cartId: string };
    Body: { productId: string; quantity: number };
  }>('/api/cart/:cartId/items', addItemOpts, async (request, reply) => {
    const { cartId } = request.params;
    const { productId, quantity } = request.body;
    try {
      return cartService.addItem(cartId, productId, quantity);
    } catch (err) {
      reply.code(404);
      return { message: (err as Error).message };
    }
  });

  const updateItemOpts: RouteShorthandOptions = {
    schema: {
      tags: ['cart'],
      summary: 'Update item quantity in cart',
      params: {
        type: 'object',
        properties: {
          cartId: { type: 'string' },
          productId: { type: 'string' },
        },
        required: ['cartId', 'productId'],
      },
      body: {
        type: 'object',
        properties: { quantity: { type: 'number' } },
        required: ['quantity'],
      },
      response: { 200: cartSchema },
    },
  };

  fastify.patch<{
    Params: { cartId: string; productId: string };
    Body: { quantity: number };
  }>('/api/cart/:cartId/items/:productId', updateItemOpts, async (request) => {
    const { cartId, productId } = request.params;
    const { quantity } = request.body;
    return cartService.updateItem(cartId, productId, quantity);
  });

  const removeItemOpts: RouteShorthandOptions = {
    schema: {
      tags: ['cart'],
      summary: 'Remove item from cart',
      params: {
        type: 'object',
        properties: {
          cartId: { type: 'string' },
          productId: { type: 'string' },
        },
        required: ['cartId', 'productId'],
      },
      response: { 200: cartSchema },
    },
  };

  fastify.delete<{ Params: { cartId: string; productId: string } }>(
    '/api/cart/:cartId/items/:productId',
    removeItemOpts,
    async (request) => {
      const { cartId, productId } = request.params;
      return cartService.removeItem(cartId, productId);
    }
  );
}
