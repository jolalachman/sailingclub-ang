import { Injectable } from "@angular/core";
import { YachtsListActions } from "../actions";
import { catchError, map, mergeMap, of, switchMap } from "rxjs";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { YachtsService } from "../../service/yachts.service";

@Injectable()
export class YachtsListEffect {
    constructor(
        private actions$: Actions,
        private service: YachtsService,
        ) {}

    load$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(YachtsListActions.load),
            mergeMap(() =>
                this.service.all().pipe(
                    map(model => YachtsListActions.loadSuccess({model})),
                    catchError(error => of(YachtsListActions.loadFailure({error}))),
                )
            ),
        )
    });
}

export const effects = [YachtsListEffect];