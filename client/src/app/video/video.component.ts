import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiHttpService } from '../services/api-http.service';

@Component({
  selector: 'video-modal',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.sass'],
})
export class VideoComponent {
  video: any = {};
  url: string = '';

  constructor(
    private modalService: NgbModal,
    private apiServices: ApiHttpService
  ) {}

  @Input() set videoData(video: any) {
    this.video = video;
    this.url = this.apiServices.getVideoPlay(video.id);
  }

  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(console.log, console.log);
  }
}
