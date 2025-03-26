import { TestBed } from '@angular/core/testing';

import { CollectionModalService } from './collection-modal.service';

describe('CollectionModalService', () => {
  let service: CollectionModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollectionModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
