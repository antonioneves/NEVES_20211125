import { Component, Output, EventEmitter } from '@angular/core';
import{ Constants } from '../config/constants';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent {
  title = Constants.SiteTitle;

  @Output() newVideoEvent = new EventEmitter<object>();

  forwardNewVideo(video: object) {
    this.newVideoEvent.emit(video);
  }
}
