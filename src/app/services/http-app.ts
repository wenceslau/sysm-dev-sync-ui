import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, firstValueFrom, Observable, tap, throwError} from 'rxjs';
import {LayoutState} from './layout-state';
import {SignalApp} from './signal-app';
import {SearchRequest} from '../application/objects';

// It's a best practice to move the API URL to environment files
// For example, in src/environments/environment.ts
// export const environment = { production: false, apiUrl: 'http://localhost:8080' };
// import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpApp {
  private http = inject(HttpClient);
  private signalApp = inject(SignalApp);

  // Consider moving this to your environment files
  private readonly apiUrl = "http://localhost:8081/dev-sync/api";

  get<T>(requestData: RequestData): Observable<T> {
    requestData.httpVerb = HttpVerb.GET;
    return this.executeHttpRequest<T>(requestData);
  }

  post<T>(requestData: RequestData): Observable<T> {
    requestData.httpVerb = HttpVerb.POST;
    return this.executeHttpRequest<T>(requestData);
  }

  put<T>(requestData: RequestData): Observable<T> {
    requestData.httpVerb = HttpVerb.PUT;
    return this.executeHttpRequest<T>(requestData);
  }

  patch<T>(requestData: RequestData): Observable<T> {
    requestData.httpVerb = HttpVerb.PATCH;
    return this.executeHttpRequest<T>(requestData);
  }

  delete<T>(requestData: RequestData): Observable<T> {
    requestData.httpVerb = HttpVerb.DELETE;
    return this.executeHttpRequest<T>(requestData);
  }

  async getAsync<T>(requestData: RequestData): Promise<T> {
    return await firstValueFrom(this.get<T>(requestData));
  }

  async postAsync<T>(requestData: RequestData): Promise<T> {
    return await firstValueFrom(this.post<T>(requestData));
  }

  async putAsync<T>(requestData: RequestData): Promise<T> {
    return await firstValueFrom(this.put<T>(requestData));
  }

  async patchAsync<T>(requestData: RequestData): Promise<T> {
    return await firstValueFrom(this.patch<T>(requestData));
  }

  async deleteAsync<T>(requestData: RequestData): Promise<T> {
    return await firstValueFrom(this.delete<T>(requestData));
  }

  private executeHttpRequest<T>(requestData: RequestData): Observable<T> {
    const httpUrlPath = `${this.apiUrl}${requestData.customPath || ''}`;
    const options = {
      headers: this.getHeaders(requestData),
      params: requestData.httpParams
    };

    let request$: Observable<T>;

    switch (requestData.httpVerb) {
      case HttpVerb.GET:
        request$ = this.http.get<T>(httpUrlPath, options);
        break;
      case HttpVerb.POST:
        request$ = this.http.post<T>(httpUrlPath, requestData.payload, options);
        break;
      case HttpVerb.PUT:
        request$ = this.http.put<T>(httpUrlPath, requestData.payload, options);
        break;
      case HttpVerb.PATCH:
        // FIX: Use http.patch for PATCH requests
        request$ = this.http.patch<T>(httpUrlPath, requestData.payload, options);
        break;
      case HttpVerb.DELETE:
        request$ = this.http.delete<T>(httpUrlPath, options);
        break;
      default:
        // Return an observable that immediately errors out for invalid verbs
        return throwError(() => new Error('HttpVerb not defined or is NONE.'));
    }

    // Use the pipe operator for side-effects (logging) and error handling
    return request$.pipe(
      tap(response => {
        console.log(`HTTP Success: ${requestData.httpVerb} ${requestData.customPath}`);
      }),
      catchError(error => {
        console.error(`HTTP Error: ${requestData.httpVerb} ${requestData.customPath}`, error);
        let content = error.message;
        if (error.error && error.error.message) {
          content = error.error.message;
        }
        this.signalApp.message.set({severity: 'error', content: content});
        return throwError(() => error);
      })
    );
  }

  private getHeaders(requestData: RequestData): HttpHeaders {
    let headers = new HttpHeaders();

    if (requestData.contentType !== ContentType.NONE) {
      headers = headers.append("Content-Type", requestData.contentType);
    }

    if (requestData.customHeaders) {
      requestData.customHeaders.forEach((value, key) => {
        headers = headers.append(key, value);
      });
    }

    return headers;
  }

}

export class RequestData {
  public httpVerb: HttpVerb = HttpVerb.NONE;
  public httpParams: HttpParams = new HttpParams();
  public contentType: ContentType = ContentType.JSON;
  public customHeaders: Map<string, string> = new Map();
  public payload: any;
  public customPath: string = "";
  public blob: boolean = false;

  constructor(customPath: string, payload?: any) {
    if (customPath === "") {
      throw new Error("Custom path is required");
    }
    if (!customPath.startsWith("/")) {
      throw new Error("Custom path must start with /");
    }
    if (customPath.endsWith("/")) {
      throw new Error("Custom path must not end with /");
    }

    this.customPath = customPath;
    if (payload) {
      this.payload = payload;
    }
  }

  addParameter(key: string, value: any) {
    this.httpParams = this.httpParams.append(key, value);
  }

  addCustomHeader(key: string, value: string) {
    this.customHeaders.set(key, value);
  }

  clearParameters() {
    this.httpParams = new HttpParams();
  }

  clearCustomHeaders() {
    this.customHeaders = new Map();
  }

  prepareRequestData(search: SearchRequest) {
    if (!search){
      throw new Error("Search is required");
    }
    this.clearParameters()

    if (search.pageNumber !== undefined) {
      this.addParameter('pageNumber', search.pageNumber);
    }
    if (search.pageSize !== undefined) {
      this.addParameter('pageSize', search.pageSize);
    }
    if (search.sort) {
      this.addParameter('sort', search.sort);
    }
    if (search.direction) {
      this.addParameter('direction', search.direction);
    }
    if (search.queryType) {
      this.addParameter('queryType', search.queryType);
    }
    if (search.filters) {
      search.filters.forEach((value, key) => {
        this.addParameter(key, value);
      });
    }
  }

}

export enum HttpVerb {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  NONE = 'NONE'
}

export enum ContentType {
  JSON = "application/json",
  FORM = "application/x-www-form-urlencoded",
  MULTIPART = "multipart/form-data",
  TEXT = "text/plain",
  BLOB = "application/octet-stream",
  NONE = ""
}
