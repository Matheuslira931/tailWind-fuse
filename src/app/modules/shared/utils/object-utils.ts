export class ObjectUtils {
    static removeNullOrFalseValues(object: any): any {
        if (!object || typeof object !== 'object') {
            return object;
        }

        const filteredObj = {};

        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                const value = object[key];

                if (value !== null && value !== false) {
                    if (typeof value === 'object') {
                        const filteredValue = ObjectUtils.removeNullOrFalseValues(value);

                        if (Object.keys(filteredValue).length !== 0) {
                            filteredObj[key] = filteredValue;
                        }
                    } else {
                        filteredObj[key] = value;
                    }
                }
            }
        }
        console.log('filteredObj');
        console.log(filteredObj);
        return filteredObj;
    }
}
