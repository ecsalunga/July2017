import { July2017Page } from './app.po';

describe('july2017 App', () => {
  let page: July2017Page;

  beforeEach(() => {
    page = new July2017Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
