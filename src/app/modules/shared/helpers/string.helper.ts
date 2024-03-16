export class StringHelper {

    /**
     * This method is to avoid any empty return that can somehow cause any type of confusion
     * for the front end
     * @param value
     */
    static shouldShowString(value: string): boolean {
        return !(!value || value === '' || value === '""' || value === ' ');
    }
}
