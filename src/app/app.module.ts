import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import { MyApp } from './app.component';

import { AnimalesPerdidosPage } from '../pages/animalesPerdidos/animalesPerdidos';
import { AnunciosPage } from '../pages/anuncios/anuncios';
import { InicioPage } from '../pages/inicio/inicio';
import { PerfilUsuarioPage } from '../pages/perfil-usuario/perfil-usuario';
import { TabsPage } from '../pages/tabs/tabs';
import { EditModalPage } from '../pages/edit-modal/edit-modal';

import { FIREBASE_CONFIG } from './firebase.credentials';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
/*IMPORTACION PARA PODER USAR GOOGLE MAPS*/ 
import { Geolocation } from '@ionic-native/geolocation';
import { Geocoder, GoogleMaps } from '@ionic-native/google-maps';
/*Servicios*/
import { AnunciosService } from '../services/anuncios/anuncios.service';
import { AsociacionService } from '../services/asociaciones/asociaciones.service';
import { ClinicasService } from '../services/clinicas/clinicas.services';

/*Plugin notificaciones push*/
import { OneSignal } from '@ionic-native/onesignal';
import { Push } from '@ionic-native/push';

import { AnunciosPageModule } from '../pages/anuncios/anuncios.module';
/*Peticiones HTTP*/
import { HttpClientModule } from '@angular/common/http';
import { GeocoderServiceProvider } from '../providers/geocoder-service/geocoder-service';
/*Traducir el boton back en iphone*/
import { TranslateModule } from '@ngx-translate/core';
/*Importacion de Modulos para Autentificacion */
import { AngularFireAuthModule } from 'angularfire2/auth';
import { LoginPage } from '../pages/login/login';
import { RegistroPage } from '../pages/registro/registro';
import { UsuariosService } from '../services/usuarios/usuarios.service';
import { globalEmail } from '../providers/globalEmail/globalEmail';
import { Camera } from '@ionic-native/camera';
import { PushnotificationProvider } from '../providers/pushnotification/pushnotification';
import { LaunchNavigator } from '@ionic-native/launch-navigator';


@NgModule({
  declarations: [
    MyApp,
    AnimalesPerdidosPage,
    //AnunciosPage,
    InicioPage,
    TabsPage,
    PerfilUsuarioPage,
    LoginPage,
    RegistroPage,
    EditModalPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      platforms: {
        ios: {
          backButtonText: 'Volver'
        }
      }
    }),
    AnunciosPageModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AnimalesPerdidosPage,
    AnunciosPage,
    InicioPage,
    TabsPage,
    PerfilUsuarioPage,
    LoginPage,
    RegistroPage,
    EditModalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    AnunciosService,
    AsociacionService,
    ClinicasService,
    UsuariosService,
    Geocoder,
    GoogleMaps,
    GeocoderServiceProvider,/*Servicio para usar peticiones HTTP*/
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GeocoderServiceProvider,
    globalEmail,
    Camera,
    OneSignal,
    Push,
    PushnotificationProvider,
    LaunchNavigator
  ]
})
export class AppModule {}
