import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClubMembersComponent } from "./components/club-members/club-members.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ClubMembersComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClubMembersRoutingModule {}

export const routedComponents = [ClubMembersComponent];