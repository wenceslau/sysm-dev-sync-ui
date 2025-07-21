import {inject, Injectable} from '@angular/core';
import {HttpApp, RequestData} from '../http-app';
import {firstValueFrom, Observable} from 'rxjs';

export interface SearchRequest {
  pageNumber?: number,
  pageSize?: number,
  sort?: string,
  direction?: string,
  filters?: Map<string, string>
}

@Injectable({
  providedIn: 'root'
})
export class AbstractClient<T> {

  protected httpApp = inject(HttpApp);
  protected readonly reqMapping: string;

  constructor(reqMapping: string) {
    this.reqMapping = reqMapping;
  }

  save(payload: T): Observable<T> {
    const reqData = new RequestData(this.reqMapping);
    reqData.payload = payload;
    return this.httpApp.post<T>(reqData);
  }

  update(id: string, payload: T): Observable<T> {
    const reqData = new RequestData(`${this.reqMapping}/${id}`);
    reqData.payload = payload;
    return this.httpApp.put<T>(reqData);
  }

  updatePatch(id: string, payload: Partial<T>): Observable<T> {
    const reqData = new RequestData(`${this.reqMapping}/${id}`);
    reqData.payload = payload;
    return this.httpApp.patch<T>(reqData);
  }

  delete(id: string): Observable<void> {
    const reqData = new RequestData(`${this.reqMapping}/${id}`);
    return this.httpApp.delete<void>(reqData);
  }

  list(search: SearchRequest): Observable<T[]> {
    const reqData = new RequestData(this.reqMapping);
    if(search.pageNumber !== undefined){
      reqData.addParameter('pageNumber', search.pageNumber);
    }
    if(search.pageSize !== undefined){
      reqData.addParameter('pageSize', search.pageSize);
    }
    if(search.sort){
      reqData.addParameter('sort', search.sort);
    }
    if(search.direction){
      reqData.addParameter('direction', search.direction);
    }
    if(search.filters){
      search.filters.forEach((value, key) => {
        reqData.addParameter(key, value);
      });
    }
    return this.httpApp.get<T[]>(reqData);
  }

  getById(id: string): Observable<T> {
    const reqData = new RequestData(`${this.reqMapping}/${id}`);
    return this.httpApp.get<T>(reqData);
  }

  async saveAsync(payload: T): Promise<T> {
    return await firstValueFrom(this.save(payload));
  }

  async updateAsync(id: string, payload: T): Promise<T> {
    return await firstValueFrom(this.update(id, payload));
  }

  async updatePatchAsync(id: string, payload: Partial<T>): Promise<T> {
    return await firstValueFrom(this.updatePatch(id, payload));
  }

  async deleteAsync(id: string): Promise<void> {
    return await firstValueFrom(this.delete(id));
  }

  async listAsync(search: SearchRequest): Promise<T[]> {
    return await firstValueFrom(this.list(search));
  }

  async getByIdAsync(id: string): Promise<T> {
    return await firstValueFrom(this.getById(id));
  }
}
