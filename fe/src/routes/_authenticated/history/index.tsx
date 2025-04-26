import { createFileRoute } from '@tanstack/react-router'
import ChatHistoryPage from '@/features/history'

export const Route = createFileRoute('/_authenticated/history/')({
	component: ChatHistoryPage,
})

