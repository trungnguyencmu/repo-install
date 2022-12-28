export class JsonApi {
  id?: any;
  type?: string;
  data?: any;
  included?: any[];
  relationships?: any = {};

  static buildFromObject<T extends JsonApi>(type: new () => T, object: any): T {
    const obj: any = new type();
    Object.keys(obj).forEach((key) => {
      if (object && object[key] != null) {
        obj[key] = object[key];
      }
    });
    return obj;
  }

  static parseJsonApi<T extends JsonApi>(
    type: new (json?: any) => T,
    data: any,
    included?: any[]
  ): T {
    const obj = new type() as any;

    if (Object.keys(obj).length === 0) {
      return new type(data?.attributes);
    }

    obj.data = data || {};
    obj.included = included || [];

    obj.id = obj.data.id;
    obj.type = obj.data.type;

    Object.keys(obj).forEach((key) => {
      if (obj.data.attributes[key.toString()] != null) {
        obj[key] = obj.data.attributes[key];
      }
    });

    if (obj.data.relationships) {
      Object.entries(obj.data.relationships).forEach(
        ([key, val]: [string, any]) => {
          if (val.data) {
            obj[key] = JsonApi.getRelationship(
              obj,
              obj.relationships[key],
              val
            );
          }
        }
      );
    }

    return obj;
  }

  static getRelationship(obj: any, relationship: any, val: any) {
    if (!relationship) {
      return;
    }

    if (relationship.rel === 'has_one') {
      const data = obj.included.find((item: any) => {
        return item.type === val.data.type && item.id === val.data.id;
      });
      return JsonApi.parseJsonApi(relationship.model, data, obj.included);
    }

    if (relationship.rel === 'has_many') {
      const data = [] as any;
      val.data.forEach((element: any) => {
        const matchItem = obj.included.find((item: any) => {
          return element.type === item.type && element.id === item.id;
        });
        data.push(JsonApi.parseJsonApi(relationship.model, matchItem));
      });
      return data;
    }
  }
}
