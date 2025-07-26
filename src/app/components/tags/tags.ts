import {Component, inject, OnInit, signal} from '@angular/core';
import {Tag, TagClient} from '../../services/clients/tag-client';
import {Input} from 'postcss';

@Component({
  selector: 'app-tags',
  standalone: false,
  templateUrl: './tags.html',
  styleUrl: './tags.scss'
})
export class Tags implements OnInit {

  tags: Tag[] = []
  isLoading = true;
  tagClient = inject(TagClient)

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    try {
      this.tags = await this.tagClient.mockAsync();
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading = false;
    }
  }

}
