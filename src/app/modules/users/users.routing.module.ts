import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UsersComponent } from "./components/users/users.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: UsersComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}

export const routedComponents = [UsersComponent];