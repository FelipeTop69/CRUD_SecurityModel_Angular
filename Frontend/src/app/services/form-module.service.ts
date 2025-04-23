import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FormModuleService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiURL}api/FormModule/`;

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}GetAll/`);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}GetByiId/${id}/`);
  }

  create(formModule: any): Observable<any> {
    return this.http.post(`${this.baseUrl}Create/`, formModule);
  }

  update(formModule: any): Observable<any> {
    return this.http.put(`${this.baseUrl}Update/`, formModule);
  }

  delete(id: number, strategy = 0): Observable<any> {
    return this.http.delete(`${this.baseUrl}Delete/${id}/?strategy=${strategy}`);
  }
}
