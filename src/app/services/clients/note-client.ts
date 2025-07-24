import {Injectable} from '@angular/core';
import {AbstractClient} from './abstract-client';
import {map, Observable} from 'rxjs';
import {parseISO} from 'date-fns';

export interface Note {
  id: string;
  title: string;
  content: string;
  version: number;
  projectId: string;
  authorId: string;
  tagsId: string[];
  createdAt: Date;
  updatedAt: Date;
}


@Injectable({
  providedIn: 'root'
})
export class NoteClient extends AbstractClient<Note> {

  constructor() {
    super();
    this.setReqMapping('/notes');
  }

  override getById(id: string): Observable<Note> {
    return super.getById(id).pipe(
      map(note => {
        return {
          ...note,
          createdAt: parseISO(note.createdAt as any),
          updatedAt: parseISO(note.updatedAt as any)
        }
      })
    );
  }

  override list(search: any): Observable<Note[]> {
    return super.list(search).pipe(
      map(notes => notes.map(
        note => {
          return {
            ...note,
            createdAt: parseISO(note.createdAt as any),
            updatedAt: parseISO(note.updatedAt as any)
          }
        })
      ));
  }

}
