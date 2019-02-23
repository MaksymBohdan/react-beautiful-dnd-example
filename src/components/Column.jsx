import React, { Component } from 'react'
import styled from 'styled-components'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import Task from './Task'

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  background-color: white;
  width: 220px;
  display: flex;
  flex-direction: column;
`
const Title = styled.h3`
  padding: 8px;
`
const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.2 ease;
  background-color: ${props => (props.isDraggingOver ? 'lightgrey' : 'white')};
  flex-grow: 1;
  min-heigth: 100px;
`
class InnerList extends React.Component {
  shouldComponentUpdate(nextProps){
    if(nextProps.tasks === this.props.tasks){
      return false
    }
    return true
  }
  render () {
     return this.props.tasks.map((el, index) => <Task index={index} key={el.id} task={el} />)
  }
}

class Column extends Component {
  render () {
    const { tasks, column, index } = this.props

    return (
      <Draggable draggableId={column.id} index={index}>
        {provided => (
          <Container {...provided.draggableProps} ref={provided.innerRef}>
            <Title {...provided.dragHandleProps}> {column.title} </Title>
            <Droppable droppableId={column.id} type='task'>
              {(provided, snapshot) => (
                <TaskList
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  <InnerList tasks={tasks} />

                  {provided.placeholder}
                </TaskList>
              )}
            </Droppable>
          </Container>
        )}
      </Draggable>
    )
  }
}

export default Column
