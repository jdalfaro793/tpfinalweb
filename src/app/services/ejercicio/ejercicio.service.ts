import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ejercicio } from 'src/app/models/ejercicio/ejercicio';

@Injectable({
  providedIn: 'root'
})
export class EjercicioService {
  url:string="http://localhost:3000/api/ejercicio/"
  constructor(private _http:HttpClient) { }


  //Metodo que obtiene todas las asistencias de la bd
  getEjercicios():Observable<any>{
    const httpOption={
      headers:new HttpHeaders({
      }),
      params: new HttpParams({
      })
    }
    return this._http.get(this.url,httpOption);
  }

  addEjercicio(ejercicio : Ejercicio):Observable<any>{
    let options = {
      headers:new HttpHeaders({ "Content-Type": "application/json" }),
      params: new HttpParams({})
    }
    let body = JSON.stringify(ejercicio);
    return this._http.post(this.url,body,options);
  }
}
