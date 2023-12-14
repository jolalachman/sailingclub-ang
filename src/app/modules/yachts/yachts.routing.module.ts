import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YachtsComponent } from './components/yachts/yachts.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: YachtsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YachtsRoutingModule {}

export const routedComponents = [YachtsComponent];