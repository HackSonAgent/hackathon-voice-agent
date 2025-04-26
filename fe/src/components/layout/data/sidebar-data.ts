import {
  // IconBarrierBlock,
  // IconBrowserCheck,
  // IconBug,
  // IconChecklist,
  // IconError404,
  IconHelp,
  IconLayoutDashboard,
  // IconLock,
  // IconLockAccess,
  // IconNotification,
  // IconPackages,
  // IconPalette,
  // IconServerOff,
  IconSettings,
  // IconTool,
  IconAi
  // IconUserOff,
} from '@tabler/icons-react'
import {
  AudioWaveform,
  MoonStar,
  GalleryVerticalEnd,
  BrainCog,
  ScrollText
  // SquareKanban
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: '0xDEADBEEF',
    email: '0xDEADBEEF@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1527842891421-42eec6e703ea?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  teams: [
    {
      name: 'Luna',
      logo: MoonStar,
      mode: 'Sales Agent Mode',
    },
    {
      name: 'Shopper',
      logo: GalleryVerticalEnd,
      mode: 'Price Assistant',
    },
    {
      name: 'Fashion',
      logo: AudioWaveform,
      mode: 'Fashion Assistant',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Agent',
          url: '/agent',
          icon: BrainCog,
        },
        {
          title: 'History',
          url: '/history',
          icon: ScrollText,
        },
        // {
        //   title: 'Tasks',
        //   url: '/tasks',
        //   icon: IconChecklist,
        // },
        // {
        //   title: 'Apps',
        //   url: '/apps',
        //   icon: IconPackages,
        // },
        // {
        //   title: 'Kanban',
        //   url: '/kanban',
        //   icon: SquareKanban,
        // },
      ],
    },
    // {
    //   title: 'Pages',
    //   items: [
    //     {
    //       title: 'Auth',
    //       icon: IconLockAccess,
    //       items: [
    //         {
    //           title: 'Sign In',
    //           url: '/sign-in',
    //         },
    //         {
    //           title: 'Sign In (2 Col)',
    //           url: '/sign-in-2',
    //         },
    //         {
    //           title: 'Sign Up',
    //           url: '/sign-up',
    //         },
    //         {
    //           title: 'Forgot Password',
    //           url: '/forgot-password',
    //         },
    //         {
    //           title: 'OTP',
    //           url: '/otp',
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Errors',
    //       icon: IconBug,
    //       items: [
    //         {
    //           title: 'Unauthorized',
    //           url: '/401',
    //           icon: IconLock,
    //         },
    //         {
    //           title: 'Forbidden',
    //           url: '/403',
    //           icon: IconUserOff,
    //         },
    //         {
    //           title: 'Not Found',
    //           url: '/404',
    //           icon: IconError404,
    //         },
    //         {
    //           title: 'Internal Server Error',
    //           url: '/500',
    //           icon: IconServerOff,
    //         },
    //         {
    //           title: 'Maintenance Error',
    //           url: '/503',
    //           icon: IconBarrierBlock,
    //         },
    //       ],
    //     },
    //   ],
    // },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            {
              title: 'llm',
              url: '/settings',
              icon: IconAi,
            },
            // {
            //   title: 'Account',
            //   url: '/settings/account',
            //   icon: IconTool,
            // },
            // {
            //   title: 'Appearance',
            //   url: '/settings/appearance',
            //   icon: IconPalette,
            // },
            // {
            //   title: 'Notifications',
            //   url: '/settings/notifications',
            //   icon: IconNotification,
            // },
            // {
            //   title: 'Display',
            //   url: '/settings/display',
            //   icon: IconBrowserCheck,
            // },
          ],
        },
        {
          title: 'Test API',
          url: '/test-api',
          icon: IconHelp,
        },
      ],
    },
  ],
}
