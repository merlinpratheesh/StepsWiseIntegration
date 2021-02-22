import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggedinStartComponent } from './loggedin-start.component';

describe('LoggedinStartComponent', () => {
  let component: LoggedinStartComponent;
  let fixture: ComponentFixture<LoggedinStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoggedinStartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggedinStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
