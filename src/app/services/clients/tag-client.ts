import {inject, Injectable} from '@angular/core';
import {HttpApp, RequestData} from '../http-app';
import {firstValueFrom, Observable} from 'rxjs';
import {AbstractClient} from './abstract-client';

export interface Tag {
  id: number;
  name: string;
  color: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class TagClient extends AbstractClient<Tag> {

  constructor() {
    super();
    this.setReqMapping('/tags');
  }

}
