export const createProductSchema = {
  type: 'object',
  required: ['name', 'description', 'price', 'category', 'inStock'],
  additionalProperties: false,
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    price: { type: 'number', exclusiveMinimum: 0 },
    category: { type: 'string' },
    inStock: { type: 'boolean' },
  },
};
