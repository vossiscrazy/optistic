import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { supabase } from './supabaseClient'

const initialTasks = {
  'task-1': { id: 'task-1', content: 'Review AI safety research' },
  'task-2': { id: 'task-2', content: 'Update autonomous systems protocol' },
  'task-3': { id: 'task-3', content: 'Schedule team sync on acceleration metrics' },
  'task-4': { id: 'task-4', content: 'Old meeting notes' },
  'task-5': { id: 'task-5', content: 'Deprecated feature specs' },
  'task-6': { id: 'task-6', content: 'Monitor compute cluster performance' },
  'task-7': { id: 'task-7', content: 'Track competitor model releases' },
  'task-8': { id: 'task-8', content: 'Review quarterly progress metrics' },
  'task-9': { id: 'task-9', content: 'Ship v2 model improvements' },
  'task-10': { id: 'task-10', content: 'Optimize inference pipeline' },
  'task-11': { id: 'task-11', content: 'Write technical documentation' },
  'task-12': { id: 'task-12', content: 'Review pull requests' },
  'task-13': { id: 'task-13', content: 'Research new architecture patterns' },
  'task-14': { id: 'task-14', content: 'Plan Q3 roadmap' },
  'task-15': { id: 'task-15', content: 'Explore multi-modal capabilities' },
  'task-16': { id: 'task-16', content: 'Launched production deployment' },
  'task-17': { id: 'task-17', content: 'Completed security audit' },
  'task-18': { id: 'task-18', content: 'Fixed critical performance bug' },
  'task-19': { id: 'task-19', content: 'Merged feature branch' },
  'task-20': { id: 'task-20', content: 'Start benchmark evaluation' },
  'task-21': { id: 'task-21', content: 'Begin infrastructure migration' },
  'task-22': { id: 'task-22', content: 'Draft proposal for new initiative' },
}

const initialLists = {
  inbox: ['task-1', 'task-2', 'task-3'],
  trash: ['task-4', 'task-5'],
  watch: ['task-6', 'task-7', 'task-8'],
  todo: ['task-9', 'task-10', 'task-11', 'task-12'],
  later: ['task-13', 'task-14', 'task-15'],
  'anti-todo': ['task-16', 'task-17', 'task-18', 'task-19'],
  'next-day': ['task-20', 'task-21', 'task-22'],
}

const listMetadata = {
  inbox: { title: 'Inbox', className: 'inbox' },
  trash: { title: 'Trash', className: 'trash' },
  watch: { title: 'Watch', className: 'watch' },
  todo: { title: 'Todo', className: 'todo' },
  later: { title: 'Later', className: 'later' },
  'anti-todo': { title: 'Anti-Todo', className: 'anti-todo' },
  'next-day': { title: 'Next Day', className: 'next-day' },
}

function App() {
  const [tasks, setTasks] = useState({})
  const [lists, setLists] = useState({
    inbox: [],
    trash: [],
    watch: [],
    todo: [],
    later: [],
    'anti-todo': [],
    'next-day': [],
  })
  const [loading, setLoading] = useState(true)

  // Load tasks from Supabase on mount
  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('position')

    if (error) {
      console.error('Error loading tasks:', error)
      return
    }

    // Convert to normalized state structure
    const tasksById = {}
    const listsByName = {
      inbox: [],
      trash: [],
      watch: [],
      todo: [],
      later: [],
      'anti-todo': [],
      'next-day': [],
    }

    data.forEach((task) => {
      tasksById[task.id] = task
      if (listsByName[task.list_id]) {
        listsByName[task.list_id].push(task.id)
      }
    })

    setTasks(tasksById)
    setLists(listsByName)
    setLoading(false)
  }

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result

    // Dropped outside a valid droppable
    if (!destination) {
      return
    }

    // No movement
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    const sourceList = lists[source.droppableId]
    const destList = lists[destination.droppableId]

    // Moving within the same list
    if (source.droppableId === destination.droppableId) {
      const newList = Array.from(sourceList)
      const [removed] = newList.splice(source.index, 1)
      newList.splice(destination.index, 0, removed)

      setLists({
        ...lists,
        [source.droppableId]: newList,
      })

      // Update positions in database
      await updateTaskPositions(newList, source.droppableId)
    } else {
      // Moving between lists
      const newSourceList = Array.from(sourceList)
      const newDestList = Array.from(destList)
      const [removed] = newSourceList.splice(source.index, 1)
      newDestList.splice(destination.index, 0, removed)

      setLists({
        ...lists,
        [source.droppableId]: newSourceList,
        [destination.droppableId]: newDestList,
      })

      // Update task's list_id in database
      await supabase
        .from('tasks')
        .update({ list_id: destination.droppableId, position: destination.index })
        .eq('id', draggableId)

      // Update positions in both lists
      await updateTaskPositions(newSourceList, source.droppableId)
      await updateTaskPositions(newDestList, destination.droppableId)
    }
  }

  const updateTaskPositions = async (taskIds, listId) => {
    const updates = taskIds.map((taskId, index) => ({
      id: taskId,
      position: index,
      list_id: listId,
    }))

    for (const update of updates) {
      await supabase
        .from('tasks')
        .update({ position: update.position, list_id: update.list_id })
        .eq('id', update.id)
    }
  }

  const handleAddTask = async (e) => {
    e.preventDefault()
    const form = e.target
    const input = form.elements.taskContent
    const content = input.value.trim()

    if (!content) return

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        content,
        list_id: 'inbox',
        position: lists.inbox.length,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating task:', error)
      return
    }

    // Update local state
    setTasks({ ...tasks, [data.id]: data })
    setLists({ ...lists, inbox: [...lists.inbox, data.id] })

    // Clear input
    input.value = ''
  }

  const handleEmptyTrash = async () => {
    const trashTaskIds = lists.trash

    if (trashTaskIds.length === 0) return

    // Delete all tasks in trash from database
    const { error } = await supabase
      .from('tasks')
      .delete()
      .in('id', trashTaskIds)

    if (error) {
      console.error('Error emptying trash:', error)
      return
    }

    // Update local state
    const newTasks = { ...tasks }
    trashTaskIds.forEach(taskId => {
      delete newTasks[taskId]
    })

    setTasks(newTasks)
    setLists({ ...lists, trash: [] })
  }

  return (
    <>
      <header>
        <h1>Optistic</h1>
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid-container">
          {Object.keys(listMetadata).map((listId) => {
            const metadata = listMetadata[listId]
            const taskIds = lists[listId]

            return (
              <Droppable key={listId} droppableId={listId}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`list ${metadata.className}`}
                  >
                    <h3>{metadata.title}</h3>
                    {listId === 'inbox' && (
                      <form onSubmit={handleAddTask} className="task-input-form">
                        <input
                          type="text"
                          name="taskContent"
                          placeholder="Add a task..."
                          className="task-input"
                        />
                      </form>
                    )}
                    {taskIds.map((taskId, index) => {
                      const task = tasks[taskId]
                      return (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => {
                            const style = {
                              opacity: snapshot.isDragging ? 0.5 : 1,
                              ...provided.draggableProps.style,
                            }

                            // Disable drop animation
                            if (snapshot.isDropAnimating) {
                              style.transitionDuration = '0.001s'
                            }

                            return (
                              <p
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={style}
                              >
                                {task.content}
                              </p>
                            )
                          }}
                        </Draggable>
                      )
                    })}
                    {listId === 'trash' && taskIds.length > 0 && (
                      <button onClick={handleEmptyTrash} className="empty-trash-button">
                        Empty Trash ({taskIds.length})
                      </button>
                    )}
                    <div style={{ opacity: 0 }}>
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            )
          })}
        </div>
      </DragDropContext>

      <footer>
        <p>© 2025 Optistic</p>
      </footer>
    </>
  )
}

export default App
