import { Injectable } from '@angular/core';
import { Configuration, JSONProperties } from '../../models/config.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  appConfig: Configuration;

  public apiUrl: string;

  constructor(private http: HttpClient) { }

  public async initialize(): Promise<void> {
    await new Promise((r) => setTimeout(r, 100));
    await this.loadConfig();
    return;
  }

  async loadConfig(): Promise<any> {
    return this.http.get<JSONProperties>('assets/config.json').pipe((settings) => settings)
      .toPromise()
      .then((config) => {
        this.apiUrl = config?.API_URL ? config?.API_URL : "";
    });
  }
}
