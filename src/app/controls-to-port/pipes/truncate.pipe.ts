import { Pipe, PipeTransform } from '@angular/core';

// TODO: Replace with "overflow: ellipsis" once mat table column widths are set.
@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(text: string, size: number, trail: string = '...'): unknown {
    return text.length > size ? text.substring(0, size) + trail : text;
  }
}
