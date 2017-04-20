import { TePage } from './app.po';

describe('te App', () => {
  let page: TePage;

  beforeEach(() => {
    page = new TePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('fg works!');
  });
});
