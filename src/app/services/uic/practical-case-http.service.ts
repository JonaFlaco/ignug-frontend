import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PaginatorModel} from "@models/core";
import {ServerResponse} from '@models/http-response';
import {CoreService, MessageService} from '@services/core';
import { CreatePracticalCaseDto, PracticalCaseModel, ReadPracticalCaseDto, UpdatePracticalCaseDto } from '@models/uic';
import { CatalogueTypeEnum } from '@shared/enums';

@Injectable({
  providedIn: 'root',
})
export class PracticalCasesHttpService {
  API_URL = `${environment.API_URL}/practicalCases`;
  selectedPracticalCase: ReadPracticalCaseDto = {}
  private pagination = new BehaviorSubject<PaginatorModel>(
    this.coreService.paginator
  );
  public pagination$ = this.pagination.asObservable();
  constructor(
    private coreService: CoreService,
    private httpClient: HttpClient,
    private messageService: MessageService
  ) {}

  create(payload: CreatePracticalCaseDto): Observable<PracticalCaseModel> {
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

  get practicalCases  (): ReadPracticalCaseDto{
    return this.selectedPracticalCase;
  }

  set practicalCases  (value: ReadPracticalCaseDto) {
     this.selectedPracticalCase = value ;
  }

  findAll(
    page: number = 0,
    search: string = ''
  ): Observable<PracticalCaseModel[]> {
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

  findOne(id: string): Observable<PracticalCaseModel> {
    const url = `${this.API_URL}/${id}`;

    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url).pipe(
      map((response) => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }

  findByIdTimeline( page: number = 0, search: string = '',id: string): Observable<PracticalCaseModel[]> {
    const url = `${this.API_URL}/timeline/${id}`;
  
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

  set events  (value: ReadPracticalCaseDto) {
    this.selectedPracticalCase = value ;
 }
 findByPracticalCaseTimeline( page: number = 0, search: string = '',practicalCaseId: string): Observable<PracticalCaseModel[]> {
   const url = `${this.API_URL}/timeline/${practicalCaseId}`;

   const headers = new HttpHeaders().append('pagination', 'true');
   const params = new HttpParams()
     .append('page', page)
     .append('search', search)
     .append('practicalCaseId', practicalCaseId);

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

  practicalCase(type: CatalogueTypeEnum): Observable<PracticalCaseModel[]> {
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

  update(
    id: string,
    payload: UpdatePracticalCaseDto
  ): Observable<PracticalCaseModel> {
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

  remove(id: string): Observable<PracticalCaseModel> {
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

  removeAll(practicalCase: PracticalCaseModel[]): Observable<PracticalCaseModel[]> {
    const url = `${this.API_URL}/remove-all`;

    this.coreService.showLoad();
    return this.httpClient.patch<ServerResponse>(url, practicalCase).pipe(
      map((response) => {
        this.coreService.hideLoad();
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }
}
