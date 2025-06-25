import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListNewComponent } from './product-list-new.component';

describe('ProductListNewComponent', () => {
  let component: ProductListNewComponent;
  let fixture: ComponentFixture<ProductListNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductListNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
