import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedInGuard, NotLoggedInGuard } from './core/guards';
import { AuthLayoutComponent, LayoutComponent } from './layout/layouts';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: LayoutComponent,
    canActivate: [],
    loadChildren: () =>
      import('./modules/home/home.module').then(
        m => m.HomeModule,
      ),
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [NotLoggedInGuard],
    loadChildren: () =>
      import('./modules/auth/auth.module').then(
        m => m.AuthModule,
      ),
  },
  {
    path: 'reservations',
    component: LayoutComponent,
    canActivate: [LoggedInGuard],
    loadChildren: () =>
      import('./modules/reservations/reservations.module').then(
        m => m.ReservationsModule,
      ),
  },
  {
    path: 'account',
    component: LayoutComponent,
    canActivate: [LoggedInGuard],
    loadChildren: () =>
      import('./modules/account/account.module').then(
        m => m.AccountModule,
      ),
  },
  {
    path: 'yachts',
    component: LayoutComponent,
    loadChildren: () =>
      import('./modules/yachts/yachts.module').then(
        m => m.YachtsModule,
      ),
  },
  {
    path: 'yacht-details/:yachtId',
    component: LayoutComponent,
    loadChildren: () =>
      import('./modules/yacht-details/yacht-details.module').then(
        m => m.YachtDetailsModule,
      ),
  },
  {
    path: 'reservation-details/:reservationId',
    component: LayoutComponent,
    loadChildren: () =>
      import('./modules/reservation-details/reservation-details.module').then(
        m => m.ReservationDetailsModule,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
