import { Component, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IconDefinition, faUpload } from '@fortawesome/free-solid-svg-icons';

import { ApiHttpService } from '../services/api-http.service';

@Component({
  selector: 'upload-modal',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.sass'],
})
export class UploadComponent {
  faUpload: IconDefinition = faUpload;
  categories: any = [];
  fileToUpload: File | null = null;
  maxSize: number = 200 * 1024 * 1024;

  @Output() newVideoEvent = new EventEmitter<object>();

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
      .result.then(console.log, console.log);
  }

  handleFileInput(event: Event) {
    this.fileToUpload = (<any>event.target).files.item(0);
    if (this.fileToUpload && this.fileToUpload.size > this.maxSize) {
      alert('File size is too big');
      (<any>event.target).value = null;
      this.fileToUpload = null;
    }
  }

  onSubmit(value: Object): void {
    if (this.fileToUpload)
      this.apiServices
        .fileUpload(this.fileToUpload, value)
        .subscribe((res: any) =>
          {
            res['category.name'] = this.categories.find(
              (category: any) => category.id === res.categoryId
            ).name;
            this.newVideoEvent.emit(res);
            this.fileToUpload = null;
          });
  }
}
