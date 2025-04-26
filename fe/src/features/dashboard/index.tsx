import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { AccuracyGauge as ProductAccuracyGauge } from './components/accuracy-gauge'
import { PopularPhrases as PopularProducts } from './components/popular-phrases'
import { RecentInteractions as RecentShoppingInteractions } from './components/recent-interactions'
import { VoiceActivityChart as ShoppingActivityChart } from './components/voice-activity-chart'

export default function HealthProductsRecommendationDashboard() {
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
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>
            健康保健商品推薦分析
          </h1>
          <div className='flex items-center space-x-2'>
            <Button>匯出報表</Button>
          </div>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>總覽</TabsTrigger>
              <TabsTrigger value='voice-performance' disabled>
                產品表現
              </TabsTrigger>
              <TabsTrigger value='user-interactions' disabled>
                用戶行為
              </TabsTrigger>
              <TabsTrigger value='voice-settings' disabled>
                Agent 設定
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    互動總數
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground h-4 w-4'
                  >
                    <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>12,546</div>
                  <p className='text-muted-foreground text-xs'>
                    +23.4% 相較於上個月
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    推薦準確率
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground h-4 w-4'
                  >
                    <path d='M12 2a10 10 0 1 0 10 10H12V2z' />
                    <path d='M12 2a10 10 0 0 1 10 10h-10V2z' />
                    <path d='M12 12l8.9 3.2' />
                    <path d='M12 12l3.2 8.9' />
                    <path d='M12 12H2' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>94.7%</div>
                  <p className='text-muted-foreground text-xs'>
                    +2.3% 相較於上個月
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    平均決策時間
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground h-4 w-4'
                  >
                    <circle cx='12' cy='12' r='10' />
                    <polyline points='12 6 12 12 16 14' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>1.2s</div>
                  <p className='text-muted-foreground text-xs'>
                    -0.3s 相較於上個月
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>轉換率</CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground h-4 w-4'
                  >
                    <path d='M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>25.6%</div>
                  <p className='text-muted-foreground text-xs'>
                    +3.5% 相較於上個月
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>保健產品瀏覽趨勢</CardTitle>
                  <CardDescription>過去 30 天的用戶互動數據</CardDescription>
                </CardHeader>
                <CardContent className='pl-2'>
                  <ShoppingActivityChart />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>最近互動</CardTitle>
                  <CardDescription>最近 10 筆用戶保健商品互動</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentShoppingInteractions />
                </CardContent>
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle>產品推薦準確度</CardTitle>
                  <CardDescription>根據產品類別與用戶族群</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProductAccuracyGauge />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>熱門保健產品</CardTitle>
                  <CardDescription>本月最常被推薦的保健商品</CardDescription>
                </CardHeader>
                <CardContent>
                  <PopularProducts />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
