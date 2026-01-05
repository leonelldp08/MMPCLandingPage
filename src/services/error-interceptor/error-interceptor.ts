import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, throwError, switchMap, Observable, finalize } from 'rxjs';
import { LoaderService } from '../loader/loader';
import { Injector, Injectable } from '@angular/core';
import { Toast } from '../toast/toast';
import { Auth } from '../auth/auth';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private injector: Injector,
    private toast: Toast,
    private loader: LoaderService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (req.headers.get('X-Use-Loader') === 'true') {
      this.loader.show();
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const auth = this.injector.get(Auth);
        if (error.status === 401) {
          return auth.refreshToken().pipe(
            switchMap((newToken) => {
              return next.handle(req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              }));
            }),
            catchError(() => {
              if (req.url.includes('auth/user')) {
                this.toast.setState(false, 'Unauthorized detected. Please login with your credentials.');
                this.loader.hide();
              }
              return throwError(() => new Error('Session expired. Please relogin.'));
            })
          );
        }

        let errorMessage = 'An unknown error occurred!';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else if (error.error instanceof ProgressEvent) {
          errorMessage = `Network Error: ${error.statusText}`;
        } else if (error.error instanceof Object) {
          errorMessage = `Server Error: ${error.status}`;
          if (error.error.Message != null) {
            errorMessage += `, Message: ${error.error.Message}`;
          }
          if (error.error.Error != null) {
            errorMessage += `, Exception: ${error.error.Error}`;
          }
          if (
            error.error.message != null ||
            typeof error.error.message === 'string'
          ) {
            errorMessage += `, Error: ${error.error.message}`;
          }
        } else {
          errorMessage = `Server Error: ${error.status} ${error.statusText}`;
          if (error.error != null) {
            errorMessage += ` - ${error.error}`;
          }
        }

        if (req.headers.get('X-Show-Toaster') === 'true') {
          this.toast.setState(false, errorMessage);
        }

        if (req.headers.get('X-Use-Loader') === 'true') {
          this.loader.hide();
        }

        return throwError(() => new Error(errorMessage));
      }),
      // finalize(() => {
      //   if (req.headers.get('X-Use-Loader') === 'true') {
      //     this.loader.hide();
      //   }
      // })
    );
  }
}
