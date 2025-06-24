import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListWomanComponent } from './product-list-woman.component';

describe('ProductListWomanComponent', () => {
  let component: ProductListWomanComponent;
  let fixture: ComponentFixture<ProductListWomanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListWomanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductListWomanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
