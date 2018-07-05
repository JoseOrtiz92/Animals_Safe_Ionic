import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Item, AlertController, ToastController } from 'ionic-angular';
import { AnunciosService } from '../../services/anuncios/anuncios.service';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { Anuncio } from '../../models/item/item.model';
import * as firebase from 'firebase';

/**
 * Generated class for the AnunciosUsuarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-anuncios-usuario',
  templateUrl: 'anuncios-usuario.html',
})
export class AnunciosUsuarioPage {

  AnunciosUsuarios$ : Observable<Item[]>;
  anunciosdata : Array<String> = [];
  AnunciosExist : Boolean = false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private anuncios : AnunciosService,
              private auth : AngularFireAuth,
              private alert: AlertController,
              private toast: ToastController
            ) {
    
    this.AnunciosUsuarios$ = this.anuncios.getAnunciosList().snapshotChanges().map(
      changes => {
        return changes.map (c => ({
          key : c.payload.key, ...c.payload.val()
        }))
      }
    );

    this.AnunciosUsuarios$.subscribe(val => 
      val.forEach(nodo => {
        if(nodo['Usuario_Email']==this.auth.auth.currentUser.email){
          this.assignAnunciosData(nodo);
        }
      })
    );    
  }

  assignAnunciosData(data){
    this.anunciosdata.push(data);
    if(this.anunciosdata.length>0){
      this.AnunciosExist = true;
    }
  }

  deleteAnuncio(anuncio: Anuncio){
    let alert = this.alert.create({
      title:'Confirmar borrado',
      message: '¿Está seguro de eliminar el anuncio?',
      buttons:[{
        text: 'Aceptar',
        handler: () => {
          this.anuncios.removeAnuncio(anuncio);
          var ref = firebase.storage().ref(anuncio.Usuario_Email);
          var refChild = ref.child(anuncio.Imagen)
          refChild.delete();
          var toast = this.toast.create({
            message: 'Anuncio Eliminado',
            duration: 3000,
            position: 'bottom'
            });   
            toast.present(); 
            this.navCtrl.setRoot(this.navCtrl.getActive().component);           
          }        
      },
      {
        text: 'Cancelar',
        handler: ()=>{}
      }]
    })
    alert.present();
  }

}
