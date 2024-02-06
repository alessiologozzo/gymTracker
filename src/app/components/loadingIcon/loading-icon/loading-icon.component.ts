import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-icon',
  standalone: true,
  imports: [NgClass],
  templateUrl: './loading-icon.component.html',
  styleUrl: './loading-icon.component.scss'
})
export class LoadingIconComponent {
    @Input({ required: false }) fullScreen: boolean = false
    @Input({ required: false }) wait: boolean = true
}
