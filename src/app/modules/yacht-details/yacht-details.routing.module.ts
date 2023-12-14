import { RouterModule, Routes } from "@angular/router";
import { YachtDetailsComponent } from "./components/yacht-details.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: YachtDetailsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YachtDetailsRoutingModule {}

export const routedComponents = [YachtDetailsComponent];