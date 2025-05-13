import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestAPIService {

  APIEndPoint = 'http://localhost:5360/';

  // Error handling 
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    //window.alert(errorMessage);
    return throwError(errorMessage);
  }

  constructor(private http: HttpClient) { }

  StudentView(): Observable<any> {
    return this.http.get(this.APIEndPoint + 'api/Students/GetStudents').pipe(retry(1), catchError(this.handleError));
  }

  StudentAdd(data: any): Observable<any> {
    return this.http.post<any>(this.APIEndPoint + 'api/Students/StudentAdd', data).pipe(retry(1), catchError(this.handleError));
  }
}
