import { Injectable } from "@angular/core";
import { Asociacion } from "../../models/item/item.model";
import { AngularFireDatabase } from "angularfire2/database";


@Injectable()
export class AsociacionService{
    private asociacionRef = this.db.list<Asociacion>('asociacion');

    constructor(private db: AngularFireDatabase){

    }

    getAsociacionList(){
        return this.asociacionRef;
    }
}