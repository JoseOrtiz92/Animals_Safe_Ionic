import { Component } from '@angular/core';

import { AnimalesPerdidosPage } from '../animalesPerdidos/animalesPerdidos';
import { AnunciosPage} from '../anuncios/anuncios';
import { InicioPage } from '../inicio/inicio';
import { LoginPage } from '../login/login';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = AnimalesPerdidosPage;
  tab2Root = InicioPage;
  tab3Root = AnunciosPage;
  tab4Root = LoginPage;

  constructor() {  }
}
