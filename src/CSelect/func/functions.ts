import { COption } from "../model/COption";

export function getCurrentNode(options: COption[], paths: string[]): COption | null {
    let optionsCopy = options;
    for (let i = 0; i < paths.length - 1; i++) {
        const path = paths[i]
        let currentOptionsIndex = optionsCopy.findIndex(item => item.uuid === path);
        if (currentOptionsIndex === -1) return null;
        optionsCopy = optionsCopy[currentOptionsIndex].childOptions;

    }
    let lastPath = paths[paths.length - 1];
    let result = optionsCopy.find(item => item.uuid === lastPath) || null;
    return result;
}


export function getRest(options: COption[], paths: string[]): COption[] {
    let rest = options;
    for (let i = 0; i < paths.length; i++) {
        const path = paths[i]
        let currentOptionsIndex = rest.findIndex(item => item.uuid === path);
        if (currentOptionsIndex === -1) return [];
        rest = rest[currentOptionsIndex].childOptions;

    }
    return rest;
}

export function getParentNode(options: COption[], paths: string[]): COption | null {
    let newPath = [...paths];
    newPath.pop();
    const result = getCurrentNode(options, newPath);
    return result;
}

export function expandOrCollapseOptions(options: COption[], selected: boolean): void {
    for (let i = 0; i < options.length; i++) {
        options[i].show = selected;
        if (options[i].childOptions.length === 0) continue;
        expandOrCollapseOptions(options[i].childOptions, selected)
    }
}






export function selectedOrUnselectedAll(options: COption[], selected: boolean): void {
    for (let i = 0; i < options.length; i++) {
        options[i].selected = selected;
        selectedOrUnselectedAll(options[i].childOptions, selected);
    }
}

export function selectOrUnselectAllParentNode(options: COption[], paths: string[]): void {
    const pathsClone = [...paths];
    while (pathsClone.length > 0) {
        let parentNode = getParentNode(options, pathsClone);
        if (!parentNode) return;
        if (parentNode?.childOptions.some(item => item.selected)) parentNode.selected = true;
        else parentNode.selected = false;
        pathsClone.pop();
    }

}

export function expandOrCollapseChildren(options: COption[], paths: string[]): void {
    let currentNode = getCurrentNode(options, paths);
    let isExpand = currentNode?.childOptions.every(item => item.show);
    currentNode?.childOptions.map(item => {
        item.show = !isExpand;
        return item;
    })
}

export function selectOrUnSelectAll(options: COption[], selected: boolean) {
    for (let i = 0; i < options.length; i++) {
        options[i].selected = selected;
        if (options[i].childOptions.length === 0) continue;
        selectOrUnSelectAll(options[i].childOptions, selected);
    }
}

export function checkAtLeastOneOptionWasSelected(options: COption[]): boolean {
    for (let i = 0; i < options.length; i++) {
        const currentOption = options[i];
        if (currentOption.selected) return true;
        if (currentOption.childOptions.length === 0) continue;
        checkAtLeastOneOptionWasSelected(currentOption.childOptions)
    }
    return false;
}

export function getPairSelected(options: COption[]): string[][] {
    let result: string[][] = [];
    let path: string[] = []
    loopSelected(options);
    function loopSelected(options: COption[]) {
        // debugger
        for (let i = 0; i < options.length; i++) {
            const currentOptions = options[i];
            const { uuid, selected, childOptions, label, value } = currentOptions;
            if (!selected) continue;
            path.push(`${uuid};${label};${value}`);
            if (childOptions.length === 0) {
                result.push([...path]);
                path.pop();
                continue;
            }

            loopSelected(currentOptions.childOptions);
            path.pop();
        }
    }

    return result;

}

export function getPathOfOptionSelected(options: COption[], uuid: string) {


    let result: string[] = [];
    let success = false;
    function trace(options: COption[]) {

        let i = 0;
        for (i = 0; i < options.length; i++) {
            if (success) break;
            const currentOption = options[i];
            const { uuid: currentUuid } = currentOption;

            result.push(currentUuid)

            if (currentOption.childOptions.length === 0) {
                if (currentUuid === uuid) {
                    success = true;
                    return;
                }
                result.pop()
                continue;
            }

            if (currentUuid === uuid) {
                success = true;
                return;
            }


            trace(currentOption.childOptions)

        }
        if (i === options.length && !success) {
            result.pop();
        }


    }
    trace(options);
    return result;
}


export function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }



