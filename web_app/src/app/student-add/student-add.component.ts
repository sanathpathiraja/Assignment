import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RestAPIService } from '../rest-api.service';
import { ConfigService } from '../config.service';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-student-add',
  standalone: false,
  templateUrl: './student-add.component.html',
  styleUrl: './student-add.component.css'
})
export class StudentAddComponent {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  addForm!: FormGroup;

  submitted = false;

  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.SriLanka];


  constructor(public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    public restApi: RestAPIService,
    private config: ConfigService,
  ) {
    
  }

  ngOnInit(): void {

    this.addForm = this.formBuilder.group({
      FirstName: ['', [Validators.required]],
      LastName: ['', [Validators.required]],
      Mobile: [''],
      Email: ['', [Validators.required]],
      NIC: [],
      DateOfBirth: [],
      Address: []
    });
  }

  get f() {
    return this.addForm.controls;
  }

  FromOnChange(event) {
    console.log(event, 'event')
   

    // this.minDate = this.config.dateFormatISOFn(Date)


  }

  save() {
    this.submitted = true;
    if (this.addForm.valid) {
      var data = {
        FirstName: this.addForm.value.FirstName,
        LastName: this.addForm.value.LastName,
        Mobile: this.addForm.value.Mobile,
        Email: this.addForm.value.Email,
        // Image: this.imgBase64,
        NIC: this.addForm.value.NIC,
        DateOfBirth: this.addForm.value.DateOfBirth,
        Address: this.addForm.value.Address
      }
      this.restApi.StudentAdd(data).subscribe((data = {}) => {
        if (data) {

          this.config.showSuccess("Successfully inserted");
          this.passEntry.emit(data);
          this.activeModal.dismiss();
        }
        else {
          this.config.showError("Insert failed");
          //if (this.dbStatus.ErrorHandled == 0) {
          //  console.log(this.dbStatus.errorText);
          //}
        }
      }, error => {
        console.log(error);
        this.config.showError("Insert failed");
      });
    }
  }
  close() {
    this.activeModal.close();

  }

}
