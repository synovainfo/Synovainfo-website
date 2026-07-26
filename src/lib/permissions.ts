// =============================================================================
// Permission definitions and role-permission matrix for Synova CMS
// Extensible — add new permission strings to the map and assign in matrix
// =============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Single permission string, e.g. "pages:create" */
export type Permission = string;

/** Map of all available permission keys to their string values */
export type PermissionMap = Record<string, Permission>;

/** Known role identifiers from the User model */
export type Role = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "VIEWER";

// ---------------------------------------------------------------------------
// Permission constants
// Every permission in this map is available for assignment.
// Convention: "{resource}:{action}"
// ---------------------------------------------------------------------------
export const Permissions = {
  // ── Pages ─────────────────────────────────────────────────────────────
  PAGES_CREATE: "pages:create",
  PAGES_READ: "pages:read",
  PAGES_UPDATE: "pages:update",
  PAGES_DELETE: "pages:delete",
  PAGES_PUBLISH: "pages:publish",
  PAGES_MANAGE: "pages:manage",

  // ── Services ──────────────────────────────────────────────────────────
  SERVICES_CREATE: "services:create",
  SERVICES_READ: "services:read",
  SERVICES_UPDATE: "services:update",
  SERVICES_DELETE: "services:delete",
  SERVICES_PUBLISH: "services:publish",
  SERVICES_MANAGE: "services:manage",

  // ── Industries ────────────────────────────────────────────────────────
  INDUSTRIES_CREATE: "industries:create",
  INDUSTRIES_READ: "industries:read",
  INDUSTRIES_UPDATE: "industries:update",
  INDUSTRIES_DELETE: "industries:delete",
  INDUSTRIES_PUBLISH: "industries:publish",
  INDUSTRIES_MANAGE: "industries:manage",

  // ── Blog ──────────────────────────────────────────────────────────────
  BLOG_CREATE: "blog:create",
  BLOG_READ: "blog:read",
  BLOG_UPDATE: "blog:update",
  BLOG_DELETE: "blog:delete",
  BLOG_PUBLISH: "blog:publish",
  BLOG_MANAGE: "blog:manage",

  // ── Media ─────────────────────────────────────────────────────────────
  MEDIA_CREATE: "media:create",
  MEDIA_READ: "media:read",
  MEDIA_UPDATE: "media:update",
  MEDIA_DELETE: "media:delete",
  MEDIA_MANAGE: "media:manage",

  // ── Users ─────────────────────────────────────────────────────────────
  USERS_CREATE: "users:create",
  USERS_READ: "users:read",
  USERS_UPDATE: "users:update",
  USERS_DELETE: "users:delete",
  USERS_MANAGE: "users:manage",

  // ── Roles ─────────────────────────────────────────────────────────────
  ROLES_CREATE: "roles:create",
  ROLES_READ: "roles:read",
  ROLES_UPDATE: "roles:update",
  ROLES_DELETE: "roles:delete",
  ROLES_MANAGE: "roles:manage",

  // ── Settings ──────────────────────────────────────────────────────────
  SETTINGS_READ: "settings:read",
  SETTINGS_UPDATE: "settings:update",
  SETTINGS_MANAGE: "settings:manage",

  // ── Audit ─────────────────────────────────────────────────────────────
  AUDIT_READ: "audit:read",
  AUDIT_EXPORT: "audit:export",

  // ── Leads ─────────────────────────────────────────────────────────────
  LEADS_READ: "leads:read",
  LEADS_UPDATE: "leads:update",
  LEADS_EXPORT: "leads:export",
  LEADS_MANAGE: "leads:manage",

  // ── Newsletter ────────────────────────────────────────────────────────
  NEWSLETTER_CREATE: "newsletter:create",
  NEWSLETTER_READ: "newsletter:read",
  NEWSLETTER_UPDATE: "newsletter:update",
  NEWSLETTER_DELETE: "newsletter:delete",
  NEWSLETTER_SEND: "newsletter:send",
  NEWSLETTER_MANAGE: "newsletter:manage",

  // ── Forms ─────────────────────────────────────────────────────────────
  FORMS_CREATE: "forms:create",
  FORMS_READ: "forms:read",
  FORMS_UPDATE: "forms:update",
  FORMS_DELETE: "forms:delete",
  FORMS_MANAGE: "forms:manage",

  // ── Resources ─────────────────────────────────────────────────────────
  RESOURCES_CREATE: "resources:create",
  RESOURCES_READ: "resources:read",
  RESOURCES_UPDATE: "resources:update",
  RESOURCES_DELETE: "resources:delete",
  RESOURCES_MANAGE: "resources:manage",

  // ── Downloads ─────────────────────────────────────────────────────────
  DOWNLOADS_CREATE: "downloads:create",
  DOWNLOADS_READ: "downloads:read",
  DOWNLOADS_UPDATE: "downloads:update",
  DOWNLOADS_DELETE: "downloads:delete",
  DOWNLOADS_MANAGE: "downloads:manage",

  // ── SEO ───────────────────────────────────────────────────────────────
  SEO_READ: "seo:read",
  SEO_UPDATE: "seo:update",
  SEO_MANAGE: "seo:manage",

  // ── Site Config ───────────────────────────────────────────────────────
  SITE_CONFIG_READ: "site-config:read",
  SITE_CONFIG_UPDATE: "site-config:update",
  SITE_CONFIG_MANAGE: "site-config:manage",

  // ── Theme ─────────────────────────────────────────────────────────────
  THEME_READ: "theme:read",
  THEME_UPDATE: "theme:update",
  THEME_MANAGE: "theme:manage",
} as const;

// ---------------------------------------------------------------------------
// Flattened permission string array (all values in Permissions)
// ---------------------------------------------------------------------------
export const ALL_PERMISSIONS: Permission[] = Object.values(Permissions);

// ---------------------------------------------------------------------------
// Role → Permission matrix
// ---------------------------------------------------------------------------

/**
 * Every permission in the system, grouped by role.
 * To extend: add new permission entries to Permissions above, then
 * include them in the appropriate role array below.
 */
export const rolePermissions: Record<Role, Permission[]> = {
  // ── SUPER_ADMIN: everything ────────────────────────────────────────────
  SUPER_ADMIN: ALL_PERMISSIONS,

  // ── ADMIN: all content management, no user/role management ─────────────
  ADMIN: [
    // Pages
    Permissions.PAGES_CREATE,
    Permissions.PAGES_READ,
    Permissions.PAGES_UPDATE,
    Permissions.PAGES_DELETE,
    Permissions.PAGES_PUBLISH,
    Permissions.PAGES_MANAGE,
    // Services
    Permissions.SERVICES_CREATE,
    Permissions.SERVICES_READ,
    Permissions.SERVICES_UPDATE,
    Permissions.SERVICES_DELETE,
    Permissions.SERVICES_PUBLISH,
    Permissions.SERVICES_MANAGE,
    // Industries
    Permissions.INDUSTRIES_CREATE,
    Permissions.INDUSTRIES_READ,
    Permissions.INDUSTRIES_UPDATE,
    Permissions.INDUSTRIES_DELETE,
    Permissions.INDUSTRIES_PUBLISH,
    Permissions.INDUSTRIES_MANAGE,
    // Blog
    Permissions.BLOG_CREATE,
    Permissions.BLOG_READ,
    Permissions.BLOG_UPDATE,
    Permissions.BLOG_DELETE,
    Permissions.BLOG_PUBLISH,
    Permissions.BLOG_MANAGE,
    // Media
    Permissions.MEDIA_CREATE,
    Permissions.MEDIA_READ,
    Permissions.MEDIA_UPDATE,
    Permissions.MEDIA_DELETE,
    Permissions.MEDIA_MANAGE,
    // Settings
    Permissions.SETTINGS_READ,
    Permissions.SETTINGS_UPDATE,
    Permissions.SETTINGS_MANAGE,
    // Audit
    Permissions.AUDIT_READ,
    Permissions.AUDIT_EXPORT,
    // Leads
    Permissions.LEADS_READ,
    Permissions.LEADS_UPDATE,
    Permissions.LEADS_EXPORT,
    Permissions.LEADS_MANAGE,
    // Newsletter
    Permissions.NEWSLETTER_CREATE,
    Permissions.NEWSLETTER_READ,
    Permissions.NEWSLETTER_UPDATE,
    Permissions.NEWSLETTER_DELETE,
    Permissions.NEWSLETTER_SEND,
    Permissions.NEWSLETTER_MANAGE,
    // Forms
    Permissions.FORMS_CREATE,
    Permissions.FORMS_READ,
    Permissions.FORMS_UPDATE,
    Permissions.FORMS_DELETE,
    Permissions.FORMS_MANAGE,
    // Resources
    Permissions.RESOURCES_CREATE,
    Permissions.RESOURCES_READ,
    Permissions.RESOURCES_UPDATE,
    Permissions.RESOURCES_DELETE,
    Permissions.RESOURCES_MANAGE,
    // Downloads
    Permissions.DOWNLOADS_CREATE,
    Permissions.DOWNLOADS_READ,
    Permissions.DOWNLOADS_UPDATE,
    Permissions.DOWNLOADS_DELETE,
    Permissions.DOWNLOADS_MANAGE,
    // SEO
    Permissions.SEO_READ,
    Permissions.SEO_UPDATE,
    Permissions.SEO_MANAGE,
    // Site Config
    Permissions.SITE_CONFIG_READ,
    Permissions.SITE_CONFIG_UPDATE,
    Permissions.SITE_CONFIG_MANAGE,
    // Theme
    Permissions.THEME_READ,
    Permissions.THEME_UPDATE,
    Permissions.THEME_MANAGE,
  ],

  // ── EDITOR: create + edit content, cannot publish, delete, or manage users ──
  EDITOR: [
    Permissions.PAGES_CREATE,
    Permissions.PAGES_READ,
    Permissions.PAGES_UPDATE,
    Permissions.SERVICES_CREATE,
    Permissions.SERVICES_READ,
    Permissions.SERVICES_UPDATE,
    Permissions.INDUSTRIES_CREATE,
    Permissions.INDUSTRIES_READ,
    Permissions.INDUSTRIES_UPDATE,
    Permissions.BLOG_CREATE,
    Permissions.BLOG_READ,
    Permissions.BLOG_UPDATE,
    Permissions.MEDIA_CREATE,
    Permissions.MEDIA_READ,
    Permissions.MEDIA_UPDATE,
    Permissions.LEADS_READ,
    Permissions.LEADS_UPDATE,
    Permissions.NEWSLETTER_READ,
    Permissions.FORMS_READ,
    Permissions.SEO_READ,
    Permissions.SITE_CONFIG_READ,
    Permissions.THEME_READ,
  ],

  // ── VIEWER: read-only access ───────────────────────────────────────────
  VIEWER: [
    Permissions.PAGES_READ,
    Permissions.SERVICES_READ,
    Permissions.INDUSTRIES_READ,
    Permissions.BLOG_READ,
    Permissions.MEDIA_READ,
    Permissions.SETTINGS_READ,
    Permissions.AUDIT_READ,
    Permissions.LEADS_READ,
    Permissions.NEWSLETTER_READ,
    Permissions.FORMS_READ,
    Permissions.SEO_READ,
    Permissions.SITE_CONFIG_READ,
    Permissions.THEME_READ,
  ],
};

// ---------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------

/**
 * Check whether a role has a specific permission.
 * Falls back to VIEWER if the role is unknown.
 */
export function hasPermission(role: string, permission: string): boolean {
  const permissions = rolePermissions[role as Role];
  if (!permissions) return false;
  return permissions.includes(permission);
}

/**
 * Get all permissions for a given role.
 * Returns an empty array for unknown roles.
 */
export function getPermissions(role: string): string[] {
  return rolePermissions[role as Role] ?? [];
}
