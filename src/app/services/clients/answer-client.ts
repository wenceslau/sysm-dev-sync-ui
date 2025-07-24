import {Injectable} from '@angular/core';
import {AbstractClient} from './abstract-client';
import {map, Observable} from 'rxjs';
import {parseISO} from 'date-fns';


export interface Answer {
  id: string;
  content: string;
  isAccepted: boolean;
  questionId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AnswerClient extends AbstractClient<Answer> {

  constructor() {
    super();
    this.setReqMapping('/answers');
  }

  override getById(id: string): Observable<Answer> {
    return super.getById(id).pipe(
      map(answer => {
        return {
          ...answer,
          createdAt: parseISO(answer.createdAt as any),
          updatedAt: parseISO(answer.updatedAt as any)
        }
      })
    );
  }

  override list(search: any): Observable<Answer[]> {
    return super.list(search).pipe(
      map(answers => answers.map(a => { // map the array, then map each item
          return {
            ...a,
            createdAt: parseISO(a.createdAt as any),
            updatedAt: parseISO(a.updatedAt as any)
          }
        })
      ));
  }

}
