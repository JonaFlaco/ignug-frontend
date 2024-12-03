import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'events',
    loadChildren: () =>
      import('./event/event.module').then((m) => m.EventModule),
  },
  {
    path: 'assignaments',
    loadChildren: () =>
      import('./assignament/assignament.module').then(
        (m) => m.AssignamentModule
      ),
  },
  {
    path: 'catalogues',
    loadChildren: () =>
      import('./catalogue/catalogue.module').then((m) => m.CatalogueModule),
  },
  {
    path: 'plannings',
    loadChildren: () =>
      import('./planning/planning.module').then((m) => m.PlanningModule),
  },
  {
    path: 'modalities',
    loadChildren: () =>
      import('./modality/modality.module').then((m) => m.ModalityModule),
  },
  {
    path: 'requirements',
    loadChildren: () =>
      import('./requirement/requirement.module').then(
        (m) => m.RequirementModule
      ),
  },
  {
    path: 'tutor-assignments',
    loadChildren: () =>
      import('./tutor-assignment/tutor-assignment.module').then(
        (m) => m.TutorAssignmentModule
      ),
  },
  {
    path: 'project-plans',
    loadChildren: () =>
      import('./project-plan/project-plan.module').then(
        (m) => m.ProjectPlanModule
      ),
  },
  {
    path: 'project-plans/:id',
    loadChildren: () =>
      import('./project-plan/project-plan.module').then(
        (m) => m.ProjectPlanModule
      ),
  },
  {
    path: 'project-plans/ver/:id',
    loadChildren: () =>
      import('./project-plan/project-plan.module').then(
        (m) => m.ProjectPlanModule
      ),
  },
  {
    path: 'projects',
    loadChildren: () =>
      import('./project/project.module').then((m) => m.ProjectModule),
  },
  {
    path: 'enrollments',
    loadChildren: () =>
      import('./enrollment/enrollment.module').then((m) => m.EnrollmentModule),
  },
  {
    path: 'student-informations',
    loadChildren: () =>
      import('./student-information/student-information.module').then(
        (m) => m.StudentInformationModule
      ),
  },
  {
    path: 'requirement-requests',
    loadChildren: () =>
      import('./requirement-request/requirement-request.module').then(
        (m) => m.RequirementRequestModule
      ),
  },
  {
    path: 'requirement-formats',
    loadChildren: () =>
      import('./requirement-format/requirement-format.module').then(
        (m) => m.RequirementFormatModule
      ),
  },
  {
    path: 'mesh-student-requirements',
    loadChildren: () =>
      import('./mesh-student-requirement/mesh-student-requirement.module').then(
        (m) => m.MeshStudentRequirementModule
      ),
  },
  {
    path: 'documents',
    loadChildren: () =>
      import('./document/document.module').then((m) => m.DocumentModule),
  },
  {
    path: 'professions',
    loadChildren: () =>
      import('./profession/profession.module').then((m) => m.ProfessionModule),
  },
  {
    path: 'catalogueTypes',
    loadChildren: () =>
      import('./catalogue-type/catalogue-type.module').then(
        (m) => m.CatalogueTypeModule
      ),
  },
  {
    path: 'inscriptions',
    loadChildren: () =>
      import('./inscription/inscription.module').then(
        (m) => m.InscriptionModule
      ),
  },

  {
    path: 'signatures',
    loadChildren: () =>
      import('./signature/signature.module').then((m) => m.SignatureModule),
  },
  {
    path: 'estudiantes',
    loadChildren: () =>
      import('./estudiante/estudiante.module').then((m) => m.EstudianteModule),
  },
  {
    path: 'responsible-tutors',
    loadChildren: () =>
      import('./responsible-tutor/responsible-tutor.module').then(
        (m) => m.ResponsibleTutorModule
      ),
  },

  {
    path: 'tribunals',
    loadChildren: () =>
      import('./tribunal/tribunal.module').then((m) => m.TribunalModule),
  },

  // {
  //   path: 'teachers',
  //   loadChildren: () => import('./teacher/teacher.module').then(m => m.TeacherModule)
  // },

  {
    path: 'students-degree',
    loadChildren: () =>
      import('./student-degree/student-degree.module').then(
        (m) => m.StudentDegreeModule
      ),
  },
  {
    path: 'format-proyect-plan',
    loadChildren: () =>
      import('./format-proyect-plan/format-proyect-plan.module').then(
        (m) => m.FormatProyectPlanModule
      ),
  },
  {
    path: 'approval-request',
    loadChildren: () =>
      import('./approval-request/approval-request.module').then(
        (m) => m.ApprovalRequestModule
      ),
  },
  {
    path: 'response-project-plans',
    loadChildren: () =>
      import('./response-project-plan/response-project-plan.module').then(
        (m) => m.ResponseProjectPlanModule
      ),
  },
  {
    path: 'response-request-project-plans',
    loadChildren: () =>
      import(
        './response-request-project-plan/response-request-project-plan.module'
      ).then((m) => m.ResponseRequestProjectPlanModule),
  },
  {
    path: 'coordinators',
    loadChildren: () =>
      import('./coordinator/coordinator.module').then(
        (m) => m.CoordinatorModule
      ),
  },

  {
    path: 'menu-students',
    loadChildren: () =>
      import('./menu-student/menu-student.module').then(
        (m) => m.MenuStudentModule
      ),
  },
  {
    path: 'upload-requirement-requests',
    loadChildren: () =>
      import(
        './upload-requirement-request/upload-requirement-request.module'
      ).then((m) => m.UploadRequirementRequestModule),
  },
  {
    path: 'formats',
    loadChildren: () =>
      import('./format/format.module').then((m) => m.FormatModule),
  },

  {
    path: 'download-formats',
    loadChildren: () =>
      import('./download-format/download-format.module').then(
        (m) => m.DownloadFormatModule
      ),
  },

  {
    path: 'upload-requirement-requests',
    loadChildren: () =>
      import(
        './upload-requirement-request/upload-requirement-request.module'
      ).then((m) => m.UploadRequirementRequestModule),
  },

  {
    path: 'review-requirements',
    loadChildren: () =>
      import('./review-requirement/review-requirement.module').then(
        (m) => m.ReviewRequirementModule
      ),
  },

  {
    path: 'case-views',
    loadChildren: () =>
      import('./case-view/case-view.module').then((m) => m.CaseViewModule),
  },

  {
    path: 'upload-scores',
    loadChildren: () =>
      import('./upload-score/upload-score.module').then(
        (m) => m.UploadScoreModule
      ),
  },
  {
    path: 'preparation-courses',
    loadChildren: () =>
      import('./preparation-course/preparation-course.module').then(
        (m) => m.PreparationCourseModule
      ),
  },
  {
    path: 'upload-projects',
    loadChildren: () =>
      import('./upload-project/upload-project.module').then(
        (m) => m.UploadProjectModule
      ),
  },
  {
    path: 'planification-students',
    loadChildren: () =>
      import('./planification-student/planification-student.module').then(
        (m) => m.PlanificationStudentModule
      ),
  },
  {
    path: 'view-upload-projects',
    loadChildren: () =>
      import('./view-upload-project/view-upload-project.module').then(
        (m) => m.ViewUploadProjectModule
      ),
  },
  {
    path: 'planification-tutors',
    loadChildren: () =>
      import('./planification-tutor/planification-tutor.module').then(
        (m) => m.PlanificationTutorModule
      ),
  },
  {
    path: 'theorical-notes',
    loadChildren: () =>
      import('./theoretical-note/theoretical-note.module').then(
        (m) => m.TheoricalNoteModule
      ),
  },
  {
    path: 'view-tutor-assignaments',
    loadChildren: () =>
      import('./view-tutor-assignament/view-tutor-assignment.module').then(
        (m) => m.ViewTutorAssignmentModule
      ),
  },
  {
    path: 'court-projects',
    loadChildren: () =>
      import('./court-project/court-project.module').then(
        (m) => m.CourtProjectModule
      ),
  },
  {
    path: 'registers',
    loadChildren: () =>
      import('./register/register.module').then((m) => m.RegisterModule),
  },
  {
    path: 'complexivo',
    loadChildren: () =>
      import('./complexivo/complexivo.module').then((m) => m.ComplexivoModule),
  },
  {
    path: 'view-complexivo',
    loadChildren: () =>
      import('./view-complexivo/view-complexivo.module').then(
        (m) => m.ViewComplexivoModule
      ),
  },
  {
    path: 'rubrics',
    loadChildren: () =>
      import('./rubric/rubric.module').then((m) => m.RubricModule),
  },
  {
    path: 'view-rubrics',
    loadChildren: () =>
      import('./view-rubric/view-rubric.module').then(
        (m) => m.ViewRubricModule
      ),
  },

  {
    path: 'evaluation-date',
    loadChildren: () =>
      import('./evaluation-date/evaluation-date.module').then(
        (m) => m.EvaluationDateModule
      ),
  },
  {
    path: 'evaluation-students',
    loadChildren: () =>
      import('./evaluation/evaluation.module').then((m) => m.EvaluationModule),
  },
  {
    path: 'attendances',
    loadChildren: () =>
      import('./attendance-record/attendance-record.module').then(
        (m) => m.AttendanceRecordModule
      ),
  },

  {
    path: 'notes',
    loadChildren: () => import('./note/note.module').then((m) => m.NoteModule),
  },
  {
    path: 'complex-timelines',
    loadChildren: () =>
      import('./complex-timeline/complex-timeline.module').then(
        (m) => m.ComplexTimelineModule
      ),
  },
  {
    path: 'complex-schedules',
    loadChildren: () =>
      import('./complex-schedule/complex-schedule.module').then(
        (m) => m.ComplexScheduleModule
      ),
  },
  {
    path: 'practical-cases',
    loadChildren: () =>
      import('./practical-case/practical-case.module').then(
        (m) => m.PracticalCaseModule
      ),
  },
  {
    path: 'items',
    loadChildren: () => import('./item/item.module').then((m) => m.ItemModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./home-rrhh/home-rrhh.module').then((m) => m.HomeRrhhModule),
  },
  {
    path: 'cronograma',
    loadChildren: () =>
      import('./cronograma/cronograma.module').then((m) => m.CronogramaModule),
  },
  {
    path: 'view-note',
    loadChildren: () =>
      import('./view-note-theorical/view-note-theorical.module').then(
        (m) => m.ViewNoteTheoricalModule
      ),
  },
  {
    path: 'view-note-reprobed',
    loadChildren: () =>
      import(
        './view-note-theorical-reprobed/view-note-theorical-reprobed.module'
      ).then((m) => m.ViewNoteTheoricalReprobedModule),
  },
  {
    path: 'home-note',
    loadChildren: () =>
      import('./home-note/home-note.module').then((m) => m.HomeNoteModule),
  },
  {
    path: 'project-benchs',
    loadChildren: () =>
      import('./project-bench/project-bench.module').then(
        (m) => m.ProjectBenchModule
      ),
  },
  {
    path: 'rating-weights',
    loadChildren: () =>
      import('./rating-weight/rating-weight.module').then(
        (m) => m.RatingWeightModule
      ),
  },
  {
    path: 'memorandums',
    loadChildren: () =>
      import('./memorandum/memorandum.module').then((m) => m.MemorandumModule),
  },
  {
    path: 'memorandum-home',
    loadChildren: () =>
      import('./memorandum-home/memorandum-home.module').then(
        (m) => m.MemorandumHomeModule
      ),
  },
  {
    path: 'schedule-activities',
    loadChildren: () =>
      import('./schedule-activity/schedule-activity.module').then(
        (m) => m.ScheduleActivityModule
      ),
  },
  {
    path: 'total-notes',
    loadChildren: () =>
      import('./total-note/total-note.module').then((m) => m.TotalNoteModule),
  },
  {
    path: 'rubric-notes',
    loadChildren: () =>
      import('./rubric-note/rubric-note.module').then(
        (m) => m.RubricNoteModule
      ),
  },
  {
    path: 'secretary-view',
    loadChildren: () =>
      import('./secretary-view/secretary-view.module').then(
        (m) => m.SecretaryViewModule
      ),
  },
  {
    path: 'view-defense-note',
    loadChildren: () =>
      import('./view-defense-note/view-defense-note.module').then(
        (m) => m.ViewDefenseNoteModule
      ),
  },
  {
    path: 'defense-approved',
    loadChildren: () =>
      import('./defense-approved/defense-approved.module').then(
        (m) => m.DefenseApprovedModule
      ),
  },
  {
    path: 'defense-reproved',
    loadChildren: () =>
      import('./defense-reproved/defense-reproved.module').then(
        (m) => m.DefenseReprovedModule
      ),
  },
  {
    path: 'note-defense',
    loadChildren: () =>
      import('./note-defense/note-defense.module').then(
        (m) => m.NoteDefenseModule
      ),
  },
  {
    path: 'note-setting',
    loadChildren: () =>
      import('./note-setting/note-setting.module').then(
        (m) => m.NoteSettingModule
      ),
  },
  {
    path: 'total-case',
    loadChildren: () =>
      import('./total-case/total-case.module').then(
        (m) => m.TotalCaseModule
      ),
  },
  {
    path: 'individual-defense',
    loadChildren: () =>
      import('./individual-defense/individual-defense.module').then(
        (m) => m.IndividualDefenseModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UicRoutingModule {}
