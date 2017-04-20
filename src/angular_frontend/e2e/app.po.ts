import { browser, element, by } from 'protractor';

export class TePage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('fg-root h1')).getText();
  }
}
