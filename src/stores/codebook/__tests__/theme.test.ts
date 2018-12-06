import { values } from 'mobx';
import { getSnapshot } from 'mobx-state-tree';
import { CodeModel } from '../code';
import { ThemeModel } from '../theme';

describe('Testing theme model', () => {
  // fixtures
  const THEME = {
    name: 'test theme',
    definition: 'A theme for testing',
    bgColor: 'random',
    tint: 'lala',
    children: {},
    id: '123',
  };

  it('can be created', () => {
    const theme = ThemeModel.create(THEME);
    expect(getSnapshot(theme)).toEqual(THEME);
  });

  it('can adopt code', () => {
    const theme = ThemeModel.create(THEME);
    expect(values(theme.children).length).toEqual(0);

    const code1 = CodeModel.create({ name: 'code1' });
    const code2 = CodeModel.create({ name: 'code2' });
    const children = [code1, code2];
    theme.adopt(children);

    // we can not check the children directly, because code is referenced in theme's children
    // and in this context, we do not have a place to store codes, instead, codes are stored in
    // codeBookStore
    expect(Object.values(theme.children.toJSON()).length).toEqual(2);
  });

  it('can adopt theme', () => {
    const theme = ThemeModel.create(THEME);
    expect(values(theme.children).length).toEqual(0);

    const theme2 = ThemeModel.create(THEME);
    const children = [theme2];
    theme.adopt(children);

    expect(values(theme.children).length).toEqual(1);
  });

  it('can adopt both code and theme', () => {
    const theme = ThemeModel.create(THEME);
    expect(values(theme.children).length).toEqual(0);

    const code1 = CodeModel.create({ name: 'code1' });
    const code2 = CodeModel.create({ name: 'code2' });
    const theme2 = ThemeModel.create(THEME);

    const children = [code1, code2, theme2];
    theme.adopt([code1, code2, theme2]);

    expect(Object.values(theme.children.toJSON()).length).toEqual(
      children.length
    );
  });
});
