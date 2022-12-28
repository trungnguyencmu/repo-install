export declare class JsonApi {
    id?: any;
    type?: string;
    data?: any;
    included?: any[];
    relationships?: any;
    static buildFromObject<T extends JsonApi>(type: new () => T, object: any): T;
    static parseJsonApi<T extends JsonApi>(type: new (json?: any) => T, data: any, included?: any[]): T;
    static getRelationship(obj: any, relationship: any, val: any): any;
}
