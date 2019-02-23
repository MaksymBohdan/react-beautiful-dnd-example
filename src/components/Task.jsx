import React from 'react'
import styled from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'

const Container = styled.div`
  padding: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  margin-bottom: 8px;
  background-color: ${props => (props.isDragging ? 'lightgreen': 'inherit')};
  display: flex;
  `
const Handle = styled.div`
  width:20px;
  height: 20px;
  background-color: orange;
  border-radius: 4px;
  margin-right: 8px;
`

const componentName = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => 
      <Container 
        ref={provided.innerRef}
        {...provided.draggableProps}
    
        isDragging={snapshot.isDragging}
      >
      <Handle     {...provided.dragHandleProps} />
        {task.content}
      </Container>}
    </Draggable>
  )
}

export default componentName
