import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CreateSignatureCatDto, PaginatorModel, ReadSignatureCatDto, SignatureCatModel, UpdateSignatureCatDto} from "@models/core";
import {ServerResponse} from '@models/http-response';
import {CoreService, MessageService} from '@services/core';
import { CatalogueTypeEnum } from '@shared/enums';

@Injectable({
  providedIn: 'root',
})
export class SignaturesCatHttpService {
  API_URL = `${environment.API_URL}/signaturesCat`;
  selectedSignature: ReadSignatureCatDto = {}
  private pagination = new BehaviorSubject<PaginatorModel>(
    this.coreService.paginator
  );
  public pagination$ = this.pagination.asObservable();
  constructor(
    private coreService: CoreService,
    private httpClient: HttpClient,
    private messageService: MessageService
  ) {}

  create(payload: CreateSignatureCatDto): Observable<SignatureCatModel> {
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

  get signatures  (): ReadSignatureCatDto{
    return this.selectedSignature;
  }

  set signatures  (value: ReadSignatureCatDto) {
     this.selectedSignature = value ;
  }

  findAll(page: number = 0, search: string = ''): Observable<SignatureCatModel[]> {
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

  findOne(id: string): Observable<SignatureCatModel> {
    const url = `${this.API_URL}/${id}`;

    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url).pipe(
      map((response) => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }

  

  set events  (value: ReadSignatureCatDto) {
    this.selectedSignature = value ;
 }
 findBySignatureTimeline( page: number = 0, search: string = '',signatureId: string): Observable<SignatureCatModel[]> {
   const url = `${this.API_URL}/timeline/${signatureId}`;

   const headers = new HttpHeaders().append('pagination', 'true');
   const params = new HttpParams()
     .append('page', page)
     .append('search', search)
     .append('signatureId', signatureId);

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

  signature(type: CatalogueTypeEnum): Observable<SignatureCatModel[]> {
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
    payload: UpdateSignatureCatDto
  ): Observable<SignatureCatModel> {
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

  remove(id: string): Observable<SignatureCatModel> {
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

  removeAll(signature: SignatureCatModel[]): Observable<SignatureCatModel[]> {
    const url = `${this.API_URL}/remove-all`;

    this.coreService.showLoad();
    return this.httpClient.patch<ServerResponse>(url, signature).pipe(
      map((response) => {
        this.coreService.hideLoad();
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }
}
