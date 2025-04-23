import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private baseUrl = environment.apiURL + 'api/Person/';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}GetAll/`);
  }

  getAvailable(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'GetAvailable/');
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}GetByiId/${id}/`);
  }

  create(person: any): Observable<any> {
    return this.http.post(`${this.baseUrl}Create/`, person);
  }

  update(person: any): Observable<any> {
    return this.http.put(`${this.baseUrl}Update/`, person);
  }

  delete(id: number, strategy = 0): Observable<any> {
    return this.http.delete(`${this.baseUrl}Delete/${id}/?strategy=${strategy}`);
  }
}
