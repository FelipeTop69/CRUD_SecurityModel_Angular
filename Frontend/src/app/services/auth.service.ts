// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiURL}api/Auth/`;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private jwtHelper = new JwtHelperService();
  private readonly FRONT_EXP_KEY = 'token_exp_frontend';

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}Login`, credentials).pipe(
      tap(response => {
        if (response.token) {
          const expiration = new Date(Date.now() + 2 * 60 * 1000); 

          localStorage.setItem('currentUser', JSON.stringify(response));
          localStorage.setItem(this.FRONT_EXP_KEY, expiration.toISOString());

          this.currentUserSubject.next(response);
          this.snackBar.open(`Bienvenido ${response.username}`, 'Cerrar', { duration: 3000 });
          this.router.navigate(['/user']);
        }
      })
    );
  }

  register(userData: {
    username: string;
    password: string;
    name: string;
    lastName: string;
    email: string;
    documentNumber: string;
    phone: string;
    address: string;
    documentType: string;
    bloodType: string;
    rolId: number;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}Register`, userData).pipe(
      tap(response => {
        this.snackBar.open('Registro exitoso. Por favor inicie sesión.', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/login']);
      })
    );
  }

  iniciarExtensionSesionPorActividad(): void {
    const eventos = ['click', 'keydown'];
  
    eventos.forEach(evento => {
      document.addEventListener(evento, () => {
        const ruta = this.router.url;
        const esRutaPublica = ['/login', '/register'].includes(ruta);
        
        if (!esRutaPublica && this.esValidoFrontend()) {
          this.extenderSesion();
          // console.log('[Sesion Extendida ');
        }
      });
    });
  }
  
  esValidoFrontend(): boolean {
    const exp = localStorage.getItem(this.FRONT_EXP_KEY);
    return exp ? new Date(exp) > new Date() : false;
  }

  extenderSesion(): void {
    const nuevaExp = new Date(Date.now() + 10 * 60 * 1000); 
    localStorage.setItem(this.FRONT_EXP_KEY, nuevaExp.toISOString());
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem(this.FRONT_EXP_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
    // this.snackBar.open('Sesión cerrada', 'Cerrar', { duration: 3000 });
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  getToken(): string | null {
    const userData = this.currentUserSubject.value;
    return userData?.token || null;
  }

  getUserId(): number {
    const token = this.getToken();
    if (!token) return 0;
    const decoded = this.jwtHelper.decodeToken(token);
    return decoded.UserId || 0;
  }

  getUserName(): string {
    const token = this.getToken();
    if (!token) return '';
    
    const decoded = this.jwtHelper.decodeToken(token);
    
    // Busca el claim del nombre (puede venir de varias formas)
    const nameKey = Object.keys(decoded).find(key =>
      key.endsWith('name') || 
      key.toLowerCase() === 'claimtypes.name' || 
      key === 'Name' ||
      key === 'sub' 
    );
    
    return nameKey ? decoded[nameKey] : '';
  }

  getUserRole(): string {
    const token = this.getToken();
    if (!token) return '';
    const decoded = this.jwtHelper.decodeToken(token);
  
    const roleKey = Object.keys(decoded).find(key =>
      key.includes('role') || key.toLowerCase().includes('claimtypes.role')
    );
  
    return roleKey ? decoded[roleKey] : '';
  }
}
