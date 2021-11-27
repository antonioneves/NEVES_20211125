import { Component } from '@angular/core';
import{ Constants } from '../config/constants';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent {
  title = Constants.SiteTitle;
}
