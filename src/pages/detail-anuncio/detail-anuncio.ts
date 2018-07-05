import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Item } from 'ionic-angular';
import * as firebase from 'firebase';

/**
 * Generated class for the DetailAnuncioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detail-anuncio',
  templateUrl: 'detail-anuncio.html',
})
export class DetailAnuncioPage {
  
  anuncio: Item;
  genero : String;
  URLImagen: String;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
  }

  ionViewWillLoad() {
    this.anuncio =this.navParams.get('anuncio');
    if(this.anuncio['Genero']==1){
      this.genero="Macho";
    }
    else{
      this.genero="Hembra";
    }
    this.obtenerImagen(this.anuncio['Imagen'], this.anuncio['Usuario_Email']);
  }

  obtenerImagen(imagen: string, email_user: string){
    var storageRef = firebase.storage().ref(email_user);
    var imagenRef = storageRef.child('/'+imagen);

    imagenRef.getDownloadURL().then((url) => {
      this.putUrl(url);
    });
  }

  putUrl(imgUrl){
    this.URLImagen = imgUrl;
  }
}
