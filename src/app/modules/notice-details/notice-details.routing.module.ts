import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NoticeDetailsComponent } from "./components/notice-details.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: NoticeDetailsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoticeDetailsRoutingModule {}

export const routedComponents = [NoticeDetailsComponent];