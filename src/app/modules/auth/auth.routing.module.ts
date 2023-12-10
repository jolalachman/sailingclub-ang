import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RecoverPasswordComponent } from './components/recover-password/recover-password.component';
import { RegisterComponent } from './components/register/register.component';
import { ActivateAccountComponent } from './components/activate-account/activate-account.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
    path: 'login',
    component: LoginComponent,
    },
    {
      path: 'recover-password',
      component: RecoverPasswordComponent,
    },
    {
      path: 'register',
      component: RegisterComponent,
    },
    {
      path: 'activate-account',
      component: ActivateAccountComponent,
    },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}

export const routedComponents = [LoginComponent, RecoverPasswordComponent, RegisterComponent, ActivateAccountComponent];