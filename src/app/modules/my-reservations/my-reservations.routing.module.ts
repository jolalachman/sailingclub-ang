import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MyReservationsComponent } from "./components/my-reservations.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: MyReservationsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyReservationsRoutingModule {}

export const routedComponents = [MyReservationsComponent];