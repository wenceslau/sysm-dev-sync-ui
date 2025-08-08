import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {Tag, TagClient} from '../../services/clients/tag-client';
import {SignalsApp} from '../../services/signals-app';
import {Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';
import {SearchRequest} from '../../services/clients/abstract-client';
import {DataViewLazyLoadEvent} from 'primeng/dataview';

@Component({
  selector: 'app-tags',
  standalone: false,
  templateUrl: './tags.html',
  styleUrl: './tags.scss'
})
export class Tags implements OnInit, OnDestroy {

  rowsPage = 10;
  currentPage = 0;
  totalRecords = 0;
  isLoading = true;

  tags: Tag[] = [];
  tagClient = inject(TagClient);
  signalApp = inject(SignalsApp);

  // 1. RxJS Subject to handle search term changes
  protected searchSubscription!: Subscription;
  protected searchSubject = new Subject<string>();
  protected searchValue: string = '';

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
      switchMap(searchTerm => this.tagClient.pageAsync(this.createSearchRequest(searchTerm, 0)))
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

  editTag(tag: Tag) {
    this.signalApp.selectedTag.set(tag);
    this.signalApp.showTagInput.set(true);
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchValue);
  }

  onLazyLoad($event: DataViewLazyLoadEvent) {
    console.log('Lazy load event', $event);
    this.currentPage = $event.first / $event.rows;

    this.loadingTags();
  }

  // This method is now primarily for initial load and manual refreshes
  protected async loadingTags(): Promise<void> {
    this.isLoading = true;
    try {
      const searchRequest = this.createSearchRequest(this.searchValue, this.currentPage);
      const tagPageable = await this.tagClient.pageAsync(searchRequest);
      this.tags = tagPageable.items;
      this.totalRecords = tagPageable.total;
    } catch (e) {
      console.error('Failed to load tags:', e);
    } finally {
      this.isLoading = false;
    }
  }

  protected createSearchRequest(term: string, pageNumber: number): SearchRequest {
    const filters = new Map<string, string>();
    if (term) {
      filters.set('name', term);
      filters.set('description', term);
    }
    return {queryType: 'or', filters: filters, pageNumber: pageNumber, pageSize: this.rowsPage};
  }
}
