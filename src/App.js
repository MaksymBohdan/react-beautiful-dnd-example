
import React, { Component } from 'react'
import Column from './components/Column'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import './App.css'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  background-color: ${props => (props.isDraggingOver ? 'skyblue' : 'white')};

`
   class InnerList extends React.PureComponent{
     render() {
      const { column, taskMap, index } = this.props
      const tasks = column.taskIds.map(taskId => taskMap[taskId])
      return <Column column={column} tasks={tasks} index={index} />
     }
   }

class App extends Component {
  state = {
    tasks: {
      'task-1': { id: 'task-1', content: 'Take out the garbage' },
      'task-2': { id: 'task-2', content: 'Watch my favorite show' },
      'task-3': { id: 'task-3', content: 'Change my phone' },
      'task-4': { id: 'task-4', content: 'Cook dinner' }
    },
    columns: {
      'column-1': {
        id: 'column-1',
        title: 'To do',
        taskIds: ['task-1', 'task-2', 'task-3', 'task-4']
      },
      'column-2': {
        id: 'column-2',
        title: 'In progress',
        taskIds: []
      },
      'column-3': {
        id: 'column-3',
        title: 'Done',
        taskIds: []
      },
    },
    columnOrder: ['column-1', 'column-2', 'column-3']
  }

  onDragStart = () => {
    document.body.style.color = 'orange'
    document.body.style.transition = 'background-color 0.2s ease'
  }
  
  onDragUpdate = update => {
    const { destination } = update
    const opacity = destination ? destination.index / Object.keys(this.state.tasks).length : 0
    document.body.style.backgroundColor = `rgba(153, 141, 217, ${opacity})`
  }
  onDragEnd = result => {
    document.body.style.color = 'inherit'
    document.body.style.backgroundColor = 'inherit'

    const { destination, source, draggableId, type } = result

    if (!destination) {
      return
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    if (type === 'column'){
      const newColumnOrder = Array.from(this.state.columnOrder)
      newColumnOrder.splice(source.index, 1)
      newColumnOrder.splice(destination.index, 0, draggableId)

      const newState = {
        ...this.state,
        columnOrder: newColumnOrder,
      }
      this.setState(newState);
      return;

    }

    // const column = this.state.columns[source.droppableId]; // in case if there is only one column
    // const newTaskIds = Array.from(column.taskIds); // in case if there is only one column
    const start = this.state.columns[source.droppableId]
    const finish = this.state.columns[destination.droppableId]

    // moving inside the same list
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...start, // column
        taskIds: newTaskIds
      }

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn
        }
      }

      this.setState(newState)
      return
    }
    // moving from one list to another
    const startTaskIds = Array.from(start.taskIds)
    startTaskIds.splice(source.index, 1)
    const newStart = {
      ...start,
      taskIds: startTaskIds
    }

    const finishTaskIds = Array.from(finish.taskIds)
    finishTaskIds.splice(destination.index, 0, draggableId)
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds
    }

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    }

    this.setState(newState)
  }

  render () {
    const { columnOrder, columns } = this.state
    return (
      <DragDropContext 
      // onDragStart={this.onDragStart} 
      // onDragUpdate={this.onDragUpdate} 
      onDragEnd={this.onDragEnd} >
        <Droppable 
         droppableId='all-columns' 
         type='column' 
         direction="horizontal"
        >
          {(provided, /*snapshot*/) => (
            <Container 
            {...provided.droppableProps} 
            ref={provided.innerRef}
            // isDraggingOver={snapshot.isDraggingOver}
            >
              {columnOrder.map((columnId, index) => {
                const column = columns[columnId]

                return (
                <InnerList 
                  key={column.id} 
                  column={column} 
                  taskMap={this.state.tasks} 
                  index={index} 
                  />)
              })}
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
}

export default App
