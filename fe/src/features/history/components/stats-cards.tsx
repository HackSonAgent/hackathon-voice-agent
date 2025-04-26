import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardsProps {
	totalChats: number;
	convertedChats: number;
	conversionRate: string;
	avgDuration: string;
}

export function StatsCards({
	totalChats,
	convertedChats,
	conversionRate,
	avgDuration
}: StatsCardsProps): React.ReactElement {
	return (
		<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>總對話次數</CardTitle>
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
						<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
					</svg>
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>{totalChats}</div>
					<p className='text-muted-foreground text-xs'>
						較上週增加 17.2%
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>轉化次數</CardTitle>
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
						<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
						<circle cx="9" cy="7" r="4" />
						<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
						<path d="M16 3.13a4 4 0 0 1 0 7.75" />
					</svg>
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>{convertedChats}</div>
					<p className='text-muted-foreground text-xs'>
						較上週增加 12.5%
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>轉化率</CardTitle>
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
						<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
					</svg>
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>{conversionRate}%</div>
					<p className='text-muted-foreground text-xs'>
						較上週增加 2.3%
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>平均對話時長</CardTitle>
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
						<circle cx="12" cy="12" r="10" />
						<polyline points="12 6 12 12 16 14" />
					</svg>
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>{avgDuration}</div>
					<p className='text-muted-foreground text-xs'>
						較上週減少 0.8分鐘
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
