import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingCellRendererComponent } from './loading-cell-renderer.component';

describe('LoadingCellRendererComponent', () => {
  let component: LoadingCellRendererComponent;
  let fixture: ComponentFixture<LoadingCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadingCellRendererComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call agInit', async() => {
    const params = {
      value: new Date()
    };
    component.agInit(params)
  });

  it('should call agInit setTimeout', async() => {
    const params = {
      value: new Date()
    };
    const pauseFor = (milliseconds: any) => new Promise(resolve => setTimeout(resolve, milliseconds));
    await pauseFor(2000);
    component.agInit(params)
  });

  it('should refresh',() => {
    component.refresh({});
  })
});
