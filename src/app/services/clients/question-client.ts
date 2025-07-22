import {Injectable} from '@angular/core';
import {AbstractClient} from './abstract-client';
import {map, Observable} from 'rxjs';

export interface Question {
  id: string;
  title: string;
  description: string;
  status: QuestionStatus;
  authorId: string;
  projectId: string;
  tagsId: string[];
  createdAt: Date;
  updatedAt: Date;
}

export enum QuestionStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  RESOLVED = 'RESOLVED'
}

@Injectable({
  providedIn: 'root'
})
export class QuestionClient extends AbstractClient<Question> {

  constructor() {
    super('/questions');
  }

  override getById(id: string): Observable<Question> {
    return super.getById(id).pipe(
      map(q => {
        return {
          ...q,
          createdAt: new Date(q.createdAt as any),
          updatedAt: new Date(q.updatedAt as any)
        };
      })
    );
  }

  override list(search: any): Observable<Question[]> {
    return super.list(search).pipe(
      map(questions => questions.map(q => { // map the array, then map each item
        return {
          ...q,
          createdAt: new Date(q.createdAt as any),
          updatedAt: new Date(q.updatedAt as any)
        };
      }))
    );
  }

}
