import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TimeRangeType } from '@/types/conversation';

interface PageHeaderProps {
	timeRange: TimeRangeType;
	onTimeRangeChange: (value: TimeRangeType) => void;
	onExportReport: () => void;
}

export function PageHeader({
	timeRange,
	onTimeRangeChange,
	onExportReport
}: PageHeaderProps): React.ReactElement {
	return (
		<div className='mb-2 flex items-center justify-between space-y-2'>
			<h1 className='text-2xl font-bold tracking-tight'>銷售助理對話歷史</h1>
			<div className='flex items-center space-x-2'>
				<Select value={timeRange} onValueChange={onTimeRangeChange}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="選擇時間範圍" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="today">今天</SelectItem>
						<SelectItem value="week">本週</SelectItem>
						<SelectItem value="month">本月</SelectItem>
						<SelectItem value="all">所有時間</SelectItem>
					</SelectContent>
				</Select>
				<Button onClick={onExportReport}>匯出報表</Button>
			</div>
		</div>
	);
}
