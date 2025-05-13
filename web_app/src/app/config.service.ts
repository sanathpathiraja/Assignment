import { Injectable } from '@angular/core';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private toastr: ToastrService) { }


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

}
