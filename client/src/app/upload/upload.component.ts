import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IconDefinition, faUpload } from '@fortawesome/free-solid-svg-icons';

import { ApiHttpService } from '../services/api-http.service';

@Component({
  selector: 'upload-modal',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.sass'],
})
export class UploadComponent {
  closeResult: string = '';
  faUpload: IconDefinition = faUpload;
  videoTitle: string = '';
  categories: any = [];
  fileToUpload: File | null = null;

  constructor(
    private modalService: NgbModal,
    private apiServices: ApiHttpService
  ) {
    this.apiServices.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then();
  }

  handleFileInput(event: Event) {
    this.fileToUpload = (<any>event.target).files.item(0);
  }

  onSubmit(value: Object): void {
    if (this.fileToUpload) this.apiServices.fileUpload(this.fileToUpload, value).subscribe((res) => {
      console.log(res);
    });;
  }
}
