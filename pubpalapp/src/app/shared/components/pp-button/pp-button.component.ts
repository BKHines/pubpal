import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pp-button',
  templateUrl: './pp-button.component.html',
  styleUrls: ['./pp-button.component.scss'],
})
export class PpButtonComponent implements OnInit {
  @Input() buttontype: 'submit' | 'button' | 'reset';
  @Input() disabled: boolean;
  @Input() color: string;
  @Input() slot: 'start' | 'end';
  @Input() icon: string;
  @Input() text: string;

  constructor() { }

  ngOnInit() {}

}
