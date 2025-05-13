import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularGridInstance, Column, GridOption } from 'angular-slickgrid';
import { StudentAddComponent } from './student-add/student-add.component';
import { RestAPIService } from './rest-api.service';
import { ConfigService } from './config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'web_app';



  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];

  constructor(
    private modalService: NgbModal,
    public restApi: RestAPIService,
    private config: ConfigService,
  ) {
    this.prepareGrid();
  }

  prepareGrid() {
    this.columnDefinitions = [
      { id: 'FirstName', name: 'First Name', field: 'FirstName', sortable: true, filterable: true },
      { id: 'LastName', name: 'Last Name', field: 'LastName', sortable: true, filterable: true },
      { id: 'Mobile', name: 'Mobile', field: 'Mobile', sortable: true, filterable: true },
      { id: 'Email', name: 'Email', field: 'Email', filterable: true },
      { id: 'NIC', name: 'NIC', field: 'NIC', sortable: true, filterable: true },
    ];

    this.gridOptions = {
      enableAutoResize: true,
      enableSorting: true,
      gridWidth: '100%',
      gridHeight: (window.innerHeight * 90) / 100,
      enableFiltering: true,
      //headerRowHeight: 20,
      enableGridMenu: false,
      enableCellNavigation: true,
      enableCheckboxSelector: false,
      enableRowSelection: true,
      multiSelect: false,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: true,
      },
    };

    // fill the dataset with your data (or read it from the DB)
    this.dataset = [
      { id: 0, title: 'Task 1', duration: 45, percentComplete: 5, start: '2001-01-01', finish: '2001-01-31' },
      { id: 1, title: 'Task 2', duration: 33, percentComplete: 34, start: '2001-01-11', finish: '2001-02-04' },
    ];
  }

  view() {
    let vm = this;
    this.restApi.StudentView().subscribe((data: any[]) => {
      data.map((item: any, i) => { item.id = i; });

      setTimeout(() => {
        vm.dataset = data;
      }, 0)


    }, error => {
      console.log(error);

    });

  }

  openModalAdd() {
    const modalRef = this.modalService.open(StudentAddComponent, this.config.modalConfigLG);
    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      console.log(receivedEntry);
      this.view();
    });

  }
}

