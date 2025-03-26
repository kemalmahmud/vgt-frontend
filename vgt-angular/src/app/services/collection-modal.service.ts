import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CollectionModalService {
  isModalVisible = false;
  collections: { id: string; name: string }[] = [];
  modalPosition: { top: number; left: number } | null = null;
  lastButtonRect: DOMRect | null = null;

  onSelected: EventEmitter<{ id: string; name: string }[]> = new EventEmitter();
  private selectedGame: any | null = null;

  constructor(private http: HttpClient) {}

  setSelectedGame(game: any) {
    this.selectedGame = game;
  }

  openModal(event: MouseEvent, collections: { id: string; name: string }[]) {
    const button = event.target as HTMLElement;
    this.lastButtonRect = button.getBoundingClientRect();
    this.modalPosition = this.initialModalPosition(this.lastButtonRect);
    this.collections = collections;
    this.isModalVisible = true;
    document.body.style.overflow = 'hidden'; // Mencegah scroll
  }

  closeModal() {
    this.isModalVisible = false;
    document.body.style.overflow = 'auto';
  }

  saveSelections(selectedCollections: { id: string; name: string }[]) {
    if (!this.selectedGame) {
      console.error("No game selected.");
      return;
    }
  
    const selectedCollection = selectedCollections[0]; // Hanya satu koleksi yang bisa dipilih
    const requestBody = {
      collectionId: selectedCollection.id,
      gameId: this.selectedGame.id,
      gameName: this.selectedGame.name,
      gameCover: this.selectedGame.cover ? this.selectedGame.cover.url : '',
      gameSummary: this.selectedGame.summary || ''
    };
  
    this.http.post('http://localhost:8084/api/collections/add-game', requestBody)
      .subscribe(
        (response: any) => {
          if (response.status === 200) {
            alert(`Game berhasil ditambah ke ${selectedCollection.name}`);
            this.closeModal();
          }
        },
        (error) => {
          console.error("Error adding game to collection:", error);
          alert("Gagal menambahkan game ke koleksi.");
        }
      );
  }

  private initialModalPosition(rect: DOMRect) {
    const modalHeight = 200;
    const screenHeight = window.innerHeight;
    const bottomSpace = screenHeight - (rect.top + rect.height);
  
    let topPosition = rect.top + rect.height;
  
    if (bottomSpace < modalHeight) {
      topPosition = rect.top - modalHeight;
    }
  
    return {
      top: topPosition,
      left: 160 + rect.left
    };
  }
}
