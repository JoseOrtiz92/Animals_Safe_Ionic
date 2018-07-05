import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { Usuario } from '../../models/item/item.model';
import { RegistroPage } from '../registro/registro';
import { PerfilUsuarioPage } from '../perfil-usuario/perfil-usuario';
import { globalEmail } from '../../providers/globalEmail/globalEmail';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  

  userModel = {
    Email:'',
    Password:''
  } as Usuario;
  loginForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alert: AlertController,
  public loginauth: AngularFireAuth, private formbuilder: FormBuilder, public ck : globalEmail) {
    this.loginForm=this.validacion();
    this.UsuarioLogged();
  }

  login(usuario: Usuario){
    const result = this.loginauth.auth.signInWithEmailAndPassword(
      this.userModel.Email, 
      this.userModel.Password).then(response => {
        if(result){
        this.navCtrl.setRoot(PerfilUsuarioPage);
        }  
      })
      .catch( error => {
        switch(error.code){
          case 'auth/invalid-email':
            this.newAlert('Error en el Inicio de Sesión', 'Email no válido', ['Ok']);
            break;
          case 'auth/user-not-found':
            this.newAlert('Error en el Inicio de Sesión', 'El usuario no existe', ['Ok']);
            break;
          case 'auth/wrong-password':
            this.newAlert('Error en el Inicio de Sesión', 'La contraseña es incorrecta', ['Ok']);
            break;
          case 'auth/credential-already-in-use':
            this.newAlert('Error en el Inicio de Sesión', 'La sesion ya está iniciada', ['Ok']);
            break;
          case 'auth/user-disabled':
            this.newAlert('Error en el Inicio de Sesión', 'El usuario ha sido deshabilitado', ['Ok']);
            break;          
        }
      }); 
      this.ck.checkUs = true;
  }

  linkRegister(){
    this.navCtrl.push(RegistroPage);
  }

  UsuarioLogged(){
    this.loginauth.auth.onAuthStateChanged( user => {
      if(user) {        
        this.navCtrl.setRoot(PerfilUsuarioPage);               
      }      
    });
    
  }
  newAlert(titulo:string, mensaje:string, buttons:string[]){
    let alerta = this.alert.create({
      title: titulo,
      message: mensaje,
      buttons: buttons
    });
    alerta.present();
  }

  private validacion(){
    return this.formbuilder.group({
      Email:['', [Validators.required, Validators.email]],
      Password:['', Validators.required]
    });
  }
}
