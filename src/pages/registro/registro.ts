import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Usuario } from '../../models/item/item.model';
import { InicioPage } from '../inicio/inicio';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
//Acceso a Galeria
import { Camera, CameraOptions } from '@ionic-native/camera';
import * as firebase from 'firebase';


@IonicPage()
@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {

  usuario : Usuario = { 
    Email:'',
    Password:'',
    Nombre:'',
    Telefono:'',
    Direccion:'',
    Imagen:''
  };
  registroForm: FormGroup;
  imagenAnuncio: string;
  imageName:any;
  PreloadImage : any;

  cameraOptions: CameraOptions = {
    quality: 100,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true
  };


  constructor(public navCtrl: NavController, public navParams: NavParams,
  public authentification: AngularFireAuth, private formbuilder: FormBuilder,
  private us : UsuariosService, private alert : AlertController, private camera: Camera,
  ) {
    this.registroForm = this.validacion();
  }

  signin(usuario : Usuario){
    usuario.Email = usuario.Email.toLowerCase();
    const result2 = this.authentification.auth.createUserWithEmailAndPassword(usuario.Email, usuario.Password)
    .then(response => {
      if(result2){        
        this.uploadPicture(usuario.Email);
        if(this.imagenAnuncio!='assets/imgs/logotwt.png'){
          usuario.Imagen = this.imagenAnuncio+'.jpg';
        }else{
          usuario.Imagen=this.imagenAnuncio;
        }  
        this.us.addUser(usuario);
        this.newAlert('Registro realizado', 'Te has registrado con éxito', ['Ok']);
        this.navCtrl.push(InicioPage); 
      }    
    }).catch(error => {
      switch(error.code){
        case 'auth/email-already-in-use':
          this.newAlert('Error en el registro', 'El usuario ya existe', ['Ok']);
          break;
        case 'auth/weak-password':
          this.newAlert('Error en el registro','Contraseña no válida', ['Ok']);
          break;
        case 'auth/invalid-email':
          this.newAlert('Error en el registro', 'Email no válido', ['Ok']);
          break;
      };
    });   
  }

  async takePicture(){
    const result = await this.camera.getPicture(this.cameraOptions);
    const  preImage = `data:image/jpeg;base64,${result}`;
    this.PreloadImage = preImage;
  }

  uploadPicture(emailUsuario:string){    
    this.setImage(this.PreloadImage, emailUsuario);
  }

  setImage(image: string, userEmail:string): any {
    if(image!=undefined){
      let storageRef = firebase.storage().ref(userEmail);
    this.imageName = this.generateUUID();
    this.imagenAnuncio = this.imageName;
    let imageRef = storageRef.child('fotoPerfil');
    let imageRef2 = imageRef.child(this.imageName+'.jpg');
    return imageRef2.putString(image, 'data_url');
    }else{
      this.imagenAnuncio='assets/imgs/logotwt.png';
    }    
  }

  private generateUUID(): string {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  private validacion(){
    return this.formbuilder.group({
      Nombre: ['', Validators.required],
      Telefono: ['', [Validators.required, Validators.maxLength(9)]],
      Direccion: ['', Validators.required],
      Email: ['', Validators.required],
      Password: ['', Validators.required],
      Imagen: []
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
}
