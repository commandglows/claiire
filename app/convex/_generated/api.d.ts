/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as achievements from "../achievements.js";
import type * as analytics from "../analytics.js";
import type * as calendar from "../calendar.js";
import type * as charts from "../charts.js";
import type * as companion from "../companion.js";
import type * as daily from "../daily.js";
import type * as discovery from "../discovery.js";
import type * as gamification from "../gamification.js";
import type * as habits from "../habits.js";
import type * as interventions from "../interventions.js";
import type * as lib from "../lib.js";
import type * as predictions from "../predictions.js";
import type * as recap from "../recap.js";
import type * as routines from "../routines.js";
import type * as schema from "../schema.js";
import type * as tracking from "../tracking.js";
import type * as triggers from "../triggers.js";
import type * as users from "../users.js";

declare const fullApi: ApiFromModules<{
  achievements: typeof achievements;
  analytics: typeof analytics;
  calendar: typeof calendar;
  charts: typeof charts;
  companion: typeof companion;
  daily: typeof daily;
  discovery: typeof discovery;
  gamification: typeof gamification;
  habits: typeof habits;
  interventions: typeof interventions;
  lib: typeof lib;
  predictions: typeof predictions;
  recap: typeof recap;
  routines: typeof routines;
  schema: typeof schema;
  tracking: typeof tracking;
  triggers: typeof triggers;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
