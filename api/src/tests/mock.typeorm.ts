export const getRepository = jest.fn(() => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  merge: jest.fn(),
}));