import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {Tag, TagClient} from '../../services/clients/tag-client';
import {SignalsApp} from '../../services/signals-app';
import {Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';
import {SearchRequest} from '../../services/clients/abstract-client';

@Component({
  selector: 'app-tags',
  standalone: false,
  templateUrl: './tags.html',
  styleUrl: './tags.scss'
})
export class Tags implements OnInit, OnDestroy {

  tags: Tag[] = [];
  isLoading = true;
  tagClient = inject(TagClient);
  signalApp = inject(SignalsApp);
  searchValue: string = '';

  // 1. RxJS Subject to handle search term changes
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  constructor() {
    effect(() => {
      if (this.signalApp.refreshTags()) {
        console.log('Refresh signal received, reloading tags...');
        // 2. When refreshing, clear the search bar and load all tags
        this.searchValue = '';
        this.loadingTags();
        this.signalApp.refreshTags.set(false);
      }
    });
  }

  ngOnInit() {
    // 3. Load all tags on initial component load
    this.loadingTags();

    // 4. Set up the debounced search subscription
    this.searchSubscription = this.searchSubject.pipe(
      // Wait for 400ms of silence before proceeding
      debounceTime(400),
      // Only continue if the new search term is different from the last
      distinctUntilChanged(),
      // Set loading state before making the API call
      tap(() => this.isLoading = true),
      // Cancel previous pending requests and switch to the new one
      switchMap(searchTerm => this.tagClient.pageAsync(this.createSearchRequest(searchTerm)))
    ).subscribe({
      next: (tagPageable) => {
        this.tags = tagPageable.items;
        this.isLoading = false;
      },
      error: (e) => {
        console.error('Failed to search tags:', e);
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    // 5. Clean up the subscription to prevent memory leaks
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  // 6. This method is now called from the template on every input change
  onSearchInput(): void {
    this.searchSubject.next(this.searchValue);
  }

  // This method is now primarily for initial load and manual refreshes
  async loadingTags(): Promise<void> {
    this.isLoading = true;
    try {
      const searchRequest = this.createSearchRequest(this.searchValue);
      const tagPageable = await this.tagClient.pageAsync(searchRequest);
      this.tags = tagPageable.items;
    } catch (e) {
      console.error('Failed to load tags:', e);
    } finally {
      this.isLoading = false;
    }
  }

  private createSearchRequest(term: string): SearchRequest {
    const filters = new Map<string, string>();
    if (term) {
      filters.set('name', term);
      filters.set('description', term);
    }
    return {queryType: 'or', filters: filters};
  }

  editTag(tag: Tag) {
    this.signalApp.selectedTag.set(tag);
    this.signalApp.showTagInput.set(true);
  }
}
