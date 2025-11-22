import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SilverBill } from './silver-bill';

describe('SilverBill', () => {
  let component: SilverBill;
  let fixture: ComponentFixture<SilverBill>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SilverBill]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SilverBill);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
