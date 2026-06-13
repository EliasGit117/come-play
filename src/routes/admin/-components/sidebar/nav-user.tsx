import { IconDotsVertical, IconLogout, IconUserCircle } from '@tabler/icons-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import { Link } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth';
import { orpc } from '@/lib/orpc';
import { Spinner } from '@/components/ui/spinner';
import { pickFirstLetters } from '@/utils/text';
import { useAuth } from '@/hooks/use-auth';
import { m } from '@/paraglide/messages';


export function NavUser() {
  const { isMobile } = useSidebar();
  const { user } = useAuth();

  if (!user)
    return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 after:rounded-md">
                <AvatarFallback className="rounded-lg uppercase">
                  {pickFirstLetters(user.name, 2, 'uppercase')}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4"/>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 after:rounded-md">
                  <AvatarFallback className="rounded-lg uppercase">
                    {pickFirstLetters(user.name, 2, 'uppercase')}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium text-foreground">
                    {user.name}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to=".">
                  <IconUserCircle/>
                  <span>{m['pages.admin.user.account']()}</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator/>
            <LogoutButton/>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}


const LogoutButton = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => authClient.signOut(),
    onError: (error) => {
      toast.error(error.name, { description: error.message });
    },
    onSuccess: async (data) => {
      if (data.error) {
        toast.error('Error', { description: data.error.message });
        return;
      }

      await queryClient.invalidateQueries({ queryKey: orpc.sessions.current.queryKey() });
    }
  });

  return (
    <DropdownMenuItem variant="destructive" onClick={() => mutate()} disabled={isPending}>
      {
        isPending ?
          <>
            <Spinner/>
            <span>{m['pages.admin.user.loggingOut']()}</span>
          </> :
          <>
            <IconLogout/>
            <span>{m['pages.admin.user.logout']()}</span>
          </>
      }
    </DropdownMenuItem>
  );

};
