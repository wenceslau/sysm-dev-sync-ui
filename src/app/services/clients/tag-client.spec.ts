import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import {TagClient, Tag} from './tag-client';
import {SearchRequest} from './abstract-client';

describe('TagClient', () => {
  let service: TagClient;
  let httpTestingController: HttpTestingController;
  const apiUrl = "http://localhost:8080"; // Assuming this is your base URL from HttpApp
  const tagsMapping = '/tags';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TagClient]
    });
    service = TestBed.inject(TagClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Ensure that there are no outstanding requests after each test
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // UPDATED TEST: Now passes an empty search object
  it('should call GET /tags when list() is called with an empty search', () => {
    const mockTags: Tag[] = [
      {id: 1, name: 'Angular', color: '#DD0031', description: 'A web framework'},
      {id: 2, name: 'Testing', color: '#4CAF50', description: 'Ensuring quality'}
    ];

    // Call the service method with an empty search object
    service.list({}).subscribe(tags => {
      expect(tags).toEqual(mockTags);
      expect(tags.length).toBe(2);
    });

    // Expect a request to the base URL without any query params
    const req = httpTestingController.expectOne(`${apiUrl}${tagsMapping}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockTags);
  });

  // NEW TEST: Verifies that search parameters are correctly added to the URL
  it('should call GET /tags with query params when list() is called with a search request', () => {
    const mockTags: Tag[] = [{id: 1, name: 'Angular', color: '#DD0031', description: 'A web framework'}];

    const searchRequest: SearchRequest = {
      pageNumber: 0,
      pageSize: 10,
      sort: 'name',
      direction: 'asc',
      filters: new Map([['description', 'A web framework']])
    };

    service.list(searchRequest).subscribe(tags => {
      expect(tags).toEqual(mockTags);
    });

    // The HttpTestingController can match the URL including the query string
    const expectedUrl = `${apiUrl}${tagsMapping}?pageNumber=0&pageSize=10&sort=name&direction=asc&description=A%20web%20framework`;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');

    // Verify individual parameters on the request object
   expect(req.request.params.get('pageNumber')).toBe('0');
   expect(req.request.params.get('sort')).toBe('name');
    expect(req.request.params.get('description')).toBe('A web framework');

    req.flush(mockTags);
  });

  it('should call GET /tags/{id} when getById() is called', () => {
    const mockTag: Tag = {id: 1, name: 'Angular', color: '#DD0031', description: 'A web framework'};
    const testId = '1';

    service.getById(testId).subscribe(tag => {
      expect(tag).toEqual(mockTag);
    });

    const req = httpTestingController.expectOne(`${apiUrl}${tagsMapping}/${testId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTag);
  });

  it('should call POST /tags when save() is called', () => {
    const newTag: Omit<Tag, 'id'> = {name: 'New Tag', color: '#000000', description: 'A fresh tag'};
    const savedTag: Tag = {id: 3, ...newTag};

    service.save(newTag as Tag).subscribe(response => {
      expect(response).toEqual(savedTag);
    });

    const req = httpTestingController.expectOne(`${apiUrl}${tagsMapping}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTag);
    req.flush(savedTag);
  });
});
