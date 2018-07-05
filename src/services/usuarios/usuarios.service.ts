import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Usuario } from './../../models/item/item.model';
import { globalEmail } from '../../providers/globalEmail/globalEmail';


@Injectable()

export class UsuariosService{ 

    private refUser=this.db.list<Usuario>('usuario');

    constructor(private db : AngularFireDatabase, public email : globalEmail){
        
    }

    getUsersData(){
        return this.refUser;
    }

    getDataByEmail(email: string){
        return this.refUser+"/"+email
    }

    addUser(usuario: Usuario){
        return this.refUser.push(usuario);
    }
    updateUser(usuario: Usuario){
        return this.refUser.update(usuario.key, usuario);
    }
    
}