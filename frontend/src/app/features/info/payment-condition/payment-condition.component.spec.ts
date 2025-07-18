import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentConditionComponent } from './payment-condition.component';

describe('PaymentConditionComponent', () => {
  let component: PaymentConditionComponent;
  let fixture: ComponentFixture<PaymentConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentConditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
