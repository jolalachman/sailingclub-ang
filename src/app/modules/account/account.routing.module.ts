import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

const routes: Routes = [
    {
        path: '',
        component: MyAccountComponent,
    },
    {
      path: 'change-password',
      component: ChangePasswordComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}

export const routedComponents = [MyAccountComponent, ChangePasswordComponent];