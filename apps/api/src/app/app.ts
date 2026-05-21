import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FastifyInstance } from 'fastify';
import AutoLoad from '@fastify/autoload';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { productsRoutes } from '@polydemo/api-products';

/* eslint-disable-next-line */
export interface AppOptions {}

const dirname = path.dirname(fileURLToPath(import.meta.url));

export async function app(fastify: FastifyInstance, opts: AppOptions) {
  // CORS
  await fastify.register(cors, {
    origin: true,
  });

  // Swagger
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'PolyShopping API',
        version: '1.0.0',
      },
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
  });

  // Load plugins
  fastify.register(AutoLoad, {
    dir: path.join(dirname, 'plugins'),
    options: { ...opts },
  });

  // Register product routes
  await fastify.register(productsRoutes);

  // Load other routes
  fastify.register(AutoLoad, {
    dir: path.join(dirname, 'routes'),
    options: { ...opts },
  });
}
