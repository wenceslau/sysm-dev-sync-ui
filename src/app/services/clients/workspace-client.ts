import { Injectable } from '@angular/core';
import {AbstractClient, SearchRequest} from './abstract-client';
import {map, Observable} from 'rxjs';
import {parseISO} from 'date-fns';

export interface Workspace {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  ownerId: string,
  membersId: string[];
  projectCount: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class WorkspaceClient extends AbstractClient<Workspace>{

  constructor() {
    super();
    this.setReqMapping('/workspaces');
  }

  /**
   * Overrides the base getById to handle date string to Date object conversion.
   */
  override getById(id: string): Observable<Workspace> {
    // 1. Call the parent method to get the original Observable
    return super.getById(id).pipe(
      // 2. Use the map operator to transform the emitted value
      map(workspace => {
        // 3. Return a new object with the date strings converted
        return {
          ...workspace,
          createdAt: parseISO(workspace.createdAt as any),
          updatedAt: parseISO(workspace.updatedAt as any)
        };
      })
    );
  }

  /**
   * You must also override list() to handle the conversion for arrays.
   */
  override list(search: SearchRequest): Observable<Workspace[]> {
    return super.list(search).pipe(
      map(workspaces => workspaces.map(w => { // map the array, then map each item
        return {
          ...w,
          createdAt: parseISO(w.createdAt as any),
          updatedAt: parseISO(w.updatedAt as any)
        };
      }))
    );
  }
}
