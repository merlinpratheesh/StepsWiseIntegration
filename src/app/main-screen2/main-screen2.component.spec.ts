import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainScreen2Component } from './main-screen2.component';

describe('MainScreen2Component', () => {
  let component: MainScreen2Component;
  let fixture: ComponentFixture<MainScreen2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainScreen2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainScreen2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
