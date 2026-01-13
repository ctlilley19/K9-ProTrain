'use client';

import { useState, useCallback } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
  type DraggableProvided,
  type DroppableProvided,
} from '@hello-pangea/dnd';
import { PageHeader } from '@/components/layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ActivityBadge } from '@/components/ui/Badge';
import { ActivityCard, QuickLogFAB, type ActivityDog } from '@/components/training';
import { cn, activityConfig, type ActivityType } from '@/lib/utils';
import {
  Dog,
  Filter,
  Plus,
  Home,
  Droplets,
  GraduationCap,
  Gamepad2,
  UtensilsCrossed,
  Moon,
  RefreshCw,
  Sparkles,
  Stethoscope,
} from 'lucide-react';

// Activity icons mapping
const activityIcons: Record<ActivityType, React.ReactNode> = {
  kennel: <Home size={16} />,
  potty: <Droplets size={16} />,
  training: <GraduationCap size={16} />,
  play: <Gamepad2 size={16} />,
  group_play: <Gamepad2 size={16} />,
  feeding: <UtensilsCrossed size={16} />,
  rest: <Moon size={16} />,
  walk: <Dog size={16} />,
  grooming: <Sparkles size={16} />,
  medical: <Stethoscope size={16} />,
};

// Column configuration
const columnConfig: { id: ActivityType; title: string }[] = [
  { id: 'kennel', title: 'Kenneled' },
  { id: 'potty', title: 'Potty Break' },
  { id: 'training', title: 'Training' },
  { id: 'play', title: 'Play Time' },
  { id: 'feeding', title: 'Feeding' },
  { id: 'rest', title: 'Rest' },
];

// Mock data for training board
const initialDogsData: Record<ActivityType, ActivityDog[]> = {
  kennel: [
    {
      id: '1',
      name: 'Max',
      breed: 'German Shepherd',
      photo_url: null,
      startedAt: new Date(Date.now() - 45 * 60000),
      trainer: 'John',
    },
    {
      id: '2',
      name: 'Rocky',
      breed: 'Rottweiler',
      photo_url: null,
      startedAt: new Date(Date.now() - 180 * 60000),
      trainer: 'Sarah',
    },
  ],
  potty: [
    {
      id: '3',
      name: 'Bella',
      breed: 'Golden Retriever',
      photo_url: null,
      startedAt: new Date(Date.now() - 5 * 60000),
      trainer: 'John',
    },
  ],
  training: [
    {
      id: '4',
      name: 'Luna',
      breed: 'Border Collie',
      photo_url: null,
      startedAt: new Date(Date.now() - 20 * 60000),
      trainer: 'Sarah',
    },
    {
      id: '5',
      name: 'Charlie',
      breed: 'Labrador',
      photo_url: null,
      startedAt: new Date(Date.now() - 15 * 60000),
      trainer: 'Mike',
    },
  ],
  play: [
    {
      id: '6',
      name: 'Daisy',
      breed: 'Beagle',
      photo_url: null,
      startedAt: new Date(Date.now() - 25 * 60000),
      trainer: 'John',
    },
  ],
  feeding: [],
  rest: [
    {
      id: '7',
      name: 'Cooper',
      breed: 'Husky',
      photo_url: null,
      startedAt: new Date(Date.now() - 60 * 60000),
      trainer: 'Sarah',
    },
  ],
  group_play: [],
  walk: [],
  grooming: [],
  medical: [],
};

// All dogs for quick log
const allDogs = Object.values(initialDogsData)
  .flat()
  .map((d) => ({ id: d.id, name: d.name }));

export default function TrainingBoardPage() {
  const [columns, setColumns] = useState<Record<ActivityType, ActivityDog[]>>(initialDogsData);

  const handleDragEnd = useCallback((result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Dropped outside a droppable area
    if (!destination) return;

    // Dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = source.droppableId as ActivityType;
    const destColumn = destination.droppableId as ActivityType;

    // Create new state
    setColumns((prev) => {
      const newColumns = { ...prev };

      // Remove from source
      const sourceDogs = [...newColumns[sourceColumn]];
      const [movedDog] = sourceDogs.splice(source.index, 1);

      // Update the dog's start time when moving to a new column
      if (sourceColumn !== destColumn) {
        movedDog.startedAt = new Date();
      }

      // Add to destination
      const destDogs = sourceColumn === destColumn ? sourceDogs : [...newColumns[destColumn]];
      destDogs.splice(destination.index, 0, movedDog);

      newColumns[sourceColumn] = sourceDogs;
      newColumns[destColumn] = destDogs;

      // In a real app, call activitiesService here
      console.log(`Moved ${movedDog.name} from ${sourceColumn} to ${destColumn}`);

      return newColumns;
    });
  }, []);

  const handleQuickLog = useCallback(
    (dogId: string, activityType: ActivityType, notes?: string) => {
      // Find the dog in any column
      let foundDog: ActivityDog | null = null;
      let sourceColumn: ActivityType | null = null;

      for (const [column, dogs] of Object.entries(columns)) {
        const dog = dogs.find((d) => d.id === dogId);
        if (dog) {
          foundDog = dog;
          sourceColumn = column as ActivityType;
          break;
        }
      }

      if (!foundDog || !sourceColumn) return;

      setColumns((prev) => {
        const newColumns = { ...prev };

        // Remove from source
        newColumns[sourceColumn!] = newColumns[sourceColumn!].filter((d) => d.id !== dogId);

        // Add to destination with new start time
        newColumns[activityType] = [
          ...newColumns[activityType],
          {
            ...foundDog!,
            startedAt: new Date(),
            notes,
          },
        ];

        console.log(`Quick logged ${foundDog!.name} to ${activityType}${notes ? ` with note: ${notes}` : ''}`);

        return newColumns;
      });
    },
    [columns]
  );

  const handleAddPhoto = useCallback((dogId: string) => {
    // In a real app, open file picker and upload photo
    console.log('Add photo for dog:', dogId);
  }, []);

  const handleAddNote = useCallback((dogId: string, note: string) => {
    setColumns((prev) => {
      const newColumns = { ...prev };
      for (const column of Object.keys(newColumns) as ActivityType[]) {
        newColumns[column] = newColumns[column].map((dog) =>
          dog.id === dogId ? { ...dog, notes: note } : dog
        );
      }
      return newColumns;
    });
  }, []);

  const handleEndActivity = useCallback((dogId: string, currentColumn: ActivityType) => {
    // Move dog back to kennel
    setColumns((prev) => {
      const newColumns = { ...prev };
      const dog = newColumns[currentColumn].find((d) => d.id === dogId);
      if (!dog) return prev;

      newColumns[currentColumn] = newColumns[currentColumn].filter((d) => d.id !== dogId);
      newColumns.kennel = [
        ...newColumns.kennel,
        { ...dog, startedAt: new Date(), notes: undefined },
      ];

      console.log(`Ended activity for ${dog.name}, moved back to kennel`);
      return newColumns;
    });
  }, []);

  return (
    <div className="h-[calc(100vh-8rem)]">
      <PageHeader
        title="Training Board"
        description="Drag dogs between columns to log activities"
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" leftIcon={<RefreshCw size={16} />}>
              Refresh
            </Button>
            <Button variant="outline" size="sm" leftIcon={<Filter size={16} />}>
              Filter
            </Button>
            <Button variant="primary" size="sm" leftIcon={<Plus size={16} />}>
              Add Dog
            </Button>
          </div>
        }
      />

      {/* Kanban Board with Drag and Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 h-full">
          {columnConfig.map((column) => {
            const config = activityConfig[column.id];
            const dogs = columns[column.id] || [];

            return (
              <div key={column.id} className="flex-shrink-0 w-72 flex flex-col">
                {/* Column Header */}
                <div
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-t-xl border-t-2',
                    'bg-surface-800/50',
                    column.id === 'kennel'
                      ? 'border-t-gray-500'
                      : column.id === 'potty'
                      ? 'border-t-yellow-500'
                      : column.id === 'training'
                      ? 'border-t-blue-500'
                      : column.id === 'play'
                      ? 'border-t-green-500'
                      : column.id === 'feeding'
                      ? 'border-t-purple-500'
                      : 'border-t-sky-500'
                  )}
                >
                  <ActivityBadge activity={column.id} size="sm">
                    {activityIcons[column.id]}
                  </ActivityBadge>
                  <span className="font-medium text-white text-sm">{column.title}</span>
                  <span className="ml-auto text-xs text-surface-500 bg-surface-700 px-2 py-0.5 rounded-full">
                    {dogs.length}
                  </span>
                </div>

                {/* Droppable Column Content */}
                <Droppable droppableId={column.id}>
                  {(provided: DroppableProvided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        'flex-1 p-2 rounded-b-xl border border-surface-800 border-t-0 space-y-2 overflow-y-auto transition-colors',
                        snapshot.isDraggingOver
                          ? 'bg-surface-800/70 border-brand-500/30'
                          : 'bg-surface-900/50'
                      )}
                    >
                      {dogs.length === 0 && !snapshot.isDraggingOver ? (
                        <div className="flex items-center justify-center h-24 text-surface-600 text-sm">
                          Drop dogs here
                        </div>
                      ) : (
                        dogs.map((dog, index) => (
                          <Draggable key={dog.id} draggableId={dog.id} index={index}>
                            {(provided: DraggableProvided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                              >
                                <ActivityCard
                                  dog={dog}
                                  activityType={column.id}
                                  isDragging={snapshot.isDragging}
                                  dragHandleProps={provided.dragHandleProps ?? undefined}
                                  onAddPhoto={() => handleAddPhoto(dog.id)}
                                  onAddNote={(note) => handleAddNote(dog.id, note)}
                                  onEndActivity={() => handleEndActivity(dog.id, column.id)}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Quick Log FAB */}
      <QuickLogFAB dogs={allDogs} onLog={handleQuickLog} />
    </div>
  );
}
