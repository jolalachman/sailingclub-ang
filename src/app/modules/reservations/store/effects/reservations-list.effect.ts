import { Injectable } from "@angular/core";
import { ReservationsListActions } from "../actions";
import { Store } from "@ngrx/store";
import { ReservationsListSelector } from "../selectors";
import { catchError, map, mergeMap, of, switchMap } from "rxjs";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { ReservationsService } from "../../service/reservations.service";

@Injectable()
export class ReservationsListEffect {
    constructor(
        private actions$: Actions,
        private store: Store,
        private service: ReservationsService,
        ) {}

    load$ = createEffect(() =>
        this.actions$.pipe(
          ofType(ReservationsListActions.load),
          mergeMap(() =>
            this.service.all().pipe(
              map(model => ReservationsListActions.loadSuccess({ model })), 
              catchError(error => of(ReservationsListActions.loadFailure({ error })))
            )
          )
        )
      );
}

export const effects = [ReservationsListEffect];