import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-browse',
  imports: [FormsModule, CommonModule],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.css'
})
export class BrowseComponent implements OnInit{
  private apiUrl = 'http://localhost:8083/api/games';
  games: any[] = [];
  keyword: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchGames();
  }

  onSearch(): void {
    this.fetchGames();
  }

  fetchGames(): void {
    this.getGames(this.keyword).subscribe(
      (response) => {
        if (response.status === 200) {
          this.games = response.data.games;
        }
      },
      (error) => {
        console.error('Error fetching games:', error);
      }
    );
  }

  getGames(keyword: string, offset: number = 0, limit: number = 6): Observable<any> {
    const url = `${this.apiUrl}?offset=${offset}&limit=${limit}&keyword=${keyword}`;
    return this.http.get<any>(url);
  }
}
