import * as _plane_types from '@plane/types';
import { ChartXAxisProperty, TChartColorScheme, TIssueGroupByOptions, EIssuesStoreType, TIssueOrderByOptions, IIssueDisplayProperties, IIssueFilterOptions, TIssue, ILayoutDisplayFiltersOptions, TIssueActivityComment, TUnreadNotificationsCount, TStateGroups, TProductBillingFrequency, EProductSubscriptionEnum, IPaymentProduct, TBillingFrequency, EUserWorkspaceRoles, TStaticViewTypes, IWorkspaceSearchResults, TModuleStatus, TModuleLayoutOptions, TModuleOrderByOptions, TProjectOrderByOptions, TProjectAppliedDisplayFilterKeys, IProject, EViewAccess, TInboxIssueStatus, EStartOfTheWeek, TIssuesListTypes, TEstimateSystems, TAnalyticsTabsBase, ChartYAxisMetric } from '@plane/types';

declare enum AI_EDITOR_TASKS {
    ASK_ANYTHING = "ASK_ANYTHING"
}

declare enum E_PASSWORD_STRENGTH {
    EMPTY = "empty",
    LENGTH_NOT_VALID = "length_not_valid",
    STRENGTH_NOT_VALID = "strength_not_valid",
    STRENGTH_VALID = "strength_valid"
}
declare const PASSWORD_MIN_LENGTH = 8;
declare const SPACE_PASSWORD_CRITERIA: {
    key: string;
    label: string;
    isCriteriaValid: (password: string) => boolean;
}[];
declare enum EAuthPageTypes {
    PUBLIC = "PUBLIC",
    NON_AUTHENTICATED = "NON_AUTHENTICATED",
    SET_PASSWORD = "SET_PASSWORD",
    ONBOARDING = "ONBOARDING",
    AUTHENTICATED = "AUTHENTICATED"
}
declare enum EPageTypes {
    INIT = "INIT",
    PUBLIC = "PUBLIC",
    NON_AUTHENTICATED = "NON_AUTHENTICATED",
    ONBOARDING = "ONBOARDING",
    AUTHENTICATED = "AUTHENTICATED"
}
declare enum EAuthModes {
    SIGN_IN = "SIGN_IN",
    SIGN_UP = "SIGN_UP"
}
declare enum EAuthSteps {
    EMAIL = "EMAIL",
    PASSWORD = "PASSWORD",
    UNIQUE_CODE = "UNIQUE_CODE"
}
declare enum EErrorAlertType {
    BANNER_ALERT = "BANNER_ALERT",
    TOAST_ALERT = "TOAST_ALERT",
    INLINE_FIRST_NAME = "INLINE_FIRST_NAME",
    INLINE_EMAIL = "INLINE_EMAIL",
    INLINE_PASSWORD = "INLINE_PASSWORD",
    INLINE_EMAIL_CODE = "INLINE_EMAIL_CODE"
}
type TAuthErrorInfo = {
    type: EErrorAlertType;
    code: EAuthErrorCodes;
    title: string;
    message: any;
};
declare enum EAdminAuthErrorCodes {
    ADMIN_ALREADY_EXIST = "5150",
    REQUIRED_ADMIN_EMAIL_PASSWORD_FIRST_NAME = "5155",
    INVALID_ADMIN_EMAIL = "5160",
    INVALID_ADMIN_PASSWORD = "5165",
    REQUIRED_ADMIN_EMAIL_PASSWORD = "5170",
    ADMIN_AUTHENTICATION_FAILED = "5175",
    ADMIN_USER_ALREADY_EXIST = "5180",
    ADMIN_USER_DOES_NOT_EXIST = "5185",
    ADMIN_USER_DEACTIVATED = "5190"
}
type TAdminAuthErrorInfo = {
    type: EErrorAlertType;
    code: EAdminAuthErrorCodes;
    title: string;
    message: any;
};
declare enum EAuthErrorCodes {
    INSTANCE_NOT_CONFIGURED = "5000",
    INVALID_EMAIL = "5005",
    EMAIL_REQUIRED = "5010",
    SIGNUP_DISABLED = "5015",
    MAGIC_LINK_LOGIN_DISABLED = "5016",
    PASSWORD_LOGIN_DISABLED = "5018",
    USER_ACCOUNT_DEACTIVATED = "5019",
    INVALID_PASSWORD = "5020",
    SMTP_NOT_CONFIGURED = "5025",
    USER_ALREADY_EXIST = "5030",
    AUTHENTICATION_FAILED_SIGN_UP = "5035",
    REQUIRED_EMAIL_PASSWORD_SIGN_UP = "5040",
    INVALID_EMAIL_SIGN_UP = "5045",
    INVALID_EMAIL_MAGIC_SIGN_UP = "5050",
    MAGIC_SIGN_UP_EMAIL_CODE_REQUIRED = "5055",
    USER_DOES_NOT_EXIST = "5060",
    AUTHENTICATION_FAILED_SIGN_IN = "5065",
    REQUIRED_EMAIL_PASSWORD_SIGN_IN = "5070",
    INVALID_EMAIL_SIGN_IN = "5075",
    INVALID_EMAIL_MAGIC_SIGN_IN = "5080",
    MAGIC_SIGN_IN_EMAIL_CODE_REQUIRED = "5085",
    INVALID_MAGIC_CODE_SIGN_IN = "5090",
    INVALID_MAGIC_CODE_SIGN_UP = "5092",
    EXPIRED_MAGIC_CODE_SIGN_IN = "5095",
    EXPIRED_MAGIC_CODE_SIGN_UP = "5097",
    EMAIL_CODE_ATTEMPT_EXHAUSTED_SIGN_IN = "5100",
    EMAIL_CODE_ATTEMPT_EXHAUSTED_SIGN_UP = "5102",
    OAUTH_NOT_CONFIGURED = "5104",
    GOOGLE_NOT_CONFIGURED = "5105",
    GITHUB_NOT_CONFIGURED = "5110",
    GITLAB_NOT_CONFIGURED = "5111",
    GOOGLE_OAUTH_PROVIDER_ERROR = "5115",
    GITHUB_OAUTH_PROVIDER_ERROR = "5120",
    GITLAB_OAUTH_PROVIDER_ERROR = "5121",
    INVALID_PASSWORD_TOKEN = "5125",
    EXPIRED_PASSWORD_TOKEN = "5130",
    INCORRECT_OLD_PASSWORD = "5135",
    MISSING_PASSWORD = "5138",
    INVALID_NEW_PASSWORD = "5140",
    PASSWORD_ALREADY_SET = "5145",
    ADMIN_ALREADY_EXIST = "5150",
    REQUIRED_ADMIN_EMAIL_PASSWORD_FIRST_NAME = "5155",
    INVALID_ADMIN_EMAIL = "5160",
    INVALID_ADMIN_PASSWORD = "5165",
    REQUIRED_ADMIN_EMAIL_PASSWORD = "5170",
    ADMIN_AUTHENTICATION_FAILED = "5175",
    ADMIN_USER_ALREADY_EXIST = "5180",
    ADMIN_USER_DOES_NOT_EXIST = "5185",
    ADMIN_USER_DEACTIVATED = "5190",
    RATE_LIMIT_EXCEEDED = "5900"
}

declare const LABEL_CLASSNAME = "uppercase text-custom-text-300/60 text-sm tracking-wide";
declare const AXIS_LABEL_CLASSNAME = "uppercase text-custom-text-300/60 text-sm tracking-wide";
declare enum ChartXAxisDateGrouping {
    DAY = "DAY",
    WEEK = "WEEK",
    MONTH = "MONTH",
    YEAR = "YEAR"
}
declare const TO_CAPITALIZE_PROPERTIES: ChartXAxisProperty[];
declare const CHART_X_AXIS_DATE_PROPERTIES: ChartXAxisProperty[];
declare enum EChartModels {
    BASIC = "BASIC",
    STACKED = "STACKED",
    GROUPED = "GROUPED",
    MULTI_LINE = "MULTI_LINE",
    COMPARISON = "COMPARISON",
    PROGRESS = "PROGRESS"
}
declare const CHART_COLOR_PALETTES: {
    key: TChartColorScheme;
    i18n_label: string;
    light: string[];
    dark: string[];
}[];

declare const API_BASE_URL: string;
declare const API_BASE_PATH: string;
declare const API_URL: string;
declare const ADMIN_BASE_URL: string;
declare const ADMIN_BASE_PATH: string;
declare const GOD_MODE_URL: string;
declare const SPACE_BASE_URL: string;
declare const SPACE_BASE_PATH: string;
declare const SITES_URL: string;
declare const LIVE_BASE_URL: string;
declare const LIVE_BASE_PATH: string;
declare const LIVE_URL: string;
declare const WEB_BASE_URL: string;
declare const WEB_BASE_PATH: string;
declare const WEB_URL: string;
declare const WEBSITE_URL: string;
declare const SUPPORT_EMAIL: string;
declare const MARKETING_PRICING_PAGE_LINK = "https://plane.so/pricing";
declare const MARKETING_CONTACT_US_PAGE_LINK = "https://plane.so/contact";
declare const MARKETING_PLANE_ONE_PAGE_LINK = "https://plane.so/one";

declare const MAX_FILE_SIZE: number;
declare const ACCEPTED_AVATAR_IMAGE_MIME_TYPES_FOR_REACT_DROPZONE: {
    "image/jpeg": never[];
    "image/jpg": never[];
    "image/png": never[];
    "image/webp": never[];
};
declare const ACCEPTED_COVER_IMAGE_MIME_TYPES_FOR_REACT_DROPZONE: {
    "image/jpeg": never[];
    "image/jpg": never[];
    "image/png": never[];
    "image/webp": never[];
};

declare enum E_SORT_ORDER {
    ASC = "asc",
    DESC = "desc"
}
declare const DATE_AFTER_FILTER_OPTIONS: {
    name: string;
    value: string;
}[];
declare const DATE_BEFORE_FILTER_OPTIONS: ({
    name: string;
    value: string;
    i18n_name?: undefined;
} | {
    name: string;
    i18n_name: string;
    value: string;
})[];
declare const PROJECT_CREATED_AT_FILTER_OPTIONS: {
    name: string;
    value: string;
}[];

declare const CHARTS_THEME: {
    background: string;
    text: {
        color: string;
    };
    axis: {
        domain: {
            line: {
                stroke: string;
                strokeWidth: number;
            };
        };
    };
    tooltip: {
        container: {
            background: string;
            color: string;
            fontSize: string;
            border: string;
        };
    };
    grid: {
        line: {
            stroke: string;
        };
    };
};
declare const CHART_DEFAULT_MARGIN: {
    top: number;
    right: number;
    bottom: number;
    left: number;
};

declare enum EInstanceStatus {
    ERROR = "ERROR",
    NOT_YET_READY = "NOT_YET_READY"
}
type TInstanceStatus = {
    status: EInstanceStatus | undefined;
    data?: object;
};

declare const ALL_ISSUES = "All Issues";
type TIssuePriorities = "urgent" | "high" | "medium" | "low" | "none";
type TIssueFilterPriorityObject = {
    key: TIssuePriorities;
    titleTranslationKey: string;
    className: string;
    icon: string;
};
declare enum EIssueGroupByToServerOptions {
    "state" = "state_id",
    "priority" = "priority",
    "labels" = "labels__id",
    "state_detail.group" = "state__group",
    "assignees" = "assignees__id",
    "cycle" = "cycle_id",
    "module" = "issue_module__module_id",
    "target_date" = "target_date",
    "project" = "project_id",
    "created_by" = "created_by",
    "team_project" = "project_id"
}
declare enum EIssueGroupBYServerToProperty {
    "state_id" = "state_id",
    "priority" = "priority",
    "labels__id" = "label_ids",
    "state__group" = "state__group",
    "assignees__id" = "assignee_ids",
    "cycle_id" = "cycle_id",
    "issue_module__module_id" = "module_ids",
    "target_date" = "target_date",
    "project_id" = "project_id",
    "created_by" = "created_by"
}
declare enum EIssueCommentAccessSpecifier {
    EXTERNAL = "EXTERNAL",
    INTERNAL = "INTERNAL"
}
declare enum EIssueListRow {
    HEADER = "HEADER",
    ISSUE = "ISSUE",
    NO_ISSUES = "NO_ISSUES",
    QUICK_ADD = "QUICK_ADD"
}
declare const ISSUE_PRIORITIES: {
    key: TIssuePriorities;
    title: string;
}[];
declare const DRAG_ALLOWED_GROUPS: TIssueGroupByOptions[];
type TCreateModalStoreTypes = EIssuesStoreType.TEAM | EIssuesStoreType.PROJECT | EIssuesStoreType.TEAM_VIEW | EIssuesStoreType.PROJECT_VIEW | EIssuesStoreType.PROFILE | EIssuesStoreType.CYCLE | EIssuesStoreType.MODULE | EIssuesStoreType.EPIC;
declare const ISSUE_GROUP_BY_OPTIONS: {
    key: TIssueGroupByOptions;
    titleTranslationKey: string;
}[];
declare const ISSUE_ORDER_BY_OPTIONS: {
    key: TIssueOrderByOptions;
    titleTranslationKey: string;
}[];
declare const ISSUE_DISPLAY_PROPERTIES_KEYS: (keyof IIssueDisplayProperties)[];
declare const SUB_ISSUES_DISPLAY_PROPERTIES_KEYS: (keyof IIssueDisplayProperties)[];
declare const ISSUE_DISPLAY_PROPERTIES: {
    key: keyof IIssueDisplayProperties;
    titleTranslationKey: string;
}[];
declare const SPREADSHEET_PROPERTY_LIST: (keyof IIssueDisplayProperties)[];
declare const SPREADSHEET_PROPERTY_DETAILS: {
    [key in keyof IIssueDisplayProperties]: {
        i18n_title: string;
        ascendingOrderKey: TIssueOrderByOptions;
        ascendingOrderTitle: string;
        descendingOrderKey: TIssueOrderByOptions;
        descendingOrderTitle: string;
        icon: string;
    };
};
declare const FILTER_TO_ISSUE_MAP: Partial<Record<keyof IIssueFilterOptions, keyof TIssue>>;

type TIssueLayout = "list" | "kanban" | "calendar" | "spreadsheet" | "gantt";
declare enum EIssueLayoutTypes {
    LIST = "list",
    KANBAN = "kanban",
    CALENDAR = "calendar",
    GANTT = "gantt_chart",
    SPREADSHEET = "spreadsheet"
}
type TIssueLayoutMap = Record<EIssueLayoutTypes, {
    key: EIssueLayoutTypes;
    i18n_title: string;
    i18n_label: string;
}>;
declare const SITES_ISSUE_LAYOUTS: {
    key: TIssueLayout;
    titleTranslationKey: string;
    icon: any;
}[];
declare const ISSUE_LAYOUT_MAP: TIssueLayoutMap;
declare const ISSUE_LAYOUTS: {
    key: EIssueLayoutTypes;
    i18n_title: string;
}[];

type TIssueFilterKeys = "priority" | "state" | "labels";
declare enum EServerGroupByToFilterOptions {
    "state_id" = "state",
    "priority" = "priority",
    "labels__id" = "labels",
    "state__group" = "state_group",
    "assignees__id" = "assignees",
    "cycle_id" = "cycle",
    "issue_module__module_id" = "module",
    "target_date" = "target_date",
    "project_id" = "project",
    "created_by" = "created_by"
}
declare enum EIssueFilterType {
    FILTERS = "filters",
    DISPLAY_FILTERS = "display_filters",
    DISPLAY_PROPERTIES = "display_properties",
    KANBAN_FILTERS = "kanban_filters"
}
declare const ISSUE_DISPLAY_FILTERS_BY_LAYOUT: {
    [key in TIssueLayout]: Record<"filters", TIssueFilterKeys[]>;
};
declare const ISSUE_PRIORITY_FILTERS: TIssueFilterPriorityObject[];
type TFiltersByLayout = {
    [layoutType: string]: ILayoutDisplayFiltersOptions;
};
type TIssueFiltersToDisplayByPageType = {
    [pageType: string]: TFiltersByLayout;
};
declare const ISSUE_DISPLAY_FILTERS_BY_PAGE: TIssueFiltersToDisplayByPageType;
declare const ISSUE_STORE_TO_FILTERS_MAP: Partial<Record<EIssuesStoreType, TFiltersByLayout>>;
declare enum EActivityFilterType {
    ACTIVITY = "ACTIVITY",
    COMMENT = "COMMENT"
}
type TActivityFilters = EActivityFilterType;
declare const ACTIVITY_FILTER_TYPE_OPTIONS: Record<TActivityFilters, {
    labelTranslationKey: string;
}>;
type TActivityFilterOption = {
    key: TActivityFilters;
    labelTranslationKey: string;
    isSelected: boolean;
    onClick: () => void;
};
declare const defaultActivityFilters: TActivityFilters[];
declare const filterActivityOnSelectedFilters: (activity: TIssueActivityComment[], filters: TActivityFilters[]) => TIssueActivityComment[];
declare const ENABLE_ISSUE_DEPENDENCIES = false;

declare const DEFAULT_WORK_ITEM_FORM_VALUES: Partial<TIssue>;

declare const SITE_NAME = "Plane | Simple, extensible, open-source project management tool.";
declare const SITE_TITLE = "Plane | Simple, extensible, open-source project management tool.";
declare const SITE_DESCRIPTION = "Open-source project management tool to manage work items, cycles, and product roadmaps easily";
declare const SITE_KEYWORDS = "software development, plan, ship, software, accelerate, code management, release management, project management, work items tracking, agile, scrum, kanban, collaboration";
declare const SITE_URL = "https://app.plane.so/";
declare const TWITTER_USER_NAME = "Plane | Simple, extensible, open-source project management tool.";
declare const SPACE_SITE_NAME = "Plane Publish | Make your Plane boards and roadmaps pubic with just one-click. ";
declare const SPACE_SITE_TITLE = "Plane Publish | Make your Plane boards public with one-click";
declare const SPACE_SITE_DESCRIPTION = "Plane Publish is a customer feedback management tool built on top of plane.so";
declare const SPACE_SITE_KEYWORDS = "software development, customer feedback, software, accelerate, code management, release management, project management, work items tracking, agile, scrum, kanban, collaboration";
declare const SPACE_SITE_URL = "https://app.plane.so/";
declare const SPACE_TWITTER_USER_NAME = "planepowers";

declare enum ENotificationTab {
    ALL = "all",
    MENTIONS = "mentions"
}
declare enum ENotificationFilterType {
    CREATED = "created",
    ASSIGNED = "assigned",
    SUBSCRIBED = "subscribed"
}
declare enum ENotificationLoader {
    INIT_LOADER = "init-loader",
    MUTATION_LOADER = "mutation-loader",
    PAGINATION_LOADER = "pagination-loader",
    REFRESH = "refresh",
    MARK_ALL_AS_READY = "mark-all-as-read"
}
declare enum ENotificationQueryParamType {
    INIT = "init",
    CURRENT = "current",
    NEXT = "next"
}
type TNotificationTab = ENotificationTab.ALL | ENotificationTab.MENTIONS;
declare const NOTIFICATION_TABS: {
    i18n_label: string;
    value: ENotificationTab;
    count: (unReadNotification: TUnreadNotificationsCount) => number;
}[];
declare const FILTER_TYPE_OPTIONS: {
    i18n_label: string;
    value: ENotificationFilterType;
}[];
declare const NOTIFICATION_SNOOZE_OPTIONS: ({
    key: string;
    i18n_label: string;
    value: () => Date;
} | {
    key: string;
    i18n_label: string;
    value: undefined;
})[];
declare const allTimeIn30MinutesInterval12HoursFormat: Array<{
    label: string;
    value: string;
}>;

type TDraggableData = {
    groupKey: TStateGroups;
    id: string;
};
declare const STATE_GROUPS: {
    [key in TStateGroups]: {
        key: TStateGroups;
        label: string;
        defaultStateName: string;
        color: string;
    };
};
declare const ARCHIVABLE_STATE_GROUPS: TStateGroups[];
declare const COMPLETED_STATE_GROUPS: TStateGroups[];
declare const PENDING_STATE_GROUPS: TStateGroups[];
declare const STATE_DISTRIBUTION: {
    [STATE_GROUPS.backlog.key]: {
        key: TStateGroups;
        issues: string;
        points: string;
    };
    [STATE_GROUPS.unstarted.key]: {
        key: TStateGroups;
        issues: string;
        points: string;
    };
    [STATE_GROUPS.started.key]: {
        key: TStateGroups;
        issues: string;
        points: string;
    };
    [STATE_GROUPS.completed.key]: {
        key: TStateGroups;
        issues: string;
        points: string;
    };
    [STATE_GROUPS.cancelled.key]: {
        key: TStateGroups;
        issues: string;
        points: string;
    };
};
declare const PROGRESS_STATE_GROUPS_DETAILS: {
    key: string;
    title: string;
    color: string;
}[];
declare const DISPLAY_WORKFLOW_PRO_CTA = false;

declare const DEFAULT_SWR_CONFIG: {
    refreshWhenHidden: boolean;
    revalidateIfStale: boolean;
    revalidateOnFocus: boolean;
    revalidateOnMount: boolean;
    refreshInterval: number;
    errorRetryCount: number;
};
declare const WEB_SWR_CONFIG: {
    refreshWhenHidden: boolean;
    revalidateIfStale: boolean;
    revalidateOnFocus: boolean;
    revalidateOnMount: boolean;
    errorRetryCount: number;
};

declare const ISSUE_FORM_TAB_INDICES: string[];
declare const INTAKE_ISSUE_CREATE_FORM_TAB_INDICES: string[];
declare const CREATE_LABEL_TAB_INDICES: string[];
declare const PROJECT_CREATE_TAB_INDICES: string[];
declare const PROJECT_CYCLE_TAB_INDICES: string[];
declare const PROJECT_MODULE_TAB_INDICES: string[];
declare const PROJECT_VIEW_TAB_INDICES: string[];
declare const PROJECT_PAGE_TAB_INDICES: string[];
declare enum ETabIndices {
    ISSUE_FORM = "issue-form",
    INTAKE_ISSUE_FORM = "intake-issue-form",
    CREATE_LABEL = "create-label",
    PROJECT_CREATE = "project-create",
    PROJECT_CYCLE = "project-cycle",
    PROJECT_MODULE = "project-module",
    PROJECT_VIEW = "project-view",
    PROJECT_PAGE = "project-page"
}
declare const TAB_INDEX_MAP: Record<ETabIndices, string[]>;

declare enum EAuthenticationPageType {
    STATIC = "STATIC",
    NOT_AUTHENTICATED = "NOT_AUTHENTICATED",
    AUTHENTICATED = "AUTHENTICATED"
}
declare enum EInstancePageType {
    PRE_SETUP = "PRE_SETUP",
    POST_SETUP = "POST_SETUP"
}
declare enum EUserStatus {
    ERROR = "ERROR",
    AUTHENTICATION_NOT_DONE = "AUTHENTICATION_NOT_DONE",
    NOT_YET_READY = "NOT_YET_READY"
}
type TUserStatus = {
    status: EUserStatus | undefined;
    message?: string;
};
declare enum EUserPermissionsLevel {
    WORKSPACE = "WORKSPACE",
    PROJECT = "PROJECT"
}
type TUserPermissionsLevel = EUserPermissionsLevel;
declare enum EUserPermissions {
    ADMIN = 20,
    MEMBER = 15,
    GUEST = 5
}
type TUserPermissions = EUserPermissions;
type TUserAllowedPermissionsObject = {
    create: TUserPermissions[];
    update: TUserPermissions[];
    delete: TUserPermissions[];
    read: TUserPermissions[];
};
type TUserAllowedPermissions = {
    workspace: {
        [key: string]: Partial<TUserAllowedPermissionsObject>;
    };
    project: {
        [key: string]: Partial<TUserAllowedPermissionsObject>;
    };
};
declare const USER_ALLOWED_PERMISSIONS: TUserAllowedPermissions;

/**
 * Default billing frequency for each product subscription type
 */
declare const DEFAULT_PRODUCT_BILLING_FREQUENCY: TProductBillingFrequency;
/**
 * Subscription types that support billing frequency toggle (monthly/yearly)
 */
declare const SUBSCRIPTION_WITH_BILLING_FREQUENCY: EProductSubscriptionEnum[];
/**
 * Mapping of product subscription types to their respective payment product details
 * Used to provide information about each product's pricing and features
 */
declare const PLANE_COMMUNITY_PRODUCTS: Record<string, IPaymentProduct>;
/**
 * URL for the "Talk to Sales" page where users can contact sales team
 */
declare const TALK_TO_SALES_URL = "https://plane.so/talk-to-sales";
/**
 * Mapping of subscription types to their respective upgrade/redirection URLs based on billing frequency
 * Used for self-hosted installations to redirect users to appropriate upgrade pages
 */
declare const SUBSCRIPTION_REDIRECTION_URLS: Record<EProductSubscriptionEnum, Record<TBillingFrequency, string>>;
/**
 * Mapping of subscription types to their respective marketing webpage URLs
 * Used to direct users to learn more about each plan's features and pricing
 */
declare const SUBSCRIPTION_WEBPAGE_URLS: Record<EProductSubscriptionEnum, string>;

declare const ORGANIZATION_SIZE: string[];
declare const RESTRICTED_URLS: string[];
declare const WORKSPACE_SETTINGS: {
    general: {
        key: string;
        i18n_label: string;
        href: string;
        access: EUserWorkspaceRoles[];
        highlight: (pathname: string, baseUrl: string) => boolean;
    };
    members: {
        key: string;
        i18n_label: string;
        href: string;
        access: EUserWorkspaceRoles[];
        highlight: (pathname: string, baseUrl: string) => boolean;
    };
    "billing-and-plans": {
        key: string;
        i18n_label: string;
        href: string;
        access: EUserWorkspaceRoles[];
        highlight: (pathname: string, baseUrl: string) => boolean;
    };
    export: {
        key: string;
        i18n_label: string;
        href: string;
        access: EUserWorkspaceRoles[];
        highlight: (pathname: string, baseUrl: string) => boolean;
    };
    webhooks: {
        key: string;
        i18n_label: string;
        href: string;
        access: EUserWorkspaceRoles[];
        highlight: (pathname: string, baseUrl: string) => boolean;
    };
};
declare const WORKSPACE_SETTINGS_ACCESS: {
    [k: string]: EUserWorkspaceRoles[];
};
declare const WORKSPACE_SETTINGS_LINKS: {
    key: string;
    i18n_label: string;
    href: string;
    access: EUserWorkspaceRoles[];
    highlight: (pathname: string, baseUrl: string) => boolean;
}[];
declare const ROLE: {
    5: string;
    15: string;
    20: string;
};
declare const ROLE_DETAILS: {
    5: {
        i18n_title: string;
        i18n_description: string;
    };
    15: {
        i18n_title: string;
        i18n_description: string;
    };
    20: {
        i18n_title: string;
        i18n_description: string;
    };
};
declare const USER_ROLES: {
    value: string;
    i18n_label: string;
}[];
declare const IMPORTERS_LIST: {
    provider: string;
    type: string;
    i18n_title: string;
    i18n_description: string;
}[];
declare const EXPORTERS_LIST: {
    provider: string;
    type: string;
    i18n_title: string;
    i18n_description: string;
}[];
declare const DEFAULT_GLOBAL_VIEWS_LIST: {
    key: TStaticViewTypes;
    i18n_label: string;
}[];
interface IWorkspaceSidebarNavigationItem {
    key: string;
    labelTranslationKey: string;
    href: string;
    access: EUserWorkspaceRoles[];
}
declare const WORKSPACE_SIDEBAR_DYNAMIC_NAVIGATION_ITEMS: Record<string, IWorkspaceSidebarNavigationItem>;
declare const WORKSPACE_SIDEBAR_DYNAMIC_NAVIGATION_ITEMS_LINKS: IWorkspaceSidebarNavigationItem[];
declare const WORKSPACE_SIDEBAR_STATIC_NAVIGATION_ITEMS: Record<string, IWorkspaceSidebarNavigationItem>;
declare const WORKSPACE_SIDEBAR_STATIC_NAVIGATION_ITEMS_LINKS: IWorkspaceSidebarNavigationItem[];
declare const WORKSPACE_SIDEBAR_STATIC_PINNED_NAVIGATION_ITEMS_LINKS: IWorkspaceSidebarNavigationItem[];
declare const IS_FAVORITE_MENU_OPEN = "is_favorite_menu_open";
declare const WORKSPACE_DEFAULT_SEARCH_RESULT: IWorkspaceSearchResults;

declare const STICKIES_PER_PAGE = 30;

declare const CYCLE_STATUS: {
    i18n_label: string;
    value: "current" | "upcoming" | "completed" | "draft";
    i18n_title: string;
    color: string;
    textColor: string;
    bgColor: string;
}[];

declare const MODULE_STATUS_COLORS: {
    [key in TModuleStatus]: string;
};
declare const MODULE_STATUS: {
    i18n_label: string;
    value: TModuleStatus;
    color: string;
    textColor: string;
    bgColor: string;
}[];
declare const MODULE_VIEW_LAYOUTS: {
    key: TModuleLayoutOptions;
    i18n_title: string;
}[];
declare const MODULE_ORDER_BY_OPTIONS: {
    key: TModuleOrderByOptions;
    i18n_label: string;
}[];

type TNetworkChoiceIconKey = "Lock" | "Globe2";
type TNetworkChoice = {
    key: 0 | 2;
    labelKey: string;
    i18n_label: string;
    description: string;
    iconKey: TNetworkChoiceIconKey;
};
declare const NETWORK_CHOICES: TNetworkChoice[];
declare const GROUP_CHOICES: {
    backlog: {
        key: string;
        i18n_label: string;
    };
    unstarted: {
        key: string;
        i18n_label: string;
    };
    started: {
        key: string;
        i18n_label: string;
    };
    completed: {
        key: string;
        i18n_label: string;
    };
    cancelled: {
        key: string;
        i18n_label: string;
    };
};
declare const PROJECT_AUTOMATION_MONTHS: {
    i18n_label: string;
    value: number;
}[];
declare const PROJECT_UNSPLASH_COVERS: string[];
declare const PROJECT_ORDER_BY_OPTIONS: {
    key: TProjectOrderByOptions;
    i18n_label: string;
}[];
declare const PROJECT_DISPLAY_FILTER_OPTIONS: {
    key: TProjectAppliedDisplayFilterKeys;
    i18n_label: string;
}[];
declare const PROJECT_ERROR_MESSAGES: {
    permissionError: {
        i18n_title: string;
        i18n_message: undefined;
    };
    cycleDeleteError: {
        i18n_title: string;
        i18n_message: string;
    };
    moduleDeleteError: {
        i18n_title: string;
        i18n_message: string;
    };
    issueDeleteError: {
        i18n_title: string;
        i18n_message: string;
    };
};
declare const DEFAULT_PROJECT_FORM_VALUES: Partial<IProject>;
declare enum EProjectFeatureKey {
    WORK_ITEMS = "work_items",
    CYCLES = "cycles",
    MODULES = "modules",
    VIEWS = "views",
    PAGES = "pages",
    INTAKE = "intake"
}

declare const VIEW_ACCESS_SPECIFIERS: {
    key: EViewAccess;
    i18n_label: string;
}[];
declare const VIEW_SORTING_KEY_OPTIONS: {
    key: string;
    i18n_label: string;
}[];
declare const VIEW_SORT_BY_OPTIONS: {
    key: string;
    i18n_label: string;
}[];

declare const THEMES: string[];
interface I_THEME_OPTION {
    key: string;
    value: string;
    i18n_label: string;
    type: string;
    icon: {
        border: string;
        color1: string;
        color2: string;
    };
}
declare const THEME_OPTIONS: I_THEME_OPTION[];

declare const INBOX_STATUS: {
    key: string;
    status: TInboxIssueStatus;
    i18n_title: string;
    i18n_description: () => string;
}[];
declare const INBOX_ISSUE_ORDER_BY_OPTIONS: {
    key: string;
    i18n_label: string;
}[];
declare const INBOX_ISSUE_SORT_BY_OPTIONS: {
    key: string;
    i18n_label: string;
}[];
declare enum EPastDurationFilters {
    TODAY = "today",
    YESTERDAY = "yesterday",
    LAST_7_DAYS = "last_7_days",
    LAST_30_DAYS = "last_30_days"
}
declare const PAST_DURATION_FILTER_OPTIONS: {
    name: string;
    value: string;
}[];

declare const PROFILE_SETTINGS: {
    profile: {
        key: string;
        i18n_label: string;
        href: string;
        highlight: (pathname: string) => pathname is "/settings/account/";
    };
    security: {
        key: string;
        i18n_label: string;
        href: string;
        highlight: (pathname: string) => pathname is "/settings/account/security/";
    };
    activity: {
        key: string;
        i18n_label: string;
        href: string;
        highlight: (pathname: string) => pathname is "/settings/account/activity/";
    };
    preferences: {
        key: string;
        i18n_label: string;
        href: string;
        highlight: (pathname: string) => pathname is "/settings/account/preferences";
    };
    notifications: {
        key: string;
        i18n_label: string;
        href: string;
        highlight: (pathname: string) => pathname is "/settings/account/notifications/";
    };
    "api-tokens": {
        key: string;
        i18n_label: string;
        href: string;
        highlight: (pathname: string) => pathname is "/settings/account/api-tokens/";
    };
};
declare const PROFILE_ACTION_LINKS: {
    key: string;
    i18n_label: string;
    href: string;
    highlight: (pathname: string) => boolean;
}[];
declare const PROFILE_VIEWER_TAB: {
    key: string;
    route: string;
    i18n_label: string;
    selected: string;
}[];
declare const PROFILE_ADMINS_TAB: {
    key: string;
    route: string;
    i18n_label: string;
    selected: string;
}[];
declare const PREFERENCE_OPTIONS: {
    id: string;
    title: string;
    description: string;
}[];
/**
 * @description The options for the start of the week
 * @type {Array<{value: EStartOfTheWeek, label: string}>}
 * @constant
 */
declare const START_OF_THE_WEEK_OPTIONS: {
    value: EStartOfTheWeek;
    label: string;
}[];

declare enum EDraftIssuePaginationType {
    INIT = "INIT",
    NEXT = "NEXT",
    PREV = "PREV",
    CURRENT = "CURRENT"
}

declare const LABEL_COLOR_OPTIONS: string[];
declare const getRandomLabelColor: () => string;

declare const GITHUB_REDIRECTED_TRACKER_EVENT = "github_redirected";
declare const HEADER_GITHUB_ICON = "header_github_icon";
declare const GROUP_WORKSPACE_TRACKER_EVENT = "workspace_metrics";
declare const COMMAND_PALETTE_TRACKER_ELEMENTS: {
    COMMAND_PALETTE_SHORTCUT_KEY: string;
};
declare const WORKSPACE_TRACKER_EVENTS: {
    create: string;
    update: string;
    delete: string;
};
declare const WORKSPACE_TRACKER_ELEMENTS: {
    DELETE_WORKSPACE_BUTTON: string;
    ONBOARDING_CREATE_WORKSPACE_BUTTON: string;
    CREATE_WORKSPACE_BUTTON: string;
    UPDATE_WORKSPACE_BUTTON: string;
};
declare const PROJECT_TRACKER_EVENTS: {
    create: string;
    update: string;
    delete: string;
};
declare const PROJECT_TRACKER_ELEMENTS: {
    EXTENDED_SIDEBAR_ADD_BUTTON: string;
    SIDEBAR_CREATE_PROJECT_BUTTON: string;
    SIDEBAR_CREATE_PROJECT_TOOLTIP: string;
    COMMAND_PALETTE_CREATE_BUTTON: string;
    COMMAND_PALETTE_SHORTCUT_CREATE_BUTTON: string;
    EMPTY_STATE_CREATE_PROJECT_BUTTON: string;
    CREATE_HEADER_BUTTON: string;
    CREATE_FIRST_PROJECT_BUTTON: string;
    DELETE_PROJECT_BUTTON: string;
    UPDATE_PROJECT_BUTTON: string;
    CREATE_PROJECT_JIRA_IMPORT_DETAIL_PAGE: string;
    TOGGLE_FEATURE: string;
};
declare const CYCLE_TRACKER_EVENTS: {
    create: string;
    update: string;
    delete: string;
    favorite: string;
    unfavorite: string;
    archive: string;
    restore: string;
};
declare const CYCLE_TRACKER_ELEMENTS: {
    readonly RIGHT_HEADER_ADD_BUTTON: "right_header_add_cycle_button";
    readonly EMPTY_STATE_ADD_BUTTON: "empty_state_add_cycle_button";
    readonly COMMAND_PALETTE_ADD_ITEM: "command_palette_add_cycle_item";
    readonly RIGHT_SIDEBAR: "cycle_right_sidebar";
    readonly QUICK_ACTIONS: "cycle_quick_actions";
    readonly CONTEXT_MENU: "cycle_context_menu";
    readonly LIST_ITEM: "cycle_list_item";
};
declare const MODULE_TRACKER_EVENTS: {
    create: string;
    update: string;
    delete: string;
    favorite: string;
    unfavorite: string;
    archive: string;
    restore: string;
    link: {
        create: string;
        update: string;
        delete: string;
    };
};
declare const MODULE_TRACKER_ELEMENTS: {
    readonly RIGHT_HEADER_ADD_BUTTON: "right_header_add_module_button";
    readonly EMPTY_STATE_ADD_BUTTON: "empty_state_add_module_button";
    readonly COMMAND_PALETTE_ADD_ITEM: "command_palette_add_module_item";
    readonly RIGHT_SIDEBAR: "module_right_sidebar";
    readonly QUICK_ACTIONS: "module_quick_actions";
    readonly CONTEXT_MENU: "module_context_menu";
    readonly LIST_ITEM: "module_list_item";
    readonly CARD_ITEM: "module_card_item";
};
declare const WORK_ITEM_TRACKER_EVENTS: {
    create: string;
    add_existing: string;
    update: string;
    delete: string;
    archive: string;
    restore: string;
    attachment: {
        add: string;
        remove: string;
    };
    sub_issue: {
        update: string;
        remove: string;
        delete: string;
        create: string;
        add_existing: string;
    };
    draft: {
        create: string;
    };
};
declare const WORK_ITEM_TRACKER_ELEMENTS: {
    readonly HEADER_ADD_BUTTON: {
        readonly WORK_ITEMS: "work_items_header_add_work_item_button";
        readonly PROJECT_VIEW: "project_view_header_add_work_item_button";
        readonly CYCLE: "cycle_header_add_work_item_button";
        readonly MODULE: "module_header_add_work_item_button";
    };
    readonly COMMAND_PALETTE_ADD_BUTTON: "command_palette_add_work_item_button";
    readonly EMPTY_STATE_ADD_BUTTON: {
        readonly WORK_ITEMS: "work_items_empty_state_add_work_item_button";
        readonly PROJECT_VIEW: "project_view_empty_state_add_work_item_button";
        readonly CYCLE: "cycle_empty_state_add_work_item_button";
        readonly MODULE: "module_empty_state_add_work_item_button";
        readonly GLOBAL_VIEW: "global_view_empty_state_add_work_item_button";
    };
    readonly QUICK_ACTIONS: {
        readonly WORK_ITEMS: "work_items_quick_actions";
        readonly PROJECT_VIEW: "project_view_work_items_quick_actions";
        readonly CYCLE: "cycle_work_items_quick_actions";
        readonly MODULE: "module_work_items_quick_actions";
        readonly GLOBAL_VIEW: "global_view_work_items_quick_actions";
        readonly ARCHIVED: "archived_work_items_quick_actions";
        readonly DRAFT: "draft_work_items_quick_actions";
    };
    readonly CONTEXT_MENU: {
        readonly WORK_ITEMS: "work_items_context_menu";
        readonly PROJECT_VIEW: "project_view_context_menu";
        readonly CYCLE: "cycle_context_menu";
        readonly MODULE: "module_context_menu";
        readonly GLOBAL_VIEW: "global_view_context_menu";
        readonly ARCHIVED: "archived_context_menu";
        readonly DRAFT: "draft_context_menu";
    };
};
declare const STATE_TRACKER_EVENTS: {
    create: string;
    update: string;
    delete: string;
};
declare const STATE_TRACKER_ELEMENTS: {
    STATE_GROUP_ADD_BUTTON: string;
    STATE_LIST_DELETE_BUTTON: string;
    STATE_LIST_EDIT_BUTTON: string;
};
declare const PROJECT_PAGE_TRACKER_EVENTS: {
    create: string;
    update: string;
    delete: string;
    archive: string;
    restore: string;
    lock: string;
    unlock: string;
    access_update: string;
    duplicate: string;
    favorite: string;
    unfavorite: string;
    move: string;
};
declare const PROJECT_PAGE_TRACKER_ELEMENTS: {
    readonly COMMAND_PALETTE_SHORTCUT_CREATE_BUTTON: "command_palette_shortcut_create_page_button";
    readonly EMPTY_STATE_CREATE_BUTTON: "empty_state_create_page_button";
    readonly COMMAND_PALETTE_CREATE_BUTTON: "command_palette_create_page_button";
    readonly CONTEXT_MENU: "page_context_menu";
    readonly QUICK_ACTIONS: "page_quick_actions";
    readonly LIST_ITEM: "page_list_item";
    readonly FAVORITE_BUTTON: "page_favorite_button";
    readonly ARCHIVE_BUTTON: "page_archive_button";
    readonly LOCK_BUTTON: "page_lock_button";
    readonly ACCESS_TOGGLE: "page_access_toggle";
    readonly DUPLICATE_BUTTON: "page_duplicate_button";
};
declare const MEMBER_TRACKER_EVENTS: {
    invite: string;
    accept: string;
    project: {
        add: string;
        leave: string;
    };
    workspace: {
        leave: string;
    };
};
declare const MEMBER_TRACKER_ELEMENTS: {
    readonly HEADER_ADD_BUTTON: "header_add_member_button";
    readonly ACCEPT_INVITATION_BUTTON: "accept_invitation_button";
    readonly ONBOARDING_JOIN_WORKSPACE: "workspace_join_continue_to_workspace_button";
    readonly ONBOARDING_INVITE_MEMBER: "invite_member_continue_button";
    readonly SIDEBAR_PROJECT_QUICK_ACTIONS: "sidebar_project_quick_actions";
    readonly PROJECT_MEMBER_TABLE_CONTEXT_MENU: "project_member_table_context_menu";
    readonly WORKSPACE_MEMBER_TABLE_CONTEXT_MENU: "workspace_member_table_context_menu";
    readonly WORKSPACE_INVITATIONS_LIST_CONTEXT_MENU: "workspace_invitations_list_context_menu";
};
declare const AUTH_TRACKER_EVENTS: {
    code_verify: string;
    sign_up_with_password: string;
    sign_in_with_password: string;
    forgot_password: string;
    new_code_requested: string;
};
declare const AUTH_TRACKER_ELEMENTS: {
    NAVIGATE_TO_SIGN_UP: string;
    FORGOT_PASSWORD_FROM_SIGNIN: string;
    SIGNUP_FROM_FORGOT_PASSWORD: string;
    SIGN_IN_FROM_SIGNUP: string;
    SIGN_IN_WITH_UNIQUE_CODE: string;
    REQUEST_NEW_CODE: string;
    VERIFY_CODE: string;
};
declare const GLOBAL_VIEW_TRACKER_EVENTS: {
    create: string;
    update: string;
    delete: string;
    open: string;
};
declare const GLOBAL_VIEW_TRACKER_ELEMENTS: {
    RIGHT_HEADER_ADD_BUTTON: string;
    HEADER_SAVE_VIEW_BUTTON: string;
    QUICK_ACTIONS: string;
    LIST_ITEM: string;
};
declare const PRODUCT_TOUR_TRACKER_EVENTS: {
    complete: string;
};
declare const PRODUCT_TOUR_TRACKER_ELEMENTS: {
    START_BUTTON: string;
    SKIP_BUTTON: string;
    CREATE_PROJECT_BUTTON: string;
};
declare const NOTIFICATION_TRACKER_EVENTS: {
    archive: string;
    unarchive: string;
    mark_read: string;
    mark_unread: string;
    all_marked_read: string;
};
declare const NOTIFICATION_TRACKER_ELEMENTS: {
    MARK_ALL_AS_READ_BUTTON: string;
    ARCHIVE_UNARCHIVE_BUTTON: string;
    MARK_READ_UNREAD_BUTTON: string;
};
declare const USER_TRACKER_EVENTS: {
    add_details: string;
    onboarding_complete: string;
};
declare const ONBOARDING_TRACKER_ELEMENTS: {
    PROFILE_SETUP_FORM: string;
};
declare const SIDEBAR_TRACKER_ELEMENTS: {
    USER_MENU_ITEM: string;
    CREATE_WORK_ITEM_BUTTON: string;
};

declare const SPREADSHEET_SELECT_GROUP = "spreadsheet-issues";

declare enum EDurationFilters {
    NONE = "none",
    TODAY = "today",
    THIS_WEEK = "this_week",
    THIS_MONTH = "this_month",
    THIS_YEAR = "this_year",
    CUSTOM = "custom"
}
declare const DURATION_FILTER_OPTIONS: {
    key: EDurationFilters;
    label: string;
}[];
declare const PROJECT_BACKGROUND_COLORS: string[];
declare const FILTERED_ISSUES_TABS_LIST: {
    key: TIssuesListTypes;
    label: string;
}[];
declare const UNFILTERED_ISSUES_TABS_LIST: {
    key: TIssuesListTypes;
    label: string;
}[];
type TLinkOptions = {
    userId: string | undefined;
};

declare enum EPageAccess {
    PUBLIC = 0,
    PRIVATE = 1
}
type TCreatePageModal = {
    isOpen: boolean;
    pageAccess?: EPageAccess;
};
declare const DEFAULT_CREATE_PAGE_MODAL_DATA: TCreatePageModal;

declare const ISSUE_REACTION_EMOJI_CODES: string[];
declare const RANDOM_EMOJI_CODES: string[];

declare const ENTERPRISE_PLAN_FEATURES: string[];
declare const BUSINESS_PLAN_FEATURES: string[];
declare const PRO_PLAN_FEATURES: string[];
declare const ONE_PLAN_FEATURES: string[];
declare const FREE_PLAN_UPGRADE_FEATURES: string[];

declare enum WORKSPACE_SETTINGS_CATEGORY {
    ADMINISTRATION = "administration",
    FEATURES = "features",
    DEVELOPER = "developer"
}
declare enum PROFILE_SETTINGS_CATEGORY {
    YOUR_PROFILE = "your profile",
    DEVELOPER = "developer"
}
declare enum PROJECT_SETTINGS_CATEGORY {
    PROJECTS = "projects"
}
declare const WORKSPACE_SETTINGS_CATEGORIES: WORKSPACE_SETTINGS_CATEGORY[];
declare const PROFILE_SETTINGS_CATEGORIES: PROFILE_SETTINGS_CATEGORY[];
declare const PROJECT_SETTINGS_CATEGORIES: PROJECT_SETTINGS_CATEGORY[];
declare const GROUPED_WORKSPACE_SETTINGS: {
    administration: {
        key: string;
        i18n_label: string;
        href: string;
        access: _plane_types.EUserWorkspaceRoles[];
        highlight: (pathname: string, baseUrl: string) => boolean;
    }[];
    features: never[];
    developer: {
        key: string;
        i18n_label: string;
        href: string;
        access: _plane_types.EUserWorkspaceRoles[];
        highlight: (pathname: string, baseUrl: string) => boolean;
    }[];
};
declare const GROUPED_PROFILE_SETTINGS: {
    "your profile": ({
        key: string;
        i18n_label: string;
        href: string;
        highlight: (pathname: string) => pathname is "/settings/account/";
    } | {
        key: string;
        i18n_label: string;
        href: string;
        highlight: (pathname: string) => pathname is "/settings/account/security/";
    } | {
        key: string;
        i18n_label: string;
        href: string;
        highlight: (pathname: string) => pathname is "/settings/account/activity/";
    } | {
        key: string;
        i18n_label: string;
        href: string;
        highlight: (pathname: string) => pathname is "/settings/account/preferences";
    } | {
        key: string;
        i18n_label: string;
        href: string;
        highlight: (pathname: string) => pathname is "/settings/account/notifications/";
    })[];
    developer: {
        key: string;
        i18n_label: string;
        href: string;
        highlight: (pathname: string) => pathname is "/settings/account/api-tokens/";
    }[];
};

declare enum EIconSize {
    XS = "xs",
    SM = "sm",
    MD = "md",
    LG = "lg",
    XL = "xl"
}

declare const MAX_ESTIMATE_POINT_INPUT_LENGTH = 20;
declare enum EEstimateSystem {
    POINTS = "points",
    CATEGORIES = "categories",
    TIME = "time"
}
declare enum EEstimateUpdateStages {
    CREATE = "create",
    EDIT = "edit",
    SWITCH = "switch"
}
declare const estimateCount: {
    min: number;
    max: number;
};
declare const ESTIMATE_SYSTEMS: TEstimateSystems;

interface IInsightField {
    key: string;
    i18nKey: string;
    i18nProps?: {
        entity?: string;
        entityPlural?: string;
        [key: string]: any;
    };
}
declare const ANALYTICS_INSIGHTS_FIELDS: Record<TAnalyticsTabsBase, IInsightField[]>;
declare const ANALYTICS_DURATION_FILTER_OPTIONS: {
    name: string;
    value: string;
}[];
declare const ANALYTICS_X_AXIS_VALUES: {
    value: ChartXAxisProperty;
    label: string;
}[];
declare const ANALYTICS_Y_AXIS_VALUES: {
    value: ChartYAxisMetric;
    label: string;
}[];
declare const ANALYTICS_V2_DATE_KEYS: string[];

declare const SIDEBAR_WIDTH = 250;
declare const EXTENDED_SIDEBAR_WIDTH = 300;

export { ACCEPTED_AVATAR_IMAGE_MIME_TYPES_FOR_REACT_DROPZONE, ACCEPTED_COVER_IMAGE_MIME_TYPES_FOR_REACT_DROPZONE, ACTIVITY_FILTER_TYPE_OPTIONS, ADMIN_BASE_PATH, ADMIN_BASE_URL, AI_EDITOR_TASKS, ALL_ISSUES, ANALYTICS_DURATION_FILTER_OPTIONS, ANALYTICS_INSIGHTS_FIELDS, ANALYTICS_V2_DATE_KEYS, ANALYTICS_X_AXIS_VALUES, ANALYTICS_Y_AXIS_VALUES, API_BASE_PATH, API_BASE_URL, API_URL, ARCHIVABLE_STATE_GROUPS, AUTH_TRACKER_ELEMENTS, AUTH_TRACKER_EVENTS, AXIS_LABEL_CLASSNAME, BUSINESS_PLAN_FEATURES, CHARTS_THEME, CHART_COLOR_PALETTES, CHART_DEFAULT_MARGIN, CHART_X_AXIS_DATE_PROPERTIES, COMMAND_PALETTE_TRACKER_ELEMENTS, COMPLETED_STATE_GROUPS, CREATE_LABEL_TAB_INDICES, CYCLE_STATUS, CYCLE_TRACKER_ELEMENTS, CYCLE_TRACKER_EVENTS, ChartXAxisDateGrouping, DATE_AFTER_FILTER_OPTIONS, DATE_BEFORE_FILTER_OPTIONS, DEFAULT_CREATE_PAGE_MODAL_DATA, DEFAULT_GLOBAL_VIEWS_LIST, DEFAULT_PRODUCT_BILLING_FREQUENCY, DEFAULT_PROJECT_FORM_VALUES, DEFAULT_SWR_CONFIG, DEFAULT_WORK_ITEM_FORM_VALUES, DISPLAY_WORKFLOW_PRO_CTA, DRAG_ALLOWED_GROUPS, DURATION_FILTER_OPTIONS, EActivityFilterType, EAdminAuthErrorCodes, EAuthErrorCodes, EAuthModes, EAuthPageTypes, EAuthSteps, EAuthenticationPageType, EChartModels, EDraftIssuePaginationType, EDurationFilters, EErrorAlertType, EEstimateSystem, EEstimateUpdateStages, EIconSize, EInstancePageType, EInstanceStatus, EIssueCommentAccessSpecifier, EIssueFilterType, EIssueGroupBYServerToProperty, EIssueGroupByToServerOptions, EIssueLayoutTypes, EIssueListRow, ENABLE_ISSUE_DEPENDENCIES, ENTERPRISE_PLAN_FEATURES, ENotificationFilterType, ENotificationLoader, ENotificationQueryParamType, ENotificationTab, EPageAccess, EPageTypes, EPastDurationFilters, EProjectFeatureKey, ESTIMATE_SYSTEMS, EServerGroupByToFilterOptions, ETabIndices, EUserPermissions, EUserPermissionsLevel, EUserStatus, EXPORTERS_LIST, EXTENDED_SIDEBAR_WIDTH, E_PASSWORD_STRENGTH, E_SORT_ORDER, FILTERED_ISSUES_TABS_LIST, FILTER_TO_ISSUE_MAP, FILTER_TYPE_OPTIONS, FREE_PLAN_UPGRADE_FEATURES, GITHUB_REDIRECTED_TRACKER_EVENT, GLOBAL_VIEW_TRACKER_ELEMENTS, GLOBAL_VIEW_TRACKER_EVENTS, GOD_MODE_URL, GROUPED_PROFILE_SETTINGS, GROUPED_WORKSPACE_SETTINGS, GROUP_CHOICES, GROUP_WORKSPACE_TRACKER_EVENT, HEADER_GITHUB_ICON, type IInsightField, IMPORTERS_LIST, INBOX_ISSUE_ORDER_BY_OPTIONS, INBOX_ISSUE_SORT_BY_OPTIONS, INBOX_STATUS, INTAKE_ISSUE_CREATE_FORM_TAB_INDICES, ISSUE_DISPLAY_FILTERS_BY_LAYOUT, ISSUE_DISPLAY_FILTERS_BY_PAGE, ISSUE_DISPLAY_PROPERTIES, ISSUE_DISPLAY_PROPERTIES_KEYS, ISSUE_FORM_TAB_INDICES, ISSUE_GROUP_BY_OPTIONS, ISSUE_LAYOUTS, ISSUE_LAYOUT_MAP, ISSUE_ORDER_BY_OPTIONS, ISSUE_PRIORITIES, ISSUE_PRIORITY_FILTERS, ISSUE_REACTION_EMOJI_CODES, ISSUE_STORE_TO_FILTERS_MAP, IS_FAVORITE_MENU_OPEN, type IWorkspaceSidebarNavigationItem, type I_THEME_OPTION, LABEL_CLASSNAME, LABEL_COLOR_OPTIONS, LIVE_BASE_PATH, LIVE_BASE_URL, LIVE_URL, MARKETING_CONTACT_US_PAGE_LINK, MARKETING_PLANE_ONE_PAGE_LINK, MARKETING_PRICING_PAGE_LINK, MAX_ESTIMATE_POINT_INPUT_LENGTH, MAX_FILE_SIZE, MEMBER_TRACKER_ELEMENTS, MEMBER_TRACKER_EVENTS, MODULE_ORDER_BY_OPTIONS, MODULE_STATUS, MODULE_STATUS_COLORS, MODULE_TRACKER_ELEMENTS, MODULE_TRACKER_EVENTS, MODULE_VIEW_LAYOUTS, NETWORK_CHOICES, NOTIFICATION_SNOOZE_OPTIONS, NOTIFICATION_TABS, NOTIFICATION_TRACKER_ELEMENTS, NOTIFICATION_TRACKER_EVENTS, ONBOARDING_TRACKER_ELEMENTS, ONE_PLAN_FEATURES, ORGANIZATION_SIZE, PASSWORD_MIN_LENGTH, PAST_DURATION_FILTER_OPTIONS, PENDING_STATE_GROUPS, PLANE_COMMUNITY_PRODUCTS, PREFERENCE_OPTIONS, PRODUCT_TOUR_TRACKER_ELEMENTS, PRODUCT_TOUR_TRACKER_EVENTS, PROFILE_ACTION_LINKS, PROFILE_ADMINS_TAB, PROFILE_SETTINGS, PROFILE_SETTINGS_CATEGORIES, PROFILE_SETTINGS_CATEGORY, PROFILE_VIEWER_TAB, PROGRESS_STATE_GROUPS_DETAILS, PROJECT_AUTOMATION_MONTHS, PROJECT_BACKGROUND_COLORS, PROJECT_CREATED_AT_FILTER_OPTIONS, PROJECT_CREATE_TAB_INDICES, PROJECT_CYCLE_TAB_INDICES, PROJECT_DISPLAY_FILTER_OPTIONS, PROJECT_ERROR_MESSAGES, PROJECT_MODULE_TAB_INDICES, PROJECT_ORDER_BY_OPTIONS, PROJECT_PAGE_TAB_INDICES, PROJECT_PAGE_TRACKER_ELEMENTS, PROJECT_PAGE_TRACKER_EVENTS, PROJECT_SETTINGS_CATEGORIES, PROJECT_SETTINGS_CATEGORY, PROJECT_TRACKER_ELEMENTS, PROJECT_TRACKER_EVENTS, PROJECT_UNSPLASH_COVERS, PROJECT_VIEW_TAB_INDICES, PRO_PLAN_FEATURES, RANDOM_EMOJI_CODES, RESTRICTED_URLS, ROLE, ROLE_DETAILS, SIDEBAR_TRACKER_ELEMENTS, SIDEBAR_WIDTH, SITES_ISSUE_LAYOUTS, SITES_URL, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_TITLE, SITE_URL, SPACE_BASE_PATH, SPACE_BASE_URL, SPACE_PASSWORD_CRITERIA, SPACE_SITE_DESCRIPTION, SPACE_SITE_KEYWORDS, SPACE_SITE_NAME, SPACE_SITE_TITLE, SPACE_SITE_URL, SPACE_TWITTER_USER_NAME, SPREADSHEET_PROPERTY_DETAILS, SPREADSHEET_PROPERTY_LIST, SPREADSHEET_SELECT_GROUP, START_OF_THE_WEEK_OPTIONS, STATE_DISTRIBUTION, STATE_GROUPS, STATE_TRACKER_ELEMENTS, STATE_TRACKER_EVENTS, STICKIES_PER_PAGE, SUBSCRIPTION_REDIRECTION_URLS, SUBSCRIPTION_WEBPAGE_URLS, SUBSCRIPTION_WITH_BILLING_FREQUENCY, SUB_ISSUES_DISPLAY_PROPERTIES_KEYS, SUPPORT_EMAIL, TAB_INDEX_MAP, TALK_TO_SALES_URL, type TActivityFilterOption, type TActivityFilters, type TAdminAuthErrorInfo, type TAuthErrorInfo, type TCreateModalStoreTypes, type TCreatePageModal, type TDraggableData, type TFiltersByLayout, THEMES, THEME_OPTIONS, type TInstanceStatus, type TIssueFilterKeys, type TIssueFilterPriorityObject, type TIssueFiltersToDisplayByPageType, type TIssueLayout, type TIssueLayoutMap, type TIssuePriorities, type TLinkOptions, type TNetworkChoice, type TNetworkChoiceIconKey, type TNotificationTab, TO_CAPITALIZE_PROPERTIES, type TUserAllowedPermissions, type TUserAllowedPermissionsObject, type TUserPermissions, type TUserPermissionsLevel, type TUserStatus, TWITTER_USER_NAME, UNFILTERED_ISSUES_TABS_LIST, USER_ALLOWED_PERMISSIONS, USER_ROLES, USER_TRACKER_EVENTS, VIEW_ACCESS_SPECIFIERS, VIEW_SORTING_KEY_OPTIONS, VIEW_SORT_BY_OPTIONS, WEBSITE_URL, WEB_BASE_PATH, WEB_BASE_URL, WEB_SWR_CONFIG, WEB_URL, WORKSPACE_DEFAULT_SEARCH_RESULT, WORKSPACE_SETTINGS, WORKSPACE_SETTINGS_ACCESS, WORKSPACE_SETTINGS_CATEGORIES, WORKSPACE_SETTINGS_CATEGORY, WORKSPACE_SETTINGS_LINKS, WORKSPACE_SIDEBAR_DYNAMIC_NAVIGATION_ITEMS, WORKSPACE_SIDEBAR_DYNAMIC_NAVIGATION_ITEMS_LINKS, WORKSPACE_SIDEBAR_STATIC_NAVIGATION_ITEMS, WORKSPACE_SIDEBAR_STATIC_NAVIGATION_ITEMS_LINKS, WORKSPACE_SIDEBAR_STATIC_PINNED_NAVIGATION_ITEMS_LINKS, WORKSPACE_TRACKER_ELEMENTS, WORKSPACE_TRACKER_EVENTS, WORK_ITEM_TRACKER_ELEMENTS, WORK_ITEM_TRACKER_EVENTS, allTimeIn30MinutesInterval12HoursFormat, defaultActivityFilters, estimateCount, filterActivityOnSelectedFilters, getRandomLabelColor };
