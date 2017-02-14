import { NgFgPage } from './app.po';

describe('ng-fg App', function() {
  let page: NgFgPage;

  beforeEach(() => {
    page = new NgFgPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
