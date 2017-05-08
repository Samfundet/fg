import { FgPage } from './app.po';

describe('fg App', () => {
  let page: FgPage;

  beforeEach(() => {
    page = new FgPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('fg works!');
  });
});
