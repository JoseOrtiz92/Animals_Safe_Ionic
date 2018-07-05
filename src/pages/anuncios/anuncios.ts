import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, App, ToastController, Toast } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Anuncio } from './../../models/item/item.model';
import { AnunciosService } from '../../services/anuncios/anuncios.service';
import { AngularFireAuth } from 'angularfire2/auth';
//Acceso a Galeria
import { Camera, CameraOptions } from '@ionic-native/camera';
import * as firebase from 'firebase';
import { globalEmail } from '../../providers/globalEmail/globalEmail';


@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'anuncios.html'
})
export class AnunciosPage {

  myForm: FormGroup;
  tost : Toast;
  imagenAnuncio: string;
  imageName:any;
  PreloadImage : any;
  anuncio: Anuncio = {
    Nombre_mascota: '',
    Color: '',
    TipoAnimal: '',
    Raza: '',
    Edad: undefined,
    Genero: undefined,
    Telefono: '',
    Direccion_perdida: '',
    Localidad: '',
    Provincia: '',
    Descripcion: '',
    Imagen: '',
    Usuario_Email:''
  };

  cameraOptions: CameraOptions = {
    quality: 100,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true
  };

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder,
    navParams: NavParams, private anun: AnunciosService, 
    private auth: AngularFireAuth, private camera: Camera, 
    private app: App, private ck: globalEmail, private toast: ToastController) {

    this.myForm = this.formulario();
    this.checkUser();
  }
  
  addAnun(anuncio: Anuncio){
    this.uploadPicture();
    if(this.imagenAnuncio!='assets/imgs/logotwt.png'){
      anuncio.Imagen = this.imagenAnuncio+'.jpg';
    }else{
      anuncio.Imagen=this.imagenAnuncio;
    }  
    anuncio.Usuario_Email = this.auth.auth.currentUser.email;         
    this.anun.addAnuncio(anuncio).then(ref => {
      this.navCtrl.setRoot('AnunciosPage', { key: ref.key })
    });
    
    this.tost = this.toast.create({     
      message: '¡Anuncio Publicado!',
      duration: 3000,
      position: 'bottom'
    });
    this.tost.present();
  }

  async takePicture(){
    const result = await this.camera.getPicture(this.cameraOptions);
    const  preImage = `data:image/jpeg;base64,${result}`;
    this.PreloadImage = preImage;
  }

  uploadPicture(){    
    this.setImage(this.PreloadImage, this.auth.auth.currentUser.email);
  }

  setImage(image: string, userEmail:string): any {
    if(image !=undefined){
      let storageRef = firebase.storage().ref();
    this.imageName = this.generateUUID();
    this.imagenAnuncio = this.imageName;
    let imageRef = storageRef.child(userEmail+'/'+this.imageName+'.jpg');
    return imageRef.putString(image, 'data_url');
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

  private formulario(){

    return this.formBuilder.group({
      Nombre_mascota: ['', Validators.required],
      Color: ['', Validators.required],
      TipoAnimal: ['', Validators.required],
      Raza: ['', Validators.required],      
      Edad: ['', [Validators.min(0), Validators.max(99), Validators.required]],
      Genero:  ['', Validators.required],
      Telefono: ['', Validators.required],
      Direccion_perdida: ['', Validators.required],
      Localidad: ['', Validators.required],
      Provincia: ['', Validators.required],
      Descripcion: ['', Validators.required],
      Imagen: [],
    });
  }

  linkRegister(){
    this.app.getRootNav().getActiveChildNav().select(3);
  }

  checkUser(){
    this.auth.auth.onAuthStateChanged(user => {
      if (user) {
        this.ck.checkUs=true;
      } else {
        this.ck.checkUs=false;
      }
    });
  }
  
}
