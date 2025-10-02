declare global {
    interface Window {
        intercomSettings?: IntercomSettings;
        Intercom: IntercomInstance | undefined;
        attachEvent: Function;
    }
}
export type Regions = "us" | "eu" | "ap";
export type IntercomInstance = Function;
export interface IntercomSettings extends MinimumBootArgs {
    phone?: string;
    unsubscribed_from_emails?: boolean;
    language_override?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_medium?: string;
    utm_source?: string;
    utm_term?: string;
    avatar?: any;
    user_hash?: string;
    company?: any;
    companies?: [any];
    page_title?: string;
    custom_launcher_selector?: string;
    alignment?: string;
    vertical_padding?: number;
    horizontal_padding?: number;
    hide_default_launcher?: boolean;
    session_duration?: number;
    action_color?: string;
    background_color?: string;
    installation_type?: string;
}
export interface InitType extends IntercomSettings {
    region?: Regions;
    [key: string]: any;
}
export interface MinimumBootArgs extends UserArgs {
    app_id: string;
    api_base?: string;
}
export interface UserArgs {
    email?: string;
    created_at?: number;
    name?: string;
    user_id?: string;
    [key: string]: any;
}
