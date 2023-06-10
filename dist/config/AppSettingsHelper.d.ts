import { Configuration } from "@azure/msal-node";
import { AppSettings, AppType, ProtectedResourcesMap } from "./AppSettingsTypes";
export declare class AppSettingsHelper {
    /**
     * Maps the custom configuration object to configuration
     * object expected by MSAL Node ConfidentialClientApplication class
     * @param {AppSettings} appSettings: configuration object
     * @returns {Configuration}
     */
    static getMsalConfiguration(appSettings: AppSettings): Configuration;
    /**
     * Validates the fields in the config object
     * @param {AppSettings} appSettings: configuration object
     * @param {AppType} appType: type of application
     */
    static validateAppSettings(appSettings: AppSettings, appType: AppType): void;
    /**
     * Util method to get the resource name for a given scope(s)
     * @param {Array} scopes: an array of scopes from the token response
     * @param {ProtectedResourcesMap} protectedResources: application authentication parameters
     * @returns {string}
     */
    static getResourceNameFromScopes(scopes: string[], protectedResources: ProtectedResourcesMap): string;
    /**
     * Util method to strip the default OIDC scopes from a given scopes list
     * @param {Array} scopesList: full list of scopes for this resource
     * @returns {Array}
     */
    static getEffectiveScopes(scopesList: string[]): string[];
    /**
     * Verifies if a given string is GUID
     * @param {string} guid: string to be verified as GUID
     * @returns {boolean}
     */
    static isGuid(guid: string): boolean;
}
