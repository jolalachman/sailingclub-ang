import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserDetailsComponent } from "./components/user-details/user-details.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: UserDetailsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserDetailsRoutingModule {}

export const routedComponents = [UserDetailsComponent];