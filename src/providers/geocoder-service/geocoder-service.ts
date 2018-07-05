import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the GeocoderServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GeocoderServiceProvider {

  constructor(public http: HttpClient) {
  }

  getData(direccion: string){
    var jsonData = this.http.get("https://maps.googleapis.com/maps/api/geocode/json?address="+direccion+"&key=AIzaSyBPuJPGNzXmA2Y_DktifPcGMf8nuPf8RvM");
    return jsonData;
  }
}
