import { Injectable } from '@angular/core';
import {AbstractClient} from './abstract-client';
import {map, Observable} from 'rxjs';
import {parseISO} from 'date-fns';
import {Answer} from './answer-client';

export interface Comment{
  id: string;
  content: string;
  targetType: TargetType;
  targetId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum TargetType {
  NOTE = 'NOTE',
  QUESTION = 'QUESTION',
  ANSWER = 'ANSWER'
}

@Injectable({
  providedIn: 'root'
})
export class CommentClient extends AbstractClient<Comment> {

  constructor() {
    super('/comments');
  }

  override getById(id: string): Observable<Comment> {
    return super.getById(id).pipe(
      map(comment => {
        return {
          ...comment,
          createdAt: parseISO(comment.createdAt as any),
          updatedAt: parseISO(comment.updatedAt as any)
        }
      })
    );
  }

  override list(search: any): Observable<Comment[]> {
    return super.list(search).pipe(
      map(comments => comments.map(c => { // map the array, then map each item
          return {
            ...c,
            createdAt: parseISO(c.createdAt as any),
            updatedAt: parseISO(c.updatedAt as any)
          }
        })
      ));
  }

}
