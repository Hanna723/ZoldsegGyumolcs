import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { PreviewComponent } from './preview/preview.component';

const routes: Routes = [{
  path: '',
  children: [
    {
      path: 'list',
      component: ListComponent
    },
    {
      path: 'preview',
      component: PreviewComponent
    },
    {
      path: '**',
      redirectTo: 'list'
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
