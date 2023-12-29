import { Injectable } from "@angular/core";
import { MyReservationsListActions } from "../actions";
import { Store } from "@ngrx/store";
import { catchError, combineLatest, map, mergeMap, of, switchMap } from "rxjs";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { MyReservationsService } from "../../service/my-reservations.service";
import { LoginService } from "src/app/core/service/login/login.service";

@Injectable()
export class MyReservationsListEffect {
    constructor(
        private actions$: Actions,
        private store: Store,
        private service: MyReservationsService,
        private loginService: LoginService,
        ) {}

    load$ = createEffect(() =>
        this.actions$.pipe(
          ofType(MyReservationsListActions.load),
          switchMap(() =>
            this.loginService.userInfo.asObservable().pipe(
              switchMap(userInfo =>
                this.service.all(userInfo?.id ?? '').pipe(
                      map(model => MyReservationsListActions.loadSuccess({ model })), 
                      catchError(error => of(MyReservationsListActions.loadFailure({ error })))
                    )
                )
            )
          )
        )
      );
}

export const effects = [MyReservationsListEffect];