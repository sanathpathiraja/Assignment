import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private toastr: ToastrService, private datePipe: DatePipe,) { }

  APIEndPoint = 'http://localhost:64282/';

  // Error handling 
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    //window.alert(errorMessage);
    return throwError(errorMessage);
  }

  ToastConfig = {
    closeButton: false,
    disableTimeOut: false,
    tapToDismiss: false,
    timeOut: 4000,
    positionClass: 'toast-top-right',
    preventDuplicates: true

  }

  showSuccess(msg) {
    this.toastr.success(msg, '', this.ToastConfig);
  }
  showError(msg) {
    this.toastr.error(msg, '', this.ToastConfig);
  }
  showWarning(msg) {
    this.toastr.warning(msg, '', this.ToastConfig);
  }
  showInfo(msg) {
    this.toastr.info(msg, '', this.ToastConfig);
  }

  public modalConfigLG: NgbModalOptions = {
    keyboard: true,
    backdrop: 'static',
    windowClass: 'modal-primary',
    size: 'lg'
  };


  paramDateFormat = 'yyyy-MM-dd';
  defaultDateFormatFn(paramDate) {

    return paramDate == '1900-01-01T00:00:00' ? '' : paramDate;
  }

  dateFormatFn(paramDate) {
    return this.datePipe.transform(this.defaultDateFormatFn(paramDate), this.paramDateFormat);
  }

  gridOptions = {
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

  editFormatter(row, cell, value, columnDef, dataContext) {
    return `<i class="fa-solid fa-pen-to-square blue cursor"></i>`;
  }

  deleteFormatter(row, cell, value, columnDef, dataContext) {
    return `<i class="fa-solid fa-trash-can red cursor"></i>`;
  }

}
