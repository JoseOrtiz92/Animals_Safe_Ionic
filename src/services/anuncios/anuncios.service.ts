import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { Anuncio } from './../../models/item/item.model';

@Injectable()
export class AnunciosService {
    private AnuncioRef = this.db.list<Anuncio>('anuncio');

    constructor(private db: AngularFireDatabase) { }

    getAnunciosList(){
        return this.AnuncioRef;
    }
    addAnuncio(anuncio: Anuncio){
        return this.AnuncioRef.push(anuncio);
    }
    removeAnuncio(anuncio:Anuncio){
        return this.AnuncioRef.remove(anuncio.key);
    }
}