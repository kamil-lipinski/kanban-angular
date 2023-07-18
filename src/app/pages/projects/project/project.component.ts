import { Component, EventEmitter, Input, Output} from '@angular/core';
import { Project } from 'src/app/shared/models/project';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent{
  @Input() project: Project | null = null;
  @Output() edit = new EventEmitter<Project>();
}
