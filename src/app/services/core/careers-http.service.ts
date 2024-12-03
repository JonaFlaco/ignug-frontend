import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {BehaviorSubject, delay, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ServerResponse} from '@models/http-response';
import {CoreService, MessageService} from '@services/core';
import {CareerModel, CatalogueModel, CreateCareerDto, PaginatorModel, ReadCareerDto, UpdateCareerDto} from '@models/core';
import {CatalogueTypeEnum} from "@shared/enums";
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CareersHttpService {
  API_URL = `${environment.API_URL}/careers`;
  private pagination = new BehaviorSubject<PaginatorModel>(this.coreService.paginator);
  public pagination$ = this.pagination.asObservable();
  selectedCareer:ReadCareerDto = {};

  constructor(private httpClient: HttpClient,
              private coreService: CoreService,
              private messageService: MessageService,
              private authService: AuthService) {
  }

  create(payload: CreateCareerDto): Observable<CareerModel> {
    const url = `${this.API_URL}`;
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map(response => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  career(type: CatalogueTypeEnum): Observable<CareerModel[]> {
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

  get careers  (): ReadCareerDto{
    return this.selectedCareer;
  }

  set careers  (value: ReadCareerDto) {
     this.selectedCareer = value ;
  }

  findAll(page: number = 1, search: string = ''): Observable<CareerModel[]> {
    const url = this.API_URL;
    console.log(this.authService.auth);
    const headers = new HttpHeaders().append('pagination', 'true');
    const params = new HttpParams().append('page', page).append('search', search).append('limit','20')
    // .append('teacherId', this.authService.auth.teacher.id);
    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url, {headers, params}).pipe(
      map(response => {
        this.coreService.hideLoad();
        if (response.pagination) {
          this.pagination.next(response.pagination);
        }
        return response.data;
      })
    );
  }

  findOne(id: string): Observable<CareerModel> {
    const url = `${this.API_URL}/${id}`;
    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => response.data)
    );
  }

  update(id: string, payload: UpdateCareerDto): Observable<CareerModel> {
    const url = `${this.API_URL}/${id}`;
    return this.httpClient.put<ServerResponse>(url, payload).pipe(
      map(response => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  remove(id: string): Observable<boolean> {
    const url = `${this.API_URL}/${id}`;
    return this.httpClient.delete<ServerResponse>(url).pipe(
      map(response => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  removeAll(id: CareerModel[]): Observable<boolean> {
    const url = `${this.API_URL}/${id}`;
    return this.httpClient.delete<ServerResponse>(url).pipe(
      map(response => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }
}
