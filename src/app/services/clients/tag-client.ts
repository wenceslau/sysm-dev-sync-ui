import {inject, Injectable} from '@angular/core';
import {HttpApp, RequestData} from '../http-app';
import {firstValueFrom, Observable} from 'rxjs';

export interface Tag {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class TagClient {

  private httpApp = inject(HttpApp);

  getTags(): Observable<Tag> {
    const params = new RequestData();
    params.path = '/tags/1';

    return this.httpApp.get<Tag>(params);
  }

  async getTagsAsync(): Promise<Tag> {
    return await firstValueFrom(this.getTags());
  }
}
