import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularGridInstance, AngularSlickgridComponent, Column, GridOption } from 'angular-slickgrid';
import { StudentAddComponent } from './student-add/student-add.component';
import { RestAPIService } from './rest-api.service';
import { ConfigService } from './config.service';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { StudentEditComponent } from './student-edit/student-edit.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'web_app';

  @ViewChild('grid1') slickGrid!: AngularSlickgridComponent;

  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];

  angularGrid!: AngularGridInstance;
  gridObj!: any;

  SelectedRowData: any;

  constructor(
    private modalService: NgbModal,
    public restApi: RestAPIService,
    private config: ConfigService,
  ) {
    this.columnDefinitions = [
      { id: 'FirstName', name: 'First Name', field: 'FirstName', sortable: true, filterable: true },
      { id: 'LastName', name: 'Last Name', field: 'LastName', sortable: true, filterable: true },
      { id: 'Mobile', name: 'Mobile', field: 'Mobile', sortable: true, filterable: true },
      { id: 'Email', name: 'Email', field: 'Email', filterable: true },
      { id: 'NIC', name: 'NIC', field: 'NIC', sortable: true, filterable: true },

      {
        id: 'editAction',
        name: '',
        field: 'editAction',
        maxWidth: 28,
        formatter: this.config.editFormatter,
        excludeFromExport: true,
        onCellClick: (_e, args) => {
          this.openModalEdit(args);
        },
      },
      {
        id: 'deleteAction',
        name: '',
        field: 'deleteAction',
        maxWidth: 30,
        formatter: this.config.deleteFormatter,
        excludeFromExport: true,
        onCellClick: (_e, args) => {
          this.delete(args);
        },
      }
    ];


    this.dataset = [
      { id: 1},
    ];

    this.gridOptions = {
      enableAutoResize: true,
      enableSorting: true,
      gridWidth: '100%',
      gridHeight: (window.innerHeight * 80) / 100,
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
      rowHighlightCssClass:'blue',

      autoResize: {
        container: '#grid1',

      },
      enablePagination: true,
      pagination: {
        pageSizes: [10, 25, 50, 100],
        pageSize: 10
      },
      enableColumnPicker: true,
      autoFitColumnsOnFirstLoad: true
    };
  }

  ngOnInit(): void {
    
    this.view();
  }

  ngAfterViewInit() {
    let vm = this;
    setTimeout(() => {
      this.slickGrid?.refreshGridData(vm.dataset);
    }, 100);
  }


  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid?.slickGrid || {};
  }

  onSelectedRowsChanged(e, args) {
    if (Array.isArray(args.rows)) {

      this.SelectedRowData = args.rows.map(idx => {
        this.currentPage = idx +1;
        const item = this.gridObj.getDataItem(idx);
        return item || {};
      })[0];

      //console.log(this.SelectedRowData);
    }
  }

  view() {
    let vm = this;
    this.restApi.StudentView().subscribe((data: any[]) => {
      data.map((item: any, i) => { item.id = i; });

      setTimeout(() => {
        vm.dataset = data;
        vm.SelectedRowData = {};
        ////vm.angularGrid?.slickGrid.invalidate();  // Invalidate grid
        ////vm.angularGrid?.slickGrid.render();
        //vm.angularGrid?.dataView.refresh();
        //vm.angularGrid.resizerService.resizeGrid(2);
      }, 100)


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

  openModalEdit = (e) => {

    console.log(e.dataContext);
    const modalRef = this.modalService.open(StudentEditComponent, this.config.modalConfigLG);
    modalRef.componentInstance.SelectedRowData = e.dataContext;
    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      this.view();
    })
  }

  delete = (e) => {
    let vm = this;
    const modalRef = this.modalService.open(ConfirmModalComponent);

    modalRef.result.then(
      (result) => {
        if (result) {
          console.log('Confirmed!');
          vm.restApi.StudentDelete(e.dataContext.RecId).subscribe((data: {}) => {
            if (data) {
              console.log(data);
              vm.config.showSuccess("Successfully deleted");
              vm.view();
            }
            else {

              vm.config.showError('Transactions exists');

            }


          }, error => {
            vm.config.showError("Delete Fail");
          });
        } else {
          console.log('Cancelled!');
        }
      },
      () => console.log('Dismissed!')
    );
  }

  currentPage = 1;

  nextPage() {
    if (this.currentPage < this.dataset.length) {
      this.currentPage++;
      this.gridRowSelection(this.currentPage);
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.gridRowSelection(this.currentPage);
    }
  }

  gridRowSelection(id) {
/*    console.log(id);*/
    id = id - 1;
    this.angularGrid.gridService.setSelectedRow(id);
    this.angularGrid.gridService.highlightRow(id);
    this.SelectedRowData = this.gridObj.getDataItem(this.angularGrid.gridService.getSelectedRows())
  }
}

