import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../../services/game.service';
import { CollectionModalComponent } from '../../components/collection-modal/collection-modal.component';
import { HttpClient } from '@angular/common/http';
import { CollectionService } from '../../services/collection.service';
import { CollectionModalService } from '../../services/collection-modal.service';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [CommonModule, CollectionModalComponent],
  templateUrl: './game-detail.component.html',
  styleUrl: './game-detail.component.css'
})
export class GameDetailComponent implements OnInit {
  gameId!: number;
  gameData: any = null;
  errorMessage: string | null = null;
  involvedCompanies: string = '';

  //untuk modal collection
  isModalVisible = false;
  collections: { id: string, name: string }[] = [];
  modalPosition: { top: number; left: number } | null = null;
  lastButtonRect: DOMRect | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private gameService: GameService,
    public collectionService: CollectionService, public collectionModalService: CollectionModalService
  ) {}

  ngOnInit(): void {
    // collection
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

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.gameId = parseInt(idParam, 10);
      this.getGameDetails();
    } else {
      this.errorMessage = "Invalid game ID.";
    }
  }

  getGameDetails(): void {
    this.gameService.getGameById(this.gameId).subscribe({
      next: (response) => {
        if (response?.data) {
          this.gameData = response.data;
          this.processGameData();
        } else {
          this.errorMessage = "Game data not found.";
        }
      },
      error: (err) => {
        console.error("Error fetching game details:", err);
        this.errorMessage = "Failed to load game details.";
      }
    });
  }

  processGameData(): void {
    // Handle involved companies safely
    if (this.gameData.involved_companies) {
      this.involvedCompanies = this.gameData.involved_companies
        .map((c: any) => c.company?.name)
        .filter((name: string | undefined) => name !== undefined)
        .join(', ');
    }

    // Ensure all data exists before using it in HTML
    this.gameData.cover = this.gameData.cover || { url: '' };
    this.gameData.release_dates = this.gameData.release_dates || [];
    this.gameData.genres = this.gameData.genres || [];
    this.gameData.platforms = this.gameData.platforms || [];
    this.gameData.screenshots = this.gameData.screenshots || [];
  }

  openCollectionModal(event: MouseEvent) {
    if (!this.gameData) return;
    
    this.collectionModalService.setSelectedGame({
      id: this.gameId,
      name: this.gameData.name,
      cover: { url : this.gameData.cover?.url || '' },
      summary: this.gameData.summary || ''
    });
  
    this.collectionModalService.openModal(event, this.collections);
  }
}
