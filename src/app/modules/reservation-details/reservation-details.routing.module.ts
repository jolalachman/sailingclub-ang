import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReservationDetailsComponent } from "./components/reservation-details/reservation-details.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ReservationDetailsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservationDetailsRoutingModule {}

export const routedComponents = [ReservationDetailsComponent];