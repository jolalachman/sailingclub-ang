import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
  // {
  //   path: 'person-details/:employeeId',
  //   canActivate: [],
  //   loadChildren: () =>
  //     import('./modules/person-details/person-details.module').then(
  //       m => m.PersonDetailsModule,
  //     ),
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
