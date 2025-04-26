import { IconLayoutDashboard, IconSettings, IconAi } from '@tabler/icons-react'
import {
  AudioWaveform,
  MoonStar,
  GalleryVerticalEnd,
  BrainCog,
  ScrollText,
  // SquareKanban
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: '0xDEADBEEF',
    email: '0xDEADBEEF@gmail.com',
    avatar:
      'https://images.unsplash.com/photo-1527842891421-42eec6e703ea?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  teams: [
    {
      name: 'Luna',
      logo: MoonStar,
      mode: 'Sales Assistant',
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
          ],
        },
        // {
        //   title: 'Test API',
        //   url: '/test-api',
        //   icon: IconHelp,
        // },
      ],
    },
  ],
}
