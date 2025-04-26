import { useState, useEffect } from 'react'
import { IconPlanet } from '@tabler/icons-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

// Define TypeScript interfaces
interface SpaceFact {
  title: string
  explanation: string
  imageUrl: string
  date: string
}

interface AppData {
  title: string
  launchDate: string
  featuresComingSoon: string[]
  spaceFact?: SpaceFact
}

export default function ComingSoon() {
  // Initialize with proper types
  const [data, setData] = useState<AppData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch data from NASA's APOD API when component mounts
    const getData = async () => {
      try {
        // Using NASA's Astronomy Picture of the Day API
        const response = await fetch(
          'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY'
        )

        if (!response.ok) {
          throw new Error('The stars are not aligned. Please try again later.')
        }

        const apiData = await response.json()

        // Transform NASA data to fit our component
        setData({
          title: 'Our Galactic Journey Begins Soon',
          launchDate: 'June 15, 2025',
          featuresComingSoon: [
            'Interstellar Navigation',
            'Quantum Communication',
            'Wormhole Mapping',
          ],
          spaceFact: {
            title: apiData.title,
            explanation: apiData.explanation.substring(0, 150) + '...',
            imageUrl: apiData.url,
            date: apiData.date,
          },
        })

        setLoading(false)
      } catch (err) {
        // console.(err);
        setError('Failed to fetch data from the cosmos' + err)
        setLoading(false)
      }
    }

    getData()
  }, [])

  useEffect(() => {
    // 異步函數來獲取數據
    const fetchConversations = async () => {
      // 重置錯誤狀態
      setError(null)
      // 設置加載狀態
      setLoading(true)

      try {
        // 使用環境變數構建 API URL
        const apiUrl = `${import.meta.env.VITE_API_PATH}/conversations`
        console.log('Fetching from:', apiUrl)

        const response = await fetch(apiUrl)

        // 檢查響應是否成功
        if (!response.ok) {
          throw new Error(`API 請求失敗: ${response.status}`)
        }

        // 解析 JSON 響應
        const data = await response.json()
        console.log('Fetched data:', data)

        // 更新狀態
      } catch (err) {
        console.error('獲取數據時出錯:', err)
      } finally {
        // 無論成功或失敗都設置加載完成
        setLoading(false)
      }
    }

    // 調用獲取函數
    fetchConversations()

    // 空依賴數組意味著這個 effect 只在組件掛載時運行一次
  }, [])

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className='ml-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Content ===== */}
      <Main fixed>
        <div className='h-svh'>
          <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-4'>
            <IconPlanet size={72} className='animate-pulse text-blue-500' />

            {loading ? (
              <p className='text-lg'>Contacting the distant stars...</p>
            ) : error ? (
              <p className='text-red-500'>{error}</p>
            ) : data ? (
              <>
                <h1 className='text-4xl leading-tight font-bold'>
                  {data.title}
                </h1>
                <p className='text-2xl font-semibold'>
                  Launching: {data.launchDate}
                </p>

                {/* NASA APOD Content */}
                <div className='my-6 w-full max-w-lg'>
                  <div className='overflow-hidden rounded-lg shadow-lg'>
                    {data.spaceFact?.imageUrl && (
                      <img
                        src={data.spaceFact.imageUrl}
                        alt={data.spaceFact.title}
                        className='h-64 w-full object-cover'
                        onError={(
                          e: React.SyntheticEvent<HTMLImageElement>
                        ) => {
                          const img = e.currentTarget
                          img.src = '/api/placeholder/400/320'
                          img.alt = 'Space image unavailable'
                        }}
                      />
                    )}
                    <div className='bg-gray-50 p-4'>
                      <h3 className='text-lg font-medium'>
                        NASA Astronomy Pic of the Day: {data.spaceFact?.title}
                      </h3>
                      <p className='text-sm text-gray-600'>
                        {data.spaceFact?.date}
                      </p>
                      <p className='mt-2 text-gray-700'>
                        {data.spaceFact?.explanation}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='mt-4 rounded-lg border border-gray-200 p-4'>
                  <h2 className='mb-2 text-xl font-medium'>
                    Features Coming Soon:
                  </h2>
                  <ul className='space-y-2'>
                    {data.featuresComingSoon.map(
                      (feature: string, index: number) => (
                        <li key={index} className='flex items-center'>
                          <span className='mr-2 text-blue-500'>✧</span>
                          {feature}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </>
            ) : (
              <p>No data available</p>
            )}
          </div>
        </div>
      </Main>
    </>
  )
}
