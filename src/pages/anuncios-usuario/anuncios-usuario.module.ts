import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnunciosUsuarioPage } from './anuncios-usuario';

@NgModule({
  declarations: [
    AnunciosUsuarioPage,
  ],
  imports: [
    IonicPageModule.forChild(AnunciosUsuarioPage),
  ],
})
export class AnunciosUsuarioPageModule {}
