import { values } from 'mobx';
import { getSnapshot } from 'mobx-state-tree';

import { CodeModel } from '../code';
import { CodeBookModel } from '../codebook';
import { CodeBookStore } from '../store';
import { ThemeModel } from '../theme';

let store: typeof CodeBookStore.Type;
const CODEBOOK = {
  name: 'test_codebook',
};

beforeEach(() => (store = CodeBookStore.create()));

it('can be created', () => {
  expect(store).not.toEqual(null);
  expect(store).not.toEqual(undefined);

  expect(getSnapshot(store.codes)).toEqual({});
  expect(getSnapshot(store.codeBooks)).toEqual({});
  expect(getSnapshot(store.themes)).toEqual({});
});

it('can add codebooks and get books', () => {
  const codebook = CodeBookModel.create(CODEBOOK);
  expect(store.codeBookBy(codebook.id)).toBeUndefined();
  store.addCodeBook(codebook);
  expect(store.codeBookBy(codebook.id)).toEqual(codebook);
});

it('can add codes to a specific codebook', () => {
  const codebook = CodeBookModel.create(CODEBOOK);
  const code = CodeModel.create({ name: 'test_code' });
  store.addCodeBook(codebook);
  store.createCodeAndAddTo(codebook.id, code);
  expect(store.codeBookBy(codebook.id)!.codeList).toContainEqual(code);
});

it('can remove codes of a specific codebook', () => {
  const codebook = CodeBookModel.create(CODEBOOK);
  const code = CodeModel.create({ name: 'test_code' });
  store.addCodeBook(codebook);
  store.createCodeAndAddTo(codebook.id, code);

  expect(store.codeBookBy(codebook.id)!.codeList).toContainEqual(code);

  const result = store.removeCodeOf(codebook.id, code.id);
  expect(store.codeBookBy(codebook.id)!.codeList).not.toContainEqual(code);
  expect(result).toBeTruthy();

  const falseResult = store.removeCodeOf('I do not exist', code.id);
  expect(falseResult).toBeFalsy();
});

it('can updates codes of a specific codebook', () => {
  const codebook = CodeBookModel.create(CODEBOOK);
  const code = CodeModel.create({ name: 'test_code' });
  const originalName = code.name;
  const updatedName = 'I have been changed!';

  expect(code.name).toEqual(originalName);

  store.addCodeBook(codebook);
  store.createCodeAndAddTo(codebook.id, code);
  expect(store.codeBookBy(codebook.id)!.codeList).toContainEqual(code);

  store.updateCodeOf(codebook.id, code.id, { name: updatedName });

  expect(code.name).not.toEqual(originalName);
  expect(code.name).toEqual(updatedName);
});

it('can add themes to a specific codebook', () => {
  const codebook = CodeBookModel.create(CODEBOOK);
  store.addCodeBook(codebook);

  const theme = ThemeModel.create({ name: 'theme 1' });
  store.createThemeAndAddTo(codebook.id, theme);

  expect(store.codeBookBy(codebook.id)).not.toBeFalsy();
  expect(values(store.codeBookBy(codebook.id)!.themes)).toContainEqual(theme);
});

it('can reference children from a theme', () => {
  const codebook = CodeBookModel.create(CODEBOOK);
  store.addCodeBook(codebook);

  const code = CodeModel.create({ name: 'code 1' });
  store.createCodeAndAddTo(codebook.id, code);

  const theme = ThemeModel.create({ name: 'theme 1' });
  theme.adopt([code]);
  store.createThemeAndAddTo(codebook.id, theme);

  expect(values(theme.children).length).toEqual(1);
  expect(values(theme.children)).toContainEqual(code);
});

it('can copy an existing codebook', () => {
  const codebook = CodeBookModel.create(CODEBOOK);
  const code1 = CodeModel.create({ name: 'test_code1' });
  const code2 = CodeModel.create({ name: 'test_code2' });

  store.addCodeBook(codebook);
  store.createCodeAndAddTo(codebook.id, code1);
  store.createCodeAndAddTo(codebook.id, code2);

  expect(store.codeBookList.length).toEqual(1);

  const copiedName = 'copied_codebook';
  const copied = store.copyCodeBookBy(codebook.id, {
    name: copiedName,
  });
  expect(store.codeBookList.length).toEqual(2);
  expect(copied).not.toBeNull();

  const { id: code1ID, ...code1WithoutID } = getSnapshot(code1);
  const { id: code2ID, ...code2WithoutID } = getSnapshot(code2);

  expect(copied!.name).toEqual(copiedName);
  expect(copied!.description).toEqual(codebook.description);
  expect(copied!.availableColors).toEqual(codebook.availableColors);
  expect(copied!.colorPalette).toEqual(codebook.colorPalette);

  expect(copied!.codeList[0]).not.toMatchObject(code1);
  expect(copied!.codeList[0]).toMatchObject(code1WithoutID);
  expect(copied!.codeList[1]).not.toMatchObject(code2);
  expect(copied!.codeList[1]).toMatchObject(code2WithoutID);
});
