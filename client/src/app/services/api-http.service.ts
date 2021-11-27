import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Constants } from '../config/constants';

@Injectable()
export class ApiHttpService {
  constructor(private http: HttpClient) {}

  public getCategories() {
    return this.http.get<object[]>(Constants.API_URL + '/categories');
  }

  public fileUpload(file: File, fileInfo: Object) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileInfo', JSON.stringify(fileInfo));
    return this.http.post(Constants.API_URL + '/videos', formData);
  }
}
