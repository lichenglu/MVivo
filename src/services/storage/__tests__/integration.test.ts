import Storage from '../storage';

describe('integration test on storage class', () => {
  // fixtures
  const VALUE_OBJECT = { x: 1 };
  const VALUE_STRING = JSON.stringify(VALUE_OBJECT);
  const VALUE_OBJECT2 = { x: 2 };
  const VALUE_STRING2 = JSON.stringify(VALUE_OBJECT2);

  let storage: Storage;
  beforeEach(() => (storage = new Storage()));
  afterEach(async () => storage.clear());

  it('save and load', async () => {
    await storage.save('key', VALUE_OBJECT);
    const value = await storage.load('key');
    expect(value).toEqual(JSON.parse(VALUE_STRING));
  });

  it('remove', async () => {
    await storage.save('key', VALUE_OBJECT);
    const originalVal = await storage.load('key');
    expect(originalVal).toEqual(JSON.parse(VALUE_STRING));

    await storage.remove('key');
    const value = await storage.load('key');
    expect(value).toEqual(null);
  });

  it('clear', async () => {
    await storage.save('key1', VALUE_OBJECT);
    await storage.save('key2', VALUE_OBJECT2);
    const val1 = await storage.load('key1');
    const val2 = await storage.load('key2');

    expect(val1).toEqual(JSON.parse(VALUE_STRING));
    expect(val2).toEqual(JSON.parse(VALUE_STRING2));

    await storage.clear();
    const _val1 = await storage.load('key1');
    const _val2 = await storage.load('key2');
    expect(_val1).toEqual(null);
    expect(_val2).toEqual(null);
  });
});
