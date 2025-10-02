import * as _plane_types from '@plane/types';
import { IIssueLabel, IIssueLabelTree, ICalendarPayload, EStartOfTheWeek, CompleteOrEmpty, ICycle, TCycleFilters, TIssue, IState, IEstimatePoint, IModule, TFileSignedURLResponse, TFileMetaDataLite, IIssueFilters, TModuleOrderByOptions, TModuleDisplayFilters, TModuleFilters, TPageNavigationTabs, TPage, TPageFiltersSortKey, TPageFiltersSortBy, TPageFilterProps, EUserWorkspaceRoles, EUserProjectRoles, TProject, TProjectDisplayFilters, TProjectFilters, TProjectOrderByOptions, IProjectView, TViewFiltersSortKey, TViewFiltersSortBy, TViewFilterProps, EProductSubscriptionEnum, TProductSubscriptionType, TSubscriptionPrice, IPaymentProduct, TIssueGroupByOptions, TIssueOrderByOptions, TIssueParams, TStateGroups, IGanttBlock, TGroupedIssues, TUnGroupedIssues, TSubGroupedIssues, IIssueDisplayFilterOptions, IIssueDisplayProperties, IPartialProject, ISearchIssueResponse, IStateResponse, IWorkspace } from '@plane/types';
import { E_PASSWORD_STRENGTH, EAuthErrorCodes, TAuthErrorInfo, EEstimateSystem, EPastDurationFilters, EUserPermissions, ETabIndices, EIssueLayoutTypes, TIssuePriorities, TIssueFilterPriorityObject, TDraggableData } from '@plane/constants';
import { ClassValue } from 'clsx';
import * as react from 'react';
import * as lucide_react from 'lucide-react';

/**
 * @description Groups an array of objects by a specified key
 * @param {any[]} array Array to group
 * @param {string} key Key to group by (supports dot notation for nested objects)
 * @returns {Object} Grouped object with keys being the grouped values
 * @example
 * const array = [{type: 'A', value: 1}, {type: 'B', value: 2}, {type: 'A', value: 3}];
 * groupBy(array, 'type') // returns { A: [{type: 'A', value: 1}, {type: 'A', value: 3}], B: [{type: 'B', value: 2}] }
 */
declare const groupBy: (array: any[], key: string) => any;
/**
 * @description Orders an array by a specified key in ascending or descending order
 * @param {any[]} orgArray Original array to order
 * @param {string} key Key to order by (supports dot notation for nested objects)
 * @param {"ascending" | "descending"} ordering Sort order
 * @returns {any[]} Ordered array
 * @example
 * const array = [{value: 2}, {value: 1}, {value: 3}];
 * orderArrayBy(array, 'value', 'ascending') // returns [{value: 1}, {value: 2}, {value: 3}]
 */
declare const orderArrayBy: (orgArray: any[], key: string, ordering?: "ascending" | "descending") => any[];
/**
 * @description Checks if an array contains duplicate values
 * @param {any[]} array Array to check for duplicates
 * @returns {boolean} True if duplicates exist, false otherwise
 * @example
 * checkDuplicates([1, 2, 2, 3]) // returns true
 * checkDuplicates([1, 2, 3]) // returns false
 */
declare const checkDuplicates: (array: any[]) => boolean;
/**
 * @description Finds the string with the most characters in an array of strings
 * @param {string[]} strings Array of strings to check
 * @returns {string} String with the most characters
 * @example
 * findStringWithMostCharacters(['a', 'bb', 'ccc']) // returns 'ccc'
 */
declare const findStringWithMostCharacters: (strings: string[]) => string;
/**
 * @description Checks if two arrays have the same elements regardless of order
 * @param {any[] | null} arr1 First array
 * @param {any[] | null} arr2 Second array
 * @returns {boolean} True if arrays have same elements, false otherwise
 * @example
 * checkIfArraysHaveSameElements([1, 2], [2, 1]) // returns true
 * checkIfArraysHaveSameElements([1, 2], [1, 3]) // returns false
 */
declare const checkIfArraysHaveSameElements: (arr1: any[] | null, arr2: any[] | null) => boolean;
type GroupedItems<T> = {
    [key: string]: T[];
};
/**
 * @description Groups an array of objects by a specified field
 * @param {T[]} array Array to group
 * @param {keyof T} field Field to group by
 * @returns {GroupedItems<T>} Grouped object
 * @example
 * const array = [{type: 'A', value: 1}, {type: 'B', value: 2}];
 * groupByField(array, 'type') // returns { A: [{type: 'A', value: 1}], B: [{type: 'B', value: 2}] }
 */
declare const groupByField: <T>(array: T[], field: keyof T) => GroupedItems<T>;
/**
 * @description Sorts an array of objects by a specified field
 * @param {any[]} array Array to sort
 * @param {string} field Field to sort by
 * @returns {any[]} Sorted array
 * @example
 * const array = [{value: 2}, {value: 1}];
 * sortByField(array, 'value') // returns [{value: 1}, {value: 2}]
 */
declare const sortByField: (array: any[], field: string) => any[];
/**
 * @description Orders grouped data by a specified field
 * @param {GroupedItems<T>} groupedData Grouped data object
 * @param {keyof T} orderBy Field to order by
 * @returns {GroupedItems<T>} Ordered grouped data
 */
declare const orderGroupedDataByField: <T>(groupedData: GroupedItems<T>, orderBy: keyof T) => GroupedItems<T>;
/**
 * @description Builds a tree structure from an array of labels
 * @param {IIssueLabel[]} array Array of labels
 * @param {any} parent Parent ID
 * @returns {IIssueLabelTree[]} Tree structure
 */
declare const buildTree: (array: IIssueLabel[], parent?: null) => IIssueLabelTree[];
/**
 * @description Returns valid keys from object whose value is not falsy
 * @param {any} obj Object to check
 * @returns {string[]} Array of valid keys
 * @example
 * getValidKeysFromObject({a: 1, b: 0, c: null}) // returns ['a']
 */
declare const getValidKeysFromObject: (obj: any) => string[];
/**
 * @description Converts an array of strings into an object with boolean true values
 * @param {string[]} arrayStrings Array of strings
 * @returns {Object} Object with string keys and boolean values
 * @example
 * convertStringArrayToBooleanObject(['a', 'b']) // returns {a: true, b: true}
 */
declare const convertStringArrayToBooleanObject: (arrayStrings: string[]) => {
    [key: string]: boolean;
};

declare const generateFileName: (fileName: string) => string;
declare const getFileExtension: (filename: string) => string;
declare const getFileName: (fileName: string) => string;
declare const convertBytesToSize: (bytes: number) => string;

/**
 * @description Password strength levels
 */
declare enum PasswordStrength {
    EMPTY = "empty",
    WEAK = "weak",
    FAIR = "fair",
    GOOD = "good",
    STRONG = "strong"
}
/**
 * @description Password strength criteria type
 */
type PasswordCriterion = {
    regex: RegExp;
    description: string;
};
/**
 * @description Password strength criteria
 */
declare const PASSWORD_CRITERIA: {
    key: string;
    label: string;
    isCriteriaValid: (password: string) => boolean;
}[];
declare const getPasswordStrength: (password: string) => E_PASSWORD_STRENGTH;
declare const authErrorHandler: (errorCode: EAuthErrorCodes, email?: string | undefined) => TAuthErrorInfo | undefined;

/**
 * @returns {ICalendarPayload} calendar payload to render the calendar
 * @param {ICalendarPayload | null} currentStructure current calendar payload
 * @param {Date} startDate date of the month to render
 * @description Returns calendar payload to render the calendar, if currentStructure is null, it will generate the payload for the month of startDate, else it will construct the payload for the month of startDate and append it to the currentStructure
 */
declare const generateCalendarData: (currentStructure: ICalendarPayload | null, startDate: Date) => ICalendarPayload;
/**
 * Returns a new array sorted by the startOfWeek.
 * @param items Array of items to sort.
 * @param getDayIndex Function to get the day index (0-6) from an item.
 * @param startOfWeek The day to start the week on.
 */
declare const getOrderedDays: <T>(items: T[], getDayIndex: (item: T) => number, startOfWeek?: EStartOfTheWeek) => T[];

/**
 * Represents an RGB color with numeric values for red, green, and blue components
 * @typedef {Object} TRgb
 * @property {number} r - Red component (0-255)
 * @property {number} g - Green component (0-255)
 * @property {number} b - Blue component (0-255)
 */
type TRgb = {
    r: number;
    g: number;
    b: number;
};
type THsl = {
    h: number;
    s: number;
    l: number;
};
/**
 * @description Validates and clamps color values to RGB range (0-255)
 * @param {number} value - The color value to validate
 * @returns {number} Clamped and floored value between 0-255
 * @example
 * validateColor(-10) // returns 0
 * validateColor(300) // returns 255
 * validateColor(128) // returns 128
 */
declare const validateColor: (value: number) => number;
/**
 * Converts a decimal color value to two-character hex
 * @param {number} value - Decimal color value (0-255)
 * @returns {string} Two-character hex value with leading zero if needed
 */
declare const toHex: (value: number) => string;
/**
 * Converts a hexadecimal color code to RGB values
 * @param {string} hex - The hexadecimal color code (e.g., "#ff0000" for red)
 * @returns {RGB} An object containing the RGB values
 * @example
 * hexToRgb("#ff0000") // returns { r: 255, g: 0, b: 0 }
 * hexToRgb("#00ff00") // returns { r: 0, g: 255, b: 0 }
 * hexToRgb("#0000ff") // returns { r: 0, g: 0, b: 255 }
 */
declare const hexToRgb: (hex: string) => TRgb;
/**
 * Converts RGB values to a hexadecimal color code
 * @param {RGB} rgb - An object containing RGB values
 * @param {number} rgb.r - Red component (0-255)
 * @param {number} rgb.g - Green component (0-255)
 * @param {number} rgb.b - Blue component (0-255)
 * @returns {string} The hexadecimal color code (e.g., "#ff0000" for red)
 * @example
 * rgbToHex({ r: 255, g: 0, b: 0 }) // returns "#ff0000"
 * rgbToHex({ r: 0, g: 255, b: 0 }) // returns "#00ff00"
 * rgbToHex({ r: 0, g: 0, b: 255 }) // returns "#0000ff"
 */
declare const rgbToHex: ({ r, g, b }: TRgb) => string;
/**
 * Converts Hex values to HSL values
 * @param {string} hex - The hexadecimal color code (e.g., "#ff0000" for red)
 * @returns {HSL} An object containing the HSL values
 * @example
 * hexToHsl("#ff0000") // returns { h: 0, s: 100, l: 50 }
 * hexToHsl("#00ff00") // returns { h: 120, s: 100, l: 50 }
 * hexToHsl("#0000ff") // returns { h: 240, s: 100, l: 50 }
 */
declare const hexToHsl: (hex: string) => THsl;
/**
 * Converts HSL values to a hexadecimal color code
 * @param {HSL} hsl - An object containing HSL values
 * @param {number} hsl.h - Hue component (0-360)
 * @param {number} hsl.s - Saturation component (0-100)
 * @param {number} hsl.l - Lightness component (0-100)
 * @returns {string} The hexadecimal color code (e.g., "#ff0000" for red)
 * @example
 * hslToHex({ h: 0, s: 100, l: 50 }) // returns "#ff0000"
 * hslToHex({ h: 120, s: 100, l: 50 }) // returns "#00ff00"
 * hslToHex({ h: 240, s: 100, l: 50 }) // returns "#0000ff"
 */
declare const hslToHex: ({ h, s, l }: THsl) => string;
/**
 * Calculate relative luminance of a color according to WCAG
 * @param {Object} rgb - RGB color object with r, g, b properties
 * @returns {number} Relative luminance value
 */
declare const getLuminance: ({ r, g, b }: TRgb) => number;
/**
 * Calculate contrast ratio between two colors
 * @param {Object} rgb1 - First RGB color object
 * @param {Object} rgb2 - Second RGB color object
 * @returns {number} Contrast ratio between the colors
 */
declare function getContrastRatio(rgb1: {
    r: number;
    g: number;
    b: number;
}, rgb2: {
    r: number;
    g: number;
    b: number;
}): number;
/**
 * Lighten a color by a specified amount
 * @param {Object} rgb - RGB color object
 * @param {number} amount - Amount to lighten (0-1)
 * @returns {Object} Lightened RGB color
 */
declare function lightenColor(rgb: {
    r: number;
    g: number;
    b: number;
}, amount: number): {
    r: number;
    g: number;
    b: number;
};
/**
 * Darken a color by a specified amount
 * @param {Object} rgb - RGB color object
 * @param {number} amount - Amount to darken (0-1)
 * @returns {Object} Darkened RGB color
 */
declare function darkenColor(rgb: {
    r: number;
    g: number;
    b: number;
}, amount: number): {
    r: number;
    g: number;
    b: number;
};
/**
 * Generate appropriate foreground and background colors based on input color
 * @param {string} color - Input color in hex format
 * @returns {Object} Object containing foreground and background colors in hex format
 */
declare function generateIconColors(color: string): {
    foreground: string;
    background: string;
};
/**
 * @description Generates a deterministic HSL color based on input string
 * @param {string} input - Input string to generate color from
 * @returns {THsl} An object containing the HSL values
 * @example
 * generateRandomColor("hello") // returns consistent HSL color for "hello"
 * generateRandomColor("") // returns { h: 0, s: 0, l: 0 }
 */
declare const generateRandomColor: (input: string) => THsl;

declare const getSupportEmail: (defaultEmail?: string) => string;
declare const cn: (...inputs: ClassValue[]) => string;
/**
 * Extracts IDs from an array of objects with ID property
 */
declare const extractIds: <T extends {
    id: string;
}>(items: T[]) => string[];
/**
 * Checks if an ID exists and is valid within the provided list
 */
declare const isValidId: (id: string | null | undefined, validIds: string[]) => boolean;
/**
 * Filters an array to only include valid IDs
 */
declare const filterValidIds: (ids: string[], validIds: string[]) => string[];
/**
 * Filters an array to include only valid IDs, returning both valid and invalid IDs
 */
declare const partitionValidIds: (ids: string[], validIds: string[]) => {
    valid: string[];
    invalid: string[];
};
/**
 * Checks if an object is complete (has properties) rather than empty.
 * This helps TypeScript narrow the type from CompleteOrEmpty<T> to T.
 *
 * @param obj The object to check, typed as CompleteOrEmpty<T>
 * @returns A boolean indicating if the object is complete (true) or empty (false)
 */
declare const isComplete: <T>(obj: CompleteOrEmpty<T>) => obj is T;
declare const convertRemToPixel: (rem: number) => number;

/**
 * Orders cycles based on their status
 * @param {ICycle[]} cycles - Array of cycles to be ordered
 * @param {boolean} sortByManual - Whether to sort by manual order
 * @returns {ICycle[]} Ordered array of cycles
 */
declare const orderCycles: (cycles: ICycle[], sortByManual: boolean) => ICycle[];
/**
 * Filters cycles based on provided filter criteria
 * @param {ICycle} cycle - The cycle to be filtered
 * @param {TCycleFilters} filter - Filter criteria to apply
 * @returns {boolean} Whether the cycle passes the filter
 */
declare const shouldFilterCycle: (cycle: ICycle, filter: TCycleFilters) => boolean;
declare const formatActiveCycle: (args: {
    cycle: ICycle;
    isBurnDown?: boolean | undefined;
    isTypeIssue?: boolean | undefined;
}) => {
    date: string;
}[] | {
    date: any;
    scope: any;
    completed: any;
    backlog: any;
    started: any;
    unstarted: any;
    cancelled: any;
    pending: number;
    ideal: number | null;
    actual: any;
}[];

/**
 * @returns {string | null} formatted date in the desired format or platform default format (MMM dd, yyyy)
 * @description Returns date in the formatted format
 * @param {Date | string} date
 * @param {string} formatToken (optional) // default MMM dd, yyyy
 * @example renderFormattedDate("2024-01-01", "MM-DD-YYYY") // Jan 01, 2024
 * @example renderFormattedDate("2024-01-01") // Jan 01, 2024
 */
declare const renderFormattedDate: (date: string | Date | undefined | null, formatToken?: string) => string | undefined;
/**
 * @returns {string} formatted date in the format of MMM dd
 * @description Returns date in the formatted format
 * @param {string | Date} date
 * @example renderShortDateFormat("2024-01-01") // Jan 01
 */
declare const renderFormattedDateWithoutYear: (date: string | Date) => string;
/**
 * @returns {string | null} formatted date in the format of yyyy-mm-dd to be used in payload
 * @description Returns date in the formatted format to be used in payload
 * @param {Date | string} date
 * @example renderFormattedPayloadDate("Jan 01, 20224") // "2024-01-01"
 */
declare const renderFormattedPayloadDate: (date: Date | string | undefined | null) => string | undefined;
/**
 * @returns {string} formatted date in the format of hh:mm a or HH:mm
 * @description Returns date in 12 hour format if in12HourFormat is true else 24 hour format
 * @param {string | Date} date
 * @param {boolean} timeFormat (optional) // default 24 hour
 * @example renderFormattedTime("2024-01-01 13:00:00") // 13:00
 * @example renderFormattedTime("2024-01-01 13:00:00", "12-hour") // 01:00 PM
 */
declare const renderFormattedTime: (date: string | Date, timeFormat?: "12-hour" | "24-hour") => string;
/**
 * @returns {number} total number of days in range
 * @description Returns total number of days in range
 * @param {string} startDate
 * @param {string} endDate
 * @param {boolean} inclusive
 * @example checkIfStringIsDate("2021-01-01", "2021-01-08") // 8
 */
declare const findTotalDaysInRange: (startDate: Date | string | undefined | null, endDate: Date | string | undefined | null, inclusive?: boolean) => number | undefined;
/**
 * Add number of days to the provided date and return a resulting new date
 * @param startDate
 * @param numberOfDays
 * @returns
 */
declare const addDaysToDate: (startDate: Date | string | undefined | null, numberOfDays: number) => Date | undefined;
/**
 * @returns {number} number of days left from today
 * @description Returns number of days left from today
 * @param {string | Date} date
 * @param {boolean} inclusive (optional) // default true
 * @example findHowManyDaysLeft("2024-01-01") // 3
 */
declare const findHowManyDaysLeft: (date: Date | string | undefined | null, inclusive?: boolean) => number | undefined;
/**
 * @returns {string} formatted date in the form of amount of time passed since the event happened
 * @description Returns time passed since the event happened
 * @param {string | Date} time
 * @example calculateTimeAgo("2023-01-01") // 1 year ago
 */
declare const calculateTimeAgo: (time: string | number | Date | null) => string;
declare function calculateTimeAgoShort(date: string | number | Date | null): string;
/**
 * @returns {string} boolean value depending on whether the date is greater than today
 * @description Returns boolean value depending on whether the date is greater than today
 * @param {string} dateStr
 * @example isDateGreaterThanToday("2024-01-01") // true
 */
declare const isDateGreaterThanToday: (dateStr: string) => boolean;
/**
 * @returns {number} week number of date
 * @description Returns week number of date
 * @param {Date} date
 * @example getWeekNumber(new Date("2023-09-01")) // 35
 */
declare const getWeekNumberOfDate: (date: Date) => number;
/**
 * @returns {boolean} boolean value depending on whether the dates are equal
 * @description Returns boolean value depending on whether the dates are equal
 * @param date1
 * @param date2
 * @example checkIfDatesAreEqual("2024-01-01", "2024-01-01") // true
 * @example checkIfDatesAreEqual("2024-01-01", "2024-01-02") // false
 */
declare const checkIfDatesAreEqual: (date1: Date | string | null | undefined, date2: Date | string | null | undefined) => boolean;
/**
 * This method returns a date from string of type yyyy-mm-dd
 * This method is recommended to use instead of new Date() as this does not introduce any timezone offsets
 * @param date
 * @returns date or undefined
 */
declare const getDate: (date: string | Date | undefined | null) => Date | undefined;
declare const isInDateFormat: (date: string) => boolean;
/**
 * returns the date string in ISO format regardless of the timezone in input date string
 * @param dateString
 * @returns
 */
declare const convertToISODateString: (dateString: string | undefined) => string | undefined;
/**
 * returns the date string in Epoch regardless of the timezone in input date string
 * @param dateString
 * @returns
 */
declare const convertToEpoch: (dateString: string | undefined) => string | number | undefined;
/**
 * get current Date time in UTC ISO format
 * @returns
 */
declare const getCurrentDateTimeInISO: () => string;
/**
 * @description converts hours and minutes to minutes
 * @param { number } hours
 * @param { number } minutes
 * @returns { number } minutes
 * @example convertHoursMinutesToMinutes(2, 30) // Output: 150
 */
declare const convertHoursMinutesToMinutes: (hours: number, minutes: number) => number;
/**
 * @description converts minutes to hours and minutes
 * @param { number } mins
 * @returns { number, number } hours and minutes
 * @example convertMinutesToHoursAndMinutes(150) // Output: { hours: 2, minutes: 30 }
 */
declare const convertMinutesToHoursAndMinutes: (mins: number) => {
    hours: number;
    minutes: number;
};
/**
 * @description converts minutes to hours and minutes string
 * @param { number } totalMinutes
 * @returns { string } 0h 0m
 * @example convertMinutesToHoursAndMinutes(150) // Output: 2h 10m
 */
declare const convertMinutesToHoursMinutesString: (totalMinutes: number) => string;
/**
 * @description calculates the read time for a document using the words count
 * @param {number} wordsCount
 * @returns {number} total number of seconds
 * @example getReadTimeFromWordsCount(400) // Output: 120
 * @example getReadTimeFromWordsCount(100) // Output: 30s
 */
declare const getReadTimeFromWordsCount: (wordsCount: number) => number;
/**
 * @description generates an array of dates between the start and end dates
 * @param startDate
 * @param endDate
 * @returns
 */
declare const generateDateArray: (startDate: string | Date, endDate: string | Date) => {
    date: string;
}[];
/**
 * Processes relative date strings like "1_weeks", "2_months" etc and returns a Date
 * @param value The relative date string (e.g., "1_weeks", "2_months")
 * @returns Date object representing the calculated date
 */
declare const processRelativeDate: (value: string) => Date;
/**
 * Parses a date filter string and returns the comparison type and date
 * @param filterValue The date filter string (e.g., "1_weeks;after;fromnow" or "2024-12-01;after")
 * @returns Object containing the comparison type and target date
 */
declare const parseDateFilter: (filterValue: string) => {
    type: "after" | "before";
    date: Date;
};
/**
 * Checks if a date meets the filter criteria
 * @param dateToCheck The date to check
 * @param filterDate The filter date to compare against
 * @param type The type of comparison ('after' or 'before')
 * @returns boolean indicating if the date meets the criteria
 */
declare const checkDateCriteria: (dateToCheck: Date | null, filterDate: Date, type: "after" | "before") => boolean;
/**
 * Formats merged date range display with smart formatting
 * - Single date: "Jan 24, 2025"
 * - Same year, same month: "Jan 24 - 28, 2025"
 * - Same year, different month: "Jan 24 - Feb 6, 2025"
 * - Different year: "Dec 28, 2024 - Jan 4, 2025"
 */
declare const formatDateRange: (parsedStartDate: Date | null | undefined, parsedEndDate: Date | null | undefined) => string;

type DistributionObjectUpdate = {
    id: string;
    completed_issues?: number;
    pending_issues?: number;
    total_issues: number;
    completed_estimates?: number;
    pending_estimates?: number;
    total_estimates: number;
};
type DistributionUpdates = {
    pathUpdates: {
        path: string[];
        value: number;
    }[];
    assigneeUpdates: DistributionObjectUpdate[];
    labelUpdates: DistributionObjectUpdate[];
};
/**
 * Get Distribution updates with the help of previous and next issue states
 * @param prevIssueState
 * @param nextIssueState
 * @param stateMap
 * @param estimatePointById
 * @returns
 */
declare const getDistributionPathsPostUpdate: (prevIssueState: TIssue | undefined, nextIssueState: TIssue | undefined, stateMap: Record<string, IState>, estimatePointById?: (estimatePointId: string) => IEstimatePoint | undefined) => DistributionUpdates;
/**
 * Method to update distribution of either cycle or module object
 * @param distributionObject
 * @param distributionUpdates
 */
declare const updateDistribution: (distributionObject: ICycle | IModule, distributionUpdates: DistributionUpdates) => void;

type TEditorSrcArgs = {
    assetId: string;
    projectId?: string;
    workspaceSlug: string;
};
/**
 * @description generate the file source using assetId
 * @param {TEditorSrcArgs} args
 */
declare const getEditorAssetSrc: (args: TEditorSrcArgs) => string | undefined;
/**
 * @description generate the file source using assetId
 * @param {TEditorSrcArgs} args
 */
declare const getEditorAssetDownloadSrc: (args: TEditorSrcArgs) => string | undefined;
declare const getTextContent: (jsx: JSX.Element | React.ReactNode | null | undefined) => string;
declare const isEditorEmpty: (description: string | undefined) => boolean;

/**
 * Converts a hyphen-separated hexadecimal emoji code to its decimal representation
 * @param {string} emojiUnified - The unified emoji code in hexadecimal format (e.g., "1f600" or "1f1e6-1f1e8")
 * @returns {string} The decimal representation of the emoji code (e.g., "128512" or "127462-127464")
 * @example
 * convertHexEmojiToDecimal("1f600") // returns "128512"
 * convertHexEmojiToDecimal("1f1e6-1f1e8") // returns "127462-127464"
 * convertHexEmojiToDecimal("") // returns ""
 */
declare const convertHexEmojiToDecimal: (emojiUnified: string) => string;
/**
 * Converts a hyphen-separated decimal emoji code back to its hexadecimal representation
 * @param {string} emoji - The emoji code in decimal format (e.g., "128512" or "127462-127464")
 * @returns {string} The hexadecimal representation of the emoji code (e.g., "1f600" or "1f1e6-1f1e8")
 * @example
 * emojiCodeToUnicode("128512") // returns "1f600"
 * emojiCodeToUnicode("127462-127464") // returns "1f1e6-1f1e8"
 * emojiCodeToUnicode("") // returns ""
 */
declare const emojiCodeToUnicode: (emoji: string) => string;
/**
 * Groups reactions by a specified key
 * @param {any[]} reactions - Array of reaction objects
 * @param {string} key - Key to group reactions by
 * @returns {Object} Object with reactions grouped by the specified key
 */
declare const groupReactions: (reactions: any[], key: string) => {
    [key: string]: any[];
};
/**
 * Returns a random emoji code from the RANDOM_EMOJI_CODES array
 * @returns {string} A random emoji code
 */
declare const getRandomEmoji: () => string;

declare const isEstimatePointValuesRepeated: (estimatePoints: string[], estimateType: EEstimateSystem, newEstimatePoint?: string | undefined) => boolean;

/**
 * @description combine the file path with the base URL
 * @param {string} path
 * @returns {string} final URL with the base URL
 */
declare const getFileURL: (path: string) => string | undefined;
/**
 * @description from the provided signed URL response, generate a payload to be used to upload the file
 * @param {TFileSignedURLResponse} signedURLResponse
 * @param {File} file
 * @returns {FormData} file upload request payload
 */
declare const generateFileUploadPayload: (signedURLResponse: TFileSignedURLResponse, file: File) => FormData;
/**
 * @description returns the necessary file meta data to upload a file
 * @param {File} file
 * @returns {TFileMetaDataLite} payload with file info
 */
declare const getFileMetaDataForUpload: (file: File) => TFileMetaDataLite;
/**
 * @description this function returns the assetId from the asset source
 * @param {string} src
 * @returns {string} assetId
 */
declare const getAssetIdFromUrl: (src: string) => string;
/**
 * @description encode image via URL to base64
 * @param {string} url
 * @returns
 */
declare const getBase64Image: (url: string) => Promise<string>;
/**
 * @description downloads a CSV file
 * @param {Array<Array<string>> | { [key: string]: string }} data - The data to be exported to CSV
 * @param {string} name - The name of the file to be downloaded
 */
declare const csvDownload: (data: Array<Array<string>> | {
    [key: string]: string;
}, name: string) => void;

/**
 * @description calculates the total number of filters applied
 * @param {T} filters
 * @returns {number}
 */
declare const calculateTotalFilters: <T>(filters: T) => number;
/**
 * @description checks if the date satisfies the filter
 * @param {Date} date
 * @param {string} filter
 * @returns {boolean}
 */
declare const satisfiesDateFilter: (date: Date, filter: string) => boolean;
/**
 * @description checks if the issue filter is active
 * @param {IIssueFilters} issueFilters
 * @returns {boolean}
 */
declare const isIssueFilterActive: (issueFilters: IIssueFilters | undefined) => boolean;

declare const getIconForLink: (url: string) => react.ForwardRefExoticComponent<Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>>;

declare const getCustomDates: (duration: EPastDurationFilters) => string;

declare const getProgress: (completed: number | undefined, total: number | undefined) => number;

/**
 * @description orders modules based on their status
 * @param {IModule[]} modules
 * @param {TModuleOrderByOptions | undefined} orderByKey
 * @returns {IModule[]}
 */
declare const orderModules: (modules: IModule[], orderByKey: TModuleOrderByOptions | undefined) => IModule[];
/**
 * @description filters modules based on the filters
 * @param {IModule} module
 * @param {TModuleDisplayFilters} displayFilters
 * @param {TModuleFilters} filters
 * @returns {boolean}
 */
declare const shouldFilterModule: (module: IModule, displayFilters: TModuleDisplayFilters, filters: TModuleFilters) => boolean;

declare const sanitizeCommentForNotification: (mentionContent: string | undefined) => string | undefined;

/**
 * @description filters pages based on the page type
 * @param {TPageNavigationTabs} pageType
 * @param {TPage[]} pages
 * @returns {TPage[]}
 */
declare const filterPagesByPageType: (pageType: TPageNavigationTabs, pages: TPage[]) => TPage[];
/**
 * @description orders pages based on their status
 * @param {TPage[]} pages
 * @param {TPageFiltersSortKey | undefined} sortByKey
 * @param {TPageFiltersSortBy} sortByOrder
 * @returns {TPage[]}
 */
declare const orderPages: (pages: TPage[], sortByKey: TPageFiltersSortKey | undefined, sortByOrder: TPageFiltersSortBy) => TPage[];
/**
 * @description filters pages based on the filters
 * @param {TPage} page
 * @param {TPageFilterProps | undefined} filters
 * @returns {boolean}
 */
declare const shouldFilterPage: (page: TPage, filters: TPageFilterProps | undefined) => boolean;
/**
 * @description returns the name of the project after checking for untitled page
 * @param {string | undefined} name
 * @returns {string}
 */
declare const getPageName: (name: string | undefined) => string;

declare const getUserRole: (role: EUserPermissions | EUserWorkspaceRoles | EUserProjectRoles) => "GUEST" | "MEMBER" | "ADMIN" | undefined;
type TSupportedRole = EUserPermissions | EUserProjectRoles | EUserWorkspaceRoles;
/**
 * @description Returns the highest role from an array of supported roles
 * @param { TSupportedRole[] } roles
 * @returns { TSupportedRole | undefined }
 */
declare const getHighestRole: <T extends TSupportedRole>(roles: T[]) => T | undefined;

/**
 * Updates the sort order of the project.
 * @param sortIndex
 * @param destinationIndex
 * @param projectId
 * @returns number | undefined
 */
declare const orderJoinedProjects: (sourceIndex: number, destinationIndex: number, currentProjectId: string, joinedProjects: TProject[]) => number | undefined;
declare const projectIdentifierSanitizer: (identifier: string) => string;
/**
 * @description filters projects based on the filter
 * @param {TProject} project
 * @param {TProjectFilters} filters
 * @param {TProjectDisplayFilters} displayFilters
 * @returns {boolean}
 */
declare const shouldFilterProject: (project: TProject, displayFilters: TProjectDisplayFilters, filters: TProjectFilters) => boolean;
/**
 * @description orders projects based on the orderByKey
 * @param {TProject[]} projects
 * @param {TProjectOrderByOptions | undefined} orderByKey
 * @returns {TProject[]}
 */
declare const orderProjects: (projects: TProject[], orderByKey: TProjectOrderByOptions | undefined) => TProject[];

/**
 * order views base on TViewFiltersSortKey
 * @param views
 * @param sortByKey
 * @param sortByOrder
 * @returns
 */
declare const orderViews: (views: IProjectView[], sortByKey: TViewFiltersSortKey | undefined, sortByOrder: TViewFiltersSortBy) => IProjectView[];
/**
 * Checks if the passed down view should be filtered or not
 * @param view
 * @param filters
 * @returns
 */
declare const shouldFilterView: (view: IProjectView, filters: TViewFilterProps | undefined) => boolean;
/**
 * @description returns the name of the project after checking for untitled view
 * @param {string | undefined} name
 * @returns {string}
 */
declare const getViewName: (name: string | undefined) => string;
/**
 * Adds validation for the view creation filters
 * @param data
 * @returns
 */
declare const getValidatedViewFilters: (data: Partial<IProjectView>) => Partial<IProjectView>;
/**
 * returns published view link
 * @param anchor
 * @returns
 */
declare const getPublishViewLink: (anchor: string | undefined) => string | undefined;

declare const generateQueryParams: (searchParams: URLSearchParams, excludedParamKeys?: string[]) => string;

/**
 * @description Adds space between camelCase words
 * @param {string} str - String to add spaces to
 * @returns {string} String with spaces between camelCase words
 * @example
 * addSpaceIfCamelCase("camelCase") // returns "camel Case"
 * addSpaceIfCamelCase("thisIsATest") // returns "this Is A Test"
 */
declare const addSpaceIfCamelCase: (str: string) => string;
/**
 * @description Replaces underscores with spaces in snake_case strings
 * @param {string} str - String to replace underscores in
 * @returns {string} String with underscores replaced by spaces
 * @example
 * replaceUnderscoreIfSnakeCase("snake_case") // returns "snake case"
 */
declare const replaceUnderscoreIfSnakeCase: (str: string) => string;
/**
 * @description Truncates text to specified length and adds ellipsis
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length before truncation
 * @returns {string} Truncated string with ellipsis if needed
 * @example
 * truncateText("This is a long text", 7) // returns "This is..."
 */
declare const truncateText: (str: string, length: number) => string;
/**
 * @description Creates a similar string by randomly shuffling characters
 * @param {string} str - String to shuffle
 * @returns {string} Shuffled string with same characters
 * @example
 * createSimilarString("hello") // might return "olleh" or "lehol"
 */
declare const createSimilarString: (str: string) => string;
/**
 * @description Copies full URL (origin + path) to clipboard
 * @param {string} path - URL path to copy
 * @returns {Promise<void>} Promise that resolves when copying is complete
 * @example
 * await copyUrlToClipboard("issues/123") // copies "https://example.com/issues/123"
 */
declare const copyUrlToClipboard: (path: string) => Promise<void>;
/**
 * @description Gets first character of first word or first characters of first two words
 * @param {string} str - Input string
 * @returns {string} First character(s)
 * @example
 * getFirstCharacters("John") // returns "J"
 * getFirstCharacters("John Doe") // returns "JD"
 */
declare const getFirstCharacters: (str: string) => string;
/**
 * @description Formats number count, showing "99+" for numbers over 99
 * @param {number} number - Number to format
 * @returns {string} Formatted number string
 * @example
 * getNumberCount(50) // returns "50"
 * getNumberCount(100) // returns "99+"
 */
declare const getNumberCount: (number: number) => string;
/**
 * @description Converts object to URL query parameters string
 * @param {Object} obj - Object to convert
 * @returns {string} URL query parameters string
 * @example
 * objToQueryParams({ page: 1, search: "test" }) // returns "page=1&search=test"
 * objToQueryParams({ a: null, b: "test" }) // returns "b=test"
 */
declare const objToQueryParams: (obj: any) => string;
/**
 * @description: This function will capitalize the first letter of a string
 * @param str String
 * @returns String
 */
declare const capitalizeFirstLetter: (str: string) => string;
/**
 * @description : This function will remove all the HTML tags from the string
 * @param {string} htmlString
 * @return {string}
 * @example :
 * const html = "<p>Some text</p>";
const text = stripHTML(html);
console.log(text); // Some text
 */
declare const sanitizeHTML: (htmlString: string) => string;
/**
 * @description: This function will remove all the HTML tags from the string and truncate the string to the specified length
 * @param {string} html
 * @param {number} length
 * @return {string}
 * @example:
 * const html = "<p>Some text</p>";
 * const text = stripAndTruncateHTML(html);
 * console.log(text); // Some text
 */
declare const stripAndTruncateHTML: (html: string, length?: number) => string;
/**
 * @returns {boolean} true if email is valid, false otherwise
 * @description Returns true if email is valid, false otherwise
 * @param {string} email string to check if it is a valid email
 * @example checkEmailValidity("hello world") => false
 * @example checkEmailValidity("example@plane.so") => true
 */
declare const checkEmailValidity: (email: string) => boolean;
declare const isEmptyHtmlString: (htmlString: string, allowedHTMLTags?: string[]) => boolean;
/**
 * @description this function returns whether a comment is empty or not by checking for the following conditions-
 * 1. If comment is undefined
 * 2. If comment is an empty string
 * 3. If comment is "<p></p>"
 * @param {string | undefined} comment
 * @returns {boolean}
 */
declare const isCommentEmpty: (comment: string | undefined) => boolean;
/**
 * @description
 * This function test whether a URL is valid or not.
 *
 * It accepts URLs with or without the protocol.
 * @param {string} url
 * @returns {boolean}
 * @example
 * checkURLValidity("https://example.com") => true
 * checkURLValidity("example.com") => true
 * checkURLValidity("example") => false
 */
declare const checkURLValidity: (url: string) => boolean;
/**
 * Combines array elements with a separator and adds a conjunction before the last element
 * @param array Array of strings to combine
 * @param separator Separator to use between elements (default: ", ")
 * @param conjunction Conjunction to use before last element (default: "and")
 * @returns Combined string with conjunction before the last element
 */
declare const joinWithConjunction: (array: string[], separator?: string, conjunction?: string) => string;
/**
 * @description Ensures a URL has a protocol
 * @param {string} url
 * @returns {string}
 * @example
 * ensureUrlHasProtocol("example.com") => "http://example.com"
 */
declare const ensureUrlHasProtocol: (url: string) => string;
/**
 * @returns {boolean} true if searchQuery is substring of text in the same order, false otherwise
 * @description Returns true if searchQuery is substring of text in the same order, false otherwise
 * @param {string} text string to compare from
 * @param {string} searchQuery
 * @example substringMatch("hello world", "hlo") => true
 * @example substringMatch("hello world", "hoe") => false
 */
declare const substringMatch: (text: string, searchQuery: string) => boolean;
/**
 * @description Copies text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<void>} Promise that resolves when copying is complete
 * @example
 * await copyTextToClipboard("Hello, World!") // copies "Hello, World!" to clipboard
 */
declare const copyTextToClipboard: (text: string) => Promise<void>;
/**
 * @description Joins URL path segments properly, removing duplicate slashes using URL encoding
 * @param {...string} segments - URL path segments to join
 * @returns {string} Properly joined URL path
 * @example
 * joinUrlPath("/workspace", "/projects") => "/workspace/projects"
 * joinUrlPath("/workspace", "projects") => "/workspace/projects"
 * joinUrlPath("workspace", "projects") => "/workspace/projects"
 * joinUrlPath("/workspace/", "/projects/") => "/workspace/projects/"
 */
declare const joinUrlPath: (...segments: string[]) => string;

/**
 * Calculates the yearly discount percentage when switching from monthly to yearly billing
 * @param monthlyPrice - The monthly subscription price
 * @param yearlyPricePerMonth - The monthly equivalent price when billed yearly
 * @returns The discount percentage as a whole number (floored)
 */
declare const calculateYearlyDiscount: (monthlyPrice: number, yearlyPricePerMonth: number) => number;
/**
 * Gets the display name for a subscription plan variant
 * @param planVariant - The subscription plan variant enum
 * @returns The human-readable name of the plan
 */
declare const getSubscriptionName: (planVariant: EProductSubscriptionEnum) => string;
/**
 * Gets the base subscription name for upgrade/downgrade paths
 * @param planVariant - The current subscription plan variant
 * @param isSelfHosted - Whether the instance is self-hosted / community
 * @returns The name of the base subscription plan
 *
 * @remarks
 * - For self-hosted / community instances, the upgrade path differs from cloud instances
 * - Returns the immediate lower tier subscription name
 */
declare const getBaseSubscriptionName: (planVariant: TProductSubscriptionType, isSelfHosted: boolean) => string;
type TSubscriptionPriceDetail = {
    monthlyPriceDetails: TSubscriptionPrice;
    yearlyPriceDetails: TSubscriptionPrice;
};
/**
 * Gets the price details for a subscription product
 * @param product - The payment product to get price details for
 * @returns Array of price details for monthly and yearly plans
 */
declare const getSubscriptionPriceDetails: (product: IPaymentProduct | undefined) => TSubscriptionPriceDetail;

declare const getTabIndex: (type?: ETabIndices, isMobile?: boolean) => {
    getIndex: (key: string) => number | undefined;
    baseTabIndex: number;
};

declare const applyTheme: (palette: string, isDarkPalette: boolean) => void;
declare const unsetCustomCssVariables: () => void;
declare const resolveGeneralTheme: (resolvedTheme: string | undefined) => "dark" | "light" | "system";

type THandleIssuesMutation = (formData: Partial<TIssue>, oldGroupTitle: string, selectedGroupBy: TIssueGroupByOptions, issueIndex: number, orderBy: TIssueOrderByOptions, prevData?: {
    [key: string]: TIssue[];
} | TIssue[]) => {
    [key: string]: TIssue[];
} | TIssue[] | undefined;
declare const handleIssuesMutation: THandleIssuesMutation;
declare const handleIssueQueryParamsByLayout: (layout: EIssueLayoutTypes | undefined, viewType: "my_issues" | "issues" | "profile_issues" | "archived_issues" | "draft_issues" | "team_issues") => TIssueParams[] | null;
/**
 *
 * @description create a full issue payload with some default values. This function also parse the form field
 * like assignees, labels, etc. and add them to the payload
 * @param projectId project id to be added in the issue payload
 * @param formData partial issue data from the form. This will override the default values
 * @returns full issue payload with some default values
 */
declare const createIssuePayload: (projectId: string, formData: Partial<TIssue>) => TIssue;
/**
 * @description check if the issue due date should be highlighted
 * @param date
 * @param stateGroup
 * @returns boolean
 */
declare const shouldHighlightIssueDueDate: (date: string | Date | null, stateGroup: TStateGroups | undefined) => boolean;
declare const getIssueBlocksStructure: (block: TIssue) => IGanttBlock;
declare const formatTextList: (TextArray: string[]) => string;
declare const getDescriptionPlaceholderI18n: (isFocused: boolean, description: string | undefined) => string;
declare const issueCountBasedOnFilters: (issueIds: TGroupedIssues | TUnGroupedIssues | TSubGroupedIssues, layout: EIssueLayoutTypes, groupBy: string | undefined, subGroupBy: string | undefined) => number;
/**
 * @description This method is used to apply the display filters on the issues
 * @param {IIssueDisplayFilterOptions} displayFilters
 * @returns {IIssueDisplayFilterOptions}
 */
declare const getComputedDisplayFilters: (displayFilters?: IIssueDisplayFilterOptions, defaultValues?: IIssueDisplayFilterOptions) => IIssueDisplayFilterOptions;
/**
 * @description This method is used to apply the display properties on the issues
 * @param {IIssueDisplayProperties} displayProperties
 * @returns {IIssueDisplayProperties}
 */
declare const getComputedDisplayProperties: (displayProperties?: IIssueDisplayProperties) => IIssueDisplayProperties;
/**
 * This is to check if the issues list api should fall back to server or use local db
 * @param queries
 * @returns
 */
declare const getIssuesShouldFallbackToServer: (queries: any) => boolean;
declare const generateWorkItemLink: ({ workspaceSlug, projectId, issueId, projectIdentifier, sequenceId, isArchived, isEpic, }: {
    workspaceSlug: string | undefined | null;
    projectId: string | undefined | null;
    issueId: string | undefined | null;
    projectIdentifier: string | undefined | null;
    sequenceId: string | number | undefined | null;
    isArchived?: boolean;
    isEpic?: boolean;
}) => string;
declare const getIssuePriorityFilters: (priorityKey: TIssuePriorities) => TIssueFilterPriorityObject | undefined;

declare const getUpdateFormDataForReset: (projectId: string | null | undefined, formData: Partial<TIssue>) => {
    project_id: string | null | undefined;
    name: string | undefined;
    description_html: string | undefined;
    priority: _plane_types.TIssuePriorities | null | undefined;
    start_date: string | null | undefined;
    target_date: string | null | undefined;
    id?: string | undefined;
    sequence_id?: number | undefined;
    sort_order?: number | undefined;
    state_id?: string | null | undefined;
    label_ids?: string[] | undefined;
    assignee_ids?: string[] | undefined;
    estimate_point?: string | null | undefined;
    sub_issues_count?: number | undefined;
    attachment_count?: number | undefined;
    link_count?: number | undefined;
    parent_id?: string | null | undefined;
    cycle_id?: string | null | undefined;
    module_ids?: string[] | null | undefined;
    type_id?: string | null | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    completed_at?: string | null | undefined;
    archived_at?: string | null | undefined;
    created_by?: string | undefined;
    updated_by?: string | undefined;
    is_draft?: boolean | undefined;
    is_epic?: boolean | undefined;
    is_subscribed?: boolean | undefined;
    parent?: Partial<_plane_types.TBaseIssue> | undefined;
    issue_reactions?: _plane_types.TIssueReaction[] | undefined;
    issue_attachments?: _plane_types.TIssueAttachment[] | undefined;
    issue_link?: _plane_types.TIssueLink[] | undefined;
    issue_relation?: _plane_types.IssueRelation[] | undefined;
    issue_related?: _plane_types.IssueRelation[] | undefined;
    tempId?: string | undefined;
    sourceIssueId?: string | undefined;
    state__group?: string | null | undefined;
};
declare const convertWorkItemDataToSearchResponse: (workspaceSlug: string, workItem: TIssue, project: IPartialProject | undefined, state: IState | undefined) => ISearchIssueResponse;
declare function getChangedIssuefields(formData: Partial<TIssue>, dirtyFields: {
    [key: string]: boolean | undefined;
}): Partial<TIssue>;

declare const orderStateGroups: (unorderedStateGroups: IStateResponse | undefined) => IStateResponse | undefined;
declare const sortStates: (states: IState[]) => IState[] | undefined;
declare const getCurrentStateSequence: (groupSates: IState[], destinationData: TDraggableData, edge: string | undefined) => number | undefined;

declare const orderWorkspacesList: (workspaces: IWorkspace[]) => IWorkspace[];

export { type DistributionObjectUpdate, type DistributionUpdates, PASSWORD_CRITERIA, type PasswordCriterion, PasswordStrength, type THsl, type TRgb, type TSubscriptionPriceDetail, addDaysToDate, addSpaceIfCamelCase, applyTheme, authErrorHandler, buildTree, calculateTimeAgo, calculateTimeAgoShort, calculateTotalFilters, calculateYearlyDiscount, capitalizeFirstLetter, checkDateCriteria, checkDuplicates, checkEmailValidity, checkIfArraysHaveSameElements, checkIfDatesAreEqual, checkURLValidity, cn, convertBytesToSize, convertHexEmojiToDecimal, convertHoursMinutesToMinutes, convertMinutesToHoursAndMinutes, convertMinutesToHoursMinutesString, convertRemToPixel, convertStringArrayToBooleanObject, convertToEpoch, convertToISODateString, convertWorkItemDataToSearchResponse, copyTextToClipboard, copyUrlToClipboard, createIssuePayload, createSimilarString, csvDownload, darkenColor, emojiCodeToUnicode, ensureUrlHasProtocol, extractIds, filterPagesByPageType, filterValidIds, findHowManyDaysLeft, findStringWithMostCharacters, findTotalDaysInRange, formatActiveCycle, formatDateRange, formatTextList, generateCalendarData, generateDateArray, generateFileName, generateFileUploadPayload, generateIconColors, generateQueryParams, generateRandomColor, generateWorkItemLink, getAssetIdFromUrl, getBase64Image, getBaseSubscriptionName, getChangedIssuefields, getComputedDisplayFilters, getComputedDisplayProperties, getContrastRatio, getCurrentDateTimeInISO, getCurrentStateSequence, getCustomDates, getDate, getDescriptionPlaceholderI18n, getDistributionPathsPostUpdate, getEditorAssetDownloadSrc, getEditorAssetSrc, getFileExtension, getFileMetaDataForUpload, getFileName, getFileURL, getFirstCharacters, getHighestRole, getIconForLink, getIssueBlocksStructure, getIssuePriorityFilters, getIssuesShouldFallbackToServer, getLuminance, getNumberCount, getOrderedDays, getPageName, getPasswordStrength, getProgress, getPublishViewLink, getRandomEmoji, getReadTimeFromWordsCount, getSubscriptionName, getSubscriptionPriceDetails, getSupportEmail, getTabIndex, getTextContent, getUpdateFormDataForReset, getUserRole, getValidKeysFromObject, getValidatedViewFilters, getViewName, getWeekNumberOfDate, groupBy, groupByField, groupReactions, handleIssueQueryParamsByLayout, handleIssuesMutation, hexToHsl, hexToRgb, hslToHex, isCommentEmpty, isComplete, isDateGreaterThanToday, isEditorEmpty, isEmptyHtmlString, isEstimatePointValuesRepeated, isInDateFormat, isIssueFilterActive, isValidId, issueCountBasedOnFilters, joinUrlPath, joinWithConjunction, lightenColor, objToQueryParams, orderArrayBy, orderCycles, orderGroupedDataByField, orderJoinedProjects, orderModules, orderPages, orderProjects, orderStateGroups, orderViews, orderWorkspacesList, parseDateFilter, partitionValidIds, processRelativeDate, projectIdentifierSanitizer, renderFormattedDate, renderFormattedDateWithoutYear, renderFormattedPayloadDate, renderFormattedTime, replaceUnderscoreIfSnakeCase, resolveGeneralTheme, rgbToHex, sanitizeCommentForNotification, sanitizeHTML, satisfiesDateFilter, shouldFilterCycle, shouldFilterModule, shouldFilterPage, shouldFilterProject, shouldFilterView, shouldHighlightIssueDueDate, sortByField, sortStates, stripAndTruncateHTML, substringMatch, toHex, truncateText, unsetCustomCssVariables, updateDistribution, validateColor };
