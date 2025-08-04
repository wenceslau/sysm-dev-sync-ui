import {inject, Injectable} from '@angular/core';
import {HttpApp, RequestData} from '../http-app';
import {firstValueFrom, Observable} from 'rxjs';

export class SearchRequest {
  pageNumber?: number;
  pageSize?: number;
  sort?: string;
  direction?: string;
  queryType?: string;
  filters?: Map<string, string>
}

export interface Pageable {
  currentPage: number,
  perPage: number,
  total: number,
  items: any[]
}

@Injectable({
  providedIn: 'root'
})
export class AbstractClient<T> {

  private _httpApp = inject(HttpApp);
  protected reqMapping: string | undefined;

  protected setReqMapping(value: string) {
    this.reqMapping = value;
  }

  save(payload: T): Observable<T> {
    const reqData = new RequestData(this.reqMapping);
    reqData.payload = payload;
    return this._httpApp.post<T>(reqData);
  }

  update(id: string, payload: T): Observable<T> {
    const reqData = new RequestData(`${this.reqMapping}/${id}`);
    reqData.payload = payload;
    return this._httpApp.put<T>(reqData);
  }

  updatePatch(id: string, payload: Partial<T>): Observable<T> {
    const reqData = new RequestData(`${this.reqMapping}/${id}`);
    reqData.payload = payload;
    return this._httpApp.patch<T>(reqData);
  }

  delete(id: string): Observable<void> {
    const reqData = new RequestData(`${this.reqMapping}/${id}`);
    return this._httpApp.delete<void>(reqData);
  }

  list(search: SearchRequest): Observable<T[]> {
    const reqData = this.prepareRequestData(search);

    return this._httpApp.get<T[]>(reqData);
  }

  page(search: SearchRequest): Observable<Pageable> {
    const reqData = this.prepareRequestData(search);
    return this._httpApp.get<Pageable>(reqData);
  }

  getById(id: string): Observable<T> {
    const reqData = new RequestData(`${this.reqMapping}/${id}`);
    return this._httpApp.get<T>(reqData);
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

  async pageAsync(search: SearchRequest): Promise<Pageable> {
    return await firstValueFrom(this.page(search));
  }

  async getByIdAsync(id: string): Promise<T> {
    return await firstValueFrom(this.getById(id));
  }

  private prepareRequestData(search: SearchRequest) {
    const reqData = new RequestData(this.reqMapping);
    if (search.pageNumber !== undefined) {
      reqData.addParameter('pageNumber', search.pageNumber);
    }
    if (search.pageSize !== undefined) {
      reqData.addParameter('pageSize', search.pageSize);
    }
    if (search.sort) {
      reqData.addParameter('sort', search.sort);
    }
    if (search.direction) {
      reqData.addParameter('direction', search.direction);
    }
    if (search.queryType) {
      reqData.addParameter('queryType', search.queryType);
    }
    if (search.filters) {
      search.filters.forEach((value, key) => {
        reqData.addParameter(key, value);
      });
    }
    return reqData;
  }

}
