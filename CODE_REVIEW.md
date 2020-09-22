# Improvements:

* Website is not responsive for mobile devices, made it responsive.
* Private member variable ‘http' is never reassigned, marked it as 'readonly’. Added readonly (private readonly actions$: Actions, private readonly http: HttpClient) for actions$ and http in readling-list.effects.ts file.
* this.store.select(getAllBooks) value is not unsubscribing after Subscription in book-searcg.Component.ts file may result. If a subscription is not closed the function callback attached to it will be continuously called, this may poses a huge memory leak and performance issue. Added async pipe to avoid potential memory leaks.
* When user searches for a keyword, we can use a service to cache the results of /api/books/search?q=${action.term} api response and retrieve the data from cache if he searches for same keyword again thereby avoid hitting same endpoint multiple times. Since reading the data from cache is extremely fast, this improves overall performance of the application.
* We can add routing for search key value. Even if user reloads the page, he can land on the search item.
* I thought if catchError is placed outside of the flattening operator, once the error is produced, catchError handles it and closes the stream, which means the effect will dies silently and will not handle further actions if required. So, I placed catchError inside the switchMap operator.
* Added missing methods in reading-list reducer file.
* Updated naming for book in book-search.component.html(*ngFor="let book of books$ | async").
* Removed OnInIt life cycle hook and moved logic in the declaration of book-search.component.ts file.


# Accessibility Issues:

# Lighthouse Accessibility issues:
* 'Names and labels' - Buttons do not have an accessible name. Added aria-label attribute (aria-label="Search Book") for search button to clearly describe the action to anyone using an assistive technology
* 'Contrast'- Background and foreground colors do not have a sufficient contrast ratio. Updated color to black (color: $black;) to Reading List element to maintain sufficiently high contrast ratio.

# Manually check for accessibility issues:
* Image element Book--content is missing alt attribute, added(alt="b.title + ' Content Cover'"). Image element should have an "alt" attribute, it provides a textual alternative to an image.
* Form elements like input element should have associated labels, they ensure that form elements are announced properly. Used <label> for search input element.
* Image element reading-list-item--cover is missing alt attribute. Added alt attribute (alt="Reading List Cover") for Textual alternative.
* We can use semantic tags like section instead of just using div. Used section tag instead of div for book grid.
* An anchor tag is not appropriate for click event(Search Book Example) in book-search.component.html file, updated to button tag.