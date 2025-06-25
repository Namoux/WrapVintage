import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuBurgerComponent } from './menu-burger.component';

describe('MenuBurgerComponent', () => {
  let component: MenuBurgerComponent;
  let fixture: ComponentFixture<MenuBurgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuBurgerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuBurgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
