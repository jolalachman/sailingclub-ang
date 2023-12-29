import { Injectable } from "@angular/core";
import { ReportedNoticesListActions } from "../actions";
import { Store } from "@ngrx/store";
import { catchError, map, mergeMap, of, switchMap } from "rxjs";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { ReportedNoticesService } from "../../service/reported-notices.service";

@Injectable()
export class ReportedNoticesListEffect {
    constructor(
        private actions$: Actions,
        private store: Store,
        private service: ReportedNoticesService,
        ) {}

    load$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ReportedNoticesListActions.load),
            mergeMap(() =>
                this.service.all().pipe(
                    map(model => ReportedNoticesListActions.loadSuccess({model})),
                    catchError(error => of(ReportedNoticesListActions.loadFailure({error}))),
                )
            ),
        )
    });
}

export const effects = [ReportedNoticesListEffect];