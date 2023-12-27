import { Injectable } from "@angular/core";
import { ClubMembersListActions } from "../actions";
import { Store } from "@ngrx/store";
import { catchError, map, mergeMap, of, switchMap } from "rxjs";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { ClubMembersService } from "../../service/club-members.service";

@Injectable()
export class ClubMembersListEffect {
    constructor(
        private actions$: Actions,
        private store: Store,
        private service: ClubMembersService,
        ) {}

    load$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ClubMembersListActions.load),
            mergeMap(() =>
                this.service.all().pipe(
                    map(model => ClubMembersListActions.loadSuccess({model})),
                    catchError(error => of(ClubMembersListActions.loadFailure({error}))),
                )
            ),
        )
    });
}

export const effects = [ClubMembersListEffect];