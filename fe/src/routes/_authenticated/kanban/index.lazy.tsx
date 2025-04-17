import { createLazyFileRoute } from '@tanstack/react-router'
import Kanban from '@/features/kanban'

export const Route = createLazyFileRoute('/_authenticated/kanban/')({
  component: Kanban,
})
