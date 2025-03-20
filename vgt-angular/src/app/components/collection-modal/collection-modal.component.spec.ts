import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionModalComponent } from './collection-modal.component';

describe('CollectionModalComponent', () => {
  let component: CollectionModalComponent;
  let fixture: ComponentFixture<CollectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
