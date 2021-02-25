import { FormGroup, FormArray } from '@angular/forms';

export class GenericValidator {
  constructor(
    private validationMessages: { [key: string]: { [key: string]: string } }
  ) {}

  processMessages(
    container: FormGroup,
    force?: boolean
  ): { [key: string]: string } {
    const messages: { [key: string]: string } = {};
    for (const controlKey in container.controls) {
      if (container.controls.hasOwnProperty(controlKey)) {
        const c = container.controls[controlKey];
        if (c instanceof FormGroup) {
          const childMessages = this.processMessages(c);
          Object.assign(messages, childMessages);
        } else {
          if (c instanceof FormArray) {
          }
          if (this.validationMessages[controlKey]) {
            messages[controlKey] = '';
            if ((c.dirty || c.touched || force) && c.errors) {
              Object.keys(c.errors).map((messageKey) => {
                if (this.validationMessages[controlKey][messageKey]) {
                  messages[controlKey] +=
                    this.validationMessages[controlKey][messageKey] + ' ';
                }
              });
            }
          }
        }
      }
    }
    return messages;
  }

  getErrorCount(container: FormGroup): number {
    let errorCount = 0;
    for (const controlKey in container.controls) {
      if (container.controls.hasOwnProperty(controlKey)) {
        if (container.controls[controlKey].errors) {
          errorCount += Object.keys(container?.controls[controlKey]?.errors!)
            .length;
          console.log(errorCount);
        }
      }
    }
    return errorCount;
  }
}
