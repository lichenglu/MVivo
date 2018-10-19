import Storage from '../storage';

const VALUE_OBJECT = { x: 1 };
const VALUE_STRING = JSON.stringify(VALUE_OBJECT);

const mockLoad = jest.fn().mockReturnValue(Promise.resolve(VALUE_STRING));
const mockSave = jest.fn();
const mockRemove = jest.fn();
const mockClear = jest.fn();

jest.mock('../storage', () => {
  return jest.fn().mockImplementation(() => {
    return {
      clear: mockClear,
      load: mockLoad,
      remove: mockRemove,
      save: mockSave,
    };
  });
});

beforeEach(() => {
  jest.clearAllMocks();
});

it('construct', () => {
  const storage = new Storage();
  expect(Storage).toHaveBeenCalledTimes(1);
});

it('load', async () => {
  const storage = new Storage();
  const value = await storage.load('key');
  expect(storage.load).toHaveBeenCalledWith('key');
  expect(value).toEqual(VALUE_STRING);
});

it('save', async () => {
  const storage = new Storage();
  storage.save('key', 'value');
  expect(storage.save).toHaveBeenCalledWith('key', 'value');
  expect(storage.save).toHaveBeenCalledTimes(1);
});

it('remove', async () => {
  const storage = new Storage();
  storage.remove('key');
  expect(storage.remove).toHaveBeenCalledWith('key');
  expect(storage.remove).toHaveBeenCalledTimes(1);
});

it('clear', async () => {
  const storage = new Storage();
  storage.clear();
  expect(storage.clear).toHaveBeenCalledWith();
  expect(storage.clear).toHaveBeenCalledTimes(1);
});
