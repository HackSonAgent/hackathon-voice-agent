import React, { useState, useRef } from 'react';
import { PlusCircle, X, GripVertical } from 'lucide-react';

// TypeScript interfaces
interface Task {
  id: string;
  title: string;
  content: string;
}

interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

interface KanbanData {
  tasks: {
    [key: string]: Task;
  };
  columns: {
    [key: string]: Column;
  };
  columnOrder: string[];
}

interface DraggedTask {
  taskId: string;
  columnId: string;
}

interface DraggedColumn {
  columnId: string;
  index: number;
}

interface DragOverTask {
  taskId: string;
  columnId: string;
}

// Initial data setup
const initialData: KanbanData = {
  tasks: {
    'task-1': { id: 'task-1', title: 'Create design mockups', content: 'Design the UI for the new feature' },
    'task-2': { id: 'task-2', title: 'Setup API endpoints', content: 'Implement REST API for user authentication' },
    'task-3': { id: 'task-3', title: 'Write tests', content: 'Create unit tests for core functionality' },
    'task-4': { id: 'task-4', title: 'Documentation', content: 'Update README and API docs' },
    'task-5': { id: 'task-5', title: 'Code review', content: 'Review PRs from team members' },
    'task-6': { id: 'task-6', title: 'Deploy to staging', content: 'Prepare staging environment for testing' },
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
};

const KanbanBoard: React.FC = () => {
  const [state, setState] = useState<KanbanData>(initialData);
  const [newColumnTitle, setNewColumnTitle] = useState<string>('');
  const [addingColumn, setAddingColumn] = useState<boolean>(false);
  const [newTaskData, setNewTaskData] = useState<{ title: string; content: string }>({ title: '', content: '' });
  const [addingTaskToColumn, setAddingTaskToColumn] = useState<string | null>(null);
  
  // For drag and drop functionality
  const [dragging, setDragging] = useState<boolean>(false);
  const [draggedTask, setDraggedTask] = useState<DraggedTask | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<DraggedColumn | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [dragOverTask, setDragOverTask] = useState<DragOverTask | null>(null);
  const dragNode = useRef<HTMLElement | null>(null);

  // Handle start dragging a task
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string, columnId: string): void => {
    e.stopPropagation();
    setDragging(true);
    setDraggedTask({ taskId, columnId });
    dragNode.current = e.target as HTMLElement;
    
    // Add a delay to prevent the drag ghost from showing
    setTimeout(() => {
      if (dragNode.current) {
        dragNode.current.classList.add('opacity-50');
      }
    }, 0);
  };
  
  // Handle start dragging a column
  const handleColumnDragStart = (e: React.DragEvent<HTMLDivElement>, columnId: string, index: number): void => {
    e.stopPropagation();
    setDragging(true);
    setDraggedColumn({ columnId, index });
    dragNode.current = e.target as HTMLElement;
    
    setTimeout(() => {
      if (dragNode.current) {
        dragNode.current.classList.add('opacity-50');
      }
    }, 0);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  // Handle drop on a task
  const handleDragEnterTask = (e: React.DragEvent<HTMLDivElement>, taskId: string, columnId: string): void => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!dragging) return;
    
    if (draggedTask && draggedTask.taskId !== taskId) {
      setDragOverTask({ taskId, columnId });
    }
  };
  
  // Handle drop on a column
  const handleDragEnterColumn = (e: React.DragEvent<HTMLDivElement>, columnId: string): void => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!dragging) return;
    
    if (draggedTask && draggedTask.columnId !== columnId) {
      setDragOverColumn(columnId);
    }
    
    if (draggedColumn && draggedColumn.columnId !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  // Handle end of dragging
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragging(false);
    
    if (dragNode.current) {
      dragNode.current.classList.remove('opacity-50');
      dragNode.current = null;
    }
    
    // If dragging a task
    if (draggedTask && dragOverColumn) {
      // Get source and destination columns
      const sourceColumnId = draggedTask.columnId;
      const destColumnId = dragOverColumn;
      
      if (sourceColumnId !== destColumnId) {
        // Move task between columns
        const sourceColumn = state.columns[sourceColumnId];
        const destColumn = state.columns[destColumnId];
        
        // Remove task from source column
        const sourceTaskIds = Array.from(sourceColumn.taskIds);
        const taskIndex = sourceTaskIds.indexOf(draggedTask.taskId);
        sourceTaskIds.splice(taskIndex, 1);
        
        // Add task to destination column
        const destTaskIds = Array.from(destColumn.taskIds);
        if (dragOverTask && destColumn.id === dragOverTask.columnId) {
          // Insert at specific position if we're over a task
          const dropIndex = destTaskIds.indexOf(dragOverTask.taskId);
          destTaskIds.splice(dropIndex, 0, draggedTask.taskId);
        } else {
          // Otherwise add to the end
          destTaskIds.push(draggedTask.taskId);
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
        });
      } else if (dragOverTask && draggedTask.taskId !== dragOverTask.taskId) {
        // Reorder within the same column
        const column = state.columns[sourceColumnId];
        const newTaskIds = Array.from(column.taskIds);
        
        // Remove from old position
        const dragIndex = newTaskIds.indexOf(draggedTask.taskId);
        newTaskIds.splice(dragIndex, 1);
        
        // Insert at new position
        const dropIndex = newTaskIds.indexOf(dragOverTask.taskId);
        newTaskIds.splice(dropIndex, 0, draggedTask.taskId);
        
        setState({
          ...state,
          columns: {
            ...state.columns,
            [sourceColumnId]: {
              ...column,
              taskIds: newTaskIds,
            },
          },
        });
      }
    }
    
    // If dragging a column
    if (draggedColumn && dragOverColumn && draggedColumn.columnId !== dragOverColumn) {
      const newColumnOrder = Array.from(state.columnOrder);
      
      // Remove from old position
      const dragIndex = newColumnOrder.indexOf(draggedColumn.columnId);
      newColumnOrder.splice(dragIndex, 1);
      
      // Insert at new position
      const dropIndex = newColumnOrder.indexOf(dragOverColumn);
      newColumnOrder.splice(dropIndex, 0, draggedColumn.columnId);
      
      setState({
        ...state,
        columnOrder: newColumnOrder,
      });
    }
    
    // Reset drag state
    setDraggedTask(null);
    setDraggedColumn(null);
    setDragOverColumn(null);
    setDragOverTask(null);
  };

  const handleAddColumn = (): void => {
    if (!newColumnTitle.trim()) return;
    
    const newColumnId = `column-${Object.keys(state.columns).length + 1}-${Date.now()}`;
    
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
    });
    
    setNewColumnTitle('');
    setAddingColumn(false);
  };

  const handleAddTask = (columnId: string): void => {
    if (!newTaskData.title.trim()) return;
    
    const newTaskId = `task-${Object.keys(state.tasks).length + 1}-${Date.now()}`;
    const column = state.columns[columnId];
    
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
    });
    
    setNewTaskData({ title: '', content: '' });
    setAddingTaskToColumn(null);
  };

  const handleDeleteColumn = (columnId: string): void => {
    const newState = { ...state };
    const taskIds = newState.columns[columnId].taskIds;
    
    // Remove tasks associated with this column
    taskIds.forEach(taskId => {
      delete newState.tasks[taskId];
    });
    
    // Remove the column
    delete newState.columns[columnId];
    
    // Update column order
    newState.columnOrder = newState.columnOrder.filter(id => id !== columnId);
    
    setState(newState);
  };

  const handleDeleteTask = (taskId: string): void => {
    const newState = { ...state };
    
    // Find which column contains this task
    let columnId: string | undefined;
    for (const [colId, column] of Object.entries(newState.columns)) {
      if (column.taskIds.includes(taskId)) {
        columnId = colId;
        break;
      }
    }
    
    if (columnId) {
      // Remove task from column
      newState.columns[columnId].taskIds = newState.columns[columnId].taskIds.filter(id => id !== taskId);
      
      // Remove task from tasks object
      delete newState.tasks[taskId];
      
      setState(newState);
    }
  };

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {state.columnOrder.map((columnId, index) => {
        const column = state.columns[columnId];
        const tasks = column.taskIds.map(taskId => state.tasks[taskId]);
        
        return (
          <div
            key={column.id}
            className="w-72 flex-shrink-0 bg-card rounded-md shadow"
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnterColumn(e, column.id)}
            onDrop={handleDragEnd}
            draggable
            onDragStart={(e) => handleColumnDragStart(e, column.id, index)}
            onDragEnd={handleDragEnd}
          >
            <div 
              className="p-3 font-semibold bg-card rounded-t-md flex justify-between items-center cursor-move border-b"
            >
              <div className="flex items-center">
                <GripVertical size={16} className="mr-2 text-muted-foreground" />
                <span className="truncate font-medium">{column.title}</span>
                <div className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-secondary text-secondary-foreground">
                  {column.taskIds.length}
                </div>
              </div>
              <div className="flex space-x-1">
                <button 
                  onClick={() => setAddingTaskToColumn(column.id)}
                  className="p-1 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                  title="Add task"
                >
                  <PlusCircle size={16} />
                </button>
                <button
                  onClick={() => handleDeleteColumn(column.id)}
                  className="p-1 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                  title="Delete column"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            <div
              className={`min-h-32 p-3 max-h-[calc(100vh-250px)] overflow-y-auto ${dragOverColumn === column.id ? 'bg-accent/20' : ''}`}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnterColumn(e, column.id)}
            >
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 mb-3 bg-card rounded-md shadow-sm cursor-move border border-border hover:shadow transition-all
                    ${draggedTask && draggedTask.taskId === task.id ? 'opacity-50' : ''}
                    ${dragOverTask && dragOverTask.taskId === task.id ? 'border-t-2 border-primary' : ''}
                  `}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id, column.id)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDragEnter={(e) => handleDragEnterTask(e, task.id, column.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <GripVertical size={14} className="mr-2 text-muted-foreground" />
                      <h3 className="font-medium">{task.title}</h3>
                    </div>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                      title="Delete task"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 ml-6">{task.content}</p>
                </div>
              ))}
              
              {addingTaskToColumn === column.id && (
                <div className="p-3 bg-card rounded-md shadow-md mt-3 border">
                  <input
                    type="text"
                    placeholder="Task title"
                    value={newTaskData.title}
                    onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                    className="w-full p-2 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    autoFocus
                  />
                  <textarea
                    placeholder="Task description"
                    value={newTaskData.content}
                    onChange={(e) => setNewTaskData({ ...newTaskData, content: e.target.value })}
                    className="w-full p-2 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={2}
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setAddingTaskToColumn(null)}
                      className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleAddTask(column.id)}
                      className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
                    >
                      Add Task
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
      
      {!addingColumn ? (
        <div className="w-72 flex-shrink-0 bg-card/50 rounded-md shadow border border-dashed border-muted-foreground/30 flex items-center justify-center">
          <button
            onClick={() => setAddingColumn(true)}
            className="w-full h-full p-4 text-center text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors flex flex-col items-center justify-center"
          >
            <PlusCircle size={24} className="mb-2" />
            <span className="font-medium">Add New Column</span>
          </button>
        </div>
      ) : (
        <div className="w-72 flex-shrink-0 bg-card rounded-md shadow p-4">
          <h3 className="text-lg font-medium mb-3">New Column</h3>
          <input
            type="text"
            placeholder="Column title"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            className="w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            autoFocus
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setAddingColumn(false)}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleAddColumn}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              Add Column
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
