import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBtnComponent } from './sales-btn.component';

describe('SalesBtnComponent', () => {
  let component: SalesBtnComponent;
  let fixture: ComponentFixture<SalesBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesBtnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
