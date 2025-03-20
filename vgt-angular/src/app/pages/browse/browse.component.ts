import { HttpClient } from '@angular/common/http';
import { Component, OnInit, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CollectionModalComponent } from '../../components/collection-modal/collection-modal.component';

@Component({
  selector: 'app-browse',
  imports: [FormsModule, CommonModule, CollectionModalComponent],
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
  collections = ['Collection 1', 'Collection 2', 'Collection 3', 'Collection 4'];
  modalPosition: { top: number; left: number } | null = null;
  lastButtonRect: DOMRect | null = null; // Simpan posisi terakhir button

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchGames();
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

  openModal(event: MouseEvent) {
    const button = event.target as HTMLElement;
    this.lastButtonRect = button.getBoundingClientRect();

    this.modalPosition = this.initialModalPosition(this.lastButtonRect);
  
    this.isModalVisible = true;
  }
  
  
  onCollectionSelected(selected: string[]) {
    console.log('Selected collections:', selected);
    this.isModalVisible = false;
  }
  
  closeModal() {
    this.isModalVisible = false;
  }

  // @HostListener('window:scroll')
  // updateModalPosition() {
  //   if (this.isModalVisible && this.lastButtonRect) {
  //     this.modalPosition = this.calculateModalPosition(this.lastButtonRect);
  //   }
  // }

  private initialModalPosition(rect: DOMRect) {
    const modalHeight = 200; // Perkiraan tinggi modal, bisa diubah sesuai desain
    const screenHeight = window.innerHeight;
    const bottomSpace = screenHeight - (rect.top + rect.height);
  
    let topPosition = rect.top + rect.height;
  
    if (bottomSpace < modalHeight) {
      topPosition = rect.top - modalHeight;
    }
  
    return {
      top: topPosition,
      left: rect.left
    };
  }

  // private calculateModalPosition(rect: DOMRect) {
  //   return {
  //     top: rect.top + window.scrollY + rect.height, 
  //     left: rect.left + window.scrollX 
  //   };
  // }
}
