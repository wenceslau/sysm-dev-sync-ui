import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

/**
 * Intercepts outgoing HTTP requests to add the Authorization header with a Bearer token
 * if a token is available in localStorage.
 */
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {

  // Retrieve the token from local storage. In a real app, this might
  // come from a dedicated authentication service.
  const token = localStorage.getItem('ekot');

  // If there's no token, pass the original request along without modification.
  if (!token) {
    return next(req);
  }

  // If a token exists, clone the request to add the new Authorization header.
  // Cloning is required because HttpRequests are immutable.
  const reqWithAuth = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });

  // Pass the cloned, authenticated request to the next handler in the chain.
  return next(reqWithAuth);
};
