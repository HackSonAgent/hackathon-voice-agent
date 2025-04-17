import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import KanbanBoard from './components/board'; // Import our Kanban board component

export default function KanbanDashboard() {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-4 flex items-center justify-between'>
          <h1 className='text-2xl font-bold tracking-tight'>Project groove</h1>
          <div className='flex items-center space-x-2'>
            <Button variant="outline">Export Board</Button>
            <Button>New Project</Button>
          </div>
        </div>
        
        <Tabs defaultValue='board' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='board'>Kanban Board</TabsTrigger>
            <TabsTrigger value='tasks'>Task List</TabsTrigger>
            <TabsTrigger value='timeline'>Timeline</TabsTrigger>
            <TabsTrigger value='calendar' disabled>Calendar</TabsTrigger>
          </TabsList>
          
          <TabsContent value='board' className='space-y-4'>
            <div className='grid gap-4 grid-cols-1'>
              <Card className='col-span-1'>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-xl'>Current Sprint</CardTitle>
                </CardHeader>
                <CardContent className='pt-0'>
                  {/* Here we embed our Kanban Board inside the Card */}
                  <KanbanBoard />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value='tasks' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>All Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Task list view will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
			<TabsContent value='timeline' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>All Timeline Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Task list view will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  );
}


