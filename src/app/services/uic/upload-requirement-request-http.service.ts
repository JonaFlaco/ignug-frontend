import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PaginatorModel} from "@models/core";
import {ServerResponse} from '@models/http-response';
import {CoreService, MessageService} from '@services/core';
import {CreateUploadRequirementRequestDto, UpdateUploadRequirementRequestDto, UploadRequirementRequestModel } from '@models/uic';
import {CatalogueTypeEnum } from '@shared/enums';

@Injectable({
  providedIn: 'root'
})
export class UploadRequirementRequetsHttpService {
  API_URL = `${environment.API_URL}/upload-requirements`;
  private pagination = new BehaviorSubject<PaginatorModel>(this.coreService.paginator);
  public pagination$ = this.pagination.asObservable();

  constructor(
    private coreService: CoreService,
    private httpClient: HttpClient,
    private messageService: MessageService,
  ) {
  }

  create4(payload: FormData): Observable<UploadRequirementRequestModel> {
    const url = 'http://localhost:3000/api/v1/formats/upload';

    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map((response) => {
        this.coreService.hideLoad();
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }

  create(payload: CreateUploadRequirementRequestDto): Observable<UploadRequirementRequestModel> {
    const url = `${this.API_URL}`;

    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map((response) => {
        this.coreService.hideLoad();
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }

  uploadRequirementRequest(type: CatalogueTypeEnum): Observable<UploadRequirementRequestModel[]> {
    const url = `${this.API_URL}/catalogue`;
    const params = new HttpParams().append('type', type);
    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url, {params}).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data
      })
    );
  }

  findAll(page: number = 0, search: string = ''): Observable<UploadRequirementRequestModel[]> {
    const url = this.API_URL;

    const headers = new HttpHeaders().append('pagination', 'true');
    const params = new HttpParams()
      .append('page', page)
      .append('search', search);

    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url, {headers, params}).pipe(
      map((response) => {
        this.coreService.hideLoad();
        if (response.pagination) {
          this.pagination.next(response.pagination);
        }
        return response.data;
      })
    );
  }

  findOne(id: string): Observable<UploadRequirementRequestModel> {
    const url = `${this.API_URL}/${id}`;

    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }

  update(id: string, payload: UpdateUploadRequirementRequestDto): Observable<UploadRequirementRequestModel> {
    const url = `${this.API_URL}/${id}`;

    this.coreService.showLoad();
    return this.httpClient.put<ServerResponse>(url, payload).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }


  remove(id: string): Observable<UploadRequirementRequestModel> {
    const url = `${this.API_URL}/${id}`;

    this.coreService.showLoad();
    return this.httpClient.delete<ServerResponse>(url).pipe(
      map((response) => {
        this.coreService.hideLoad();
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }

  removeAll(uploadRequirementRequests: UploadRequirementRequestModel[]): Observable<UploadRequirementRequestModel[]> {
    const url = `${this.API_URL}/remove-all`;

    this.coreService.showLoad();
    return this.httpClient.patch<ServerResponse>(url, uploadRequirementRequests).pipe(
      map((response) => {
        this.coreService.hideLoad();
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }

  // upload(uploadRequirementRequests: UploadRequirementRequestModel[]): Observable<UploadRequirementRequestModel> {
  //   const url = `${this.API_URL}/upload`;
  //   this.coreService.showLoad();
  //   return this.httpClient.post<ServerResponse>(url, uploadRequirementRequests).pipe(
  //     map((response) => {
  //       this.coreService.hideLoad();
  //       this.messageService.success(response).then();
  //       return response.data;
  //     })
  //   );
  // }

  upload(payload: FormData): Observable<any> {
    const url = `${this.API_URL}/upload`;

    console.log(payload);
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map((response) => {
        this.coreService.hideLoad();
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }

}
