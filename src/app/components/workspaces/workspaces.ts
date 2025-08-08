import {Component, effect, inject, OnInit} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {Tag, TagClient} from '../../services/clients/tag-client';
import {SignalsApp} from '../../services/signals-app';
import {WorkspaceClient} from '../../services/clients/workspace-client';
import {SearchRequest} from '../../services/clients/abstract-client';
import {debounceTime, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-workspaces',
  standalone: false,
  templateUrl: './workspaces.html',
  styleUrl: './workspaces.scss'
})
export class Workspaces implements OnInit {

  rowsPage = 10;
  currentPage = 0;
  totalRecords = 0;
  isLoading = true;

  protected searchSubscription!: Subscription;
  protected searchSubject = new Subject<string>();
  protected searchValue: string = '';

  workspaces: Tag[] = [];
  workspaceClient = inject(WorkspaceClient);
  signalApp = inject(SignalsApp);


  constructor() {
    effect(() => {
      if (this.signalApp.refreshTags()) {
        console.log('Refresh signal received, reloading tags...');
        // 2. When refreshing, clear the search bar and load all tags
        this.searchValue = '';
        this.loadingWorkspace();
        this.signalApp.refreshTags.set(false);
      }
    });
  }

  ngOnInit() {
    // 3. Load all tags on initial component load
    this.loadingWorkspace();


    // 4. Set up the debounced search subscription
    this.searchSubscription = this.searchSubject.pipe(
      // Wait for 400ms of silence before proceeding
      debounceTime(400),
      // Only continue if the new search term is different from the last
      distinctUntilChanged(),
      // Set loading state before making the API call
      tap(() => this.isLoading = true),
      // Cancel previous pending requests and switch to the new one
      switchMap(searchTerm => this.workspaceClient.pageAsync(this.createSearchRequest(searchTerm, 0)))
    ).subscribe({
      next: (tagPageable) => {
        this.workspaces = tagPageable.items;
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

  onSearchInput(): void {
    this.searchSubject.next(this.searchValue);
  }

  protected async loadingWorkspace(): Promise<void> {
    this.isLoading = true;
    try {
      const searchRequest = this.createSearchRequest(this.searchValue, this.currentPage);
      const tagPageable = await this.workspaceClient.pageAsync(searchRequest);
      this.workspaces = tagPageable.items;
      this.totalRecords = tagPageable.total;
    } catch (e) {
      console.error('Failed to load workspaces:', e);
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
