import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi'
import { UserSchema, CreateUserSchema } from './schemas/user.schema'
import { RegisterSchema, LoginSchema, LoginResponseSchema } from './schemas/auth.schema'
import { ClienteSchema, ConsegnaSchema, CreateClienteSchema, CreateConsegnaSchema, UpdateClienteSchema, UpdateConsegnaSchema } from './schemas/consegna.schema'
import { z } from 'zod'
import { GeocodingResponseSchema } from './schemas/geocoding.schema'

const registry = new OpenAPIRegistry()

const bearerAuth = registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
})

// ─── Registrazione schemi ─────────────────────────────────────────

registry.register('User', UserSchema)
registry.register('Register', RegisterSchema)
registry.register('Login', LoginSchema)
registry.register('Cliente', ClienteSchema)
registry.register('CreateCliente', CreateClienteSchema)
registry.register('Consegna', ConsegnaSchema)
registry.register('CreateConsegna', CreateConsegnaSchema)

// ─── Auth ─────────────────────────────────────────────────────────

registry.registerPath({
  method: 'post',
  path: '/api/auth/register',
  summary: 'Registra un nuovo utente',
  request: {
    body: { content: { 'application/json': { schema: RegisterSchema } } },
  },
  responses: {
    201: { description: 'Utente registrato' },
    400: { description: 'Dati non validi' },
    409: { description: 'Email già esistente' },
  },
})

registry.registerPath({
  method: 'post',
  path: '/api/auth/login',
  summary: 'Login e ottieni JWT',
  request: {
    body: { content: { 'application/json': { schema: LoginSchema } } },
  },
  responses: {
    200: {
      description: 'Login riuscito',
      content: { 'application/json': { schema: LoginResponseSchema } },
    },
    401: { description: 'Credenziali non valide' },
  },
})

registry.registerPath({
  method: 'post',
  path: '/api/auth/refresh',
  summary: 'Ottieni nuovo access token (con refresh token rotation)',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            refreshToken: z.string().openapi({ example: 'eyJhbGciOiJIUzI1NiJ9...' }),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Nuovi token (rotation)',
      content: { 'application/json': { schema: LoginResponseSchema } },
    },
    401: { description: 'Refresh token non valido o scaduto' },
  },
})

registry.registerPath({
  method: 'post',
  path: '/api/auth/logout',
  summary: 'Logout e invalida refresh token',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            refreshToken: z.string().openapi({ example: 'eyJhbGciOiJIUzI1NiJ9...' }),
          }),
        },
      },
    },
  },
  responses: {
    200: { description: 'Logout effettuato' },
    400: { description: 'Refresh token mancante' },
  },
})

// ─── Users ────────────────────────────────────────────────────────

registry.registerPath({
  method: 'get',
  path: '/api/users',
  summary: 'Lista tutti gli utenti',
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: {
      description: 'Lista utenti',
      content: { 'application/json': { schema: z.array(UserSchema) } },
    },
    401: { description: 'Non autorizzato' },
  },
})

registry.registerPath({
  method: 'post',
  path: '/api/users',
  summary: 'Crea un utente',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    body: { content: { 'application/json': { schema: CreateUserSchema } } },
  },
  responses: {
    201: {
      description: 'Utente creato',
      content: { 'application/json': { schema: UserSchema } },
    },
    400: { description: 'Dati non validi' },
    401: { description: 'Non autorizzato' },
  },
})

// ─── Clienti ──────────────────────────────────────────────────────

registry.registerPath({
  method: 'get',
  path: '/api/clienti',
  summary: 'Lista tutti i clienti',
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: {
      description: 'Lista clienti',
      content: { 'application/json': { schema: z.array(ClienteSchema) } },
    },
    401: { description: 'Non autorizzato' },
  },
})

registry.registerPath({
  method: 'post',
  path: '/api/clienti',
  summary: 'Crea un cliente',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    body: { content: { 'application/json': { schema: CreateClienteSchema } } },
  },
  responses: {
    201: {
      description: 'Cliente creato',
      content: { 'application/json': { schema: ClienteSchema } },
    },
    400: { description: 'Dati non validi' },
    401: { description: 'Non autorizzato' },
  },
})

registry.registerPath({
  method: 'get',
  path: '/api/clienti/{id}',
  summary: 'Ottieni un cliente per ID',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: z.object({ id: z.string().openapi({ example: '1' }) }),
  },
  responses: {
    200: {
      description: 'Cliente trovato',
      content: { 'application/json': { schema: ClienteSchema } },
    },
    401: { description: 'Non autorizzato' },
    404: { description: 'Cliente non trovato' },
  },
})

registry.registerPath({
  method: 'patch',
  path: '/api/clienti/{id}',
  summary: 'Aggiorna un cliente',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: z.object({ id: z.string().openapi({ example: '1' }) }),
    body: { content: { 'application/json': { schema: UpdateClienteSchema } } },
  },
  responses: {
    200: {
      description: 'Cliente aggiornato',
      content: { 'application/json': { schema: ClienteSchema } },
    },
    400: { description: 'Dati non validi' },
    401: { description: 'Non autorizzato' },
    404: { description: 'Cliente non trovato' },
  },
})

registry.registerPath({
  method: 'delete',
  path: '/api/clienti/{id}',
  summary: 'Elimina un cliente',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: z.object({ id: z.string().openapi({ example: '1' }) }),
  },
  responses: {
    204: { description: 'Cliente eliminato' },
    401: { description: 'Non autorizzato' },
    404: { description: 'Cliente non trovato' },
    409: { description: 'Cliente ha consegne attive' },
  },
})

// ─── Consegne ─────────────────────────────────────────────────────

registry.registerPath({
  method: 'get',
  path: '/api/consegna',
  summary: 'Lista tutte le consegne',
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: {
      description: 'Lista consegne',
      content: { 'application/json': { schema: z.array(ConsegnaSchema) } },
    },
    401: { description: 'Non autorizzato' },
  },
})

registry.registerPath({
  method: 'post',
  path: '/api/consegna',
  summary: 'Crea una consegna',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    body: { content: { 'application/json': { schema: CreateConsegnaSchema } } },
  },
  responses: {
    201: {
      description: 'Consegna creata',
      content: { 'application/json': { schema: ConsegnaSchema } },
    },
    400: { description: 'Dati non validi' },
    401: { description: 'Non autorizzato' },
  },
})

registry.registerPath({
  method: 'get',
  path: '/api/consegna/{id}',
  summary: 'Ottieni una consegna per ID',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: z.object({ id: z.string().openapi({ example: '1' }) }),
  },
  responses: {
    200: {
      description: 'Consegna trovata',
      content: { 'application/json': { schema: ConsegnaSchema } },
    },
    401: { description: 'Non autorizzato' },
    404: { description: 'Consegna non trovata' },
  },
})

registry.registerPath({
  method: 'patch',
  path: '/api/consegna/{id}',
  summary: 'Aggiorna una consegna',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: z.object({ id: z.string().openapi({ example: '1' }) }),
    body: { content: { 'application/json': { schema: UpdateConsegnaSchema } } },
  },
  responses: {
    200: {
      description: 'Consegna aggiornata',
      content: { 'application/json': { schema: ConsegnaSchema } },
    },
    400: { description: 'Dati non validi' },
    401: { description: 'Non autorizzato' },
    404: { description: 'Consegna non trovata' },
  },
})

registry.registerPath({
  method: 'delete',
  path: '/api/consegna/{id}',
  summary: 'Elimina una consegna',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: z.object({ id: z.string().openapi({ example: '1' }) }),
  },
  responses: {
    204: { description: 'Consegna eliminata' },
    401: { description: 'Non autorizzato' },
    404: { description: 'Consegna non trovata' },
  },
})

// ─── Tracking (pubblico) ──────────────────────────────────────────

registry.registerPath({
  method: 'get',
  path: '/api/tracking',
  summary: 'Tracciamento pubblico consegna',
  request: {
    query: z.object({
      chiave: z.string().optional().openapi({ example: 'ck_abc123' }),
      dataRitiro: z.string().optional().openapi({ example: '2024-01-15' }),
    }),
  },
  responses: {
    200: {
      description: 'Consegna trovata',
      content: { 'application/json': { schema: ConsegnaSchema } },
    },
    400: { description: 'Parametro mancante' },
    404: { description: 'Consegna non trovata' },
  },
})

registry.registerPath({
  method: 'get',
  path: '/api/geocoding',
  summary: 'Ricerca indirizzo tramite Nominatim (proxy)',
  request: {
    query: z.object({
      q: z.string().min(3).openapi({ example: 'Via Roma Milano' }),
    }),
  },
  responses: {
    200: {
      description: 'Risultati geocoding',
      content: { 'application/json': { schema: GeocodingResponseSchema } },
    },
    400: { description: 'Query troppo corta' },
    502: { description: 'Errore Nominatim' },
  },
})

// ─── Generator ────────────────────────────────────────────────────

export function getApiDocs() {
  const generator = new OpenApiGeneratorV3(registry.definitions)
  return generator.generateDocument({
    openapi: '3.0.0',
    info: { title: 'Corriere API', version: '1.0.0' },
    servers: [{ url: 'http://localhost:3000' }],
  })
}