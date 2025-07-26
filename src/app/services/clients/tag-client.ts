import {inject, Injectable} from '@angular/core';
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

  /**
   * A new async mock method that simulates a real API call by returning a Promise.
   */
  async mockAsync(): Promise<Tag[]> {
    console.log('Fetching mock data asynchronously...');
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.mock());
      }, 500); // Simulate a 500ms network delay
    });
  }

  mock() {
    return [
        {
          id: 1,
          name: 'java',
          color: 'red',
          description: 'Tag 1 description xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc'
        },
        {
          id: 2,
          name: 'angular',
          color: 'blue',
          description: 'Tag 2 description cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc'
        },
        {
          id: 3,
          name: 'node',
          color: 'green',
          description: 'Tag 3 description xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
        },
        {
          id: 4,
          name: 'react',
          color: 'yellow',
          description: 'Tag 4 description cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc'
        },
      {
        id: 1,
        name: 'java',
        color: 'red',
        description: 'Tag 1 description xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
      },
      {
        id: 2,
        name: 'angular',
        color: 'blue',
        description: 'Tag 2 description cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc'
      },
      {
        id: 3,
        name: 'node',
        color: 'green',
        description: 'Tag 3 description xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
      },
      {
        id: 4,
        name: 'react',
        color: 'yellow',
        description: 'Tag 4 description cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc'
      },
      {
        id: 1,
        name: 'java',
        color: 'red',
        description: 'Tag 1 description xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
      },
      {
        id: 2,
        name: 'angular',
        color: 'blue',
        description: 'Tag 2 description cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc'
      },
      {
        id: 3,
        name: 'node',
        color: 'green',
        description: 'Tag 3 description xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
      },
      {
        id: 4,
        name: 'react',
        color: 'yellow',
        description: 'Tag 4 description cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc'
      },
      {
        id: 1,
        name: 'java',
        color: 'red',
        description: 'Tag 1 description xxxxxxxxxxxxxxxxxxxxxxxsfdxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxasaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
      },
      {
        id: 2,
        name: 'angular',
        color: 'blue',
        description: 'Tag 2 description cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc'
      },
      {
        id: 3,
        name: 'node',
        color: 'green',
        description: 'Tag 3 description xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
      },
      {
        id: 4,
        name: 'react',
        color: 'yellow',
        description: 'Tag 4 description cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc'
      }
    ];

  }

}
