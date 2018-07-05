export interface Anuncio {
    key?: string;
    Nombre_mascota: string;
    Color: string;
    TipoAnimal: string;
    Raza: string;
    Edad: number;
    Genero: number;
    Telefono: string;
    Direccion_perdida: string;
    Localidad: string;
    Provincia: string;
    Descripcion: string;
    Imagen: string;
    Usuario_Email:string;
}

export interface Asociacion {
    CIF:string;
    Nombre:string;
    Telefono:string;
    Direccion:string;
    Latitud:string;
    Longitud:string;
    Ocupacion:number;
    Capacidad:number;
    Valoracion:number;
    Email:string;
    Imagen:File;
    Web:string;
}

export interface Clinica {
    CIF:string;
    Nombre:string;
    Telefono:string;
    Direccion:string;
    Latitud:string;
    Longitud:string;
    Horario:string;
    Valoracion:number;
    Imagen:File;
}

export interface Usuario {
    key?: string;
    Nombre:string;
    Telefono:string;
    Direccion:string;
    Email:string;
    Password:string;
    Imagen:string;
}