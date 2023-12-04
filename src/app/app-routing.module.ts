import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotLoggedInGuard } from './core/guards';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    canActivate: [],
    loadChildren: () =>
      import('./modules/home/home.module').then(
        m => m.HomeModule,
      ),
  },
  {
    path: 'auth',
    canActivate: [NotLoggedInGuard],
    loadChildren: () =>
      import('./modules/auth/auth.module').then(
        m => m.AuthModule,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
