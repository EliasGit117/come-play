import { createAccessControl } from 'better-auth/plugins/access';
import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access';

export const statements = {
  ...defaultStatements,
  news: ['list', 'get', 'create', 'update', 'delete'],
  banners: ['list', 'get', 'create', 'update', 'delete'],
  customerRequests: ['list', 'get', 'create', 'delete'],
} as const;

export const accessControl = createAccessControl(statements);

export const user = accessControl.newRole({
  news: ['list', 'get'],
  banners: ['list', 'get'],
});

export const admin = accessControl.newRole({
  ...adminAc.statements,
  news: statements.news,
  banners: statements.banners,
  customerRequests: statements.customerRequests,
});

export const roles = {
  user,
  admin,
};
