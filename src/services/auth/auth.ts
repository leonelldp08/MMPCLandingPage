import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppConfigService } from '../config/config';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  public apiUrl: string;
  public httpHeaders: HttpHeaders;

  constructor(
    private http: HttpClient,
    private configService: AppConfigService
  ) {
    this.apiUrl = this.configService.apiUrl;
    this.httpHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('X-Use-Loader', 'true')
      .set('X-Show-Toaster', 'true');
  }

  getAppUser(username: string, password: string): Observable<HttpResponse<any[]>> {
    let url = this.apiUrl + 'auth/appuser';
    const bodyParams = { username: username, password: password };
    return this.http.post<any[]>(url, bodyParams, {
      headers: this.httpHeaders,
      observe: 'response',
    });
  }

  validateToken(): Observable<HttpResponse<any[]>> {
    let token = sessionStorage.getItem('token');
    let refreshToken = sessionStorage.getItem('refreshToken');
    let url = this.apiUrl + 'auth/validatetoken';
    return this.http.post<any[]>(url, { token: token, refreshToken: refreshToken }, {
      headers: this.httpHeaders.set('X-Use-Loader', 'false').set('X-Show-Toaster', 'false'),
      observe: 'response'
    });
  }

  completeAuthentication(): Observable<boolean> {
    let username = sessionStorage.getItem('userid');
    let url = this.apiUrl + 'auth/token/' + username;
    return this.http
      .get<{ token: string; refreshToken: string }>(url, {
        headers: this.httpHeaders,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          if (response && response.body) {
            sessionStorage.setItem('token', response.body.token);
            sessionStorage.setItem('refreshToken', response.body.refreshToken);
            return true;
          } else {
            return false;
          }
        })
      );
  }

  getAuthorizationHeader(): string {
    return sessionStorage.getItem('token') || '';
  }

  refreshToken(): Observable<string> {
    const refreshToken = sessionStorage.getItem('refreshToken');
    const token = sessionStorage.getItem('token');
    const url = this.apiUrl + 'auth/refresh';
    return this.http
      .post<{ token: string; refreshToken: string }>(
        url,
        { token: token, refreshToken: refreshToken },
        {
          headers: this.httpHeaders.set('X-Use-Loader', 'false'),
          observe: 'response',
        }
      )
      .pipe(
        map((response) => {
          if (response && response.body && response.body.token) {
            sessionStorage.setItem('token', response.body.token);
            sessionStorage.setItem('refreshToken', response.body.refreshToken);
            return response.body.token;
          } else {
            throw new Error('Failed to refresh token');
          }
        })
      );
  }

  clearAuthData(): void {
    try {
      // Remove all authentication-related data from sessionStorage
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('userid');
      sessionStorage.removeItem('currentUrl');
      sessionStorage.removeItem('accessrights');

      console.log('Authentication data cleared successfully');
    } catch (error) {
      console.error('Error clearing authentication data:', error);
    }
  }
}
