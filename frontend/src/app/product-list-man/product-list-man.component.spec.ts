import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListManComponent } from './product-list-man.component';

describe('ProductListManComponent', () => {
  let component: ProductListManComponent;
  let fixture: ComponentFixture<ProductListManComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListManComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductListManComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
