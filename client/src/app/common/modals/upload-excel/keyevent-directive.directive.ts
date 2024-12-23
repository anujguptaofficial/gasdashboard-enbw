import { Directive, Output, EventEmitter, HostListener } from "@angular/core";

@Directive({
  selector: "[appKeyeventDirective]",
})
export class KeyeventDirectiveDirective {
  @Output() ctrlV = new EventEmitter();

  @HostListener("keydown.control.v") jumpToPasteDialog() {
    this.ctrlV.emit();
  }
}
