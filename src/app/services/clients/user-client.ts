import { Injectable } from '@angular/core';
import {AbstractClient} from './abstract-client';
import {RequestData} from '../http-app';
import {Observable} from 'rxjs';

export interface User {
  id: string;
  username?: string;
  email?: string;
  roles?: UserRole;
  profilePictureUrl?: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

@Injectable({
  providedIn: 'root'
})
export class UserClient extends AbstractClient<User> {

  constructor() {
    super();
    this.setReqMapping('/users');
  }
}
