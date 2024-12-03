import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from "@angular/forms";
import { Router } from '@angular/router';
import { debounceTime } from "rxjs";
import { ColumnModel, PaginatorModel } from '@models/core';
import { SignaturesCatHttpService } from '@services/core';
import { BreadcrumbService, CoreService, MessageService } from '@services/core';
import { MenuItem } from "primeng/api";
import { SignatureCatModel, ReadSignatureCatDto, SelectSignatureCatDto } from '@models/core';
import { AuthService } from '@services/auth';

@Component({
  selector: 'app-signature-list',
  templateUrl: './signature-list.component.html',
})
export class SignatureListComponent implements OnInit {

  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.signaturesCatHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedSignatures: SignatureCatModel[] = [];
  selectedSignature: SelectSignatureCatDto = {};
  signatures: SignatureCatModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private signaturesCatHttpService: SignaturesCatHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Gestion de Asignaturas'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit(): void {
    this.findAll();
    
  }

  findAll(page: number = 0) {
    this.signaturesCatHttpService.findAll(page, this.search.value).subscribe((signatures) => this.signatures = signatures);
  }

  getColumns(): ColumnModel[] {
    return [

      {field: 'name', header: 'Nombre'},
      {field: 'description', header: 'Descripción'},
      {field:'code', header:'Codigo'},
      {field: 'state', header: 'Estado'},

    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedSignature.id)
            this.redirectEditForm(this.selectedSignature.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedSignature.id)
            this.remove(this.selectedSignature.id);
        },
      },
    ];
  }

  paginate(signature: any) {
    this.findAll(signature.page);
  }

  checkState(signature: SignatureCatModel): string {
    if (signature.state) return 'success';

    return 'danger';
  }

  redirectCreateForm() {
    this.router.navigate(['/core/signatures', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/core/signatures', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.signaturesCatHttpService.remove(id).subscribe((signature) => {
            this.signatures = this.signatures.filter(item => item.id !== signature.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.signaturesCatHttpService.removeAll(this.selectedSignatures).subscribe((signatures) => {
          this.selectedSignatures.forEach(signatureDeleted => {
            this.signatures = this.signatures.filter(signature => signature.id !== signatureDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedSignatures = [];
        });
      }
    });
  }

  selectSignature(signature: ReadSignatureCatDto) {
    this.signaturesCatHttpService.signatures = signature
    this.selectedSignature = signature;
  }

}
