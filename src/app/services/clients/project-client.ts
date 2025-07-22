import {Injectable} from '@angular/core';
import {AbstractClient} from './abstract-client';
import {map, Observable} from 'rxjs';
import {parseISO} from 'date-fns';


export interface Project {
  id: string;
  name: string;
  description: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectClient extends AbstractClient<Project> {

  constructor() {
    super('/projects');
  }

  override getById(id: string): Observable<Project> {
    return super.getById(id).pipe(
      map(p => {
        return {
          ...p,
          createdAt: parseISO(p.updatedAt as any),
          updatedAt: parseISO(p.updatedAt as any)
        };
      })
    );
  }

  override list(search: any): Observable<Project[]> {
    return super.list(search).pipe(
      map(projects => projects.map(p => { // map the array, then map each item
        return {
          ...p,
          createdAt: parseISO(p.updatedAt as any),
          updatedAt: parseISO(p.updatedAt as any)
        };
      }))
    );
  }

}
