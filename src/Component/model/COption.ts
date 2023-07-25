export interface COption{
    label: string,
    value: string,
    level: number,
    show?: boolean,
    selected?:boolean,
    childOptions: COption[],
    uuid: string,
}