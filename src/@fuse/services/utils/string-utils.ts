export class StringUtils {
    static removeSpecialCharacters(value: string): string {
        return value.replace(';', '');

    }
}
