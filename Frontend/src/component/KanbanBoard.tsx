// src/components/KanbanBoard.tsx
import React, { useEffect, useState } from "react";
import PlusIcon from "../Icons/PlusIcon";
import { Board, Column, Task } from "../services/boardService";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensors, useSensor, DragOverEvent, UniqueIdentifier } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { fetchBoards, createBoard, fetchColumns, createColumn, updateColumn, deleteColumn, fetchTasks, createTask, updateTask, deleteTask } from '../services/boardService';
import TaskCard from "./TaskCard";

const KanbanBoard: React.FC = () => {
  const [board, setBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 3,  // 3px
    },
  }));

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const boards = await fetchBoards();
      let currentBoard: Board;
      
      if (boards.length === 0) {
        currentBoard = await createInitialBoard();
      } else {
        currentBoard = boards[0]; // Assuming we're working with the first board
      }
      
      setBoard(currentBoard);
      
      const [columnsResponse, tasksResponse] = await Promise.all([
        fetchColumns(),
        fetchTasks()
      ]);
      
      if (columnsResponse.length === 0 && currentBoard.id) {
        const createdColumns = await createInitialColumns(currentBoard.id);
        setColumns(createdColumns);
      } else {
        setColumns(columnsResponse);
      }
      
      setTasks(tasksResponse);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const createInitialBoard = async (): Promise<Board> => {
    const newBoard: Omit<Board, 'id' | 'created_at' | 'updated_at'> = {
      name: "My Kanban Board",
      description: "A board to organize my tasks and projects"
    };

    try {
      const createdBoard = await createBoard(newBoard);
      return createdBoard;
    } catch (error) {
      console.error('Error creating initial board:', error);
      throw error;
    }
  };

  const createInitialColumns = async (boardId: number): Promise<Column[]> => {
    const initialColumns = [
      { title: "To Do", position: 0, board: boardId },
      { title: "In Progress", position: 1, board: boardId },
      { title: "Done", position: 2, board: boardId }
    ];

    try {
      const createdColumns = await Promise.all(initialColumns.map(col => createColumn(col)));
      return createdColumns;
    } catch (error) {
      console.error('Error creating initial columns:', error);
      throw error;
    }
  };

  const createNewColumnHandler = async () => {
    if (!board?.id) return;
    const newColumn: Omit<Column, 'id'> = {
      title: `New Column ${columns.length + 1}`,
      position: columns.length,
      board: board.id
    };
    try {
      const createdColumn = await createColumn(newColumn);
      setColumns(prev => [...prev, createdColumn]);
    } catch (error) {
      console.error('Error creating new column:', error);
    }
  };

  const updateColumnHandler = async (id: number, title: string) => {
    try {
      const updatedColumn = await updateColumn(id, { title });
      setColumns(prev => prev.map(col => col.id === id ? updatedColumn : col));
    } catch (error) {
      console.error('Error updating column:', error);
    }
  };

  const deleteColumnHandler = async (id: number) => {
    try {
      await deleteColumn(id);
      setColumns(prev => prev.filter(col => col.id !== id));
      setTasks(prev => prev.filter(task => task.columnId !== id));
    } catch (error) {
      console.error('Error deleting column:', error);
    }
  };

  const createTaskHandler = async (columnId: number) => {
    const column = columns.find(col => col.id === columnId);
    if (!column) {
      console.error('Column not found');
      return;
    }
  
    const newTask: Omit<Task, 'id'> = {
      content: `New Task ${tasks.length + 1}`,
      columnId,
      position: tasks.filter(task => task.columnId === columnId).length,
      title: `Task ${tasks.length + 1} - ${column.title}`
    };
  
    try {
      const createdTask = await createTask(newTask);
      setTasks(prev => [...prev, createdTask]);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };
  
  const updateTaskHandler = async (id: number, content: string) => {
    try {
      const updatedTask = await updateTask(id, { content });
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTaskHandler = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
    } else if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveColumn = active.data.current?.type === "Column";
    if (isActiveColumn) {
      setColumns(columns => {
        const activeColumnIndex = columns.findIndex(col => col.id === activeId);
        const overColumnIndex = columns.findIndex(col => col.id === overId);
        
        return arrayMove(columns, activeColumnIndex, overColumnIndex);
      });
    }

    const isActiveTask = active.data.current?.type === "Task";
    if (isActiveTask) {
      setTasks(tasks => {
        const activeIndex = tasks.findIndex(t => t.id === activeId);
        const overIndex = tasks.findIndex(t => t.id === overId);

        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      setTasks(tasks => {
        const activeIndex = tasks.findIndex(t => t.id === activeId);
        const overIndex = tasks.findIndex(t => t.id === overId);
        
        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex);
        }
        
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverColumn = over.data.current?.type === "Column";
    if (isActiveTask && isOverColumn) {
      setTasks(tasks => {
        const activeIndex = tasks.findIndex(t => t.id === activeId);
        
        tasks[activeIndex].columnId = overId as number;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  };

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      {board && (
        <div className="m-auto flex flex-col gap-4">
          <h1 className="text-2xl font-bold">{board.name}</h1>
          <p className="text-gray-600">{board.description}</p>
          <DndContext 
            sensors={sensors} 
            onDragStart={onDragStart} 
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
          >
            <div className="flex gap-4">
              <SortableContext items={columns.map(col => col.id).filter(id => id !== undefined) as UniqueIdentifier[]}>
                {columns.map(col => (
                  <ColumnContainer 
                    key={col.id} 
                    column={col} 
                    deleteColumn={deleteColumnHandler} 
                    updateColumn={updateColumnHandler}
                    createTask={createTaskHandler} 
                    updateTask={updateTaskHandler}
                    deleteTask={deleteTaskHandler}
                    tasks={tasks.filter(task => task.columnId === col.id)} 
                  />
                ))}
              </SortableContext>
            </div>
            {createPortal(
              <DragOverlay>
                {activeColumn && (
                  <ColumnContainer 
                    column={activeColumn} 
                    deleteColumn={deleteColumnHandler} 
                    updateColumn={updateColumnHandler}
                    createTask={createTaskHandler}
                    updateTask={updateTaskHandler}
                    deleteTask={deleteTaskHandler}
                    tasks={tasks.filter(task => task.columnId === activeColumn.id)} 
                  />
                )}
                {activeTask && (
                  <TaskCard 
                    task={activeTask}
                    deleteTask={deleteTaskHandler} 
                    updateTask={updateTaskHandler}
                  />
                )}
              </DragOverlay>,
              document.body
            )}
          </DndContext>
          <button 
            onClick={createNewColumnHandler}
            className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2"
          >
            <PlusIcon /> 
            Add Column
          </button>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
