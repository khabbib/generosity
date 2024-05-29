import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  @Input() projects: any[] = [];
  @Output() projectPicked = new EventEmitter<any>();

  pickProject(project: any) {
    this.projectPicked.emit(project);
  }
}
