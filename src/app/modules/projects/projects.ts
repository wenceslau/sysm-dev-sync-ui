import {Component, effect, inject, OnDestroy, OnInit, signal, ViewChild} from '@angular/core';
import {SignalApp} from '../../services/signal-app';
import {Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';
import {DataViewLazyLoadEvent} from 'primeng/dataview';
import {ProjectInput} from './project-input/project-input';
import {HttpApp, RequestData} from '../../services/http-app';
import {Pageable, Project} from '../../application/objects';

@Component({
  selector: 'app-projects',
  standalone: false,
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class Projects implements OnInit, OnDestroy {

  private modulePath: string = "/projects"

  private httpApp = inject(HttpApp);
  protected signalApp = inject(SignalApp);

  protected projects: Project[] = [];
  protected selectedProject: Project | null = null;

  protected searchSubscription!: Subscription;
  protected searchSubject = new Subject<string>();
  protected searchValue: string = '';

  protected rowsPage = 10;
  private currentPage = 0;
  protected totalRecords = 0;
  protected isLoading = true;

  constructor() {
    effect(() => {
      if (this.signalApp.refreshProjects()) {
        this.searchValue = '';
        this.loadProjects();
        this.signalApp.refreshProjects.set(false);
      }
    });
  }

  ngOnInit() {
    // 3. Load all tags on initial component load
    this.signalApp.selectedProject.set(null);
    this.loadProjects();

    // 4. Set up the debounced search subscription
    this.searchSubscription = this.searchSubject.pipe(
      // Wait for 400ms of silence before proceeding
      debounceTime(400),
      // Only continue if the new search term is different from the last
      distinctUntilChanged(),
      // Set loading state before making the API call
      tap(() => this.isLoading = true),
      // Cancel previous pending requests and switch to the new one
      switchMap(searchTerm => this.httpApp.getAsync<Pageable>(this.createSearchReqData(searchTerm, 0)))
    ).subscribe({
      next: (tagPageable) => {
        this.projects = tagPageable.items;
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

  protected editProject(project: Project) {
    this.selectedProject = project;
    this.signalApp.selectedProject.set(project);
  }

  protected onSearchInput(): void {
    this.searchSubject.next(this.searchValue);
  }

  protected onLazyLoad($event: DataViewLazyLoadEvent) {
    console.log('Lazy load event', $event);
    this.currentPage = $event.first / $event.rows;

    this.loadProjects();
  }

  protected async loadProjects(): Promise<void> {
    this.isLoading = true;
    try {
      const searchReqData = this.createSearchReqData(this.searchValue, this.currentPage);
      const tagPageable = await this.httpApp.getAsync<Pageable>(searchReqData);
      this.projects = tagPageable.items;
      this.totalRecords = tagPageable.total;
    } catch (e) {
      console.error('Failed to load tags:');
    } finally {
      this.isLoading = false;
    }
  }

  @ViewChild(ProjectInput) projectInput!: ProjectInput;

  resetInput() {
    this.projectInput.reset();
  }

  private createSearchReqData(term: string, pageNumber: number): RequestData {
    const filters = new Map<string, string>();
    if (term) {
      filters.set('id', term);
      filters.set('name', term);
      filters.set('description', term);
      filters.set('workspaceId', term);
    }
    let searchRequest = {queryType: 'or', filters: filters, pageNumber: pageNumber, pageSize: this.rowsPage};

    let reqData = new RequestData(this.modulePath, searchRequest);
    reqData.prepareRequestData(searchRequest);
    return reqData;
  }

}
