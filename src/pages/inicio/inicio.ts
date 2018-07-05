import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Item} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { PerfilUsuarioPage } from '../perfil-usuario/perfil-usuario';
import { Observable } from 'rxjs/Observable';
import { AsociacionService } from '../../services/asociaciones/asociaciones.service';
import { ClinicasService } from '../../services/clinicas/clinicas.services';
import { GeocoderServiceProvider } from '../../providers/geocoder-service/geocoder-service';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';

declare let google;

@Component({
  selector: 'page-home',
  templateUrl: 'inicio.html'
})

export class InicioPage {

  @ViewChild('map') mapElement: ElementRef;

  map: any;
  listaAsociaciones$: Observable<Item[]>;
  listaClinicas$: Observable<Item[]>;

  constructor(public navCtrl: NavController,
    public geolocation: Geolocation, 
    private asociaciones: AsociacionService,
    private clinicas: ClinicasService,
    private geocodeService: GeocoderServiceProvider,
    public auth: AngularFireAuth) {
      

    this.listaAsociaciones$ = this.asociaciones
    .getAsociacionList()
    .snapshotChanges()
    .map(
      changes => {
        return changes.map(c => ({
          key : c.payload.key, ...c.payload.val()
        }))
      }
    )
    this.listaClinicas$ = this.clinicas
    .getClinicasList()
    .snapshotChanges()
    .map(
      changes => {
        return changes.map(c => ({
         key : c.payload.key, ... c.payload.val()
        }))
      }
    )
    this.loadMap();
  }

  linkPerfil(){
    this.auth.auth.onAuthStateChanged( user => {
      if(user) {
        this.navCtrl.push(PerfilUsuarioPage)
      }
      else{
        this.navCtrl.push(LoginPage)
      }
    })
  }

  loadMap(){
    this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
       /*Centrar en la geolocalizacion donde estas*/
      let mapOptions = {
        center: latLng,
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
 
       /*Marcador*/
       google.maps.event.addListenerOnce(this.map, 'idle', () => {
        new google.maps.Marker({
          position: latLng,
          map: this.map,
          title: 'Mi posicion'
        });

        this.listaAsociaciones$.subscribe(asociaciones => {
          asociaciones.forEach(asociacion =>{
            this.geocode(asociacion, "Asociacion");
          });
        });

        this.listaClinicas$.subscribe(clinicas => {
          clinicas.forEach(clinica =>{
            this.geocode(clinica, "Clinica");
          });
        });

      });
    });
  }

  geocode(objeto, tipo){
    var direccion = objeto.Direccion;
    this.geocodeService.getData(direccion)
    .subscribe(data => {
      var lat = data['results'][0].geometry['location'].lat;
      var lon = data['results'][0].geometry['location'].lng;
      this.ponerMarker(lat, lon, objeto, tipo);
    });
  }

  ponerMarker(lat, lon, objeto, tipo){
    var latlng = new google.maps.LatLng(lat, lon);
    var infowindow;
    
    if (tipo == "Asociacion"){
      var plazas = (objeto.Capacidad-objeto.Ocupacion);
      var resultado;
      if (plazas < 1){
        resultado = "no disponible";
      }else{
        resultado = plazas;
      }

      var contenidoAsoc = '<div style="text-align:center;">'+
      '<p style="font-weight:bold;">Nombre: '+objeto.Nombre+'</p>'+
      '<p>Plazas disponibles: '+resultado+'</p>'+
      '<p>Telefono: '+objeto.Telefono+'</p>'+
      '<p>Valoracion: '+objeto.Valoracion+'</p>'+
      '</div>';

      infowindow = new google.maps.InfoWindow({
        content: contenidoAsoc
      });

      var markerAsoc = new google.maps.Marker({
        position: latlng,
        map: this.map,
        title : objeto.Nombre,
        icon: 'assets/imgs/markerAsociacion.png'
      });

      markerAsoc.addListener('click', function(){
        this.map.setZoom(16);
        this.map.setCenter(markerAsoc.getPosition());
        infowindow.open(this.map, markerAsoc);
      });

    }else{
      if(tipo=="Clinica"){
        var contenidoClin = '<div style="text-align:center;">'+
        '<p style="font-weight:bold;">Nombre: '+objeto.Nombre+'</p>'+
        '<p>Horario: '+objeto.Horario+'</p>'+
        '<p>Telefono: '+objeto.Telefono+'</p>'+
        '<p>Valoracion: '+objeto.Valoracion+'</p>'+
        '</div>';

        infowindow = new google.maps.InfoWindow({
          content: contenidoClin
        });

        var markerClin = new google.maps.Marker({
          position: latlng,
          map: this.map,
          title : objeto.Nombre,
          icon: 'assets/imgs/markerClinica.png'
        });

        markerClin.addListener('click', function(){
          this.map.setZoom(16);
          this.map.setCenter(markerClin.getPosition());
          infowindow.open(this.map, markerClin);
        });
      }
    }
  }

}

