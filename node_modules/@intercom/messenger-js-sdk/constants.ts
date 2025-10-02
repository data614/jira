import * as IntercomTypes from "./types";

export const regionAPIs: Map<IntercomTypes.Regions, string> = new Map([
  ["us", "https://api-iam.intercom.io"],
  ["eu", "https://api-iam.eu.intercom.io"],
  ["ap", "https://api-iam.au.intercom.io"]
]);