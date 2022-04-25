import { Pipe, PipeTransform } from "@angular/core";


@Pipe({
    name: 'capitalizename'
})

export class CapitalizeNamePipe implements PipeTransform {

    exeptions: string[] = [
        'van', 'de', 'der', 'op', 'den'
    ]

    transform(name: string) {
        if (!name) {
            return;
        }
        const nameSections = name.split(' ');
        let lc = []
        nameSections.forEach((section: string) => {
            lc.push(section.toLowerCase())
   
        });
        let capitalizedName = '';
        lc.forEach((section: string) => {
            if (this.exeptions.indexOf(section) == -1) {
                section = section.charAt(0).toUpperCase() + section.slice(1);
                capitalizedName = capitalizedName + ' ' + section;
            } else {
                section = section.charAt(0).toLowerCase() + section.slice(1);
                capitalizedName = capitalizedName + ' ' + section;
            }
        })
        return capitalizedName;

    }
}