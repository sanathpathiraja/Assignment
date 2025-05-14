import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, catchError } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class RestAPIService {


  constructor(private http: HttpClient, private config: ConfigService) { }

  StudentView(): Observable<any> {
    return this.http.get(this.config.APIEndPoint + 'api/Students/GetStudents').pipe(retry(1), catchError(this.config.handleError));
  }

  StudentAdd(
    FirstName: string,
    LastName: string,
    Mobile: string,
    Email: string,
    NIC: string,
    DateOfBirth: string,
    Address: string,
    Photos: File,
  ): Observable<any> {

    const formData = new FormData();
    formData.append('FirstName', FirstName);
    formData.append('LastName', LastName);
    formData.append('Mobile', Mobile);
    formData.append('Email', Email);
    formData.append('NIC', NIC);
    formData.append('DateOfBirth', DateOfBirth);
    formData.append('Address', Address);
    formData.append('Photos', Photos);
    return this.http.post<any>(this.config.APIEndPoint + 'api/Students/AddStudent', formData);
  }

  StudentEdit(
    RecId: string,
    FirstName: string,
    LastName: string,
    Mobile: string,
    Email: string,
    NIC: string,
    DateOfBirth: string,
    Address: string,
    Photos: File,
  ): Observable<any> {

    const formData = new FormData();
    formData.append('recId', RecId);
    formData.append('FirstName', FirstName);
    formData.append('LastName', LastName);
    formData.append('Mobile', Mobile);
    formData.append('Email', Email);
    formData.append('NIC', NIC);
    formData.append('DateOfBirth', DateOfBirth);
    formData.append('Address', Address);
    formData.append('Photos', Photos);
    return this.http.put<any>(this.config.APIEndPoint + 'api/Students/EditStudent', formData);
  }

  StudentDelete(RecId: any): Observable<any> {
    const params = new HttpParams().set('recId', RecId);
    return this.http.delete(this.config.APIEndPoint + 'api/Students/DeleteStudent', { params: params }).pipe(retry(0), catchError(this.config.handleError));
  }
}
