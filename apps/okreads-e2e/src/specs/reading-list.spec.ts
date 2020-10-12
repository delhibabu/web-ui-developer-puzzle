import { $, $$, browser, ExpectedConditions } from 'protractor';

describe('When: I use the reading list feature', () => {
  it('Then: I should see my reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
  });

  it('Then: I should see mark book as finished', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    await $('[data-testing="close-reading-list"]').click();

    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('java');
    await form.submit();

    const addBooksToListButton = await $$('[data-testing="add-to-list"] [ng-reflect-disabled="false"]');
    addBooksToListButton[0].click();

    await readingListToggle.click();
    const markAsFinishedButton = await $$('[data-testing="mark-as-finish"]');
    await browser.wait(ExpectedConditions.visibilityOf(markAsFinishedButton[0]));
    await markAsFinishedButton[0].click();

    const markAsFinishedText = await $$('[data-testing="finished-text"]');
    expect(ExpectedConditions.visibilityOf(markAsFinishedText[0]));
  })
});
