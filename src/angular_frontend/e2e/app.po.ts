import { browser, element, by } from 'protractor';

export class FgPage {
  navigateTo() {
    return browser.get('/');
  }

  getHeaderText() {
    return element(by.css('fg-root fg-nav header#header h1 a')).getText();
  }
}
