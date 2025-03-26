import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private apiUrl = 'http://localhost:8084/api/collections/user-collections';
  private userId = 'ffdd26c6-7fef-4b69-9357-d8dbccaac212'; // sementara

  constructor(private http: HttpClient) {}

  fetchCollections(): Observable<any> {
    return this.http.post<any>(this.apiUrl, { userId: this.userId });
  }
}
