import { createLazyFileRoute } from '@tanstack/react-router'
import Agent from '@/features/agent'

export const Route = createLazyFileRoute('/_authenticated/agent/')({
  component: Agent,
})

