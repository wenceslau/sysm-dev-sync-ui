import {inject, Injectable} from '@angular/core';
import {AbstractClient} from './abstract-client';

export interface Tag {
  id: number;
  name: string;
  color: string;
  description: string;
  category: string;
  amountUsed: number;
}

export interface TagColor {
  name: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class TagClient extends AbstractClient<Tag> {

  constructor() {
    super();
    this.setReqMapping('/tags');
  }

  tagColors(): TagColor[] {
    return [
      {name: "white", color: "#ffffff"},
      {name: "black", color: "#000000"},
      {name: "red", color: "#ff0000"},
      {name: "green", color: "#00ff00"},
      {name: "blue", color: "#0000ff"},
      {name: "yellow", color: "#ffff00"},
      {name: "purple", color: "#ff00ff"},
      {name: "orange", color: "#ffa500"},
      {name: "pink", color: "#ffc0cb"},
      {name: "brown", color: "#a52a2a"},
      {name: "gray", color: "#808080"},
      {name: "cyan", color: "#00ffff"},
      {name: "magenta", color: "#ff00ff"},
      {name: "lime", color: "#00ff00"},
      {name: "teal", color: "#008080"},
      {name: "olive", color: "#808000"},
      {name: "navy", color: "#000080"},
      {name: "nblue", color: "#2496ED"}
    ]

  }


}
