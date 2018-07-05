import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailAnuncioPage } from './detail-anuncio';

@NgModule({
  declarations: [
    DetailAnuncioPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailAnuncioPage),
  ],
})
export class DetailAnuncioPageModule {}
