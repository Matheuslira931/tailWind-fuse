import { CustomerCompany } from "./customers.types";

export const ID_COMPANY_RESPONSIBLE = -1;

export const PF_TYPE = 1;
export const filterLegalResponsiblePosition = (customerCompany: CustomerCompany): boolean => customerCompany?.position?.id === -1;
export const EMAIL_CONTACT_GROUP = 1;
export const PHONE_NUMBER_CONTACT_GROUP = 2;
export const PHONE_TYPE_CONTACT_GROUP = 4;
export const EMAIL_TYPE_CONTACT_GROUP = 1;
