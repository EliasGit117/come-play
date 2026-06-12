import { createAccessControl } from 'better-auth/plugins/access';
import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access';

export const statements = {
  ...defaultStatements,
  news: ['list', 'get', 'create', 'update', 'delete'],
  categories: ['list', 'get', 'create', 'update', 'delete'],
  subcategories: ['list', 'get', 'create', 'update', 'delete'],
  products: ['list', 'get', 'create', 'update', 'delete'],
  banners: ['list', 'get', 'create', 'update', 'delete'],
} as const;

export const accessControl = createAccessControl(statements);

export const user = accessControl.newRole({
  news: ['list', 'get'],
  categories: ['list', 'get'],
  subcategories: ['list', 'get'],
  products: ['list', 'get'],
  banners: ['list', 'get'],
});

export const admin = accessControl.newRole({
  ...adminAc.statements,
  news: statements.news,
  categories: statements.categories,
  subcategories: statements.subcategories,
  products: statements.products,
  banners: statements.banners,
});

export const roles = {
  user,
  admin,
};
