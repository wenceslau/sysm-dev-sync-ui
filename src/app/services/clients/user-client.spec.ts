import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UserClient, User, UserRole } from './user-client';
import {SearchRequest} from './abstract-client';
import {Tag} from './tag-client';

describe('UserClient', () => {
  let service: UserClient;
  let httpTestingController: HttpTestingController;
  const apiUrl = "http://localhost:8080"; // Base URL from HttpApp
  const usersMapping = '/users';

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Import the testing module for HttpClient
      imports: [HttpClientTestingModule],
      // Provide the service to be tested
      providers: [UserClient]
    });
    service = TestBed.inject(UserClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Ensure that there are no outstanding requests after each test
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should call GET /users when list() is called', () => {
  //   // 1. Define mock data for a list of users
  //   const mockUsers: User[] = [
  //     { id: '1', username: 'wenceslau', email: 'wenceslau@email.com', roles: UserRole.ADMIN },
  //     { id: '2', username: 'gemini', email: 'gemini@google.com', roles: UserRole.USER }
  //   ];
  //
  //   const searchRequest: SearchRequest = {
  //     pageNumber: 0,
  //     pageSize: 10,
  //     sort: 'name',
  //     direction: 'asc',
  //     filters: new Map([['email', 'wenceslau@email.com']])
  //   };
  //
  //   service.list(searchRequest).subscribe(users => {
  //     expect(users).toEqual(mockUsers);
  //   });
  //
  //   // The HttpTestingController can match the URL including the query string
  //   const expectedUrl = `${apiUrl}${usersMapping}?pageNumber=0&pageSize=10&sort=name&direction=asc&description=A%20web%20framework`;
  //   const req = httpTestingController.expectOne(expectedUrl);
  //   expect(req.request.method).toBe('GET');
  //
  //   // Verify individual parameters on the request object
  //   expect(req.request.params.get('pageNumber')).toBe('0');
  //   expect(req.request.params.get('sort')).toBe('name');
  //   expect(req.request.params.get('description')).toBe('A web framework');
  //
  //   req.flush(mockUsers);
  // });

  // UPDATED TEST: Now passes an empty search object
  it('should call GET /tags when list() is called with an empty search', () => {
      const mockUsers: User[] = [
        { id: '1', username: 'wenceslau', email: 'wenceslau@email.com', roles: UserRole.ADMIN },
        { id: '2', username: 'gemini', email: 'gemini@google.com', roles: UserRole.USER }
      ];

    // Call the service method with an empty search object
    service.list({}).subscribe(tags => {
      expect(tags).toEqual(mockUsers);
      expect(tags.length).toBe(2);
    });

    // Expect a request to the base URL without any query params
    const req = httpTestingController.expectOne(`${apiUrl}${usersMapping}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockUsers);
  });

  // NEW TEST: Verifies that search parameters are correctly added to the URL
  it('should call GET /tags with query params when list() is called with a search request', () => {
    const mockUsers: User[] = [
      { id: '1', username: 'wenceslau', email: 'wenceslau@email.com', roles: UserRole.ADMIN },
      { id: '2', username: 'gemini', email: 'gemini@google.com', roles: UserRole.USER }
    ];

    const searchRequest: SearchRequest = {
      pageNumber: 0,
      pageSize: 10,
      sort: 'username',
      direction: 'asc',
      filters: new Map([['email', 'wenceslau@email.com']])
    };

    service.list(searchRequest).subscribe(tags => {
      expect(tags).toEqual(mockUsers);
    });

    // The HttpTestingController can match the URL including the query string
    const expectedUrl = `${apiUrl}${usersMapping}?pageNumber=0&pageSize=10&sort=username&direction=asc&email=wenceslau@email.com`;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');

    // Verify individual parameters on the request object
    expect(req.request.params.get('pageNumber')).toBe('0');
    expect(req.request.params.get('sort')).toBe('username');
    expect(req.request.params.get('email')).toBe('wenceslau@email.com');

    req.flush(mockUsers);
  });

  it('should call GET /users/{id} when getById() is called', () => {
    const mockUser: User = { id: '1', username: 'wenceslau', email: 'wenceslau@email.com', roles: UserRole.ADMIN };
    const testId = '1';

    service.getById(testId).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpTestingController.expectOne(`${apiUrl}${usersMapping}/${testId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should call POST /users when save() is called', () => {
    // Using Omit to represent a new user without an ID
    const newUserPayload: Omit<User, 'id'> = { username: 'newuser', email: 'new@email.com', roles: UserRole.USER };
    const savedUserResponse: User = { id: '3', ...newUserPayload };

    service.save(newUserPayload as User).subscribe(response => {
      expect(response).toEqual(savedUserResponse);
    });

    const req = httpTestingController.expectOne(`${apiUrl}${usersMapping}`);
    expect(req.request.method).toBe('POST');

    // Ensure the payload sent in the request is correct
    expect(req.request.body).toEqual(newUserPayload);
    req.flush(savedUserResponse);
  });

  it('should call DELETE /users/{id} when delete() is called', () => {
    const testId = '1';

    service.delete(testId).subscribe(response => {
      // For a void response, we just care that it completes successfully
      expect(response).toBeNull();
    });

    const req = httpTestingController.expectOne(`${apiUrl}${usersMapping}/${testId}`);
    expect(req.request.method).toBe('DELETE');

    // For a 204 No Content response, flush with null
    req.flush(null, { status: 204, statusText: 'No Content' });
  });
});
