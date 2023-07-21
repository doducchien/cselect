export interface COption{
    label: string,
    value: string,
    level: number,
    expand?: boolean,
    selected?:boolean,
    childOptions: COption[],
    uuid: string
}