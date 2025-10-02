declare enum EUserPermissions {
    ADMIN = 20,
    MEMBER = 15,
    GUEST = 5
}
type TUserPermissions = EUserPermissions.ADMIN | EUserPermissions.MEMBER | EUserPermissions.GUEST;
declare enum EProjectNetwork {
    PRIVATE = 0,
    PUBLIC = 2
}
declare enum EPageAccess {
    PUBLIC = 0,
    PRIVATE = 1
}
declare enum EDurationFilters {
    NONE = "none",
    TODAY = "today",
    THIS_WEEK = "this_week",
    THIS_MONTH = "this_month",
    THIS_YEAR = "this_year",
    CUSTOM = "custom"
}
declare enum EIssueCommentAccessSpecifier {
    EXTERNAL = "EXTERNAL",
    INTERNAL = "INTERNAL"
}
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
declare enum ENotificationFilterType {
    CREATED = "created",
    ASSIGNED = "assigned",
    SUBSCRIBED = "subscribed"
}
declare enum EFileAssetType {
    COMMENT_DESCRIPTION = "COMMENT_DESCRIPTION",
    ISSUE_ATTACHMENT = "ISSUE_ATTACHMENT",
    ISSUE_DESCRIPTION = "ISSUE_DESCRIPTION",
    DRAFT_ISSUE_DESCRIPTION = "DRAFT_ISSUE_DESCRIPTION",
    PAGE_DESCRIPTION = "PAGE_DESCRIPTION",
    PROJECT_COVER = "PROJECT_COVER",
    USER_AVATAR = "USER_AVATAR",
    USER_COVER = "USER_COVER",
    WORKSPACE_LOGO = "WORKSPACE_LOGO",
    TEAM_SPACE_DESCRIPTION = "TEAM_SPACE_DESCRIPTION",
    INITIATIVE_DESCRIPTION = "INITIATIVE_DESCRIPTION",
    PROJECT_DESCRIPTION = "PROJECT_DESCRIPTION",
    TEAM_SPACE_COMMENT_DESCRIPTION = "TEAM_SPACE_COMMENT_DESCRIPTION"
}
type TEditorAssetType = EFileAssetType.COMMENT_DESCRIPTION | EFileAssetType.ISSUE_DESCRIPTION | EFileAssetType.DRAFT_ISSUE_DESCRIPTION | EFileAssetType.PAGE_DESCRIPTION | EFileAssetType.TEAM_SPACE_DESCRIPTION | EFileAssetType.INITIATIVE_DESCRIPTION | EFileAssetType.PROJECT_DESCRIPTION | EFileAssetType.TEAM_SPACE_COMMENT_DESCRIPTION;
declare enum EUpdateStatus {
    OFF_TRACK = "OFF-TRACK",
    ON_TRACK = "ON-TRACK",
    AT_RISK = "AT-RISK"
}

/**
 * @description The start of the week for the user
 * @enum {number}
 */
declare enum EStartOfTheWeek {
    SUNDAY = 0,
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6
}
type TLoginMediums = "email" | "magic-code" | "github" | "gitlab" | "google";
interface IUserLite {
    avatar_url: string;
    display_name: string;
    email?: string;
    first_name: string;
    id: string;
    is_bot: boolean;
    last_name: string;
    joining_date?: string;
}
interface IUser extends IUserLite {
    cover_image_asset?: string | null;
    cover_image?: string | null;
    cover_image_url: string | null;
    date_joined: string;
    email: string;
    is_active: boolean;
    is_email_verified: boolean;
    is_password_autoset: boolean;
    is_tour_completed: boolean;
    mobile_number: string | null;
    last_workspace_id: string;
    user_timezone: string;
    username: string;
    last_login_medium: TLoginMediums;
    theme: IUserTheme;
}
interface IUserAccount {
    provider_account_id: string;
    provider: string;
    created_at: Date;
    updated_at: Date;
}
type TUserProfile = {
    id: string | undefined;
    user: string | undefined;
    role: string | undefined;
    last_workspace_id: string | undefined;
    theme: {
        text: string | undefined;
        theme: string | undefined;
        palette: string | undefined;
        primary: string | undefined;
        background: string | undefined;
        darkPalette: boolean | undefined;
        sidebarText: string | undefined;
        sidebarBackground: string | undefined;
    };
    onboarding_step: TOnboardingSteps;
    is_onboarded: boolean;
    is_tour_completed: boolean;
    use_case: string | undefined;
    billing_address_country: string | undefined;
    billing_address: string | undefined;
    has_billing_address: boolean;
    language: string;
    created_at: Date | string;
    updated_at: Date | string;
    start_of_the_week: EStartOfTheWeek;
};
interface IInstanceAdminStatus {
    is_instance_admin: boolean;
}
interface IUserSettings {
    id: string | undefined;
    email: string | undefined;
    workspace: {
        last_workspace_id: string | undefined;
        last_workspace_slug: string | undefined;
        last_workspace_name: string | undefined;
        last_workspace_logo: string | undefined;
        fallback_workspace_id: string | undefined;
        fallback_workspace_slug: string | undefined;
        invites: number | undefined;
    };
}
interface IUserTheme {
    text: string | undefined;
    theme: string | undefined;
    palette: string | undefined;
    primary: string | undefined;
    background: string | undefined;
    darkPalette: boolean | undefined;
    sidebarText: string | undefined;
    sidebarBackground: string | undefined;
}
interface IUserMemberLite extends IUserLite {
    email?: string;
}
interface IUserActivity {
    created_date: string;
    activity_count: number;
}
interface IUserPriorityDistribution {
    priority: TIssuePriorities;
    priority_count: number;
}
interface IUserStateDistribution {
    state_group: TStateGroups;
    state_count: number;
}
interface IUserActivityResponse {
    count: number;
    extra_stats: null;
    next_cursor: string;
    next_page_results: boolean;
    prev_cursor: string;
    prev_page_results: boolean;
    results: IIssueActivity[];
    total_pages: number;
    total_results: number;
}
type UserAuth = {
    isMember: boolean;
    isOwner: boolean;
    isGuest: boolean;
};
type TOnboardingSteps = {
    profile_complete: boolean;
    workspace_create: boolean;
    workspace_invite: boolean;
    workspace_join: boolean;
};
interface IUserProfileData {
    assigned_issues: number;
    completed_issues: number;
    created_issues: number;
    pending_issues: number;
    priority_distribution: IUserPriorityDistribution[];
    state_distribution: IUserStateDistribution[];
    subscribed_issues: number;
}
interface IUserProfileProjectSegregation {
    project_data: {
        assigned_issues: number;
        completed_issues: number;
        created_issues: number;
        id: string;
        pending_issues: number;
    }[];
    user_data: Pick<IUser, "avatar_url" | "cover_image_url" | "display_name" | "first_name" | "last_name"> & {
        date_joined: Date;
        user_timezone: string;
    };
}
interface IUserProjectsRole {
    [projectId: string]: TUserPermissions;
}
interface IUserEmailNotificationSettings {
    property_change: boolean;
    state_change: boolean;
    comment: boolean;
    mention: boolean;
    issue_completed: boolean;
}
type TProfileViews = "assigned" | "created" | "subscribed";
type TPublicMember = {
    id: string;
    member: string;
    member__avatar: string;
    member__first_name: string;
    member__last_name: string;
    member__display_name: string;
    project: string;
    workspace: string;
};

type TPaginationInfo = {
    count: number;
    extra_stats: string | null;
    next_cursor: string;
    next_page_results: boolean;
    prev_cursor: string;
    prev_page_results: boolean;
    total_pages: number;
    per_page?: number;
    total_results: number;
};
type TLogoProps = {
    in_use: "emoji" | "icon";
    emoji?: {
        value?: string;
        url?: string;
    };
    icon?: {
        name?: string;
        color?: string;
        background_color?: string;
    };
};
type TNameDescriptionLoader = "submitting" | "submitted" | "saved";
type TFetchStatus = "partial" | "complete" | undefined;
type ICustomSearchSelectOption = {
    value: any;
    query: string;
    content: React.ReactNode;
    disabled?: boolean;
    tooltip?: string | React.ReactNode;
};

type TCycleTabOptions = "active" | "all";
type TCycleLayoutOptions = "list" | "board" | "gantt";
type TCycleDisplayFilters = {
    active_tab?: TCycleTabOptions;
    layout?: TCycleLayoutOptions;
};
type TCycleFilters = {
    end_date?: string[] | null;
    start_date?: string[] | null;
    status?: string[] | null;
};
type TCycleFiltersByState = {
    default: TCycleFilters;
    archived: TCycleFilters;
};
type TCycleStoredFilters = {
    display_filters?: TCycleDisplayFilters;
    filters?: TCycleFilters;
};

type TModuleOrderByOptions = "name" | "-name" | "progress" | "-progress" | "issues_length" | "-issues_length" | "target_date" | "-target_date" | "created_at" | "-created_at" | "sort_order";
type TModuleLayoutOptions = "list" | "board" | "gantt";
type TModuleDisplayFilters = {
    favorites?: boolean;
    layout?: TModuleLayoutOptions;
    order_by?: TModuleOrderByOptions;
};
type TModuleFilters = {
    lead?: string[] | null;
    members?: string[] | null;
    start_date?: string[] | null;
    status?: string[] | null;
    target_date?: string[] | null;
};
type TModuleFiltersByState = {
    default: TModuleFilters;
    archived: TModuleFilters;
};
type TModuleStoredFilters = {
    display_filters?: TModuleDisplayFilters;
    filters?: TModuleFilters;
};

type TIssueLayouts = "list" | "kanban" | "calendar" | "spreadsheet" | "gantt_chart";
type TIssueGroupByOptions = "state" | "priority" | "labels" | "created_by" | "state_detail.group" | "project" | "assignees" | "cycle" | "module" | "target_date" | "team_project" | null;
type TIssueOrderByOptions = "-created_at" | "created_at" | "updated_at" | "-updated_at" | "priority" | "-priority" | "sort_order" | "state__name" | "-state__name" | "assignees__first_name" | "-assignees__first_name" | "labels__name" | "-labels__name" | "issue_module__module__name" | "-issue_module__module__name" | "issue_cycle__cycle__name" | "-issue_cycle__cycle__name" | "target_date" | "-target_date" | "estimate_point__key" | "-estimate_point__key" | "start_date" | "-start_date" | "link_count" | "-link_count" | "attachment_count" | "-attachment_count" | "sub_issues_count" | "-sub_issues_count";
type TIssueGroupingFilters = "active" | "backlog" | null;
type TIssueExtraOptions = "show_empty_groups" | "sub_issue";
type TIssueParams = "priority" | "state_group" | "state" | "assignees" | "mentions" | "created_by" | "subscriber" | "labels" | "cycle" | "module" | "start_date" | "target_date" | "project" | "team_project" | "group_by" | "sub_group_by" | "order_by" | "type" | "sub_issue" | "show_empty_groups" | "cursor" | "per_page" | "issue_type" | "layout" | "expand";
type TCalendarLayouts = "month" | "week";
interface IIssueFilterOptions {
    assignees?: string[] | null;
    mentions?: string[] | null;
    created_by?: string[] | null;
    labels?: string[] | null;
    priority?: string[] | null;
    cycle?: string[] | null;
    module?: string[] | null;
    project?: string[] | null;
    team_project?: string[] | null;
    start_date?: string[] | null;
    state?: string[] | null;
    state_group?: string[] | null;
    subscriber?: string[] | null;
    target_date?: string[] | null;
    issue_type?: string[] | null;
}
interface IIssueDisplayFilterOptions {
    calendar?: {
        show_weekends?: boolean;
        layout?: TCalendarLayouts;
    };
    group_by?: TIssueGroupByOptions;
    sub_group_by?: TIssueGroupByOptions;
    layout?: any;
    order_by?: TIssueOrderByOptions;
    show_empty_groups?: boolean;
    sub_issue?: boolean;
    type?: TIssueGroupingFilters;
}
interface IIssueDisplayProperties {
    assignee?: boolean;
    start_date?: boolean;
    due_date?: boolean;
    labels?: boolean;
    key?: boolean;
    priority?: boolean;
    state?: boolean;
    sub_issue_count?: boolean;
    link?: boolean;
    attachment_count?: boolean;
    estimate?: boolean;
    created_on?: boolean;
    updated_on?: boolean;
    modules?: boolean;
    cycle?: boolean;
    issue_type?: boolean;
}
type TIssueKanbanFilters = {
    group_by: string[];
    sub_group_by: string[];
};
interface IIssueFilters {
    filters: IIssueFilterOptions | undefined;
    displayFilters: IIssueDisplayFilterOptions | undefined;
    displayProperties: IIssueDisplayProperties | undefined;
    kanbanFilters: TIssueKanbanFilters | undefined;
}
interface IIssueFiltersResponse {
    filters: IIssueFilterOptions;
    display_filters: IIssueDisplayFilterOptions;
    display_properties: IIssueDisplayProperties;
}
interface IWorkspaceIssueFilterOptions {
    assignees?: string[] | null;
    created_by?: string[] | null;
    labels?: string[] | null;
    priority?: string[] | null;
    state_group?: string[] | null;
    subscriber?: string[] | null;
    start_date?: string[] | null;
    target_date?: string[] | null;
    project?: string[] | null;
}
interface IWorkspaceViewIssuesParams {
    assignees?: string | undefined;
    created_by?: string | undefined;
    labels?: string | undefined;
    priority?: string | undefined;
    start_date?: string | undefined;
    state?: string | undefined;
    state_group?: string | undefined;
    subscriber?: string | undefined;
    target_date?: string | undefined;
    project?: string | undefined;
    order_by?: string | undefined;
    type?: "active" | "backlog" | undefined;
    sub_issue?: boolean;
}
interface IProjectViewProps {
    display_filters: IIssueDisplayFilterOptions | undefined;
    filters: IIssueFilterOptions;
}
interface IWorkspaceViewProps {
    filters: IIssueFilterOptions;
    display_filters: IIssueDisplayFilterOptions | undefined;
    display_properties: IIssueDisplayProperties;
}
interface IssuePaginationOptions {
    canGroup: boolean;
    perPageCount: number;
    before?: string;
    after?: string;
    groupedBy?: TIssueGroupByOptions;
    subGroupedBy?: TIssueGroupByOptions;
    orderBy?: TIssueOrderByOptions;
}
type TSpreadsheetColumn = React.FC<{
    issue: TIssue;
    onClose: () => void;
    onChange: (issue: TIssue, data: Partial<TIssue>, updates: any) => void;
    disabled: boolean;
}>;

type TModuleStatus = "backlog" | "planned" | "in-progress" | "paused" | "completed" | "cancelled";
type TModuleCompletionChartDistribution = {
    [key: string]: number | null;
};
type TModuleDistributionBase = {
    total_issues: number;
    pending_issues: number;
    completed_issues: number;
};
type TModuleEstimateDistributionBase = {
    total_estimates: number;
    pending_estimates: number;
    completed_estimates: number;
};
type TModuleAssigneesDistribution = {
    assignee_id: string | null;
    avatar_url: string | null;
    first_name: string | null;
    last_name: string | null;
    display_name: string | null;
};
type TModuleLabelsDistribution = {
    color: string | null;
    label_id: string | null;
    label_name: string | null;
};
type TModuleDistribution = {
    assignees: (TModuleAssigneesDistribution & TModuleDistributionBase)[];
    completion_chart: TModuleCompletionChartDistribution;
    labels: (TModuleLabelsDistribution & TModuleDistributionBase)[];
};
type TModuleEstimateDistribution = {
    assignees: (TModuleAssigneesDistribution & TModuleEstimateDistributionBase)[];
    completion_chart: TModuleCompletionChartDistribution;
    labels: (TModuleLabelsDistribution & TModuleEstimateDistributionBase)[];
};
interface IModule {
    total_issues: number;
    completed_issues: number;
    backlog_issues: number;
    started_issues: number;
    unstarted_issues: number;
    cancelled_issues: number;
    total_estimate_points?: number;
    completed_estimate_points?: number;
    backlog_estimate_points: number;
    started_estimate_points: number;
    unstarted_estimate_points: number;
    cancelled_estimate_points: number;
    distribution?: TModuleDistribution;
    estimate_distribution?: TModuleEstimateDistribution;
    id: string;
    name: string;
    description: string;
    description_text: any;
    description_html: any;
    workspace_id: string;
    project_id: string;
    lead_id: string | null;
    member_ids: string[];
    link_module?: ILinkDetails[];
    sub_issues?: number;
    is_favorite: boolean;
    sort_order: number;
    view_props: {
        filters: IIssueFilterOptions;
    };
    status?: TModuleStatus;
    archived_at: string | null;
    start_date: string | null;
    target_date: string | null;
    created_at: string;
    updated_at: string;
    created_by?: string;
    updated_by?: string;
}
interface ModuleIssueResponse {
    created_at: Date;
    created_by: string;
    id: string;
    issue: string;
    issue_detail: TIssue;
    module: string;
    module_detail: IModule;
    project: string;
    updated_at: Date;
    updated_by: string;
    workspace: string;
    sub_issues_count: number;
}
type ModuleLink = {
    title: string;
    url: string;
};
type SelectModuleType = (IModule & {
    actionType: "edit" | "delete" | "create-issue";
}) | undefined;
type TModulePlotType = "burndown" | "points";
type TPublicModule = {
    id: string;
    name: string;
};

type TProjectOrderByOptions = "sort_order" | "name" | "-name" | "created_at" | "-created_at" | "members_length" | "-members_length";
type TProjectDisplayFilters = {
    my_projects?: boolean;
    archived_projects?: boolean;
    order_by?: TProjectOrderByOptions;
};
type TProjectAppliedDisplayFilterKeys = "my_projects" | "archived_projects";
type TProjectFilters = {
    access?: string[] | null;
    lead?: string[] | null;
    members?: string[] | null;
    created_at?: string[] | null;
};
type TProjectStoredFilters = {
    display_filters?: TProjectDisplayFilters;
    filters?: TProjectFilters;
};

type TStateGroups = "backlog" | "unstarted" | "started" | "completed" | "cancelled";
interface IState {
    readonly id: string;
    color: string;
    default: boolean;
    description: string;
    group: TStateGroups;
    name: string;
    project_id: string;
    sequence: number;
    workspace_id: string;
    order: number;
}
interface IStateLite {
    color: string;
    group: TStateGroups;
    id: string;
    name: string;
}
interface IStateResponse {
    [key: string]: IState[];
}
type TStateOperationsCallbacks = {
    createState: (data: Partial<IState>) => Promise<IState>;
    updateState: (stateId: string, data: Partial<IState>) => Promise<IState | undefined>;
    deleteState: (stateId: string) => Promise<void>;
    moveStatePosition: (stateId: string, data: Partial<IState>) => Promise<void>;
    markStateAsDefault: (stateId: string) => Promise<void>;
};

declare enum EUserProjectRoles {
    ADMIN = 20,
    MEMBER = 15,
    GUEST = 5
}
interface IPartialProject {
    id: string;
    name: string;
    identifier: string;
    sort_order: number | null;
    logo_props: TLogoProps;
    member_role?: TUserPermissions | EUserProjectRoles | null;
    archived_at: string | null;
    workspace: IWorkspace | string;
    cycle_view: boolean;
    issue_views_view: boolean;
    module_view: boolean;
    page_view: boolean;
    inbox_view: boolean;
    guest_view_all_features?: boolean;
    project_lead?: IUserLite | string | null;
    network?: number;
    created_at?: Date;
    updated_at?: Date;
    created_by?: string;
    updated_by?: string;
}
interface IProject extends IPartialProject {
    archive_in?: number;
    close_in?: number;
    cover_image_asset?: null;
    cover_image?: string;
    readonly cover_image_url?: string;
    default_assignee?: IUser | string | null;
    default_state?: string | null;
    description?: string;
    estimate?: string | null;
    anchor?: string | null;
    is_favorite?: boolean;
    members?: string[];
    timezone?: string;
}
type TProjectAnalyticsCountParams = {
    project_ids?: string;
    fields?: string;
};
type TProjectAnalyticsCount = Pick<IProject, "id"> & {
    total_issues?: number;
    completed_issues?: number;
    total_cycles?: number;
    total_members?: number;
    total_modules?: number;
};
interface IProjectLite {
    id: string;
    name: string;
    identifier: string;
    logo_props: TLogoProps;
}
type ProjectPreferences = {
    pages: {
        block_display: boolean;
    };
};
interface IProjectMap {
    [id: string]: IProject;
}
interface IProjectMemberLite {
    id: string;
    member__avatar_url: string;
    member__display_name: string;
    member_id: string;
}
type TProjectMembership = {
    member: string;
    role: TUserPermissions | EUserProjectRoles;
} & ({
    id: string;
    original_role: EUserProjectRoles;
    created_at: string;
} | {
    id: null;
    original_role: null;
    created_at: null;
});
interface IProjectBulkAddFormData {
    members: {
        role: TUserPermissions | EUserProjectRoles;
        member_id: string;
    }[];
}
interface IGithubRepository {
    id: string;
    full_name: string;
    html_url: string;
    url: string;
}
interface GithubRepositoriesResponse {
    repositories: IGithubRepository[];
    total_count: number;
}
type TProjectIssuesSearchParams = {
    search: string;
    parent?: boolean;
    issue_relation?: boolean;
    cycle?: boolean;
    module?: string;
    sub_issue?: boolean;
    issue_id?: string;
    workspace_search: boolean;
    target_date?: string;
    epic?: boolean;
};
interface ISearchIssueResponse {
    id: string;
    name: string;
    project_id: string;
    project__identifier: string;
    project__name: string;
    sequence_id: number;
    start_date: string | null;
    state__color: string;
    state__group: TStateGroups;
    state__name: string;
    workspace__slug: string;
    type_id: string;
}
type TPartialProject = IPartialProject;
type TProject = TPartialProject & IProject;

type TProjectLinkEditableFields = {
    title: string;
    url: string;
};
type TProjectLink = TProjectLinkEditableFields & {
    created_by_id: string;
    id: string;
    metadata: any;
    project_id: string;
    created_at: Date;
};
type TProjectLinkMap = {
    [project_id: string]: TProjectLink;
};
type TProjectLinkIdMap = {
    [project_id: string]: string[];
};

interface IIssueCycle {
    id: string;
    cycle_detail: ICycle;
    created_at: Date;
    updated_at: Date;
    created_by: string;
    updated_by: string;
    project: string;
    workspace: string;
    issue: string;
    cycle: string;
}
interface IIssueModule {
    created_at: Date;
    created_by: string;
    id: string;
    issue: string;
    module: string;
    module_detail: IModule;
    project: string;
    updated_at: Date;
    updated_by: string;
    workspace: string;
}
interface IIssueParent {
    description: any;
    id: string;
    name: string;
    priority: string | null;
    project_detail: IProjectLite;
    sequence_id: number;
    start_date: string | null;
    state_detail: IStateLite;
    target_date: string | null;
}
interface IIssueLink {
    title: string;
    url: string;
}
interface ILinkDetails {
    created_at: Date;
    created_by: string;
    id: string;
    metadata: any;
    title: string;
    url: string;
}
interface ISubIssuesState {
    backlog: number;
    unstarted: number;
    started: number;
    completed: number;
    cancelled: number;
}
interface ISubIssueResponse {
    state_distribution: ISubIssuesState;
    sub_issues: TIssue[];
}
interface BlockeIssueDetail {
    id: string;
    name: string;
    sequence_id: number;
    project_detail: IProjectLite;
}
type IssuePriorities = {
    id: string;
    created_at: Date;
    updated_at: Date;
    uuid: string;
    properties: Properties;
    created_by: number;
    updated_by: number;
    user: string;
};
interface IIssueLabel {
    id: string;
    name: string;
    color: string;
    project_id: string;
    workspace_id: string;
    parent: string | null;
    sort_order: number;
}
interface IIssueLabelTree extends IIssueLabel {
    children: IIssueLabel[] | undefined;
}
interface IIssueActivity {
    access?: "EXTERNAL" | "INTERNAL";
    actor: string;
    actor_detail: IUserLite;
    attachments: any[];
    comment?: string;
    comment_html?: string;
    comment_stripped?: string;
    created_at: Date;
    created_by: string;
    field: string | null;
    id: string;
    issue: string | null;
    issue_comment?: string | null;
    issue_detail: {
        description_html: string;
        id: string;
        name: string;
        priority: string | null;
        sequence_id: string;
        type_id: string;
    } | null;
    new_identifier: string | null;
    new_value: string | null;
    old_identifier: string | null;
    old_value: string | null;
    project: string;
    project_detail: IProjectLite;
    updated_at: Date;
    updated_by: string;
    verb: string;
    workspace: string;
    workspace_detail?: IWorkspaceLite;
}
interface IIssueLite {
    id: string;
    name: string;
    project_id: string;
    start_date?: string | null;
    target_date?: string | null;
    workspace__slug: string;
}
interface IIssueAttachment {
    asset: string;
    attributes: {
        name: string;
        size: number;
    };
    created_at: string;
    created_by: string;
    id: string;
    issue: string;
    project: string;
    updated_at: string;
    updated_by: string;
    workspace: string;
}
type TIssuePriorities = "urgent" | "high" | "medium" | "low" | "none";
interface ViewFlags {
    enableQuickAdd: boolean;
    enableIssueCreation: boolean;
    enableInlineEditing: boolean;
}
type GroupByColumnTypes = "project" | "cycle" | "module" | "state" | "state_detail.group" | "priority" | "labels" | "assignees" | "created_by" | "team_project";
type TGetColumns = {
    isWorkspaceLevel?: boolean;
    projectId?: string;
};
interface IGroupByColumn {
    id: string;
    name: string;
    icon?: React.ReactElement | undefined;
    payload: Partial<TIssue>;
    isDropDisabled?: boolean;
    dropErrorMessage?: string;
}
interface IIssueMap {
    [key: string]: TIssue;
}
interface IIssueListRow {
    id: string;
    groupId: string;
    type: "HEADER" | "NO_ISSUES" | "QUICK_ADD" | "ISSUE";
    name?: string;
    icon?: React.ReactElement | undefined;
    payload?: Partial<TIssue>;
}
interface ILayoutDisplayFiltersOptions {
    filters: (keyof IIssueFilterOptions)[];
    display_properties: (keyof IIssueDisplayProperties)[];
    display_filters: {
        group_by?: TIssueGroupByOptions[];
        sub_group_by?: TIssueGroupByOptions[];
        order_by?: TIssueOrderByOptions[];
        type?: TIssueGroupingFilters[];
    };
    extra_options: {
        access: boolean;
        values: TIssueExtraOptions[];
    };
}

type TFileMetaDataLite = {
    name: string;
    size: number;
    type: string;
};
type TFileEntityInfo = {
    entity_identifier: string;
    entity_type: EFileAssetType;
};
type TFileMetaData = TFileMetaDataLite & TFileEntityInfo;
type TFileSignedURLResponse = {
    asset_id: string;
    asset_url: string;
    upload_data: {
        url: string;
        fields: {
            "Content-Type": string;
            key: string;
            "x-amz-algorithm": string;
            "x-amz-credential": string;
            "x-amz-date": string;
            policy: string;
            "x-amz-signature": string;
        };
    };
};
type TDuplicateAssetData = {
    entity_id: string;
    entity_type: EFileAssetType;
    project_id?: string;
    asset_ids: string[];
};
type TDuplicateAssetResponse = Record<string, string>;

type TIssueAttachment = {
    id: string;
    attributes: {
        name: string;
        size: number;
    };
    asset_url: string;
    issue_id: string;
    updated_at: string;
    updated_by: string;
    created_by: string;
};
type TIssueAttachmentUploadResponse = TFileSignedURLResponse & {
    attachment: TIssueAttachment;
};
type TIssueAttachmentMap = {
    [issue_id: string]: TIssueAttachment;
};
type TIssueAttachmentIdMap = {
    [issue_id: string]: string[];
};

type TIssueLinkEditableFields = {
    title: string;
    url: string;
};
type TIssueLink = TIssueLinkEditableFields & {
    created_by_id: string;
    id: string;
    metadata: any;
    issue_id: string;
    created_at: Date;
};
type TIssueLinkMap = {
    [issue_id: string]: TIssueLink;
};
type TIssueLinkIdMap = {
    [issue_id: string]: string[];
};

type TIssueReaction = {
    actor: string;
    id: string;
    issue: string;
    reaction: string;
};
interface IIssuePublicReaction {
    actor_details: IUserLite;
    reaction: string;
}
type TIssueReactionMap = {
    [reaction_id: string]: TIssueReaction;
};
type TIssueReactionIdMap = {
    [issue_id: string]: {
        [reaction: string]: string[];
    };
};
interface IPublicVote {
    vote: -1 | 1;
    actor_details: IUserLite;
}

type TIssueRelation = Record<TIssueRelationTypes, TIssue[]>;
type TIssueRelationMap = {
    [issue_id: string]: Record<TIssueRelationTypes, string[]>;
};
type TIssueRelationIdMap = Record<TIssueRelationTypes, string[]>;
type TIssueRelationTypes = "blocking" | "blocked_by" | "duplicate" | "relates_to";

declare enum EInboxIssueCurrentTab {
    OPEN = "open",
    CLOSED = "closed"
}
type TInboxIssueCurrentTab = EInboxIssueCurrentTab;
declare enum EInboxIssueStatus {
    PENDING = -2,
    DECLINED = -1,
    SNOOZED = 0,
    ACCEPTED = 1,
    DUPLICATE = 2
}
declare enum EInboxIssueSource {
    IN_APP = "IN_APP",
    FORMS = "FORMS",
    EMAIL = "EMAIL"
}
type TInboxIssueStatus = EInboxIssueStatus;
type TInboxIssue = {
    id: string;
    status: TInboxIssueStatus;
    snoozed_till: Date | null;
    duplicate_to: string | undefined;
    source: EInboxIssueSource | undefined;
    issue: TIssue;
    created_by: string;
    duplicate_issue_detail: TInboxDuplicateIssueDetails | undefined;
};
type TInboxIssueFilterMemberKeys = "assignees" | "created_by";
type TInboxIssueFilterDateKeys = "created_at" | "updated_at";
type TInboxIssueFilter = {
    [key in TInboxIssueFilterMemberKeys]: string[] | undefined;
} & {
    [key in TInboxIssueFilterDateKeys]: string[] | undefined;
} & {
    state: string[] | undefined;
    status: TInboxIssueStatus[] | undefined;
    priority: TIssuePriorities[] | undefined;
    labels: string[] | undefined;
};
type TInboxIssueSortingKeys = "order_by" | "sort_by";
type TInboxIssueSortingOrderByKeys = "issue__created_at" | "issue__updated_at" | "issue__sequence_id";
type TInboxIssueSortingSortByKeys = "asc" | "desc";
type TInboxIssueSorting = {
    order_by: TInboxIssueSortingOrderByKeys | undefined;
    sort_by: TInboxIssueSortingSortByKeys | undefined;
};
type TInboxIssueSortingOrderByQueryParamKeys = "issue__created_at" | "-issue__created_at" | "issue__updated_at" | "-issue__updated_at" | "issue__sequence_id" | "-issue__sequence_id";
type TInboxIssueSortingOrderByQueryParam = {
    order_by: TInboxIssueSortingOrderByQueryParamKeys;
};
type TInboxIssuesQueryParams = {
    [key in keyof TInboxIssueFilter]: string;
} & TInboxIssueSortingOrderByQueryParam & {
    per_page: number;
    cursor: string;
};
type TInboxDuplicateIssueDetails = {
    id: string;
    sequence_id: string;
    name: string;
};
type TInboxIssuePaginationInfo = TPaginationInfo & {
    total_results: number;
};
type TInboxIssueWithPagination = TInboxIssuePaginationInfo & {
    results: TInboxIssue[];
};
type TAnchors = {
    [key: string]: string;
};
type TInboxForm = {
    anchors: TAnchors;
    id: string;
    is_in_app_enabled: boolean;
    is_form_enabled: boolean;
};
type TInboxIssueForm = {
    name: string;
    description: string;
    username: string;
    email: string;
};

type TIssueActivity = {
    id: string;
    workspace: string;
    workspace_detail: TIssueActivityWorkspaceDetail;
    project: string;
    project_detail: TIssueActivityProjectDetail;
    issue: string;
    issue_detail: TIssueActivityIssueDetail;
    actor: string;
    actor_detail: TIssueActivityUserDetail;
    created_at: string;
    updated_at: string;
    created_by: string | undefined;
    updated_by: string | undefined;
    attachments: any[];
    verb: string;
    field: string | undefined;
    old_value: string | undefined;
    new_value: string | undefined;
    comment: string | undefined;
    old_identifier: string | undefined;
    new_identifier: string | undefined;
    epoch: number;
    issue_comment: string | null;
    source_data: {
        source: EInboxIssueSource;
        source_email?: string;
        extra: {
            username?: string;
        };
    };
};
type TIssueActivityMap = {
    [issue_id: string]: TIssueActivity;
};
type TIssueActivityIdMap = {
    [issue_id: string]: string[];
};

type TIssueCommentReaction = {
    id: string;
    comment: string;
    actor: string;
    reaction: string;
    workspace: string;
    project: string;
    created_at: Date;
    updated_at: Date;
    created_by: string;
    updated_by: string;
};
type TIssueCommentReactionMap = {
    [reaction_id: string]: TIssueCommentReaction;
};
type TIssueCommentReactionIdMap = {
    [comment_id: string]: {
        [reaction: string]: string[];
    };
};

type TIssueActivityWorkspaceDetail = {
    name: string;
    slug: string;
    id: string;
};
type TIssueActivityProjectDetail = {
    id: string;
    identifier: string;
    name: string;
    cover_image: string;
    description: string | null;
    emoji: string | null;
    icon_prop: {
        name: string;
        color: string;
    } | null;
};
type TIssueActivityIssueDetail = {
    id: string;
    sequence_id: number;
    sort_order: boolean;
    name: string;
    description_html: string;
    priority: TIssuePriorities;
    start_date: string;
    target_date: string;
    is_draft: boolean;
};
type TIssueActivityUserDetail = {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
    is_bot: boolean;
    display_name: string;
};
type TIssueActivityComment = {
    id: string;
    activity_type: "COMMENT";
    created_at?: string;
} | {
    id: string;
    activity_type: "ACTIVITY";
    created_at?: string;
} | {
    id: string;
    activity_type: "WORKLOG";
    created_at?: string;
} | {
    id: string;
    activity_type: "ISSUE_ADDITIONAL_PROPERTIES_ACTIVITY";
    created_at?: string;
};

type TCommentReaction = {
    id: string;
    reaction: string;
    actor: string;
    actor_detail: IUserLite;
};
type TIssueComment = {
    id: string;
    workspace: string;
    workspace_detail: TIssueActivityWorkspaceDetail;
    project: string;
    project_detail: TIssueActivityProjectDetail;
    issue: string;
    issue_detail: TIssueActivityIssueDetail;
    actor: string;
    actor_detail: TIssueActivityUserDetail;
    created_at: string;
    edited_at?: string | undefined;
    updated_at: string;
    created_by: string | undefined;
    updated_by: string | undefined;
    attachments: any[];
    comment_reactions: any[];
    comment_stripped: string;
    comment_html: string;
    comment_json: object;
    external_id: string | undefined;
    external_source: string | undefined;
    access: EIssueCommentAccessSpecifier;
};
type TCommentsOperations = {
    createComment: (data: Partial<TIssueComment>) => Promise<Partial<TIssueComment> | undefined>;
    updateComment: (commentId: string, data: Partial<TIssueComment>) => Promise<void>;
    removeComment: (commentId: string) => Promise<void>;
    uploadCommentAsset: (blockId: string, file: File, commentId?: string) => Promise<TFileSignedURLResponse>;
    addCommentReaction: (commentId: string, reactionEmoji: string) => Promise<void>;
    deleteCommentReaction: (commentId: string, reactionEmoji: string, userReactions: TCommentReaction[]) => Promise<void>;
    react: (commentId: string, reactionEmoji: string, userReactions: string[]) => Promise<void>;
    reactionIds: (commentId: string) => {
        [reaction: string]: string[];
    } | undefined;
    userReactions: (commentId: string) => string[] | undefined;
    getReactionUsers: (reaction: string, reactionIds: Record<string, string[]>) => string;
};
type TIssueCommentMap = {
    [issue_id: string]: TIssueComment;
};
type TIssueCommentIdMap = {
    [issue_id: string]: string[];
};
interface ActorDetail {
    avatar_url?: string;
    display_name?: string;
    first_name?: string;
    is_bot?: boolean;
    id?: string;
    last_name?: string;
}
interface IssueDetail {
    id: string;
    name: string;
    description: Description;
    description_html: string;
    priority: string;
    start_date: null;
    target_date: null;
    sequence_id: number;
    sort_order: number;
}
interface Description {
    type: string;
    content: DescriptionContent[];
}
interface DescriptionContent {
    type: string;
    attrs?: Attrs;
    content: ContentContent[];
}
interface Attrs {
    level: number;
}
interface ContentContent {
    text: string;
    type: string;
}
interface ProjectDetail {
    id: string;
    identifier: string;
    name: string;
    cover_image: string;
    icon_prop: null;
    emoji: string;
    description: string;
}
type TIssuePublicComment = {
    actor_detail: ActorDetail;
    access: string;
    actor: string;
    attachments: any[];
    comment_html: string;
    comment_reactions: {
        actor_detail: ActorDetail;
        comment: string;
        id: string;
        reaction: string;
    }[];
    comment_stripped: string;
    created_at: Date;
    created_by: string;
    id: string;
    is_member: boolean;
    issue: string;
    issue_detail: IssueDetail;
    project: string;
    project_detail: ProjectDetail;
    updated_at: Date;
    updated_by: string;
    workspace: string;
    workspace_detail: IWorkspaceLite;
};

declare enum EIssueServiceType {
    ISSUES = "issues",
    EPICS = "epics",
    WORK_ITEMS = "work-items"
}
declare enum EIssuesStoreType {
    GLOBAL = "GLOBAL",
    PROFILE = "PROFILE",
    TEAM = "TEAM",
    PROJECT = "PROJECT",
    CYCLE = "CYCLE",
    MODULE = "MODULE",
    TEAM_VIEW = "TEAM_VIEW",
    PROJECT_VIEW = "PROJECT_VIEW",
    ARCHIVED = "ARCHIVED",
    DRAFT = "DRAFT",
    DEFAULT = "DEFAULT",
    WORKSPACE_DRAFT = "WORKSPACE_DRAFT",
    EPIC = "EPIC"
}
type TBaseIssue = {
    id: string;
    sequence_id: number;
    name: string;
    sort_order: number;
    state_id: string | null;
    priority: TIssuePriorities | null;
    label_ids: string[];
    assignee_ids: string[];
    estimate_point: string | null;
    sub_issues_count: number;
    attachment_count: number;
    link_count: number;
    project_id: string | null;
    parent_id: string | null;
    cycle_id: string | null;
    module_ids: string[] | null;
    type_id: string | null;
    created_at: string;
    updated_at: string;
    start_date: string | null;
    target_date: string | null;
    completed_at: string | null;
    archived_at: string | null;
    created_by: string;
    updated_by: string;
    is_draft: boolean;
    is_epic?: boolean;
};
type IssueRelation = {
    id: string;
    name: string;
    project_id: string;
    relation_type: TIssueRelationTypes;
    sequence_id: number;
};
type TIssue = TBaseIssue & {
    description_html?: string;
    is_subscribed?: boolean;
    parent?: Partial<TBaseIssue>;
    issue_reactions?: TIssueReaction[];
    issue_attachments?: TIssueAttachment[];
    issue_link?: TIssueLink[];
    issue_relation?: IssueRelation[];
    issue_related?: IssueRelation[];
    tempId?: string;
    sourceIssueId?: string;
    state__group?: string | null;
};
type TIssueMap = {
    [issue_id: string]: TIssue;
};
type TIssueResponseResults = TBaseIssue[] | {
    [key: string]: {
        results: TBaseIssue[] | {
            [key: string]: {
                results: TBaseIssue[];
                total_results: number;
            };
        };
        total_results: number;
    };
};
type TIssuesResponse = {
    grouped_by: string;
    next_cursor: string;
    prev_cursor: string;
    next_page_results: boolean;
    prev_page_results: boolean;
    total_count: number;
    count: number;
    total_pages: number;
    extra_stats: null;
    results: TIssueResponseResults;
    total_results: number;
};
type TBulkIssueProperties = Pick<TIssue, "state_id" | "priority" | "label_ids" | "assignee_ids" | "start_date" | "target_date" | "module_ids" | "cycle_id" | "estimate_point">;
type TBulkOperationsPayload = {
    issue_ids: string[];
    properties: Partial<TBulkIssueProperties>;
};
type TWorkItemWidgets = "sub-work-items" | "relations" | "links" | "attachments";
type TIssueServiceType = EIssueServiceType.ISSUES | EIssueServiceType.EPICS | EIssueServiceType.WORK_ITEMS;
interface IPublicIssue extends Pick<TIssue, "description_html" | "created_at" | "updated_at" | "created_by" | "id" | "name" | "priority" | "state_id" | "project_id" | "sequence_id" | "sort_order" | "start_date" | "target_date" | "cycle_id" | "module_ids" | "label_ids" | "assignee_ids" | "attachment_count" | "sub_issues_count" | "link_count" | "estimate_point"> {
    comments: TIssuePublicComment[];
    reaction_items: IIssuePublicReaction[];
    vote_items: IPublicVote[];
}
type TPublicIssueResponseResults = IPublicIssue[] | {
    [key: string]: {
        results: IPublicIssue[] | {
            [key: string]: {
                results: IPublicIssue[];
                total_results: number;
            };
        };
        total_results: number;
    };
};
type TPublicIssuesResponse = {
    grouped_by: string;
    next_cursor: string;
    prev_cursor: string;
    next_page_results: boolean;
    prev_page_results: boolean;
    total_count: number;
    count: number;
    total_pages: number;
    extra_stats: null;
    results: TPublicIssueResponseResults;
};
interface IWorkItemPeekOverview {
    embedIssue?: boolean;
    embedRemoveCurrentNotification?: () => void;
    is_draft?: boolean;
    storeType?: EIssuesStoreType;
}

type TCycleGroups = "current" | "upcoming" | "completed" | "draft";
type TCycleCompletionChartDistribution = {
    [key: string]: number | null;
};
type TCycleDistributionBase = {
    total_issues: number;
    pending_issues: number;
    completed_issues: number;
};
type TCycleEstimateDistributionBase = {
    total_estimates: number;
    pending_estimates: number;
    completed_estimates: number;
};
type TCycleAssigneesDistribution = {
    assignee_id: string | null;
    avatar_url: string | null;
    first_name: string | null;
    last_name: string | null;
    display_name: string | null;
};
type TCycleLabelsDistribution = {
    color: string | null;
    label_id: string | null;
    label_name: string | null;
};
type TCycleDistribution = {
    assignees: (TCycleAssigneesDistribution & TCycleDistributionBase)[];
    completion_chart: TCycleCompletionChartDistribution;
    labels: (TCycleLabelsDistribution & TCycleDistributionBase)[];
};
type TCycleEstimateDistribution = {
    assignees: (TCycleAssigneesDistribution & TCycleEstimateDistributionBase)[];
    completion_chart: TCycleCompletionChartDistribution;
    labels: (TCycleLabelsDistribution & TCycleEstimateDistributionBase)[];
};
type TCycleProgress = {
    date: string;
    started: number;
    actual: number;
    pending: number;
    ideal: number | null;
    scope: number;
    completed: number;
    unstarted: number;
    backlog: number;
    cancelled: number;
};
type TProgressSnapshot = {
    total_issues: number;
    completed_issues: number;
    backlog_issues: number;
    started_issues: number;
    unstarted_issues: number;
    cancelled_issues: number;
    total_estimate_points?: number;
    completed_estimate_points?: number;
    backlog_estimate_points: number;
    started_estimate_points: number;
    unstarted_estimate_points: number;
    cancelled_estimate_points: number;
    distribution?: TCycleDistribution;
    estimate_distribution?: TCycleEstimateDistribution;
};
interface IProjectDetails {
    id: string;
}
interface ICycle extends TProgressSnapshot {
    progress_snapshot: TProgressSnapshot | undefined;
    created_at?: string;
    created_by?: string;
    description: string;
    end_date: string | null;
    id: string;
    is_favorite?: boolean;
    name: string;
    owned_by_id: string;
    project_id: string;
    status?: TCycleGroups;
    sort_order: number;
    start_date: string | null;
    sub_issues?: number;
    updated_at?: string;
    updated_by?: string;
    archived_at: string | null;
    assignee_ids?: string[];
    view_props: {
        filters: IIssueFilterOptions;
    };
    workspace_id: string;
    project_detail: IProjectDetails;
    progress: any[];
    version: number;
}
interface CycleIssueResponse {
    id: string;
    issue_detail: TIssue;
    created_at: Date;
    updated_at: Date;
    created_by: string;
    updated_by: string;
    project: string;
    workspace: string;
    issue: string;
    cycle: string;
    sub_issues_count: number;
}
type SelectCycleType = (ICycle & {
    actionType: "edit" | "delete" | "create-issue";
}) | undefined;
type CycleDateCheckData = {
    start_date: string;
    end_date: string;
    cycle_id?: string;
};
type TCycleEstimateType = "issues" | "points";
type TCyclePlotType = "burndown" | "burnup";
type TPublicCycle = {
    id: string;
    name: string;
    status: string;
};
type TProgressChartData = {
    date: string;
    scope: number;
    completed: number;
    backlog: number;
    started: number;
    unstarted: number;
    cancelled: number;
    pending: number;
    ideal: number;
    actual: number;
}[];

declare enum EUserWorkspaceRoles {
    ADMIN = 20,
    MEMBER = 15,
    GUEST = 5
}
interface IWorkspace {
    readonly id: string;
    readonly owner: IUser;
    readonly created_at: Date;
    readonly updated_at: Date;
    name: string;
    url: string;
    logo_url: string | null;
    readonly total_members: number;
    readonly slug: string;
    readonly created_by: string;
    readonly updated_by: string;
    organization_size: string;
    total_projects?: number;
    role: number;
}
interface IWorkspaceLite {
    readonly id: string;
    name: string;
    slug: string;
}
interface IWorkspaceMemberInvitation {
    accepted: boolean;
    email: string;
    id: string;
    message: string;
    responded_at: Date;
    role: TUserPermissions;
    token: string;
    invite_link: string;
    workspace: {
        id: string;
        logo_url: string;
        name: string;
        slug: string;
    };
}
interface IWorkspaceBulkInviteFormData {
    emails: {
        email: string;
        role: TUserPermissions;
    }[];
}
type Properties = {
    assignee: boolean;
    start_date: boolean;
    due_date: boolean;
    labels: boolean;
    key: boolean;
    priority: boolean;
    state: boolean;
    sub_issue_count: boolean;
    link: boolean;
    attachment_count: boolean;
    estimate: boolean;
    created_on: boolean;
    updated_on: boolean;
};
interface IWorkspaceMember {
    id: string;
    member: IUserLite;
    role: TUserPermissions | EUserWorkspaceRoles;
    created_at?: string;
    avatar_url?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    joining_date?: string;
    display_name?: string;
    last_login_medium?: string;
}
interface IWorkspaceMemberMe {
    company_role: string | null;
    created_at: Date;
    created_by: string;
    default_props: IWorkspaceViewProps;
    id: string;
    member: string;
    role: TUserPermissions | EUserWorkspaceRoles;
    updated_at: Date;
    updated_by: string;
    view_props: IWorkspaceViewProps;
    workspace: string;
    draft_issue_count: number;
}
interface ILastActiveWorkspaceDetails {
    workspace_details: IWorkspace;
    project_details?: TProjectMembership[];
}
interface IWorkspaceDefaultSearchResult {
    id: string;
    name: string;
    project_id: string;
    project__identifier: string;
    workspace__slug: string;
}
interface IWorkspaceSearchResult {
    id: string;
    name: string;
    slug: string;
}
interface IWorkspaceIssueSearchResult {
    id: string;
    name: string;
    project__identifier: string;
    project_id: string;
    sequence_id: number;
    workspace__slug: string;
    type_id: string;
}
interface IWorkspacePageSearchResult {
    id: string;
    name: string;
    project_ids: string[];
    project__identifiers: string[];
    workspace__slug: string;
}
interface IWorkspaceProjectSearchResult {
    id: string;
    identifier: string;
    name: string;
    workspace__slug: string;
}
interface IWorkspaceSearchResults {
    results: {
        workspace: IWorkspaceSearchResult[];
        project: IWorkspaceProjectSearchResult[];
        issue: IWorkspaceIssueSearchResult[];
        cycle: IWorkspaceDefaultSearchResult[];
        module: IWorkspaceDefaultSearchResult[];
        issue_view: IWorkspaceDefaultSearchResult[];
        page: IWorkspacePageSearchResult[];
    };
}
interface IProductUpdateResponse {
    url: string;
    assets_url: string;
    upload_url: string;
    html_url: string;
    id: number;
    author: {
        login: string;
        id: string;
        node_id: string;
        avatar_url: string;
        gravatar_id: "";
        url: string;
        html_url: string;
        followers_url: string;
        following_url: string;
        gists_url: string;
        starred_url: string;
        subscriptions_url: string;
        organizations_url: string;
        repos_url: string;
        events_url: string;
        received_events_url: string;
        type: string;
        site_admin: false;
    };
    node_id: string;
    tag_name: string;
    target_commitish: string;
    name: string;
    draft: boolean;
    prerelease: true;
    created_at: string;
    published_at: string;
    assets: [];
    tarball_url: string;
    zipball_url: string;
    body: string;
    reactions: {
        url: string;
        total_count: number;
        "+1": number;
        "-1": number;
        laugh: number;
        hooray: number;
        confused: number;
        heart: number;
        rocket: number;
        eyes: number;
    };
}
interface IWorkspaceActiveCyclesResponse {
    count: number;
    extra_stats: null;
    next_cursor: string;
    next_page_results: boolean;
    prev_cursor: string;
    prev_page_results: boolean;
    results: ICycle[];
    total_pages: number;
}
interface IWorkspaceProgressResponse {
    completed_issues: number;
    total_issues: number;
    started_issues: number;
    cancelled_issues: number;
    unstarted_issues: number;
}
interface IWorkspaceAnalyticsResponse {
    completion_chart: any;
}
type TWorkspacePaginationInfo = TPaginationInfo & {
    results: IWorkspace[];
};
interface IWorkspaceSidebarNavigationItem {
    key?: string;
    is_pinned: boolean;
    sort_order: number;
}
interface IWorkspaceSidebarNavigation {
    [key: string]: IWorkspaceSidebarNavigationItem;
}

type TWidgetKeys = "overview_stats" | "assigned_issues" | "created_issues" | "issues_by_state_groups" | "issues_by_priority" | "recent_activity" | "recent_projects" | "recent_collaborators";
type TIssuesListTypes = "pending" | "upcoming" | "overdue" | "completed";
type TAssignedIssuesWidgetFilters = {
    custom_dates?: string[];
    duration?: EDurationFilters;
    tab?: TIssuesListTypes;
};
type TCreatedIssuesWidgetFilters = {
    custom_dates?: string[];
    duration?: EDurationFilters;
    tab?: TIssuesListTypes;
};
type TIssuesByStateGroupsWidgetFilters = {
    duration?: EDurationFilters;
    custom_dates?: string[];
};
type TIssuesByPriorityWidgetFilters = {
    custom_dates?: string[];
    duration?: EDurationFilters;
};
type TWidgetFiltersFormData = {
    widgetKey: "assigned_issues";
    filters: Partial<TAssignedIssuesWidgetFilters>;
} | {
    widgetKey: "created_issues";
    filters: Partial<TCreatedIssuesWidgetFilters>;
} | {
    widgetKey: "issues_by_state_groups";
    filters: Partial<TIssuesByStateGroupsWidgetFilters>;
} | {
    widgetKey: "issues_by_priority";
    filters: Partial<TIssuesByPriorityWidgetFilters>;
};
type TWidget = {
    id: string;
    is_visible: boolean;
    key: TWidgetKeys;
    readonly widget_filters: // only for read
    TAssignedIssuesWidgetFilters & TCreatedIssuesWidgetFilters & TIssuesByStateGroupsWidgetFilters & TIssuesByPriorityWidgetFilters;
    filters: // only for write
    TAssignedIssuesWidgetFilters & TCreatedIssuesWidgetFilters & TIssuesByStateGroupsWidgetFilters & TIssuesByPriorityWidgetFilters;
};
type TWidgetStatsRequestParams = {
    widget_key: TWidgetKeys;
} | {
    target_date: string;
    issue_type: TIssuesListTypes;
    widget_key: "assigned_issues";
    expand?: "issue_relation";
} | {
    target_date: string;
    issue_type: TIssuesListTypes;
    widget_key: "created_issues";
} | {
    target_date: string;
    widget_key: "issues_by_state_groups";
} | {
    target_date: string;
    widget_key: "issues_by_priority";
} | {
    cursor: string;
    per_page: number;
    search?: string;
    widget_key: "recent_collaborators";
};
type TWidgetIssue = TIssue & {
    issue_relation: {
        id: string;
        project_id: string;
        relation_type: TIssueRelationTypes;
        sequence_id: number;
        type_id: string | null;
    }[];
};
type TOverviewStatsWidgetResponse = {
    assigned_issues_count: number;
    completed_issues_count: number;
    created_issues_count: number;
    pending_issues_count: number;
};
type TAssignedIssuesWidgetResponse = {
    issues: TWidgetIssue[];
    count: number;
};
type TCreatedIssuesWidgetResponse = {
    issues: TWidgetIssue[];
    count: number;
};
type TIssuesByStateGroupsWidgetResponse = {
    count: number;
    state: TStateGroups;
};
type TIssuesByPriorityWidgetResponse = {
    count: number;
    priority: TIssuePriorities;
};
type TRecentActivityWidgetResponse = IIssueActivity;
type TRecentProjectsWidgetResponse = string[];
type TRecentCollaboratorsWidgetResponse = {
    active_issue_count: number;
    user_id: string;
};
type TWidgetStatsResponse = TOverviewStatsWidgetResponse | TIssuesByStateGroupsWidgetResponse[] | TIssuesByPriorityWidgetResponse[] | TAssignedIssuesWidgetResponse | TCreatedIssuesWidgetResponse | TRecentActivityWidgetResponse[] | TRecentProjectsWidgetResponse | TRecentCollaboratorsWidgetResponse[];
type TDeprecatedDashboard = {
    created_at: string;
    created_by: string | null;
    description_html: string;
    id: string;
    identifier: string | null;
    is_default: boolean;
    name: string;
    owned_by: string;
    type: string;
    updated_at: string;
    updated_by: string | null;
};
type THomeDashboardResponse = {
    dashboard: TDeprecatedDashboard;
    widgets: TWidget[];
};

type TDuplicateIssuePayload = {
    title: string;
    workspace_id: string;
    issue_id?: string;
    project_id?: string;
    description_stripped?: string;
};
type TDeDupeIssue = {
    id: string;
    type_id: string | null;
    project_id: string;
    sequence_id: number;
    name: string;
    priority: TIssuePriorities;
    state_id: string;
    created_by: string;
};
type TDuplicateIssueResponse = {
    dupes: TDeDupeIssue[];
};

type TDescriptionVersion = {
    created_at: string;
    created_by: string | null;
    id: string;
    last_saved_at: string;
    owned_by: string;
    project: string;
    updated_at: string;
    updated_by: string | null;
};
type TDescriptionVersionDetails = TDescriptionVersion & {
    description_binary: string | null;
    description_html: string | null;
    description_json: object | null;
    description_stripped: string | null;
};
type TDescriptionVersionsListResponse = {
    cursor: string;
    next_cursor: string | null;
    next_page_results: boolean;
    page_count: number;
    prev_cursor: string | null;
    prev_page_results: boolean;
    results: TDescriptionVersion[];
    total_pages: number;
    total_results: number;
};

declare enum EViewAccess {
    PRIVATE = 0,
    PUBLIC = 1
}
interface IProjectView {
    id: string;
    access: EViewAccess;
    created_at: Date;
    updated_at: Date;
    is_favorite: boolean;
    created_by: string;
    updated_by: string;
    name: string;
    description: string;
    filters: IIssueFilterOptions;
    display_filters: IIssueDisplayFilterOptions;
    display_properties: IIssueDisplayProperties;
    query: IIssueFilterOptions;
    query_data: IIssueFilterOptions;
    project: string;
    workspace: string;
    logo_props: TLogoProps | undefined;
    is_locked: boolean;
    anchor?: string;
    owned_by: string;
}
type TPublishViewSettings = {
    is_comments_enabled: boolean;
    is_reactions_enabled: boolean;
    is_votes_enabled: boolean;
};
type TPublishViewDetails = TPublishViewSettings & {
    id: string;
    anchor: string;
};
type TViewFiltersSortKey = "name" | "created_at" | "updated_at";
type TViewFiltersSortBy = "asc" | "desc";
type TViewFilterProps = {
    created_at?: string[] | null;
    owned_by?: string[] | null;
    favorites?: boolean;
    view_type?: EViewAccess[];
};
type TViewFilters = {
    searchQuery: string;
    sortKey: TViewFiltersSortKey;
    sortBy: TViewFiltersSortBy;
    filters?: TViewFilterProps;
};

interface IAppIntegration {
    author: string;
    avatar_url: string | null;
    created_at: string;
    created_by: string | null;
    description: any;
    id: string;
    metadata: any;
    network: number;
    provider: string;
    redirect_url: string;
    title: string;
    updated_at: string;
    updated_by: string | null;
    verified: boolean;
    webhook_secret: string;
    webhook_url: string;
}
interface IWorkspaceIntegration {
    actor: string;
    api_token: string;
    config: any;
    created_at: string;
    created_by: string;
    id: string;
    integration: string;
    integration_detail: IAppIntegration;
    metadata: any;
    updated_at: string;
    updated_by: string;
    workspace: string;
}
interface ISlackIntegration {
    id: string;
    created_at: string;
    updated_at: string;
    access_token: string;
    scopes: string;
    bot_user_id: string;
    webhook_url: string;
    data: ISlackIntegrationData;
    team_id: string;
    team_name: string;
    created_by: string;
    updated_by: string;
    project: string;
    workspace: string;
    workspace_integration: string;
}
interface ISlackIntegrationData {
    ok: boolean;
    team: {
        id: string;
        name: string;
    };
    scope: string;
    app_id: string;
    enterprise: any;
    token_type: string;
    authed_user: string;
    bot_user_id: string;
    access_token: string;
    incoming_webhook: {
        url: string;
        channel: string;
        channel_id: string;
        configuration_url: string;
    };
    is_enterprise_install: boolean;
}

type TPageExtended = {};

type TPage = TPageExtended & {
    access: EPageAccess | undefined;
    archived_at: string | null | undefined;
    color: string | undefined;
    created_at: Date | undefined;
    created_by: string | undefined;
    description_html: string | undefined;
    id: string | undefined;
    is_favorite: boolean;
    is_locked: boolean;
    label_ids: string[] | undefined;
    name: string | undefined;
    owned_by: string | undefined;
    project_ids?: string[] | undefined;
    updated_at: Date | undefined;
    updated_by: string | undefined;
    workspace: string | undefined;
    logo_props: TLogoProps | undefined;
};
type TPageNavigationTabs = "public" | "private" | "archived";
type TPageFiltersSortKey = "name" | "created_at" | "updated_at" | "opened_at";
type TPageFiltersSortBy = "asc" | "desc";
type TPageFilterProps = {
    created_at?: string[] | null;
    created_by?: string[] | null;
    favorites?: boolean;
    labels?: string[] | null;
};
type TPageFilters = {
    searchQuery: string;
    sortKey: TPageFiltersSortKey;
    sortBy: TPageFiltersSortBy;
    filters?: TPageFilterProps;
};
type TPageEmbedType = "mention" | "issue";
type TPageVersion = {
    created_at: string;
    created_by: string;
    deleted_at: string | null;
    description_binary?: string | null;
    description_html?: string | null;
    description_json?: object;
    id: string;
    last_saved_at: string;
    owned_by: string;
    page: string;
    updated_at: string;
    updated_by: string;
    workspace: string;
};
type TDocumentPayload = {
    description_binary: string;
    description_html: string;
    description: object;
};
type TWebhookConnectionQueryParams = {
    documentType: "project_page" | "team_page" | "workspace_page";
    projectId?: string;
    teamId?: string;
    workspaceSlug: string;
};

interface IGptResponse {
    response: string;
    response_html: string;
    count: number;
    project_detail: IProjectLite;
    workspace_detail: IWorkspaceLite;
}

interface IEstimatePoint {
    id: string | undefined;
    key: number | undefined;
    value: string | undefined;
    description: string | undefined;
    workspace: string | undefined;
    project: string | undefined;
    estimate: string | undefined;
    created_at: Date | undefined;
    updated_at: Date | undefined;
    created_by: string | undefined;
    updated_by: string | undefined;
}
type TEstimateSystemKeys = EEstimateSystem.POINTS | EEstimateSystem.CATEGORIES | EEstimateSystem.TIME;
interface IEstimate {
    id: string | undefined;
    name: string | undefined;
    description: string | undefined;
    type: TEstimateSystemKeys | undefined;
    points: IEstimatePoint[] | undefined;
    workspace: string | undefined;
    project: string | undefined;
    last_used: boolean | undefined;
    created_at: Date | undefined;
    updated_at: Date | undefined;
    created_by: string | undefined;
    updated_by: string | undefined;
}
interface IEstimateFormData {
    estimate?: {
        name?: string;
        type?: string;
        last_used?: boolean;
    };
    estimate_points: {
        id?: string | undefined;
        key: number;
        value: string;
    }[];
}
type TEstimatePointsObject = {
    id?: string | undefined;
    key: number;
    value: string;
};
type TTemplateValues = {
    title: string;
    i18n_title: string;
    values: TEstimatePointsObject[];
    hide?: boolean;
};
type TEstimateSystem = {
    name: string;
    i18n_name: string;
    templates: Record<string, TTemplateValues>;
    is_available: boolean;
    is_ee: boolean;
};
type TEstimateSystems = {
    [K in TEstimateSystemKeys]: TEstimateSystem;
};
type TEstimateUpdateStageKeys = EEstimateUpdateStages.CREATE | EEstimateUpdateStages.EDIT | EEstimateUpdateStages.SWITCH;
type TEstimateTypeErrorObject = {
    oldValue: string;
    newValue: string;
    message: string | undefined;
};
type TEstimateTypeError = Record<number, TEstimateTypeErrorObject> | undefined;

interface IGithubServiceImportFormData {
    metadata: {
        owner: string;
        name: string;
        repository_id: number;
        url: string;
    };
    data: {
        users: {
            username: string;
            import: boolean | "invite" | "map";
            email: string;
        }[];
    };
    config: {
        sync: boolean;
    };
    project_id: string;
}
interface IGithubRepoCollaborator {
    avatar_url: string;
    html_url: string;
    id: number;
    login: string;
    url: string;
}
interface IGithubRepoInfo {
    issue_count: number;
    labels: number;
    collaborators: IGithubRepoCollaborator[];
}

interface IJiraImporterForm {
    metadata: IJiraMetadata;
    config: IJiraConfig;
    data: IJiraData;
    project_id: string;
}
interface IJiraConfig {
    epics_to_modules: boolean;
}
interface IJiraData {
    users: User[];
    invite_users: boolean;
    total_issues: number;
    total_labels: number;
    total_states: number;
    total_modules: number;
}
interface User {
    username: string;
    import: "invite" | "map" | false;
    email: string;
}
interface IJiraMetadata {
    cloud_hostname: string;
    api_token: string;
    project_key: string;
    email: string;
}
interface IJiraResponse {
    issues: number;
    modules: number;
    labels: number;
    states: number;
    users: IJiraResponseUser[];
}
interface IJiraResponseUser {
    self: string;
    accountId: string;
    accountType: string;
    emailAddress: string;
    avatarUrls: IJiraResponseAvatarUrls;
    displayName: string;
    active: boolean;
    locale: string;
}
interface IJiraResponseAvatarUrls {
    "48x48": string;
    "24x24": string;
    "16x16": string;
    "32x32": string;
}

interface IImporterService {
    created_at: string;
    config: {
        sync: boolean;
    };
    created_by: string | null;
    data: {
        users: [];
    };
    id: string;
    initiated_by: string;
    initiated_by_detail: IUserLite;
    metadata: {
        name: string;
        owner: string;
        repository_id: number;
        url: string;
    };
    project: string;
    project_detail: IProjectLite;
    service: string;
    status: "processing" | "completed" | "failed";
    updated_at: string;
    updated_by: string;
    token: string;
    workspace: string;
}
interface IExportData {
    id: string;
    created_at: string;
    updated_at: string;
    project: string[];
    provider: string;
    status: string;
    url: string;
    token: string;
    created_by: string;
    updated_by: string;
    initiated_by_detail: IUserLite;
}
interface IExportServiceResponse {
    count: number;
    extra_stats: null;
    next_cursor: string;
    next_page_results: boolean;
    prev_cursor: string;
    prev_page_results: boolean;
    results: IExportData[];
    total_pages: number;
}

type TChartColorScheme = "modern" | "horizon" | "earthen";
type TChartDatum = {
    key: string;
    name: string;
    count: number;
} & Record<string, number>;
type TChart = {
    data: TChartDatum[];
    schema: Record<string, string>;
};

type TChartLegend = {
    align: "left" | "center" | "right";
    verticalAlign: "top" | "middle" | "bottom";
    layout: "horizontal" | "vertical";
    wrapperStyles?: React.CSSProperties;
};
type TChartMargin = {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
};
type TChartData<K extends string, T extends string> = {
    [key in K]: string | number;
} & Record<T, any>;
type TChartProps<K extends string, T extends string> = {
    data: TChartData<K, T>[];
    xAxis: {
        key: keyof TChartData<K, T>;
        label?: string;
        strokeColor?: string;
        dy?: number;
    };
    yAxis: {
        allowDecimals?: boolean;
        domain?: [number, number];
        key: keyof TChartData<K, T>;
        label?: string;
        strokeColor?: string;
        offset?: number;
        dx?: number;
    };
    className?: string;
    legend?: TChartLegend;
    margin?: TChartMargin;
    tickCount?: {
        x?: number;
        y?: number;
    };
    showTooltip?: boolean;
    customTooltipContent?: (props: {
        active?: boolean;
        label: string;
        payload: any;
    }) => React.ReactNode;
};
type TBarChartShapeVariant = "bar" | "lollipop" | "lollipop-dotted";
type TBarItem<T extends string> = {
    key: T;
    label: string;
    fill: string | ((payload: any) => string);
    textClassName: string;
    showPercentage?: boolean;
    stackId: string;
    showTopBorderRadius?: (barKey: string, payload: any) => boolean;
    showBottomBorderRadius?: (barKey: string, payload: any) => boolean;
    shapeVariant?: TBarChartShapeVariant;
};
type TBarChartProps<K extends string, T extends string> = TChartProps<K, T> & {
    bars: TBarItem<T>[];
    barSize?: number;
};
type TLineItem<T extends string> = {
    key: T;
    label: string;
    dashedLine: boolean;
    fill: string;
    showDot: boolean;
    smoothCurves: boolean;
    stroke: string;
    style?: Record<string, string | number>;
};
type TLineChartProps<K extends string, T extends string> = TChartProps<K, T> & {
    lines: TLineItem<T>[];
};
type TScatterPointItem<T extends string> = {
    key: T;
    label: string;
    fill: string;
    stroke: string;
};
type TScatterChartProps<K extends string, T extends string> = TChartProps<K, T> & {
    scatterPoints: TScatterPointItem<T>[];
};
type TAreaItem<T extends string> = {
    key: T;
    label: string;
    stackId: string;
    fill: string;
    fillOpacity: number;
    showDot: boolean;
    smoothCurves: boolean;
    strokeColor: string;
    strokeOpacity: number;
    style?: Record<string, string | number>;
};
type TAreaChartProps<K extends string, T extends string> = TChartProps<K, T> & {
    areas: TAreaItem<T>[];
    comparisonLine?: {
        dashedLine: boolean;
        strokeColor: string;
    };
};
type TCellItem<T extends string> = {
    key: T;
    fill: string;
};
type TPieChartProps<K extends string, T extends string> = Pick<TChartProps<K, T>, "className" | "data" | "showTooltip" | "legend" | "margin"> & {
    dataKey: T;
    cells: TCellItem<T>[];
    innerRadius?: number | string;
    outerRadius?: number | string;
    cornerRadius?: number;
    paddingAngle?: number;
    showLabel: boolean;
    customLabel?: (value: any) => string;
    centerLabel?: {
        className?: string;
        fill: string;
        style?: React.CSSProperties;
        text?: string | number;
    };
    tooltipLabel?: string | ((payload: any) => string);
    customLegend?: (props: any) => React.ReactNode;
};
type TreeMapItem = {
    name: string;
    value: number;
    label?: string;
    textClassName?: string;
    icon?: React.ReactElement;
} & ({
    fillColor: string;
} | {
    fillClassName: string;
});
type TreeMapChartProps = {
    data: TreeMapItem[];
    className?: string;
    isAnimationActive?: boolean;
    showTooltip?: boolean;
};
type TTopSectionConfig = {
    showIcon: boolean;
    showName: boolean;
    nameTruncated: boolean;
};
type TBottomSectionConfig = {
    show: boolean;
    showValue: boolean;
    showLabel: boolean;
    labelTruncated: boolean;
};
type TContentVisibility = {
    top: TTopSectionConfig;
    bottom: TBottomSectionConfig;
};
type TRadarItem<T extends string> = {
    key: T;
    name: string;
    fill?: string;
    stroke?: string;
    fillOpacity?: number;
    dot?: {
        r: number;
        fillOpacity: number;
    };
};
type TRadarChartProps<K extends string, T extends string> = Pick<TChartProps<K, T>, "className" | "showTooltip" | "margin" | "data" | "legend"> & {
    dataKey: T;
    radars: TRadarItem<T>[];
    angleAxis: {
        key: keyof TChartData<K, T>;
        label?: string;
        strokeColor?: string;
    };
};

declare enum ChartXAxisProperty {
    STATES = "STATES",
    STATE_GROUPS = "STATE_GROUPS",
    LABELS = "LABELS",
    ASSIGNEES = "ASSIGNEES",
    ESTIMATE_POINTS = "ESTIMATE_POINTS",
    CYCLES = "CYCLES",
    MODULES = "MODULES",
    PRIORITY = "PRIORITY",
    START_DATE = "START_DATE",
    TARGET_DATE = "TARGET_DATE",
    CREATED_AT = "CREATED_AT",
    COMPLETED_AT = "COMPLETED_AT",
    CREATED_BY = "CREATED_BY",
    WORK_ITEM_TYPES = "WORK_ITEM_TYPES",
    PROJECTS = "PROJECTS",
    EPICS = "EPICS"
}
declare enum ChartYAxisMetric {
    WORK_ITEM_COUNT = "WORK_ITEM_COUNT",
    ESTIMATE_POINT_COUNT = "ESTIMATE_POINT_COUNT",
    PENDING_WORK_ITEM_COUNT = "PENDING_WORK_ITEM_COUNT",
    COMPLETED_WORK_ITEM_COUNT = "COMPLETED_WORK_ITEM_COUNT",
    IN_PROGRESS_WORK_ITEM_COUNT = "IN_PROGRESS_WORK_ITEM_COUNT",
    WORK_ITEM_DUE_THIS_WEEK_COUNT = "WORK_ITEM_DUE_THIS_WEEK_COUNT",
    WORK_ITEM_DUE_TODAY_COUNT = "WORK_ITEM_DUE_TODAY_COUNT",
    BLOCKED_WORK_ITEM_COUNT = "BLOCKED_WORK_ITEM_COUNT"
}
type TAnalyticsTabsBase = "overview" | "work-items";
type TAnalyticsGraphsBase = "projects" | "work-items" | "custom-work-items";
interface AnalyticsTab {
    key: TAnalyticsTabsBase;
    label: string;
    content: React.FC;
    isDisabled: boolean;
}
type TAnalyticsFilterParams = {
    project_ids?: string;
    cycle_id?: string;
    module_id?: string;
};
interface IAnalyticsResponse {
    [key: string]: any;
}
interface IAnalyticsResponseFields {
    count: number;
    filter_count: number;
}
interface IChartResponse {
    schema: Record<string, string>;
    data: TChartData<string, string>[];
}
interface WorkItemInsightColumns {
    project_id?: string;
    project__name?: string;
    cancelled_work_items: number;
    completed_work_items: number;
    backlog_work_items: number;
    un_started_work_items: number;
    started_work_items: number;
    display_name?: string;
    avatar_url?: string;
    assignee_id?: string;
}
type AnalyticsTableDataMap = {
    "work-items": WorkItemInsightColumns;
};
interface IAnalyticsParams {
    x_axis: ChartXAxisProperty;
    y_axis: ChartYAxisMetric;
    group_by?: ChartXAxisProperty;
}

interface IApiToken {
    created_at: string;
    created_by: string;
    description: string;
    expired_at: string | null;
    id: string;
    is_active: boolean;
    label: string;
    last_used: string | null;
    updated_at: string;
    updated_by: string;
    user: string;
    user_type: number;
    token?: string;
    workspace: string;
}

type TEmailCheckTypes = "magic_code" | "password";
interface IEmailCheckData {
    email: string;
}
interface IEmailCheckResponse {
    status: "MAGIC_CODE" | "CREDENTIAL";
    existing: boolean;
    is_password_autoset: boolean;
}
interface ILoginTokenResponse {
    access_token: string;
    refresh_token: string;
}
interface IMagicSignInData {
    email: string;
    key: string;
    token: string;
}
interface IPasswordSignInData {
    email: string;
    password: string;
}
interface ICsrfTokenData {
    csrf_token: string;
}

interface ICalendarRange {
    startDate: Date;
    endDate: Date;
}
interface ICalendarDate {
    date: Date;
    year: number;
    month: number;
    day: number;
    week: number;
    is_current_month: boolean;
    is_current_week: boolean;
    is_today: boolean;
}
interface ICalendarWeek {
    [date: string]: ICalendarDate;
}
interface ICalendarMonth {
    [monthIndex: string]: {
        [weekNumber: string]: ICalendarWeek;
    };
}
interface ICalendarPayload {
    [year: string]: ICalendarMonth;
}

type TInstanceAIConfigurationKeys = "LLM_API_KEY" | "LLM_MODEL";

type TInstanceAuthenticationModes = {
    key: string;
    name: string;
    description: string;
    icon: JSX.Element;
    config: JSX.Element;
    unavailable?: boolean;
};
type TInstanceAuthenticationMethodKeys = "ENABLE_SIGNUP" | "ENABLE_MAGIC_LINK_LOGIN" | "ENABLE_EMAIL_PASSWORD" | "IS_GOOGLE_ENABLED" | "IS_GITHUB_ENABLED" | "IS_GITLAB_ENABLED";
type TInstanceGoogleAuthenticationConfigurationKeys = "GOOGLE_CLIENT_ID" | "GOOGLE_CLIENT_SECRET";
type TInstanceGithubAuthenticationConfigurationKeys = "GITHUB_CLIENT_ID" | "GITHUB_CLIENT_SECRET" | "GITHUB_ORGANIZATION_ID";
type TInstanceGitlabAuthenticationConfigurationKeys = "GITLAB_HOST" | "GITLAB_CLIENT_ID" | "GITLAB_CLIENT_SECRET";
type TInstanceAuthenticationConfigurationKeys = TInstanceGoogleAuthenticationConfigurationKeys | TInstanceGithubAuthenticationConfigurationKeys | TInstanceGitlabAuthenticationConfigurationKeys;
type TInstanceAuthenticationKeys = TInstanceAuthenticationMethodKeys | TInstanceAuthenticationConfigurationKeys;
type TGetBaseAuthenticationModeProps = {
    disabled: boolean;
    updateConfig: (key: TInstanceAuthenticationMethodKeys, value: string) => void;
    resolvedTheme: string | undefined;
};

interface IInstanceInfo {
    instance: IInstance;
    config: IInstanceConfig;
}
interface IInstance {
    id: string;
    created_at: string;
    updated_at: string;
    instance_name: string | undefined;
    whitelist_emails: string | undefined;
    instance_id: string | undefined;
    license_key: string | undefined;
    current_version: string | undefined;
    latest_version: string | undefined;
    last_checked_at: string | undefined;
    namespace: string | undefined;
    is_telemetry_enabled: boolean;
    is_support_required: boolean;
    is_activated: boolean;
    is_setup_done: boolean;
    is_signup_screen_visited: boolean;
    user_count: number | undefined;
    is_verified: boolean;
    created_by: string | undefined;
    updated_by: string | undefined;
    workspaces_exist: boolean;
}
interface IInstanceConfig {
    enable_signup: boolean;
    is_workspace_creation_disabled: boolean;
    is_google_enabled: boolean;
    is_github_enabled: boolean;
    is_gitlab_enabled: boolean;
    is_magic_login_enabled: boolean;
    is_email_password_enabled: boolean;
    github_app_name: string | undefined;
    slack_client_id: string | undefined;
    posthog_api_key: string | undefined;
    posthog_host: string | undefined;
    has_unsplash_configured: boolean;
    has_llm_configured: boolean;
    file_size_limit: number | undefined;
    is_smtp_configured: boolean;
    app_base_url: string | undefined;
    space_base_url: string | undefined;
    admin_base_url: string | undefined;
    is_intercom_enabled: boolean;
    intercom_app_id: string | undefined;
    instance_changelog_url?: string;
}
interface IInstanceAdmin {
    created_at: string;
    created_by: string;
    id: string;
    instance: string;
    role: string;
    updated_at: string;
    updated_by: string;
    user: string;
    user_detail: IUserLite;
}
type TInstanceIntercomConfigurationKeys = "IS_INTERCOM_ENABLED" | "INTERCOM_APP_ID";
type TInstanceConfigurationKeys = TInstanceAIConfigurationKeys | TInstanceEmailConfigurationKeys | TInstanceImageConfigurationKeys | TInstanceAuthenticationKeys | TInstanceIntercomConfigurationKeys | TInstanceWorkspaceConfigurationKeys;
interface IInstanceConfiguration {
    id: string;
    created_at: string;
    updated_at: string;
    key: TInstanceConfigurationKeys;
    value: string;
    created_by: string | null;
    updated_by: string | null;
}
type IFormattedInstanceConfiguration = {
    [key in TInstanceConfigurationKeys]: string;
};

type TInstanceEmailConfigurationKeys = "EMAIL_HOST" | "EMAIL_PORT" | "EMAIL_HOST_USER" | "EMAIL_HOST_PASSWORD" | "EMAIL_USE_TLS" | "EMAIL_USE_SSL" | "EMAIL_FROM";

type TInstanceImageConfigurationKeys = "UNSPLASH_ACCESS_KEY";

type TInstanceWorkspaceConfigurationKeys = "DISABLE_WORKSPACE_CREATION";

type TSubIssuesStateDistribution = {
    backlog: string[];
    unstarted: string[];
    started: string[];
    completed: string[];
    cancelled: string[];
};
type TIssueSubIssues = {
    state_distribution: TSubIssuesStateDistribution;
    sub_issues: TSubIssueResponse;
};
type TSubIssueResponse = TIssue[] | {
    [key: string]: TIssue[];
};
type TIssueSubIssuesStateDistributionMap = {
    [issue_id: string]: TSubIssuesStateDistribution;
};
type TIssueSubIssuesIdMap = {
    [issue_id: string]: string[];
};
type TSubIssueOperations = {
    copyLink: (path: string) => void;
    fetchSubIssues: (workspaceSlug: string, projectId: string, parentIssueId: string) => Promise<void>;
    addSubIssue: (workspaceSlug: string, projectId: string, parentIssueId: string, issueIds: string[]) => Promise<void>;
    updateSubIssue: (workspaceSlug: string, projectId: string, parentIssueId: string, issueId: string, issueData: Partial<TIssue>, oldIssue?: Partial<TIssue>, fromModal?: boolean) => Promise<void>;
    removeSubIssue: (workspaceSlug: string, projectId: string, parentIssueId: string, issueId: string) => Promise<void>;
    deleteSubIssue: (workspaceSlug: string, projectId: string, parentIssueId: string, issueId: string) => Promise<void>;
};

type TLoader = "init-loader" | "mutation" | "pagination" | "loaded" | undefined;
type TGroupedIssues = {
    [group_id: string]: string[];
};
type TSubGroupedIssues = {
    [sub_grouped_id: string]: TGroupedIssues;
};
type TIssues = TGroupedIssues | TSubGroupedIssues;
type TPaginationData = {
    nextCursor: string;
    prevCursor: string;
    nextPageResults: boolean;
};
type TIssuePaginationData = {
    [group_id: string]: TPaginationData;
};
type TGroupedIssueCount = {
    [group_id: string]: number;
};
type TUnGroupedIssues = string[];

interface IIssueReaction {
    actor: string;
    actor_detail: IUserLite;
    created_at: Date;
    created_by: string;
    id: string;
    issue: string;
    project: string;
    reaction: string;
    updated_at: Date;
    updated_by: string;
    workspace: string;
}
interface IssueReactionForm {
    reaction: string;
}
interface IssueCommentReaction {
    id: string;
    created_at: Date;
    updated_at: Date;
    reaction: string;
    created_by: string;
    updated_by: string;
    project: string;
    workspace: string;
    actor: string;
    comment: string;
}
interface IssueCommentReactionForm {
    reaction: string;
}

interface IWebWaitListResponse {
    status: string;
}

interface IWebhook {
    created_at: string;
    cycle: boolean;
    id: string;
    is_active: boolean;
    issue: boolean;
    issue_comment: boolean;
    module: boolean;
    project: boolean;
    secret_key?: string;
    updated_at: string;
    url: string;
}
type TWebhookEventTypes = "all" | "individual";

interface IWorkspaceView {
    id: string;
    access: EViewAccess;
    created_at: Date;
    updated_at: Date;
    is_favorite: boolean;
    created_by: string;
    updated_by: string;
    name: string;
    description: string;
    filters: IIssueFilterOptions;
    display_filters: IIssueDisplayFilterOptions;
    display_properties: IIssueDisplayProperties;
    query: any;
    query_data: IWorkspaceViewProps;
    project: string;
    workspace: string;
    is_locked: boolean;
    owned_by: string;
    workspace_detail?: {
        id: string;
        name: string;
        slug: string;
    };
}
type TStaticViewTypes = "all-issues" | "assigned" | "created" | "subscribed";

type TDropTarget = {
    element: Element;
    data: Record<string | symbol, unknown>;
};
type TDropTargetMiscellaneousData = {
    dropEffect: string;
    isActiveDueToStickiness: boolean;
};
interface IPragmaticPayloadLocation {
    initial: {
        dropTargets: (TDropTarget & TDropTargetMiscellaneousData)[];
    };
    current: {
        dropTargets: (TDropTarget & TDropTargetMiscellaneousData)[];
    };
    previous: {
        dropTargets: (TDropTarget & TDropTargetMiscellaneousData)[];
    };
}
interface IPragmaticDropPayload {
    location: IPragmaticPayloadLocation;
    source: TDropTarget;
    self: TDropTarget & TDropTargetMiscellaneousData;
}
type InstructionType = "reparent" | "reorder-above" | "reorder-below" | "make-child" | "instruction-blocked";

type TPublishEntityType = "project" | "page";
type TProjectPublishLayouts = "calendar" | "gantt" | "kanban" | "list" | "spreadsheet";
type TProjectPublishViewProps = {
    calendar?: boolean;
    gantt?: boolean;
    kanban?: boolean;
    list?: boolean;
    spreadsheet?: boolean;
};
type TProjectDetails = IProjectLite & Pick<IProject, "cover_image" | "logo_props" | "description">;
type TPublishSettings = {
    anchor: string | undefined;
    created_at: string | undefined;
    created_by: string | undefined;
    entity_identifier: string | undefined;
    entity_name: TPublishEntityType | undefined;
    id: string | undefined;
    inbox: unknown;
    is_comments_enabled: boolean;
    is_reactions_enabled: boolean;
    is_votes_enabled: boolean;
    project: string | undefined;
    project_details: TProjectDetails | undefined;
    updated_at: string | undefined;
    updated_by: string | undefined;
    workspace: string | undefined;
    workspace_detail: IWorkspaceLite | undefined;
};
type TProjectPublishSettings = TPublishSettings & {
    view_props: TProjectPublishViewProps | undefined;
};

type TSearchEntities = "user_mention" | "issue" | "project" | "cycle" | "module" | "page";
type TUserSearchResponse = {
    member__avatar_url: IUser["avatar_url"];
    member__display_name: IUser["display_name"];
    member__id: IUser["id"];
};
type TProjectSearchResponse = {
    name: IProject["name"];
    id: IProject["id"];
    identifier: IProject["identifier"];
    logo_props: IProject["logo_props"];
    workspace__slug: IWorkspace["slug"];
};
type TIssueSearchResponse = {
    name: TIssue["name"];
    id: TIssue["id"];
    sequence_id: TIssue["sequence_id"];
    project__identifier: IProject["identifier"];
    project_id: TIssue["project_id"];
    priority: TIssue["priority"];
    state_id: TIssue["state_id"];
    type_id: TIssue["type_id"];
};
type TCycleSearchResponse = {
    name: ICycle["name"];
    id: ICycle["id"];
    project_id: ICycle["project_id"];
    project__identifier: IProject["identifier"];
    status: ICycle["status"];
    workspace__slug: IWorkspace["slug"];
};
type TModuleSearchResponse = {
    name: IModule["name"];
    id: IModule["id"];
    project_id: IModule["project_id"];
    project__identifier: IProject["identifier"];
    status: IModule["status"];
    workspace__slug: IWorkspace["slug"];
};
type TPageSearchResponse = {
    name: TPage["name"];
    id: TPage["id"];
    logo_props: TPage["logo_props"];
    projects__id: TPage["project_ids"];
    workspace__slug: IWorkspace["slug"];
};
type TSearchResponse = {
    cycle?: TCycleSearchResponse[];
    issue?: TIssueSearchResponse[];
    module?: TModuleSearchResponse[];
    page?: TPageSearchResponse[];
    project?: TProjectSearchResponse[];
    user_mention?: TUserSearchResponse[];
};
type TSearchEntityRequestPayload = {
    count: number;
    project_id?: string;
    query_type: TSearchEntities[];
    query: string;
    team_id?: string;
    issue_id?: string;
};

type TNotificationFilter = {
    type: {
        [key in ENotificationFilterType]: boolean;
    };
    snoozed: boolean;
    archived: boolean;
    read: boolean;
};
type TNotificationIssueLite = {
    id: string | undefined;
    sequence_id: number | undefined;
    identifier: string | undefined;
    name: string | undefined;
    state_name: string | undefined;
    state_group: string | undefined;
};
type TNotificationData = {
    issue: TNotificationIssueLite | undefined;
    issue_activity: {
        id: string | undefined;
        actor: string | undefined;
        field: string | undefined;
        issue_comment: string | undefined;
        verb: "created" | "updated" | "deleted";
        new_value: string | undefined;
        old_value: string | undefined;
    };
};
type TNotification = {
    id: string;
    title: string | undefined;
    data: TNotificationData | undefined;
    entity_identifier: string | undefined;
    entity_name: string | undefined;
    message_html: string | undefined;
    message: undefined;
    message_stripped: undefined;
    sender: string | undefined;
    receiver: string | undefined;
    triggered_by: string | undefined;
    triggered_by_details: IUserLite | undefined;
    read_at: string | undefined;
    archived_at: string | undefined;
    snoozed_till: string | undefined;
    is_inbox_issue: boolean | undefined;
    is_mentioned_notification: boolean | undefined;
    workspace: string | undefined;
    project: string | undefined;
    created_at: string | undefined;
    updated_at: string | undefined;
    created_by: string | undefined;
    updated_by: string | undefined;
};
type TNotificationPaginatedInfoQueryParams = {
    type?: string | undefined;
    snoozed?: boolean;
    archived?: boolean;
    mentioned?: boolean;
    read?: boolean;
    per_page?: number;
    cursor?: string;
};
type TNotificationPaginatedInfo = {
    next_cursor: string | undefined;
    prev_cursor: string | undefined;
    next_page_results: boolean | undefined;
    prev_page_results: boolean | undefined;
    total_pages: number | undefined;
    extra_stats: string | undefined;
    count: number | undefined;
    total_count: number | undefined;
    results: TNotification[] | undefined;
    grouped_by: string | undefined;
    sub_grouped_by: string | undefined;
};
type TUnreadNotificationsCount = {
    total_unread_notifications_count: number;
    mention_unread_notifications_count: number;
};
type TNotificationLite = {
    workspace_slug: string | undefined;
    project_id: string | undefined;
    notification_id: string | undefined;
    issue_id: string | undefined;
    is_inbox_issue: boolean | undefined;
};

type IFavorite = {
    id: string;
    name: string;
    entity_type: string;
    entity_data: {
        id?: string;
        name: string;
        logo_props?: TLogoProps | undefined;
    };
    is_folder: boolean;
    sort_order: number;
    parent: string | null;
    entity_identifier?: string | null;
    children: IFavorite[];
    project_id: string | null;
    sequence: number;
};

type TWorkspaceDraftIssue = {
    id: string;
    name: string;
    sort_order: number;
    state_id: string | undefined;
    priority: TIssuePriorities | undefined;
    label_ids: string[];
    assignee_ids: string[];
    estimate_point: string | undefined;
    project_id: string | undefined;
    parent_id: string | undefined;
    cycle_id: string | undefined;
    module_ids: string[] | undefined;
    start_date: string | undefined;
    target_date: string | undefined;
    completed_at: string | undefined;
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by: string;
    is_draft: boolean;
    type_id: string;
};
type TWorkspaceDraftPaginationInfo<T> = {
    next_cursor: string | undefined;
    prev_cursor: string | undefined;
    next_page_results: boolean | undefined;
    prev_page_results: boolean | undefined;
    total_pages: number | undefined;
    count: number | undefined;
    total_count: number | undefined;
    total_results: number | undefined;
    results: T[] | undefined;
    extra_stats: string | undefined;
    grouped_by: string | undefined;
    sub_grouped_by: string | undefined;
};
type TWorkspaceDraftQueryParams = {
    per_page: number;
    cursor: string;
};
type TWorkspaceDraftIssueLoader = "init-loader" | "empty-state" | "mutation" | "pagination" | "loaded" | "create" | "update" | "delete" | "move" | undefined;

type TCommandPaletteActionList = Record<string, {
    title: string;
    description: string;
    action: () => void;
}>;
type TCommandPaletteShortcutList = {
    key: string;
    title: string;
    shortcuts: TCommandPaletteShortcut[];
};
type TCommandPaletteShortcut = {
    keys: string;
    description: string;
};

type TTimezoneObject = {
    utc_offset: string;
    gmt_offset: string;
    label: string;
    value: string;
};
type TTimezones = {
    timezones: TTimezoneObject[];
};

type TBaseActivity<TFieldKey extends string = string, TVerbKey extends string = string> = {
    id: string;
    field: TFieldKey | undefined;
    epoch: number;
    verb: TVerbKey;
    comment: string | undefined;
    old_value: string | undefined;
    new_value: string | undefined;
    old_identifier: string | undefined;
    new_identifier: string | undefined;
    actor: string;
    created_at: string;
    updated_at: string;
};
type TWorkspaceBaseActivity<K extends string = string, V extends string = string> = TBaseActivity<K, V> & {
    workspace: string;
};
type TProjectBaseActivity<K extends string = string, V extends string = string> = TWorkspaceBaseActivity<K, V> & {
    project: string;
};
type TBaseActivityVerbs = "created" | "updated" | "deleted";

type TEpicAnalyticsGroup = "backlog_issues" | "unstarted_issues" | "started_issues" | "completed_issues" | "cancelled_issues" | "overdue_issues";
type TEpicAnalytics = {
    backlog_issues: number;
    unstarted_issues: number;
    started_issues: number;
    completed_issues: number;
    cancelled_issues: number;
    overdue_issues: number;
};

type TRecentActivityFilterKeys = "all item" | "issue" | "page" | "project" | "workspace_page";
type THomeWidgetKeys = "quick_links" | "recents" | "my_stickies" | "quick_tutorial" | "new_at_plane";
type THomeWidgetProps = {
    workspaceSlug: string;
};
type TPageEntityData = {
    id: string;
    name: string;
    logo_props: TLogoProps;
    project_id?: string;
    owned_by: string;
    project_identifier?: string;
};
type TProjectEntityData = {
    id: string;
    name: string;
    logo_props: TLogoProps;
    project_members: string[];
    identifier: string;
};
type TIssueEntityData = {
    id: string;
    name: string;
    state: string;
    priority: TIssuePriorities;
    assignees: string[];
    type: string | null;
    sequence_id: number;
    project_id: string;
    project_identifier: string;
    is_epic: boolean;
};
type TActivityEntityData = {
    id: string;
    entity_name: "page" | "project" | "issue" | "workspace_page";
    entity_identifier: string;
    visited_at: string;
    entity_data: TPageEntityData | TProjectEntityData | TIssueEntityData;
};
type TLinkEditableFields = {
    title: string;
    url: string;
};
type TLink = TLinkEditableFields & {
    created_by_id: string;
    id: string;
    metadata: any;
    workspace_slug: string;
    created_at: Date;
};
type TLinkMap = {
    [workspace_slug: string]: TLink;
};
type TLinkIdMap = {
    [workspace_slug: string]: string[];
};
type TWidgetEntityData = {
    key: THomeWidgetKeys;
    name: string;
    is_enabled: boolean;
    sort_order: number;
};

type TSticky = {
    created_at?: string | undefined;
    created_by?: string | undefined;
    background_color?: string | null | undefined;
    description?: object | undefined;
    description_html?: string | undefined;
    id: string;
    logo_props: TLogoProps | undefined;
    name?: string;
    sort_order: number | undefined;
    updated_at?: string | undefined;
    updated_by?: string | undefined;
    workspace: string | undefined;
};

type PartialDeep<K> = {
    [attr in keyof K]?: K[attr] extends object ? PartialDeep<K[attr]> : K[attr];
};
type CompleteOrEmpty<T> = T | Record<string, never>;
type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

declare enum EProductSubscriptionEnum {
    FREE = "FREE",
    ONE = "ONE",
    PRO = "PRO",
    BUSINESS = "BUSINESS",
    ENTERPRISE = "ENTERPRISE"
}
type TBillingFrequency = "month" | "year";
type IPaymentProductPrice = {
    currency: string;
    id: string;
    product: string;
    recurring: TBillingFrequency;
    unit_amount: number;
    workspace_amount: number;
};
type TProductSubscriptionType = "FREE" | "ONE" | "PRO" | "BUSINESS" | "ENTERPRISE";
type IPaymentProduct = {
    description: string;
    id: string;
    name: string;
    type: Omit<TProductSubscriptionType, "FREE">;
    payment_quantity: number;
    prices: IPaymentProductPrice[];
    is_active: boolean;
};
type TSubscriptionPrice = {
    key: string;
    id: string | undefined;
    currency: string;
    price: number;
    recurring: TBillingFrequency;
};
type TProductBillingFrequency = {
    [key in EProductSubscriptionEnum]: TBillingFrequency | undefined;
};

interface IGanttBlock {
    data: any;
    id: string;
    name: string;
    position?: {
        marginLeft: number;
        width: number;
    };
    sort_order: number | undefined;
    start_date: string | undefined;
    target_date: string | undefined;
    project_id: string | undefined;
}
interface IBlockUpdateData {
    sort_order?: {
        destinationIndex: number;
        newSortOrder: number;
        sourceIndex: number;
    };
    start_date?: string;
    target_date?: string;
}
interface IBlockUpdateDependencyData {
    id: string;
    start_date?: string;
    target_date?: string;
    project_id?: string;
}
type TGanttViews = "week" | "month" | "quarter";
interface WeekMonthDataType {
    key: number;
    shortTitle: string;
    title: string;
    abbreviation: string;
}
interface ChartDataType {
    key: string;
    i18n_title: string;
    data: ChartDataTypeData;
}
interface ChartDataTypeData {
    startDate: Date;
    currentDate: Date;
    endDate: Date;
    approxFilterRange: number;
    dayWidth: number;
}

export { type ActorDetail, type AnalyticsTab, type AnalyticsTableDataMap, type Attrs, type BlockeIssueDetail, type ChartDataType, type ChartDataTypeData, ChartXAxisProperty, ChartYAxisMetric, type CompleteOrEmpty, type ContentContent, type CycleDateCheckData, type CycleIssueResponse, type Description, type DescriptionContent, EDurationFilters, EEstimateSystem, EEstimateUpdateStages, EFileAssetType, EInboxIssueCurrentTab, EInboxIssueSource, EInboxIssueStatus, EIssueCommentAccessSpecifier, EIssueServiceType, EIssuesStoreType, ENotificationFilterType, EPageAccess, EProductSubscriptionEnum, EProjectNetwork, EStartOfTheWeek, EUpdateStatus, EUserPermissions, EUserProjectRoles, EUserWorkspaceRoles, EViewAccess, type GithubRepositoriesResponse, type GroupByColumnTypes, type IAnalyticsParams, type IAnalyticsResponse, type IAnalyticsResponseFields, type IApiToken, type IAppIntegration, type IBlockUpdateData, type IBlockUpdateDependencyData, type ICalendarDate, type ICalendarMonth, type ICalendarPayload, type ICalendarRange, type ICalendarWeek, type IChartResponse, type ICsrfTokenData, type ICustomSearchSelectOption, type ICycle, type IEmailCheckData, type IEmailCheckResponse, type IEstimate, type IEstimateFormData, type IEstimatePoint, type IExportData, type IExportServiceResponse, type IFavorite, type IFormattedInstanceConfiguration, type IGanttBlock, type IGithubRepoCollaborator, type IGithubRepoInfo, type IGithubRepository, type IGithubServiceImportFormData, type IGptResponse, type IGroupByColumn, type IImporterService, type IInstance, type IInstanceAdmin, type IInstanceAdminStatus, type IInstanceConfig, type IInstanceConfiguration, type IInstanceInfo, type IIssueActivity, type IIssueAttachment, type IIssueCycle, type IIssueDisplayFilterOptions, type IIssueDisplayProperties, type IIssueFilterOptions, type IIssueFilters, type IIssueFiltersResponse, type IIssueLabel, type IIssueLabelTree, type IIssueLink, type IIssueListRow, type IIssueLite, type IIssueMap, type IIssueModule, type IIssueParent, type IIssuePublicReaction, type IIssueReaction, type IJiraConfig, type IJiraData, type IJiraImporterForm, type IJiraMetadata, type IJiraResponse, type IJiraResponseAvatarUrls, type IJiraResponseUser, type ILastActiveWorkspaceDetails, type ILayoutDisplayFiltersOptions, type ILinkDetails, type ILoginTokenResponse, type IMagicSignInData, type IModule, type IPartialProject, type IPasswordSignInData, type IPaymentProduct, type IPaymentProductPrice, type IPragmaticDropPayload, type IPragmaticPayloadLocation, type IProductUpdateResponse, type IProject, type IProjectBulkAddFormData, type IProjectDetails, type IProjectLite, type IProjectMap, type IProjectMemberLite, type IProjectView, type IProjectViewProps, type IPublicIssue, type IPublicVote, type ISearchIssueResponse, type ISlackIntegration, type ISlackIntegrationData, type IState, type IStateLite, type IStateResponse, type ISubIssueResponse, type ISubIssuesState, type IUser, type IUserAccount, type IUserActivity, type IUserActivityResponse, type IUserEmailNotificationSettings, type IUserLite, type IUserMemberLite, type IUserPriorityDistribution, type IUserProfileData, type IUserProfileProjectSegregation, type IUserProjectsRole, type IUserSettings, type IUserStateDistribution, type IUserTheme, type IWebWaitListResponse, type IWebhook, type IWorkItemPeekOverview, type IWorkspace, type IWorkspaceActiveCyclesResponse, type IWorkspaceAnalyticsResponse, type IWorkspaceBulkInviteFormData, type IWorkspaceDefaultSearchResult, type IWorkspaceIntegration, type IWorkspaceIssueFilterOptions, type IWorkspaceIssueSearchResult, type IWorkspaceLite, type IWorkspaceMember, type IWorkspaceMemberInvitation, type IWorkspaceMemberMe, type IWorkspacePageSearchResult, type IWorkspaceProgressResponse, type IWorkspaceProjectSearchResult, type IWorkspaceSearchResult, type IWorkspaceSearchResults, type IWorkspaceSidebarNavigation, type IWorkspaceSidebarNavigationItem, type IWorkspaceView, type IWorkspaceViewIssuesParams, type IWorkspaceViewProps, type InstructionType, type IssueCommentReaction, type IssueCommentReactionForm, type IssueDetail, type IssuePaginationOptions, type IssuePriorities, type IssueReactionForm, type IssueRelation, type MakeOptional, type ModuleIssueResponse, type ModuleLink, type PartialDeep, type ProjectDetail, type ProjectPreferences, type Properties, type SelectCycleType, type SelectModuleType, type TActivityEntityData, type TAnalyticsFilterParams, type TAnalyticsGraphsBase, type TAnalyticsTabsBase, type TAnchors, type TAreaChartProps, type TAreaItem, type TAssignedIssuesWidgetFilters, type TAssignedIssuesWidgetResponse, type TBarChartProps, type TBarChartShapeVariant, type TBarItem, type TBaseActivity, type TBaseActivityVerbs, type TBaseIssue, type TBillingFrequency, type TBottomSectionConfig, type TBulkIssueProperties, type TBulkOperationsPayload, type TCalendarLayouts, type TCellItem, type TChart, type TChartColorScheme, type TChartData, type TChartDatum, type TChartLegend, type TChartMargin, type TChartProps, type TCommandPaletteActionList, type TCommandPaletteShortcut, type TCommandPaletteShortcutList, type TCommentReaction, type TCommentsOperations, type TContentVisibility, type TCreatedIssuesWidgetFilters, type TCreatedIssuesWidgetResponse, type TCycleAssigneesDistribution, type TCycleCompletionChartDistribution, type TCycleDisplayFilters, type TCycleDistribution, type TCycleDistributionBase, type TCycleEstimateDistribution, type TCycleEstimateDistributionBase, type TCycleEstimateType, type TCycleFilters, type TCycleFiltersByState, type TCycleGroups, type TCycleLabelsDistribution, type TCycleLayoutOptions, type TCyclePlotType, type TCycleProgress, type TCycleSearchResponse, type TCycleStoredFilters, type TCycleTabOptions, type TDeDupeIssue, type TDeprecatedDashboard, type TDescriptionVersion, type TDescriptionVersionDetails, type TDescriptionVersionsListResponse, type TDocumentPayload, type TDropTarget, type TDropTargetMiscellaneousData, type TDuplicateAssetData, type TDuplicateAssetResponse, type TDuplicateIssuePayload, type TDuplicateIssueResponse, type TEditorAssetType, type TEmailCheckTypes, type TEpicAnalytics, type TEpicAnalyticsGroup, type TEstimatePointsObject, type TEstimateSystem, type TEstimateSystemKeys, type TEstimateSystems, type TEstimateTypeError, type TEstimateTypeErrorObject, type TEstimateUpdateStageKeys, type TFetchStatus, type TFileEntityInfo, type TFileMetaData, type TFileMetaDataLite, type TFileSignedURLResponse, type TGanttViews, type TGetBaseAuthenticationModeProps, type TGetColumns, type TGroupedIssueCount, type TGroupedIssues, type THomeDashboardResponse, type THomeWidgetKeys, type THomeWidgetProps, type TInboxDuplicateIssueDetails, type TInboxForm, type TInboxIssue, type TInboxIssueCurrentTab, type TInboxIssueFilter, type TInboxIssueFilterDateKeys, type TInboxIssueFilterMemberKeys, type TInboxIssueForm, type TInboxIssuePaginationInfo, type TInboxIssueSorting, type TInboxIssueSortingKeys, type TInboxIssueSortingOrderByKeys, type TInboxIssueSortingOrderByQueryParam, type TInboxIssueSortingOrderByQueryParamKeys, type TInboxIssueSortingSortByKeys, type TInboxIssueStatus, type TInboxIssueWithPagination, type TInboxIssuesQueryParams, type TInstanceAIConfigurationKeys, type TInstanceAuthenticationConfigurationKeys, type TInstanceAuthenticationKeys, type TInstanceAuthenticationMethodKeys, type TInstanceAuthenticationModes, type TInstanceConfigurationKeys, type TInstanceEmailConfigurationKeys, type TInstanceGithubAuthenticationConfigurationKeys, type TInstanceGitlabAuthenticationConfigurationKeys, type TInstanceGoogleAuthenticationConfigurationKeys, type TInstanceImageConfigurationKeys, type TInstanceIntercomConfigurationKeys, type TInstanceWorkspaceConfigurationKeys, type TIssue, type TIssueActivity, type TIssueActivityComment, type TIssueActivityIdMap, type TIssueActivityIssueDetail, type TIssueActivityMap, type TIssueActivityProjectDetail, type TIssueActivityUserDetail, type TIssueActivityWorkspaceDetail, type TIssueAttachment, type TIssueAttachmentIdMap, type TIssueAttachmentMap, type TIssueAttachmentUploadResponse, type TIssueComment, type TIssueCommentIdMap, type TIssueCommentMap, type TIssueCommentReaction, type TIssueCommentReactionIdMap, type TIssueCommentReactionMap, type TIssueEntityData, type TIssueExtraOptions, type TIssueGroupByOptions, type TIssueGroupingFilters, type TIssueKanbanFilters, type TIssueLayouts, type TIssueLink, type TIssueLinkEditableFields, type TIssueLinkIdMap, type TIssueLinkMap, type TIssueMap, type TIssueOrderByOptions, type TIssuePaginationData, type TIssueParams, type TIssuePriorities, type TIssuePublicComment, type TIssueReaction, type TIssueReactionIdMap, type TIssueReactionMap, type TIssueRelation, type TIssueRelationIdMap, type TIssueRelationMap, type TIssueRelationTypes, type TIssueResponseResults, type TIssueSearchResponse, type TIssueServiceType, type TIssueSubIssues, type TIssueSubIssuesIdMap, type TIssueSubIssuesStateDistributionMap, type TIssues, type TIssuesByPriorityWidgetFilters, type TIssuesByPriorityWidgetResponse, type TIssuesByStateGroupsWidgetFilters, type TIssuesByStateGroupsWidgetResponse, type TIssuesListTypes, type TIssuesResponse, type TLineChartProps, type TLineItem, type TLink, type TLinkEditableFields, type TLinkIdMap, type TLinkMap, type TLoader, type TLoginMediums, type TLogoProps, type TModuleAssigneesDistribution, type TModuleCompletionChartDistribution, type TModuleDisplayFilters, type TModuleDistribution, type TModuleDistributionBase, type TModuleEstimateDistribution, type TModuleEstimateDistributionBase, type TModuleFilters, type TModuleFiltersByState, type TModuleLabelsDistribution, type TModuleLayoutOptions, type TModuleOrderByOptions, type TModulePlotType, type TModuleSearchResponse, type TModuleStatus, type TModuleStoredFilters, type TNameDescriptionLoader, type TNotification, type TNotificationData, type TNotificationFilter, type TNotificationIssueLite, type TNotificationLite, type TNotificationPaginatedInfo, type TNotificationPaginatedInfoQueryParams, type TOnboardingSteps, type TOverviewStatsWidgetResponse, type TPage, type TPageEmbedType, type TPageEntityData, type TPageExtended, type TPageFilterProps, type TPageFilters, type TPageFiltersSortBy, type TPageFiltersSortKey, type TPageNavigationTabs, type TPageSearchResponse, type TPageVersion, type TPaginationData, type TPaginationInfo, type TPartialProject, type TPieChartProps, type TProductBillingFrequency, type TProductSubscriptionType, type TProfileViews, type TProgressChartData, type TProgressSnapshot, type TProject, type TProjectAnalyticsCount, type TProjectAnalyticsCountParams, type TProjectAppliedDisplayFilterKeys, type TProjectBaseActivity, type TProjectDetails, type TProjectDisplayFilters, type TProjectEntityData, type TProjectFilters, type TProjectIssuesSearchParams, type TProjectLink, type TProjectLinkEditableFields, type TProjectLinkIdMap, type TProjectLinkMap, type TProjectMembership, type TProjectOrderByOptions, type TProjectPublishLayouts, type TProjectPublishSettings, type TProjectPublishViewProps, type TProjectSearchResponse, type TProjectStoredFilters, type TPublicCycle, type TPublicIssueResponseResults, type TPublicIssuesResponse, type TPublicMember, type TPublicModule, type TPublishEntityType, type TPublishSettings, type TPublishViewDetails, type TPublishViewSettings, type TRadarChartProps, type TRadarItem, type TRecentActivityFilterKeys, type TRecentActivityWidgetResponse, type TRecentCollaboratorsWidgetResponse, type TRecentProjectsWidgetResponse, type TScatterChartProps, type TScatterPointItem, type TSearchEntities, type TSearchEntityRequestPayload, type TSearchResponse, type TSpreadsheetColumn, type TStateGroups, type TStateOperationsCallbacks, type TStaticViewTypes, type TSticky, type TSubGroupedIssues, type TSubIssueOperations, type TSubIssueResponse, type TSubIssuesStateDistribution, type TSubscriptionPrice, type TTemplateValues, type TTimezoneObject, type TTimezones, type TTopSectionConfig, type TUnGroupedIssues, type TUnreadNotificationsCount, type TUserPermissions, type TUserProfile, type TUserSearchResponse, type TViewFilterProps, type TViewFilters, type TViewFiltersSortBy, type TViewFiltersSortKey, type TWebhookConnectionQueryParams, type TWebhookEventTypes, type TWidget, type TWidgetEntityData, type TWidgetFiltersFormData, type TWidgetIssue, type TWidgetKeys, type TWidgetStatsRequestParams, type TWidgetStatsResponse, type TWorkItemWidgets, type TWorkspaceBaseActivity, type TWorkspaceDraftIssue, type TWorkspaceDraftIssueLoader, type TWorkspaceDraftPaginationInfo, type TWorkspaceDraftQueryParams, type TWorkspacePaginationInfo, type TreeMapChartProps, type TreeMapItem, type User, type UserAuth, type ViewFlags, type WeekMonthDataType, type WorkItemInsightColumns };
