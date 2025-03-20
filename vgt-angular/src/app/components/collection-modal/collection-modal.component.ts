import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-collection-modal',
  standalone: true,
  templateUrl: './collection-modal.component.html',
  styleUrl: './collection-modal.component.css',
  imports: [CommonModule]
})
export class CollectionModalComponent {
  @Input() collections: string[] = []; // Daftar koleksi
  @Input() isVisible: boolean = false; // Modal terlihat atau tidak
  @Input() buttonPosition: { top: number; left: number } | null = null; // Posisi modal
  @Output() collectionSelected = new EventEmitter<string[]>(); // Event saat koleksi dipilih
  @Output() closeModal = new EventEmitter<void>(); // Event untuk menutup modal

  selectedCollections: string[] = [];
  fixedPosition = { top: '0px', left: '0px' };

  toggleSelection(collection: string) {
    if (this.selectedCollections.includes(collection)) {
      this.selectedCollections = this.selectedCollections.filter(item => item !== collection);
    } else {
      this.selectedCollections.push(collection);
    }
  }

  saveSelections() {
    this.collectionSelected.emit(this.selectedCollections);
    this.closeModal.emit();
  }

  close() {
    this.closeModal.emit();
  }

  get modalStyle() {
    console.log("Modal Style Updated:", this.buttonPosition);
    return this.buttonPosition
      ? { 
          'position': 'absolute', 
          'top.px': this.buttonPosition.top, 
          'left.px': this.buttonPosition.left 
        }
      : {};
  }
}
