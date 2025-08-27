import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { HttpApp, RequestData, ContentType } from './http-app';

interface MockData {
  id: number;
  name: string;
}

describe('HttpApp', () => {
  let service: HttpApp;
  let httpTestingController: HttpTestingController;
  const apiUrl = "http://localhost:8080";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpApp]
    });

    service = TestBed.inject(HttpApp);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('GET requests', () => {
    it('should perform a GET request and return strongly-typed data', () => {
      const testData: MockData = { id: 1, name: 'Test Data' };
      const testPath = '/test-get';

      const requestData = new RequestData();
      requestData.customPath = testPath;

      service.get<MockData>(requestData).subscribe(data => {
        expect(data).toEqual(testData);
        expect(data.id).toBe(1);
      });

      const req = httpTestingController.expectOne(`${apiUrl}${testPath}`);
      expect(req.request.method).toEqual('GET');
      req.flush(testData);
    });
  });

  describe('POST requests', () => {
    it('should perform a POST request with a payload and return a typed response', () => {
      const testPayload = { name: 'New Item' };
      const testResponse: MockData = { id: 2, name: 'New Item' };
      const testPath = '/test-post';

      const requestData = new RequestData();
      requestData.customPath = testPath;
      requestData.payload = testPayload;

      service.post<MockData>(requestData).subscribe(response => {
        expect(response).toEqual(testResponse);
      });

      const req = httpTestingController.expectOne(`${apiUrl}${testPath}`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testPayload);
      req.flush(testResponse);
    });
  });

  describe('Header Handling', () => {
    let requestData: RequestData;
    const testPath = '/test-headers';

    beforeEach(() => {
      requestData = new RequestData();
      requestData.customPath = testPath;
    });

    it('should add Content-Type and custom headers to the request', () => {
      requestData.contentType = ContentType.JSON;
      requestData.addCustomHeader('X-Test-Header', 'MyValue');

      service.get<any>(requestData).subscribe();

      const req = httpTestingController.expectOne(`${apiUrl}${testPath}`);
      expect(req.request.headers.get('Content-Type')).toBe(ContentType.JSON);
      expect(req.request.headers.get('X-Test-Header')).toBe('MyValue');

      req.flush({});
    });
  });

  describe('Error Handling', () => {
    it('should handle a 404 Not Found error', () => {
      const testPath = '/not-found';
      const errorMessage = '404 Not Found';

      const requestData = new RequestData();
      requestData.customPath = testPath;

      service.get<any>(requestData).subscribe({
        next: () => fail('should have failed with a 404 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toEqual(404);
          expect(error.statusText).toEqual(errorMessage);
        }
      });

      const req = httpTestingController.expectOne(`${apiUrl}${testPath}`);
      req.flush(errorMessage, { status: 404, statusText: errorMessage });
    });
  });
});
