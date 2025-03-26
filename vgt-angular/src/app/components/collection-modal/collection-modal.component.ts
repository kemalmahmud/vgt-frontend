import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Collection {
  id: string;
  name: string;
}

@Component({
  selector: 'app-collection-modal',
  standalone: true,
  templateUrl: './collection-modal.component.html',
  styleUrl: './collection-modal.component.css',
  imports: [CommonModule],
})
export class CollectionModalComponent implements OnChanges {
  @Input() collections: Collection[] = [];
  @Input() isVisible: boolean = false;
  @Input() buttonPosition: { top: number; left: number } | null = null;
  @Output() collectionSelected = new EventEmitter<Collection[]>();
  @Output() closeModal = new EventEmitter<void>();

  selectedCollections = new Set<string>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible']?.currentValue) {
      this.resetSelections();
    }
  }

  toggleSelection(collectionId: string) {
    // if (this.selectedCollections.has(collectionId)) {
    //   this.selectedCollections.delete(collectionId);
    // } else {
    //   this.selectedCollections.add(collectionId);
    // }

     // Hanya menyimpan satu ID dalam Set
    if (this.selectedCollections.has(collectionId)) {
        this.selectedCollections.delete(collectionId);
    } else {
      this.selectedCollections.clear(); // Unselect semua sebelum memilih yang baru
      this.selectedCollections.add(collectionId);
    }
  }

  saveSelections() {
    const selected = this.collections.filter(c => this.selectedCollections.has(c.id));
    if (selected.length > 0) {
      this.collectionSelected.emit(selected);
    }
  }

  close() {
    this.closeModal.emit();
  }

  isSelected(collectionId: string): boolean {
    return this.selectedCollections.has(collectionId);
  }

  resetSelections() {
    this.selectedCollections.clear();
  }

  get modalStyle() {
    return this.buttonPosition
      ? {
          position: 'absolute',
          top: `${this.buttonPosition.top}px`,
          left: `${this.buttonPosition.left}px`,
          transform: 'translate(-50%, 0)',
        }
      : {};
  }
}
