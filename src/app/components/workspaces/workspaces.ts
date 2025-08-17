import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {Tag, TagClient} from '../../services/clients/tag-client';
import {SignalsApp} from '../../services/signals-app';
import {Workspace, WorkspaceClient} from '../../services/clients/workspace-client';
import {SearchRequest} from '../../services/clients/abstract-client';
import {debounceTime, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-workspaces',
  standalone: false,
  templateUrl: './workspaces.html',
  styleUrl: './workspaces.scss'
})
export class Workspaces implements OnInit, OnDestroy {

  private workspaceClient = inject(WorkspaceClient);
  private router = inject(Router);
  protected signalApp = inject(SignalsApp);

  protected searchSubscription!: Subscription;
  protected searchSubject = new Subject<string>();
  protected searchValue: string = '';

  private rowsPage = 10;
  private currentPage = 0;
  private totalRecords = 0;
  private isLoading = true;

  workspaces: Tag[] = [];

  constructor() {
    effect(() => {
      if (this.signalApp.refreshWorkspace()) {
        console.log('Refresh signal received, reloading tags...');
        // 2. When refreshing, clear the search bar and load all tags
        this.searchValue = '';
        this.loadWorkspaces();
        this.signalApp.refreshWorkspace.set(false);
      }
    });
  }

  ngOnInit() {
    // 3. Load all tags on initial component load
    this.loadWorkspaces();


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

  protected editWorkspace(workspace: Workspace) {
    this.signalApp.selectedWorkspace.set(workspace);
    this.signalApp.showWorkspaceInput.set(true);
  }

  protected addMembers(workspace: Workspace) {
    this.signalApp.selectedWorkspace.set(workspace);
    this.signalApp.showWorkspaceAddMember.set(true);
  }

  protected navigateTo(route: string, id: string) {
    this.router.navigate([route]);
  }

  protected createSearchRequest(term: string, pageNumber: number): SearchRequest {
    const filters = new Map<string, string>();
    if (term) {
      filters.set('id', term);
      filters.set('name', term);
      filters.set('description', term);
      filters.set('ownerName', term);
    }
    return {queryType: 'or', filters: filters, pageNumber: pageNumber, pageSize: this.rowsPage};
  }

  protected onSearchInput(): void {
    this.searchSubject.next(this.searchValue);
  }

  protected async loadWorkspaces(): Promise<void> {
    this.isLoading = true;
    try {
      const searchRequest = this.createSearchRequest(this.searchValue, this.currentPage);
      const tagPageable = await this.workspaceClient.pageAsync(searchRequest);
      this.workspaces = tagPageable.items;
      this.totalRecords = tagPageable.total;
    } catch (e) {
      console.error('Failed to load workspaces:');
    } finally {
      this.isLoading = false;
    }
  }

}
