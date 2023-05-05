import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ListComponent } from './list/list.component';
import { PreviewComponent } from './preview/preview.component';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    ListComponent,
    PreviewComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    MatCardModule,
    MatButtonModule
  ]
})
export class ProductsModule { }
