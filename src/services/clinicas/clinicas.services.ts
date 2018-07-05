import { Injectable } from "@angular/core";
import { Clinica } from "../../models/item/item.model";
import { AngularFireDatabase } from "angularfire2/database";


@Injectable()
export class ClinicasService{
    private clinicasRef = this.db.list<Clinica>('clinica');

    constructor(private db: AngularFireDatabase){

    }

    getClinicasList(){
        return this.clinicasRef;
    }
}