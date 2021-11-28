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
