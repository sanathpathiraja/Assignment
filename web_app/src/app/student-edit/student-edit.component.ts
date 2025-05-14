import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RestAPIService } from '../rest-api.service';
import { ConfigService } from '../config.service';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { FilePondOptions } from 'filepond';
import { FilePondComponent } from 'ngx-filepond';

@Component({
  selector: 'app-student-edit',
  standalone: false,
  templateUrl: './student-edit.component.html',
  styleUrl: './student-edit.component.css'
})
export class StudentEditComponent {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  editForm!: FormGroup;

  submitted = false;

  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.SriLanka];

  profileImage: any;

  @ViewChild('myPond')
  myPond!: FilePondComponent;

  pondOptions: FilePondOptions = {
    allowMultiple: false,
    labelIdle: 'Drop profile image here...'
  }

  pondFiles: FilePondOptions["files"] = [
    
  ]

  pondHandleAddFile(event: any) {
    console.log('A file was added', event);
    //this.profileImage = {

    //  Photo: event.file.file,
    //  FileName: event.file.filename,
    //  ContentType: event.file.fileType
    //};
    this.profileImage = event.file.file;

  }

  pondHandleRemoveFile(event: any) {
    console.log('Remove', event);
    this.profileImage = null;
  }

  SelectedRowData: any;




  constructor(public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    public restApi: RestAPIService,
    private config: ConfigService,
  ) {

  }

  ngOnInit(): void {

    this.editForm = this.formBuilder.group({
      FirstName: [this.SelectedRowData['FirstName'], [Validators.required]],
      LastName: [this.SelectedRowData['LastName'], [Validators.required]],
      Mobile: [this.SelectedRowData['Mobile']],
      Email: [this.SelectedRowData['Email']],
      NIC: [this.SelectedRowData['NIC'], [Validators.required]],
      DateOfBirth: [this.SelectedRowData['DateOfBirth'], [Validators.required]],
      Address: [this.SelectedRowData['Address']]
    });

    if (this.SelectedRowData['PhotoBase64']) {
      this.pondFiles = [
        {
          source: this.SelectedRowData['PhotoBase64'],
          options: {
            type: 'local'
          }
        }
      ]
    }
    
  }

  get f() {
    return this.editForm.controls;
  }

  FromOnChange(event) {
    console.log(event, 'event')


    // this.minDate = this.config.dateFormatISOFn(Date)

  }



  save() {
    this.submitted = true;

    if (this.editForm.valid) {

      let FirstName = this.editForm.value.FirstName;
      let LastName = this.editForm.value.LastName;
      let Mobile = this.editForm.value.Mobile?.e164Number ? this.editForm.value.Mobile?.e164Number : null;
      let Email = this.editForm.value.Email;

      let NIC = this.editForm.value.NIC;
      let DateOfBirth: any = this.config.dateFormatFn(this.editForm.value.DateOfBirth);
      let Address = this.editForm.value.Address;
      let Photos = this.profileImage;

      this.restApi.StudentEdit(this.SelectedRowData['RecId'],FirstName, LastName, Mobile, Email, NIC, DateOfBirth, Address, Photos).subscribe((data = {}) => {
        if (data) {

          this.config.showSuccess("Successfully updated");
          this.passEntry.emit(data);
          this.activeModal.dismiss();
        }
        else {
          this.config.showError("Update failed");
        }
      }, error => {
        console.log(error);
        this.config.showError("Update failed");
      });
    }
  }
  close() {
    this.activeModal.close();

  }

}
