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

  protected httpApp = inject(HttpApp);
  protected reqMapping: string | undefined;

  protected setReqMapping(value: string) {
    this.reqMapping = value;
  }

  save(payload?: T, path: string = ""): Observable<T> {
    const reqData = new RequestData(this.reqMapping + path);
    reqData.payload = payload;
    return this.httpApp.post<T>(reqData);
  }

  update(id: string, payload: T, path: string = ""): Observable<T> {
    const reqData = new RequestData(`${this.reqMapping}/${id}${path}`);
    reqData.payload = payload;
    return this.httpApp.put<T>(reqData);
  }

  updatePatch(id: string, payload: Partial<T>, path: string = ""): Observable<T> {
    const reqData = new RequestData(`${this.reqMapping}/${id}${path}`);
    reqData.payload = payload;
    return this.httpApp.patch<T>(reqData);
  }

  delete(id: string, path: string = ""): Observable<void> {
    const reqData = new RequestData(`${this.reqMapping}/${id}${path}`);
    return this.httpApp.delete<void>(reqData);
  }

  list(search: SearchRequest, path: string = ""): Observable<T[]> {
    const reqData = this.prepareRequestData(search, path);

    return this.httpApp.get<T[]>(reqData);
  }

  page(search: SearchRequest, path: string = ""): Observable<Pageable> {
    const reqData = this.prepareRequestData(search, path);
    return this.httpApp.get<Pageable>(reqData);
  }

  getById(id: string): Observable<T> {
    const reqData = new RequestData(`${this.reqMapping}/${id}`);
    return this.httpApp.get<T>(reqData);
  }

  async saveAsync(payload?: T, path: string = ""): Promise<T> {
    return await firstValueFrom(this.save(payload, path));
  }

  async updateAsync(id: string, payload: T, path: string = ""): Promise<T> {
    return await firstValueFrom(this.update(id, payload, path));
  }

  async updatePatchAsync(id: string, payload: Partial<T>, path: string = ""): Promise<T> {
    return await firstValueFrom(this.updatePatch(id, payload, path));
  }

  async deleteAsync(id: string, path: string = ""): Promise<void> {
    return await firstValueFrom(this.delete(id, path));
  }

  async listAsync(search: SearchRequest, path: string = ""): Promise<T[]> {
    return await firstValueFrom(this.list(search, path));
  }

  async pageAsync(search: SearchRequest, path: string = ""): Promise<Pageable> {
    return await firstValueFrom(this.page(search, path));
  }

  async getByIdAsync(id: string): Promise<T> {
    return await firstValueFrom(this.getById(id));
  }

  private prepareRequestData(search: SearchRequest, path: string = "") {
    const reqData = new RequestData(this.reqMapping + path);
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
