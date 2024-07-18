import React, { useEffect, useState } from "react";
import PlusIcon from "../Icons/PlusIcon";
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensors, useSensor, DragOverEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { fetchColumns, createColumn, updateColumn, deleteColumn, fetchTasks, createTask, updateTask, deleteTask } from '../services/boardService';
import TaskCard from "./TaskCard";

const KanbanBoard: React.FC = () => {
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
      const [columnsResponse, tasksResponse] = await Promise.all([
        fetchColumns(),
        fetchTasks()
      ]);
      setColumns(columnsResponse.data);
      setTasks(tasksResponse.data);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const createTaskHandler = async (column: Id) => {
    const newTask: Omit<Task, "id"> = {
      column,
      content: `Task ${tasks.length + 1}`,
      position: 0,
      columnId: undefined
    };
    try {
      await createTask(newTask);
      setTasks(prevTasks => [...prevTasks, { ...newTask, id: generateId() }]);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTaskHandler = async (id: Id, content: string) => {
    try {
      await updateTask(id, { content });
      setTasks(prevTasks => prevTasks.map(task => 
        task.id !== id ? task : { ...task, content }
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTaskHandler = async (id: Id) => {
    try {
      await deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const createNewColumnHandler = async () => {
    const columnToAdd: Omit<Column, "id"> = {
      title: `Column ${columns.length + 1}`,
      position: 0,
      tasks: [],
      board: 0
    };
    try {
      await createColumn(columnToAdd);
      setColumns(prevColumns => [...prevColumns, { ...columnToAdd, id: generateId() }]);
    } catch (error) {
      console.error('Error creating column:', error);
    }
  };

  const deleteColumnHandler = async (id: Id) => {
    try {
      await deleteColumn(id);
      setColumns(prevColumns => prevColumns.filter(col => col.id !== id));
      setTasks(prevTasks => prevTasks.filter(task => task.column !== id));
    } catch (error) {
      console.error('Error deleting column:', error);
    }
  };

  const updateColumnHandler = async (id: Id, title: string) => {
    try {
      await updateColumn(id, { title });
      setColumns(prevColumns => prevColumns.map(col => 
        col.id !== id ? col : { ...col, title }
      ));
    } catch (error) {
      console.error('Error updating column:', error);
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

    setColumns(columns => {
      const activeColumnIndex = columns.findIndex(col => col.id === activeId);
      const overColumnIndex = columns.findIndex(col => col.id === overId);
      
      if (activeColumnIndex !== -1 && overColumnIndex !== -1) {
        return arrayMove(columns, activeColumnIndex, overColumnIndex);
      }
      
      return columns;
    });
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
        
        if (activeIndex !== -1 && overIndex !== -1) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex);
        }
        
        return tasks;
      });
    }

    const isOverColumn = over.data.current?.type === "Column";
    if (isActiveTask && isOverColumn) {
      setTasks(tasks => {
        const activeIndex = tasks.findIndex(t => t.id === activeId);
        
        if (activeIndex !== -1) {
          tasks[activeIndex].columnId = overId as Id;
          return [...tasks];
        }
        
        return tasks;
      });
    }
  };

  const generateId = (): number => {
    const alphanumericString = Math.random().toString(36).substr(2, 9);
    const numericId = parseInt(alphanumericString, 36);
    return numericId;
  };
  

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext 
        sensors={sensors} 
        onDragStart={onDragStart} 
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-2">
          <div className="flex gap-4">
            <SortableContext items={columns.map(col => col.id)}>
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
          <button 
            onClick={createNewColumnHandler}
            className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2"
          >
            <PlusIcon /> 
            Add Column
          </button>
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
    </div>
  );
};

export default KanbanBoard;