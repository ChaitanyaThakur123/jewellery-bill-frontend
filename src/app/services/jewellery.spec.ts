import { TestBed } from '@angular/core/testing';

import { Jewellery } from './jewellery';

describe('Jewellery', () => {
  let service: Jewellery;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Jewellery);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
