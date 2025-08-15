
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
import { CircleUserIcon, EllipsisVerticalIcon, UserIcon } from 'lucide-react';
import React from 'react';
import { Link } from '@tanstack/react-router';


interface IUser {
  email: string;
  name: string;
}

export function NavUser({ user }: { user: IUser }) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale border">
                {/*<AvatarImage src={user.avatar} alt={user.name} />*/}
                <AvatarFallback className="rounded-lg">
                  <UserIcon className="size-4 text-muted-foreground"/>
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <EllipsisVerticalIcon className="ml-auto size-4"/>
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
                <Avatar className="h-8 w-8 rounded-lg">
                  {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                  <AvatarFallback className="rounded-lg uppercase">
                    {user.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to='.'>
                  <CircleUserIcon/>
                  <span>Account</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator/>
            {/*<LogoutButton/>*/}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
//
// const LogoutButton = () => {
//
//   const router = useRouter();
//
//   const { mutate, isPending } = useMutation({
//     mutationFn: () => authClient.signOut(),
//     onError: (error) => {
//       toast.error(error.name, { description: error.message });
//     },
//     onSuccess: async (data) => {
//       if (data.error) {
//         toast.error('Error', { description: data.error.message });
//         return;
//       }
//
//       router.replace('/');
//     }
//   });
//
//   return (
//     <DropdownMenuItem onClick={() => mutate()} disabled={isPending}>
//       {
//         isPending ?
//           <>
//             <LoaderCircle className="animate-spin"/>
//             <span>Logging out</span>
//           </> :
//           <>
//             <LogOutIcon/>
//             <span>Logout</span>
//           </>
//       }
//     </DropdownMenuItem>
//   );
//
// };
