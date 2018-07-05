import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Item, ModalController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { LoginPage } from '../login/login';
import { Observable } from 'rxjs/Observable';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { globalEmail } from '../../providers/globalEmail/globalEmail';
import * as firebase from 'firebase';
import { EditModalPage } from '../edit-modal/edit-modal';


@Component({
  selector: 'page-perfil-usuario',
  templateUrl: 'perfil-usuario.html',
})
export class PerfilUsuarioPage {

  datosUsuario$ : Observable<Item[]>;
  email: string;
  userData : Array<String> = [];
  datosAnuncios$ : Observable<Item[]>;
  URLImagen: String;
  imagenAnuncio :string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public authentification : AngularFireAuth,
    public loginauth : AngularFireAuth,
    public alertControl : AlertController,
    private usu : UsuariosService,    
    private modalCtrl: ModalController,
    private ck: globalEmail,
    private alert: AlertController) {

      this.UsuarioLogged();      
      
      this.datosUsuario$ = this.usu.getUsersData().snapshotChanges().map(
        changes => {
          return changes.map (c => ({
            key : c.payload.key, ...c.payload.val()            
          }))
        }
      );

      this.datosUsuario$.subscribe(val =>
          val.forEach(nodo => {
          if(nodo['Email']==this.email){
            this.assignUserData(nodo);
            this.obtenerImagen(nodo['Imagen'], this.email);
          }
        })
      );
  }

  logout(){
    let alert = this.alert.create({
      title: 'Cerrar sesión',
      message: '¿Estás seguro de cerrar sesión?',
      buttons: [{ text:'Si', handler: () => { this.navCtrl.setRoot(LoginPage); 
                                              this.ck.checkUs = false; 
                                              this.authentification.auth.signOut();}
                },
                { text: "No" }]
    });

    alert.present();
  }

  UsuarioLogged(){
    this.loginauth.auth.onAuthStateChanged( user => {
      if(user) {        
        this.assignUserEmail();          
      }
    });
  }

  obtenerImagen(imagen: string, email_user: string){
    if(imagen!='assets/imgs/logotwt.png'){
      var storageRef = firebase.storage().ref(email_user);
      var imagenRef = storageRef.child('fotoPerfil');
      var imagenRef2 = imagenRef.child(imagen);
      imagenRef2.getDownloadURL().then((url) => {
        this.putUrl(url);
      });
    }else{
      this.putUrl('assets/imgs/logotwt.png');
    }    
  }
  
  assignUserData(data){
    this.userData = [];
    this.userData.push(data);
  }
  assignUserEmail(){
    this.email=this.loginauth.auth.currentUser.email;
  }

  putUrl(imgUrl){
    this.URLImagen = imgUrl;
  }

  show_modal(){
    var modal = this.modalCtrl.create(EditModalPage);
    modal.present();
  }
}
