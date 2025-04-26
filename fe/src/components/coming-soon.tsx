import { useState, useEffect } from 'react'
import { IconPlanet } from '@tabler/icons-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
// Define TypeScript interfaces
interface SpaceFact {
  title: string;
  explanation: string;
  imageUrl: string;
  date: string;
}

interface AppData {
  title: string;
  launchDate: string;
  featuresComingSoon: string[];
  spaceFact?: SpaceFact;
}

export default function ComingSoon() {
  // Initialize with proper types
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from NASA's APOD API when component mounts
    const getData = async () => {
      try {
        // Using NASA's Astronomy Picture of the Day API
        const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
        
        if (!response.ok) {
          throw new Error('The stars are not aligned. Please try again later.');
        }
        
        const apiData = await response.json();
        
        // Transform NASA data to fit our component
        setData({
          title: "Our Galactic Journey Begins Soon",
          launchDate: "June 15, 2025",
          featuresComingSoon: [
            "Interstellar Navigation",
            "Quantum Communication",
            "Wormhole Mapping"
          ],
          spaceFact: {
            title: apiData.title,
            explanation: apiData.explanation.substring(0, 150) + "...",
            imageUrl: apiData.url,
            date: apiData.date
          }
        });
        
        setLoading(false);
      } catch (err) {
        // console.(err);
        setError('Failed to fetch data from the cosmos'+err);
        setLoading(false);
      }
    };

    getData();
  }, []);


  useEffect(()=>{

    const getData = async ()=>{
      const response = await fetch('https://2do1mkam6i.execute-api.us-west-2.amazonaws.com/v1/conversations');
      console.log(response)
    }

    getData()

  })

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
        <IconPlanet size={72} className="text-blue-500 animate-pulse" />
        
        {loading ? (
          <p className="text-lg">Contacting the distant stars...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : data ? (
          <>
            <h1 className='text-4xl leading-tight font-bold'>{data.title}</h1>
            <p className='text-2xl font-semibold'>Launching: {data.launchDate}</p>
            
            {/* NASA APOD Content */}
            <div className="my-6 max-w-lg w-full">
              <div className="overflow-hidden rounded-lg shadow-lg">
                {data.spaceFact?.imageUrl && (
                  <img 
                    src={data.spaceFact.imageUrl} 
                    alt={data.spaceFact.title}
                    className="w-full h-64 object-cover" 
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      const img = e.currentTarget;
                      img.src = "/api/placeholder/400/320"; 
                      img.alt = "Space image unavailable";
                    }}
                  />
                )}
                <div className="p-4 bg-gray-50">
                  <h3 className="text-lg font-medium">
                    NASA Astronomy Pic of the Day: {data.spaceFact?.title}
                  </h3>
                  <p className="text-sm text-gray-600">{data.spaceFact?.date}</p>
                  <p className="mt-2 text-gray-700">{data.spaceFact?.explanation}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 border border-gray-200 rounded-lg">
              <h2 className="text-xl mb-2 font-medium">Features Coming Soon:</h2>
              <ul className="space-y-2">
                {data.featuresComingSoon.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <span className="mr-2 text-blue-500">✧</span>
                    {feature}
                  </li>
                ))}
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
