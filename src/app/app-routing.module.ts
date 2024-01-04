import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, LoggedInGuard, NotLoggedInGuard } from './core/guards';
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
    canActivate: [LoggedInGuard, AuthGuard],
    data: {
      allowedRoles: ['SAILOR', 'MAT', 'BOSMAN', 'ADMIN']
    },
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
    canActivate: [LoggedInGuard, AuthGuard],
    data: {
      allowedRoles: ['SAILOR', 'MAT', 'BOSMAN', 'ADMIN']
    },
    loadChildren: () =>
      import('./modules/reservation-details/reservation-details.module').then(
        m => m.ReservationDetailsModule,
      ),
  },
  {
    path: 'club-members',
    component: LayoutComponent,
    canActivate: [LoggedInGuard, AuthGuard],
    data: {
      allowedRoles: ['BOSMAN']
    },
    loadChildren: () =>
      import('./modules/club-members/club-members.module').then(
        m => m.ClubMembersModule,
      ),
  },
  {
    path: 'notices',
    component: LayoutComponent,
    canActivate: [LoggedInGuard, AuthGuard],
    data: {
      allowedRoles: ['BOSMAN', 'ADMIN']
    },
    loadChildren: () =>
      import('./modules/notices/notices.module').then(
        m => m.NoticesModule,
      ),
  },
  {
    path: 'notice-details/:noticeId',
    component: LayoutComponent,
    canActivate: [LoggedInGuard, AuthGuard],
    data: {
      allowedRoles: ['SAILOR', 'MAT', 'BOSMAN', 'ADMIN']
    },
    loadChildren: () =>
      import('./modules/notice-details/notice-details.module').then(
        m => m.NoticeDetailsModule,
      ),
  },
  {
    path: 'my-reservations',
    component: LayoutComponent,
    canActivate: [LoggedInGuard, AuthGuard],
    data: {
      allowedRoles: ['SAILOR', 'MAT', 'BOSMAN']
    },
    loadChildren: () =>
      import('./modules/my-reservations/my-reservations.module').then(
        m => m.MyReservationsModule,
      ),
  },
  {
    path: 'users',
    component: LayoutComponent,
    canActivate: [LoggedInGuard, AuthGuard],
    data: {
      allowedRoles: ['ADMIN']
    },
    loadChildren: () =>
      import('./modules/users/users.module').then(
        m => m.UsersModule,
      ),
  },
  {
    path: 'user-details/:userId',
    component: LayoutComponent,
    canActivate: [LoggedInGuard, AuthGuard],
    data: {
      allowedRoles: ['BOSMAN', 'ADMIN']
    },
    loadChildren: () =>
      import('./modules/user-details/user-details.module').then(
        m => m.UserDetailsModule,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
