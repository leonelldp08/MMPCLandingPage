import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '../config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Data {
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

  getApplications(): Observable<HttpResponse<any[]>> {
    let url = this.apiUrl + 'voting/applications';
    let newHttpHeaders = this.httpHeaders.set('X-Use-Loader', 'false');
    return this.http.get<any[]>(url, {
      headers: newHttpHeaders,
      observe: 'response',
    });
  }
}
