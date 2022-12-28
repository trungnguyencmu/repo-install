import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-remove-circle',
  templateUrl: './icon-remove-circle.component.svg',
  styleUrls: ['./icon-remove-circle.component.css'],
})
export class IconRemoveCircleComponent {
  @Input() color = '#06222B';
}
