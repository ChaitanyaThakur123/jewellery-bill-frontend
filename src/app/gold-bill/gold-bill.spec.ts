import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldBill } from './gold-bill';

describe('GoldBill', () => {
  let component: GoldBill;
  let fixture: ComponentFixture<GoldBill>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoldBill]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoldBill);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
