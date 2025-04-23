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

  getAvailable(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'GetAvailable/');
  }
}
