import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from 'firebase';

/**
 * Generated class for the EditModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-modal',
  templateUrl: 'edit-modal.html',
})
export class EditModalPage {

  nombre: string = '';
  direccion: string = '';
  telefono: string = '';
  email: string = '';
  imagen: string = '';
  old_password: string = '';
  new_password: string = '';
  trigger: Boolean;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController,
              private userService: UsuariosService, private auth:AngularFireAuth,
              private alertCtrl: AlertController) {              
  }

  close_modal(){
    this.viewCtrl.dismiss();
  }

  update_data_user(){
    var email = this.auth.auth.currentUser.email;
    var user_data = this.userService.getUsersData().snapshotChanges().map(
      changes => {
        return changes.map (c => ({
          key : c.payload.key, ...c.payload.val()            
        }))
      }
    );

    var n= this.nombre;
    var d= this.direccion;
    var e= this.email;
    var t= this.telefono;    
    var user = firebase.auth().currentUser;

    user_data.subscribe(val => 
      val.forEach(nodo => {
        if (nodo['Email']==email) {
          if(n==''){
            n=nodo.Nombre
          }
          if(d==''){
            d=nodo.Direccion
          }
          if(e==''){
            e=nodo.Email
          }
          if(t==''){
            t=nodo.Telefono
          }          
          firebase.database().ref('usuario/'+nodo.key).set({
            Direccion: d,
            Email: e,
            Imagen: nodo.Imagen,
            Nombre: n,
            Password: nodo.Password,
            Telefono: t
          });
          user.updateEmail(e);          
        }
      })
    );
    this.alert_update(); 
    this.viewCtrl.dismiss();         
  }
    

  alert_update(){
    let alert = this.alertCtrl.create({
      title: '¡Gracias!',
      subTitle: 'Los datos se han guardado correctamente',
      buttons: ['Ok']
    });
    alert.present();
  }
}
