import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Item } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { AnunciosService } from '../../services/anuncios/anuncios.service';
import { Observable } from 'rxjs/Observable';
import { GeocoderServiceProvider } from '../../providers/geocoder-service/geocoder-service';
import { PerfilUsuarioPage } from '../perfil-usuario/perfil-usuario';


declare let google;

@Component({
  selector: 'page-about',
  templateUrl: 'animalesPerdidos.html'
})
export class AnimalesPerdidosPage {

  @ViewChild('map') mapElement: ElementRef;
  
  map: any; 
  listaAnuncios$: Observable<Item[]>;

  constructor(public navCtrl: NavController, 
    public geolocation: Geolocation, 
    private anuncios: AnunciosService,
    private geocodeService: GeocoderServiceProvider) {
      this.listaAnuncios$ = this.anuncios.getAnunciosList().snapshotChanges().map(
                  changes => {
                    return changes.map (c => ({
                      key : c.payload.key, ...c.payload.val()
                    }))
                  }
                );
      this.loadMap();
  }

  linkPerfil(){
    this.navCtrl.setRoot(PerfilUsuarioPage)
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
          title: "Mi posicion"
        });
        /* Por cada anuncio llamo a la funcion que lo añade a un marcador */
        this.listaAnuncios$.subscribe(anuncios=>{
          anuncios.forEach(anuncio=>{
            this.geocode(anuncio);
          });
        });
      });
    });
  }

  /*Metodo para añadir marcadores */
  async geocode(anuncio){
    var direccion = anuncio.Direccion_perdida +", "+ anuncio.Provincia +", "+ anuncio.Localidad;
    /*Geocodificando la direccion para obtener la latitud y la longitud y llamando al metodo ponerMarker para poner el marcador en el mapa*/
    this.geocodeService.getData(direccion)
    .subscribe(data => {
      var lat = data['results'][0].geometry['location'].lat;
      var lon = data['results'][0].geometry['location'].lng;
      this.ponerMarker(lat, lon, anuncio);
    });
  }

  ponerMarker(lat, lon, anuncio){
    var sexo;
    if (anuncio.Genero == 1){
      sexo="Macho";
    }else{
      if(anuncio.Genero ==2){
        sexo="Hembra";
      }
    }
    
    var contenido = 
    '<div style="text-align:center;">'+
    '<p style="font-weight:bold;">'+anuncio.TipoAnimal+'</p>'+
    '<p>Nombre: '+anuncio.Nombre_mascota+'</p>'+
    '<p>Raza: '+anuncio.Raza+'</p>'+
    '<p>Teléfono: '+anuncio.Telefono+'</p>'+
    '<p>Edad: '+anuncio.Edad+'</p>'+
    '<p>Color: '+anuncio.Color+'</p>'+
    '<p>Sexo: '+sexo+'</p>'+
    '<p>Descripcion: '+anuncio.Descripcion+'</p>'+
    '</div>';


    var infowindow = new google.maps.InfoWindow({
      content: contenido,
      maxWidth: 200
    });

    var latlng = new google.maps.LatLng(lat, lon);

    var marker = new google.maps.Marker({
      position: latlng,
      map: this.map,
      title : anuncio.Nombre_mascota,
      icon: 'assets/imgs/paw2.png'
    });
    marker.addListener('click', function(){
      this.map.setZoom(16);
      this.map.setCenter(marker.getPosition());
      infowindow.open(this.map, marker);
    });

  } 
}

