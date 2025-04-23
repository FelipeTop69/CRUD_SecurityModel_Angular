import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  private baseUrl = environment.apiURL + 'api/Module/';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}GetAll/`);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}GetById/${id}/`);
  }

  create(module: any): Observable<any> {
    return this.http.post(`${this.baseUrl}Create/`, module);
  }

  update(module: any): Observable<any> {
    return this.http.put(`${this.baseUrl}Update/`, module);
  }

  delete(id: number, strategy = 0): Observable<any> {
    return this.http.delete(`${this.baseUrl}Delete/${id}/?strategy=${strategy}`);
  }
}