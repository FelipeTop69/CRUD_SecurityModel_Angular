import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiURL}api/User/`;

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}GetAll/`);
  }

  getAllJWT(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}GetAllJWT/`);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}GetByiId/${id}/`);
  }

  create(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}Create/`, user);
  }

  update(user: any): Observable<any> {
    return this.http.put(`${this.baseUrl}Update/`, user);
  }

  delete(id: number, strategy = 0): Observable<any> {
    return this.http.delete(`${this.baseUrl}Delete/${id}/?strategy=${strategy}`);
  }
}
