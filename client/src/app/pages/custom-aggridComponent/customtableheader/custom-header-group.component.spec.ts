import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { CustomHeaderGroup } from './custom-header-group.component';

describe('CustomtableheaderComponent', () => {
  let component: CustomHeaderGroup;
  let fixture: ComponentFixture<CustomHeaderGroup>;
  let dialogMock: any;

  beforeEach(async () => {
    dialogMock = {
      open : jest.fn()
    }

    await TestBed.configureTestingModule({
      declarations: [ CustomHeaderGroup ],
      providers: [
        {
          provide: MatDialog , useValue: dialogMock
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomHeaderGroup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call agInit', () => {
    const params: any = {
      columnApi : {
        getAllGridColumns: jest.fn()
      }
    }
    component.agInit(params)
  });

  it('should openDialog', () => {
    jest.spyOn(dialogMock,'open').mockReturnValue(true);
    component.openDialog();
  })
});
