import { Injectable } from "@angular/core";
import { YachtsListActions } from "../actions";
import { Store } from "@ngrx/store";
import { YachtsListSelector } from "../selectors";
import { catchError, map, mergeMap, of, switchMap } from "rxjs";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { YachtsService } from "../../service/yachts.service";

@Injectable()
export class YachtsListEffect {
    constructor(
        private actions$: Actions,
        private store: Store,
        private service: YachtsService,
        ) {}

    load$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(YachtsListActions.load),
            concatLatestFrom(() =>
                this.store.select(YachtsListSelector.selectFilters),
            ),
            mergeMap(([action, query]) => of({...query, ...action.filters})),
            switchMap(filters =>
                this.service.all(filters).pipe(
                    map(model => YachtsListActions.loadSuccess({model, filters})),
                    catchError(error => of(YachtsListActions.loadFailure({error}))),
                )
            ),
        )
    });
}

export const effects = [YachtsListEffect];