import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NoticesComponent } from "./components/notices.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: NoticesComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoticesRoutingModule {}

export const routedComponents = [NoticesComponent];