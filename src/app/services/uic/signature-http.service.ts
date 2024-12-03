import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PaginatorModel} from "@models/core";
import {ServerResponse} from '@models/http-response';
import {CoreService, MessageService} from '@services/core';
import { CreateSignatureDto, ReadSignatureDto, SignatureModel, UpdateSignatureDto } from '@models/uic';
import { CatalogueTypeEnum } from '@shared/enums';

@Injectable({
  providedIn: 'root',
})
export class SignaturesHttpService {
  selectedSignature:ReadSignatureDto = {};
  API_URL = `${environment.API_URL}/signatures`;
  private pagination = new BehaviorSubject<PaginatorModel>(
    this.coreService.paginator
    
  );
  public pagination$ = this.pagination.asObservable();

  constructor(
    private coreService: CoreService,
    private httpClient: HttpClient,
    private messageService: MessageService
  ) {}

  create(payload: CreateSignatureDto): Observable<SignatureModel> {
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

  findAll(page: number = 0, search: string = ''): Observable<SignatureModel[]> {
    const url = this.API_URL;

    const headers = new HttpHeaders().append('pagination', 'true');
    const params = new HttpParams()
      .append('page', page)
      .append('search', search);

    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url, { headers, params }).pipe(
      map((response) => {
        this.coreService.hideLoad();
        if (response.pagination) {
          this.pagination.next(response.pagination);
        }
        return response.data;
      })
    );
  }

  findByPreparationCourse( page: number = 0, search: string = '',preparationCourseId: string): Observable<SignatureModel[]> {
    const url = `${this.API_URL}/preparationCourses/${preparationCourseId}`;

    const headers = new HttpHeaders().append('pagination', 'true');
    const params = new HttpParams()
      .append('page', page)
      .append('search', search)

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

  findOne(id: string): Observable<SignatureModel> {
    const url = `${this.API_URL}/${id}`;

    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url).pipe(
      map((response) => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }

  signature(type: CatalogueTypeEnum): Observable<SignatureModel[]> {
    const url = `${this.API_URL}/catalogue`;
    const params = new HttpParams().append('type', type);
    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url, { params }).pipe(
      map((response) => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }

  get sigantures  (): ReadSignatureDto{
    return this.selectedSignature;
  }

  set signatures  (value: ReadSignatureDto) {
    this.selectedSignature = value ;
 }

 findByPreparationCourseTimeline( page: number = 0, search: string = '',preparationCourseId: string): Observable<SignatureModel[]> {
  const url = `${this.API_URL}/timeline/${preparationCourseId}`;

  const headers = new HttpHeaders().append('pagination', 'true');
  const params = new HttpParams()
    .append('page', page)
    .append('search', search)
    // .append('preparationCourseId', preparationCourseId);

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




  update(id: string, payload: UpdateSignatureDto): Observable<SignatureModel> {
    const url = `${this.API_URL}/${id}`;

    this.coreService.showLoad();
    return this.httpClient.put<ServerResponse>(url, payload).pipe(
      map((response) => {
        this.coreService.hideLoad();
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }

  remove(id: string): Observable<SignatureModel> {
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

  removeAll(signatures: SignatureModel[]): Observable<SignatureModel[]> {
    const url = `${this.API_URL}/remove-all`;

    this.coreService.showLoad();
    return this.httpClient.patch<ServerResponse>(url, signatures).pipe(
      map((response) => {
        this.coreService.hideLoad();
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }
}
