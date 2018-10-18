import { ThemeModel } from '../theme';

describe('Testing theme model', () => {
  it('can be created', () => {
    const theme = ThemeModel.create({ name: 'test theme' });
  });
});
