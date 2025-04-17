import React, { useState, useRef } from 'react'
import { PlusCircle, X, GripVertical } from 'lucide-react'

// TypeScript interfaces
interface Task {
  id: string
  title: string
  content: string
}

interface Column {
  id: string
  title: string
  taskIds: string[]
}

interface KanbanData {
  tasks: {
    [key: string]: Task
  }
  columns: {
    [key: string]: Column
  }
  columnOrder: string[]
}

interface DraggedTask {
  taskId: string
  columnId: string
}

interface DraggedColumn {
  columnId: string
  index: number
}

interface DragOverTask {
  taskId: string
  columnId: string
}

// Initial data setup
const initialData: KanbanData = {
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'Create design mockups',
      content: 'Design the UI for the new feature',
    },
    'task-2': {
      id: 'task-2',
      title: 'Setup API endpoints',
      content: 'Implement REST API for user authentication',
    },
    'task-3': {
      id: 'task-3',
      title: 'Write tests',
      content: 'Create unit tests for core functionality',
    },
    'task-4': {
      id: 'task-4',
      title: 'Documentation',
      content: 'Update README and API docs',
    },
    'task-5': {
      id: 'task-5',
      title: 'Code review',
      content: 'Review PRs from team members',
    },
    'task-6': {
      id: 'task-6',
      title: 'Deploy to staging',
      content: 'Prepare staging environment for testing',
    },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: ['task-1', 'task-2'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: ['task-3', 'task-4'],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: ['task-5', 'task-6'],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
}

const KanbanBoard: React.FC = () => {
  const [state, setState] = useState<KanbanData>(initialData)
  const [newColumnTitle, setNewColumnTitle] = useState<string>('')
  const [addingColumn, setAddingColumn] = useState<boolean>(false)
  const [newTaskData, setNewTaskData] = useState<{
    title: string
    content: string
  }>({ title: '', content: '' })
  const [addingTaskToColumn, setAddingTaskToColumn] = useState<string | null>(
    null
  )

  // For drag and drop functionality
  const [dragging, setDragging] = useState<boolean>(false)
  const [draggedTask, setDraggedTask] = useState<DraggedTask | null>(null)
  const [draggedColumn, setDraggedColumn] = useState<DraggedColumn | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const [dragOverTask, setDragOverTask] = useState<DragOverTask | null>(null)
  const dragNode = useRef<HTMLElement | null>(null)

  // Handle start dragging a task
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    taskId: string,
    columnId: string
  ): void => {
    e.stopPropagation()
    setDragging(true)
    setDraggedTask({ taskId, columnId })
    dragNode.current = e.target as HTMLElement

    // Add a delay to prevent the drag ghost from showing
    setTimeout(() => {
      if (dragNode.current) {
        dragNode.current.classList.add('opacity-50')
      }
    }, 0)
  }

  // Handle start dragging a column
  const handleColumnDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    columnId: string,
    index: number
  ): void => {
    e.stopPropagation()
    setDragging(true)
    setDraggedColumn({ columnId, index })
    dragNode.current = e.target as HTMLElement

    setTimeout(() => {
      if (dragNode.current) {
        dragNode.current.classList.add('opacity-50')
      }
    }, 0)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    e.stopPropagation()
  }

  // Handle drop on a task
  const handleDragEnterTask = (
    e: React.DragEvent<HTMLDivElement>,
    taskId: string,
    columnId: string
  ): void => {
    e.preventDefault()
    e.stopPropagation()

    if (!dragging) return

    if (draggedTask && draggedTask.taskId !== taskId) {
      setDragOverTask({ taskId, columnId })
    }
  }

  // Handle drop on a column
  const handleDragEnterColumn = (
    e: React.DragEvent<HTMLDivElement>,
    columnId: string
  ): void => {
    e.preventDefault()
    e.stopPropagation()

    if (!dragging) return

    if (draggedTask && draggedTask.columnId !== columnId) {
      setDragOverColumn(columnId)
    }

    if (draggedColumn && draggedColumn.columnId !== columnId) {
      setDragOverColumn(columnId)
    }
  }

  // Handle end of dragging
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    e.stopPropagation()

    setDragging(false)

    if (dragNode.current) {
      dragNode.current.classList.remove('opacity-50')
      dragNode.current = null
    }

    // If dragging a task
    if (draggedTask && dragOverColumn) {
      // Get source and destination columns
      const sourceColumnId = draggedTask.columnId
      const destColumnId = dragOverColumn

      if (sourceColumnId !== destColumnId) {
        // Move task between columns
        const sourceColumn = state.columns[sourceColumnId]
        const destColumn = state.columns[destColumnId]

        // Remove task from source column
        const sourceTaskIds = Array.from(sourceColumn.taskIds)
        const taskIndex = sourceTaskIds.indexOf(draggedTask.taskId)
        sourceTaskIds.splice(taskIndex, 1)

        // Add task to destination column
        const destTaskIds = Array.from(destColumn.taskIds)
        if (dragOverTask && destColumn.id === dragOverTask.columnId) {
          // Insert at specific position if we're over a task
          const dropIndex = destTaskIds.indexOf(dragOverTask.taskId)
          destTaskIds.splice(dropIndex, 0, draggedTask.taskId)
        } else {
          // Otherwise add to the end
          destTaskIds.push(draggedTask.taskId)
        }

        setState({
          ...state,
          columns: {
            ...state.columns,
            [sourceColumnId]: {
              ...sourceColumn,
              taskIds: sourceTaskIds,
            },
            [destColumnId]: {
              ...destColumn,
              taskIds: destTaskIds,
            },
          },
        })
      } else if (dragOverTask && draggedTask.taskId !== dragOverTask.taskId) {
        // Reorder within the same column
        const column = state.columns[sourceColumnId]
        const newTaskIds = Array.from(column.taskIds)

        // Remove from old position
        const dragIndex = newTaskIds.indexOf(draggedTask.taskId)
        newTaskIds.splice(dragIndex, 1)

        // Insert at new position
        const dropIndex = newTaskIds.indexOf(dragOverTask.taskId)
        newTaskIds.splice(dropIndex, 0, draggedTask.taskId)

        setState({
          ...state,
          columns: {
            ...state.columns,
            [sourceColumnId]: {
              ...column,
              taskIds: newTaskIds,
            },
          },
        })
      }
    }

    // If dragging a column
    if (
      draggedColumn &&
      dragOverColumn &&
      draggedColumn.columnId !== dragOverColumn
    ) {
      const newColumnOrder = Array.from(state.columnOrder)

      // Remove from old position
      const dragIndex = newColumnOrder.indexOf(draggedColumn.columnId)
      newColumnOrder.splice(dragIndex, 1)

      // Insert at new position
      const dropIndex = newColumnOrder.indexOf(dragOverColumn)
      newColumnOrder.splice(dropIndex, 0, draggedColumn.columnId)

      setState({
        ...state,
        columnOrder: newColumnOrder,
      })
    }

    // Reset drag state
    setDraggedTask(null)
    setDraggedColumn(null)
    setDragOverColumn(null)
    setDragOverTask(null)
  }

  const handleAddColumn = (): void => {
    if (!newColumnTitle.trim()) return

    const newColumnId = `column-${Object.keys(state.columns).length + 1}-${Date.now()}`

    setState({
      ...state,
      columns: {
        ...state.columns,
        [newColumnId]: {
          id: newColumnId,
          title: newColumnTitle,
          taskIds: [],
        },
      },
      columnOrder: [...state.columnOrder, newColumnId],
    })

    setNewColumnTitle('')
    setAddingColumn(false)
  }

  const handleAddTask = (columnId: string): void => {
    if (!newTaskData.title.trim()) return

    const newTaskId = `task-${Object.keys(state.tasks).length + 1}-${Date.now()}`
    const column = state.columns[columnId]

    setState({
      ...state,
      tasks: {
        ...state.tasks,
        [newTaskId]: {
          id: newTaskId,
          title: newTaskData.title,
          content: newTaskData.content,
        },
      },
      columns: {
        ...state.columns,
        [columnId]: {
          ...column,
          taskIds: [...column.taskIds, newTaskId],
        },
      },
    })

    setNewTaskData({ title: '', content: '' })
    setAddingTaskToColumn(null)
  }

  const handleDeleteColumn = (columnId: string): void => {
    const newState = { ...state }
    const taskIds = newState.columns[columnId].taskIds

    // Remove tasks associated with this column
    taskIds.forEach((taskId) => {
      delete newState.tasks[taskId]
    })

    // Remove the column
    delete newState.columns[columnId]

    // Update column order
    newState.columnOrder = newState.columnOrder.filter((id) => id !== columnId)

    setState(newState)
  }

  const handleDeleteTask = (taskId: string): void => {
    const newState = { ...state }

    // Find which column contains this task
    let columnId: string | undefined
    for (const [colId, column] of Object.entries(newState.columns)) {
      if (column.taskIds.includes(taskId)) {
        columnId = colId
        break
      }
    }

    if (columnId) {
      // Remove task from column
      newState.columns[columnId].taskIds = newState.columns[
        columnId
      ].taskIds.filter((id) => id !== taskId)

      // Remove task from tasks object
      delete newState.tasks[taskId]

      setState(newState)
    }
  }

  return (
    <div className='flex space-x-4 overflow-x-auto pb-4'>
      {state.columnOrder.map((columnId, index) => {
        const column = state.columns[columnId]
        const tasks = column.taskIds.map((taskId) => state.tasks[taskId])

        return (
          <div
            key={column.id}
            className='bg-card w-72 flex-shrink-0 rounded-md shadow'
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnterColumn(e, column.id)}
            onDrop={handleDragEnd}
            draggable
            onDragStart={(e) => handleColumnDragStart(e, column.id, index)}
            onDragEnd={handleDragEnd}
          >
            <div className='bg-card flex cursor-move items-center justify-between rounded-t-md border-b p-3 font-semibold'>
              <div className='flex items-center'>
                <GripVertical
                  size={16}
                  className='text-muted-foreground mr-2'
                />
                <span className='truncate font-medium'>{column.title}</span>
                <div className='bg-secondary text-secondary-foreground ml-2 rounded-full px-2 py-0.5 text-xs font-semibold'>
                  {column.taskIds.length}
                </div>
              </div>
              <div className='flex space-x-1'>
                <button
                  onClick={() => setAddingTaskToColumn(column.id)}
                  className='hover:bg-accent hover:text-accent-foreground rounded-md p-1 transition-colors'
                  title='Add task'
                >
                  <PlusCircle size={16} />
                </button>
                <button
                  onClick={() => handleDeleteColumn(column.id)}
                  className='hover:bg-accent hover:text-accent-foreground rounded-md p-1 transition-colors'
                  title='Delete column'
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div
              className={`max-h-[calc(100vh-250px)] min-h-32 overflow-y-auto p-3 ${dragOverColumn === column.id ? 'bg-accent/20' : ''}`}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnterColumn(e, column.id)}
            >
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`bg-card border-border mb-3 cursor-move rounded-md border p-3 shadow-sm transition-all hover:shadow ${draggedTask && draggedTask.taskId === task.id ? 'opacity-50' : ''} ${dragOverTask && dragOverTask.taskId === task.id ? 'border-primary border-t-2' : ''} `}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id, column.id)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDragEnter={(e) =>
                    handleDragEnterTask(e, task.id, column.id)
                  }
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex items-center'>
                      <GripVertical
                        size={14}
                        className='text-muted-foreground mr-2'
                      />
                      <h3 className='font-medium'>{task.title}</h3>
                    </div>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className='hover:bg-accent hover:text-accent-foreground rounded-md p-1 transition-colors'
                      title='Delete task'
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <p className='text-muted-foreground mt-2 ml-6 text-sm'>
                    {task.content}
                  </p>
                </div>
              ))}

              {addingTaskToColumn === column.id && (
                <div className='bg-card mt-3 rounded-md border p-3 shadow-md'>
                  <input
                    type='text'
                    placeholder='Task title'
                    value={newTaskData.title}
                    onChange={(e) =>
                      setNewTaskData({
                        ...newTaskData,
                        title: e.target.value,
                      })
                    }
                    className='focus:ring-primary mb-2 w-full rounded-md border p-2 focus:border-transparent focus:ring-2 focus:outline-none'
                    autoFocus
                  />
                  <textarea
                    placeholder='Task description'
                    value={newTaskData.content}
                    onChange={(e) =>
                      setNewTaskData({
                        ...newTaskData,
                        content: e.target.value,
                      })
                    }
                    className='focus:ring-primary mb-3 w-full rounded-md border p-2 focus:border-transparent focus:ring-2 focus:outline-none'
                    rows={2}
                  />
                  <div className='flex justify-end space-x-2'>
                    <button
                      onClick={() => setAddingTaskToColumn(null)}
                      className='bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md px-3 py-1.5 text-sm font-medium transition-colors'
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleAddTask(column.id)}
                      className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-1.5 text-sm font-medium transition-colors'
                    >
                      Add Task
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}

      {!addingColumn ? (
        <div className='bg-card/50 border-muted-foreground/30 flex w-72 flex-shrink-0 items-center justify-center rounded-md border border-dashed shadow'>
          <button
            onClick={() => setAddingColumn(true)}
            className='text-muted-foreground hover:bg-accent hover:text-accent-foreground flex h-full w-full flex-col items-center justify-center rounded-md p-4 text-center transition-colors'
          >
            <PlusCircle size={24} className='mb-2' />
            <span className='font-medium'>Add New Column</span>
          </button>
        </div>
      ) : (
        <div className='bg-card w-72 flex-shrink-0 rounded-md p-4 shadow'>
          <h3 className='mb-3 text-lg font-medium'>New Column</h3>
          <input
            type='text'
            placeholder='Column title'
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            className='focus:ring-primary mb-4 w-full rounded-md border p-2 focus:border-transparent focus:ring-2 focus:outline-none'
            autoFocus
          />
          <div className='flex justify-end space-x-2'>
            <button
              onClick={() => setAddingColumn(false)}
              className='bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md px-4 py-2 font-medium transition-colors'
            >
              Cancel
            </button>
            <button
              onClick={handleAddColumn}
              className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 font-medium transition-colors'
            >
              Add Column
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default KanbanBoard
