import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-canceltextbox',
  templateUrl: './canceltextbox.component.html',
  styleUrls: ['./canceltextbox.component.scss']
})
export class CanceltextboxComponent implements OnInit {
  @ViewChild('ctentry', { static: false }) ctentry: ElementRef;

  @Input() textValue: string;
  @Input() focusonaccept: boolean;
  @Input() clearonaccept: boolean;
  @Input() placeholderText: string;
  @Output() acceptTriggered: EventEmitter<string> = new EventEmitter<string>();
  @Output() cancelTriggered: EventEmitter<void> = new EventEmitter<void>();

  faAccept = faCheck;
  faClose = faTimes;

  constructor() { }

  ngOnInit() {
  }

  triggerAccept() {
    this.acceptTriggered.emit(this.textValue);
    if (this.focusonaccept) {
      this.ctentry.nativeElement.focus();
    }
    if (this.clearonaccept) {
      this.textValue = '';
    }
  }

  triggerCancel() {
    this.cancelTriggered.emit();
  }
}
