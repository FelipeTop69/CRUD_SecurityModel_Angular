import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private baseUrl = environment.apiURL + 'api/Permission/';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}GetAll/`);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}GetByiId/${id}/`);
  }

  create(permission: any): Observable<any> {
    return this.http.post(`${this.baseUrl}Create/`, permission);
  }

  update(permission: any): Observable<any> {
    return this.http.put(`${this.baseUrl}Updated/`, permission);
  }

  delete(id: number, strategy = 0): Observable<any> {
    return this.http.delete(`${this.baseUrl}Delete/${id}/?strategy=${strategy}`);
  }
}