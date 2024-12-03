import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PaginatorModel} from "@models/core";
import {ServerResponse} from '@models/http-response';
import {CoreService, MessageService} from '@services/core';
import { CatalogueModel, CreateCatalogueDto, ReadCatalogueDto, UpdateCatalogueDto } from '@models/uic';
import { CatalogueTypeEnum } from '@shared/enums';

@Injectable({
  providedIn: 'root'
})
export class CataloguesHttpService {
  API_URL = `${environment.API_URL}/catalogues-uic`;
  private pagination = new BehaviorSubject<PaginatorModel>(this.coreService.paginator);
  public pagination$ = this.pagination.asObservable();
  selectedCatalogue:ReadCatalogueDto = {};
  constructor(
    private coreService: CoreService,
    private httpClient: HttpClient,
    private messageService: MessageService,
  ) {
  }

  create(payload: CreateCatalogueDto): Observable<CatalogueModel> {
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

  catalogue(type: CatalogueTypeEnum): Observable<CatalogueModel[]> {
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
  get catalogues  (): ReadCatalogueDto{
    return this.selectedCatalogue;
  }

  set catalogues  (value: ReadCatalogueDto) {
     this.selectedCatalogue = value ;
  }
  findAll(page: number = 0, search: string = ''): Observable<CatalogueModel[]> {
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

  findEverything(): Observable<CatalogueModel[]> {
    const url = this.API_URL;

    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url).pipe(
      map((response) => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }

  findOne(id: string): Observable<CatalogueModel> {
    const url = `${this.API_URL}/${id}`;

    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }

  update(id: string, payload: UpdateCatalogueDto): Observable<CatalogueModel> {
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


  remove(id: string): Observable<CatalogueModel> {
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

  removeAll(catalogues: CatalogueModel[]): Observable<CatalogueModel[]> {
    const url = `${this.API_URL}/remove-all`;

    this.coreService.showLoad();
    return this.httpClient.patch<ServerResponse>(url, catalogues).pipe(
      map((response) => {
        this.coreService.hideLoad();
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }

}
