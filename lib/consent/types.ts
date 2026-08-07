export interface ConsentState {
  necessary: true;
  analytics: boolean;
  advertising: boolean;
}

export const CONSENT_STORAGE_KEY = "homesolveatlas-cookie-consent";
export const CONSENT_CHANGE_EVENT = "homesolveatlas-consent-change";

export const defaultConsent: ConsentState = {
  necessary: true,
  analytics: false,
  advertising: false,
};
