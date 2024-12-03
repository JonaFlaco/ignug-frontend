import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PaginatorModel} from "@models/core";
import {ServerResponse} from '@models/http-response';
import { MessageService} from '@services/core';
import { CreateEnrollmentDto, EnrollmentModel, UpdateEnrollmentDto } from '@models/uic/enrollment.model';
import { CatalogueTypeEnum } from '@shared/enums';
import { HelpService } from './help.service';
import { StudentTypeEnum } from '@shared/enums/student.enum';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentsHttpService {
  enrollment(STUDENT: StudentTypeEnum) {
    throw new Error('Method not implemented.');
  }
  API_URL = `${environment.API_URL}/enrollments`;
  private pagination = new BehaviorSubject<PaginatorModel>(this.helpService.paginator);
  public pagination$ = this.pagination.asObservable();

  constructor(
    private helpService: HelpService,
    private httpClient: HttpClient,
    private messageService: MessageService,
  ) {
  }

  create(payload: CreateEnrollmentDto): Observable<EnrollmentModel> {
    const url = `${this.API_URL}`;

    this.helpService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map((response) => {
        this.helpService.hideLoad();
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }

  catalogue(type: CatalogueTypeEnum): Observable<EnrollmentModel[]> {
    const url = `${this.API_URL}/catalogue`;
    const params = new HttpParams().append('type', type);
    this.helpService.showLoad();
    return this.httpClient.get<ServerResponse>(url, {params}).pipe(
      map(response => {
        this.helpService.hideLoad();
        return response.data
      })
    );
  }

  findAll(page: number = 0, search: string = ''): Observable<EnrollmentModel[]> {
    const url = this.API_URL;

    const headers = new HttpHeaders().append('pagination', 'true');
    const params = new HttpParams()
      .append('page', page)
      .append('search', search)
      .append('limit','20');

    this.helpService.showLoad();
    return this.httpClient.get<ServerResponse>(url, {headers, params}).pipe(
      map((response) => {
        this.helpService.hideLoad();
        if (response.pagination) {
          this.pagination.next(response.pagination);
        }
        return response.data;
      })
    );
  }

  findOne(id: string): Observable<EnrollmentModel> {
    const url = `${this.API_URL}/${id}`;

    this.helpService.showLoad();
    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        this.helpService.hideLoad();
        return response.data;
      })
    );
  }

  update(id: string, payload: UpdateEnrollmentDto): Observable<EnrollmentModel> {
    const url = `${this.API_URL}/${id}`;

    this.helpService.showLoad();
    return this.httpClient.put<ServerResponse>(url, payload).pipe(
      map(response => {
        this.helpService.hideLoad();
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }


  remove(id: string): Observable<EnrollmentModel> {
    const url = `${this.API_URL}/${id}`;

    this.helpService.showLoad();
    return this.httpClient.delete<ServerResponse>(url).pipe(
      map((response) => {
        this.helpService.hideLoad();
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }

  removeAll(enrollments: EnrollmentModel[]): Observable<EnrollmentModel[]> {
    const url = `${this.API_URL}/remove-all`;

    this.helpService.showLoad();
    return this.httpClient.patch<ServerResponse>(url, enrollments).pipe(
      map((response) => {
        this.helpService.hideLoad();
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }

}
