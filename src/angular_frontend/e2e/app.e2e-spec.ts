import { FgPage } from './app.po';

describe('fg App', () => {
  let page: FgPage;

  beforeEach(() => {
    page = new FgPage();
  });

  it('should have a title saying "fotogjengen"', async () => {
    page.navigateTo();
    expect(page.getHeaderText).toBe('fotogjengen', page.getHeaderText());
  });
});
