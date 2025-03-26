import { HttpClient } from '@angular/common/http';
import { Component, OnInit, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CollectionModalComponent } from '../../components/collection-modal/collection-modal.component';
import { RouterModule } from '@angular/router';
import { CollectionService } from '../../services/collection.service';
import { CollectionModalService } from '../../services/collection-modal.service';

@Component({
  selector: 'app-browse',
  imports: [FormsModule, CommonModule, CollectionModalComponent, RouterModule],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.css'
})
export class BrowseComponent implements OnInit{
  private apiUrl = 'http://localhost:8083/api/games';
  games: any[] = [];
  keyword: string = '';
  currentPage = 1;
  totalPages = 1;
  pageSize = 6;

  //untuk modal collection
  isModalVisible = false;
  collections: { id: string, name: string }[] = [];
  modalPosition: { top: number; left: number } | null = null;
  lastButtonRect: DOMRect | null = null; 

  constructor(private http: HttpClient, public collectionService: CollectionService, 
    public collectionModalService : CollectionModalService) {}

  ngOnInit(): void {
    this.fetchGames();
    this.collectionService.fetchCollections().subscribe(
      (response) => {
        if (response.status === 200 && response.data.collections) {
          this.collections = response.data.collections.map((col: any) => ({
            id: col.collectionId,
            name: col.collectionName,
          }));
        }
      },
      (error) => {
        console.error('Error fetching collections:', error);
      }
    );
  }

  onSearch(): void {
    this.currentPage = 1;
    this.fetchGames();
  }
  

  fetchGames(): void {
    this.getGames(this.keyword, (this.currentPage - 1) * this.pageSize, this.pageSize).subscribe(
      (response) => {
        if (response.status === 200) {
          this.games = response.data.games;
          this.totalPages = response.data.totalPages;
        }
      },
      (error) => {
        console.error('Error fetching games:', error);
      }
    );
  }

  changePage(newPage: number): void {
    if (newPage > 0 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.fetchGames();
    }
  }

  getGames(keyword: string, offset: number = 0, limit: number = 6): Observable<any> {
    const url = `${this.apiUrl}?offset=${offset}&limit=${limit}&keyword=${keyword}`;
    return this.http.get<any>(url);
  }
  
  openCollectionModal(event: MouseEvent, game: any) {
    this.collectionModalService.setSelectedGame(game); // Simpan game yang sedang dipilih
    this.collectionModalService.openModal(event, this.collections);
  }
}
