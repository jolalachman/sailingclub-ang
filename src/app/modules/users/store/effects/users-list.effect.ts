import { Injectable } from "@angular/core";
import { UsersListActions } from "../actions";
import { Store } from "@ngrx/store";
import { UsersListSelector } from "../selectors";
import { catchError, map, mergeMap, of, switchMap } from "rxjs";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { UsersService } from "../../service/users.service";

@Injectable()
export class UsersListEffect {
    constructor(
        private actions$: Actions,
        private store: Store,
        private service: UsersService,
        ) {}

    load$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(UsersListActions.load),
            mergeMap(() =>
                this.service.all().pipe(
                    map(model => UsersListActions.loadSuccess({model})),
                    catchError(error => of(UsersListActions.loadFailure({error}))),
                )
            ),
        )
    });
}

export const effects = [UsersListEffect];