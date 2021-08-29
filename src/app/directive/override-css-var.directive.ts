import { Directive, Input, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
export interface CssVariable {
  name: string;
  value: string;
}

@Directive({
  selector: '[appOverrideCssVar]'
})
export class OverrideCssVarDirective implements OnChanges {
  @Input('appOverrideCssVar') variable: CssVariable|CssVariable[] = [];

  constructor(private element: ElementRef) { }

  ngOnChanges(changes: SimpleChanges) {
    const set = (variable: CssVariable) => {
      if (variable.value) {
        this.element.nativeElement.style.setProperty(variable.name, variable.value);
      }
      else {
        this.element.nativeElement.style.removeProperty(variable.name);
      }
    };
    if (changes.variable) {
      if (Array.isArray(this.variable)) {
        for (const v of this.variable) {
          set(v);
        }
      }
      else {
        set(this.variable);
      }
    }
  }
}
