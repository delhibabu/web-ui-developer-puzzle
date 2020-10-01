import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map } from 'rxjs/operators';
import { Book, ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  removeFromReadingList
} from '@tmo/books/data-access';

@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http
          .get<ReadingListItem[]>('/api/reading-list')
          .pipe(
            map(data => ReadingListActions.loadReadingListSuccess({ list: data }))
          )
      ),
      catchError(error =>
        of(ReadingListActions.loadReadingListError({ error }))
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book }) =>
        this.http.post('/api/reading-list', book).pipe(
          map(() => {
            const snackBarRef = this.snackBar.open(
              'Remove' + ' ' + book.title + ' ' + 'from reading list', 'Undo', { duration: 1000 }
            );
            snackBarRef.onAction().subscribe(() => {
              const item: ReadingListItem = {
                ...book, 
                bookId: book.id
              }
              this.store.dispatch(removeFromReadingList({ item }));
            });
            return ReadingListActions.confirmedAddToReadingList({ book });
          }),
          catchError(error => {
            const item: ReadingListItem = {
              ...book, 
              bookId: book.id
            }
            return of(ReadingListActions.failedAddToReadingList({ item }));
          })
        )
      )
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item }) =>
        this.http.delete(`/api/reading-list/${item.bookId}`).pipe(
          map(() => {
            const snackBarRef = this.snackBar.open(
              'Add' + ' ' + item.title + ' ' + 'to reading list', 'Undo', { duration: 1000 }
            );
            snackBarRef.onAction().subscribe(() => {
              const book: Book = {
                ...item,
                id: item.bookId
              }
              this.store.dispatch(addToReadingList({ book }));
            });
            return ReadingListActions.confirmedRemoveFromReadingList({ item });
          }),
          catchError(error => {
            const book: Book = {
              ...item,
              id: item.bookId
            }
            return of(ReadingListActions.failedRemoveFromReadingList({ book }));
          })
        )
      )
    )
  );

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(
    private readonly actions$: Actions,
    private readonly http: HttpClient,
    private readonly snackBar: MatSnackBar,
    private readonly store: Store
  ) {}
}
