import { Injectable } from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoginService } from '../service/login/login.service';

const TOKEN_HEADER_KEY = 'authorization';

@Injectable()
export class WithCredentialsInterceptor implements HttpInterceptor {

  constructor(private router: Router, private loginService: LoginService) {}
  
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    let req = request;
    const token = this.loginService.jwtToken;
    if (token != null) {
      req = this.addTokenHeader(req, token);
    }
    
    return next.handle(req).pipe(catchError(error => {
      if ( this.loginService.isLoggedIn) {
        this.loginService.signOut();
        window.location.reload();
      }
      return throwError(() => error);
    }));
  }

  private addTokenHeader(request: HttpRequest<unknown>, token: string) {
    return request.clone({headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer '+ token)})
  }
}

export const WithCredentialsInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: WithCredentialsInterceptor,
    multi: true,
}