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

  it('Then: I should revert book Added to reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const form = await $('form');
    const input = await $('input[type="search"]');
    const initialReadingList = await $$('.reading-list-item');
    await input.sendKeys('Python');
    await form.submit();

    const addBooksToListButton = await $$('[data-testing="add-to-list"] [ng-reflect-disabled="false"]');
    addBooksToListButton[0].click();

    const snackbarButton =  await $$('snack-bar-container .mat-button');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement(snackbarButton[0], 'Undo')
    );
    snackbarButton[0].click();
    const readingListBooksButton = await $$('[data-testing="reading-list"]');
    expect(initialReadingList.length).toEqual(readingListBooksButton.length);
  });

  it('Then: I should revert book removed from the reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    const initialReadingList = await $$('.reading-list-item');
    await readingListToggle.click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );

    const readingListBooksButton = await $$('[data-testing="reading-list"]');
    readingListBooksButton[0].click();

    const snackbarButton =  await $$('snack-bar-container .mat-button');

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(snackbarButton[0], 'Undo')
    );
    snackbarButton[0].click();
    expect(initialReadingList.length).toEqual(readingListBooksButton.length);
  });
});
