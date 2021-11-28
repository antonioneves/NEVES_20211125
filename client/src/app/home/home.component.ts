import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { ApiHttpService } from '../services/api-http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
})
export class HomeComponent {
  videos: any = [];

  constructor(
    private apiServices: ApiHttpService,
    private sanitizer: DomSanitizer
  ) {
    this.apiServices.getVideos().subscribe((videos) => {
      this.videos = videos;
      for (const video of this.videos)
        video.image = this.getImageFromBuffer(video.thumbnail256.data);
    });
  }

  getImageFromBuffer(buffer: Iterable<number>) {
    let TYPED_ARRAY = new Uint8Array(buffer);
    const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
      return data + String.fromCharCode(byte);
    }, '');
    let base64String = btoa(STRING_CHAR);
    return this.sanitizer.bypassSecurityTrustUrl(
      'data:image/png;base64,' + base64String
    );
  }

  addNewVideo(video: any) {
    video.image = this.getImageFromBuffer(video.thumbnail256.data);
    this.videos.push(video);
  }
}
