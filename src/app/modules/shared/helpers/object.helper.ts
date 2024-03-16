export class ObjectHelper {
    static removeNullFields<T>(object: T): T {
        Object.keys(object).forEach(key => {
            if (object[key] === undefined || object[key] === null) {
                delete object[key];
            }
        });
        return object;
    }
}
