import { createFileRoute, Outlet } from '@tanstack/react-router';
import AppHeader from '../../components/layout/app-header';

export const Route = createFileRoute('/(main)')({
  component: RouteComponent,
});

function RouteComponent() {
  const { userSession } = Route.useRouteContext();

  return (
    <>
      <AppHeader user={userSession?.user}/>
      <Outlet/>
    </>
  );
}
