import { useReducer } from 'react'

export const REDO = 'redo'
export const UNDO = 'undo'

export function useUndoableReducer(reducer, initialPresent) {
  const initialState = {
    past: [],
    present: initialPresent,
    future: []
  }

  const [state, dispatch] = useReducer(undoable(reducer), initialState)
  const history = {
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    state
  }

  return [state.present, dispatch, history]
}

function undoable(reducer) {
  // Return a reducer that handles undo and redo
  return function(state, action) {
    const { past, present, future } = state

    switch (action.type) {
      case UNDO:
        const previous = past[past.length - 1]
        const newPast = past.slice(0, past.length - 1)
        return {
          past: newPast,
          present: previous,
          future: [present, ...future]
        }
      case REDO:
        const next = future[0]
        const newFuture = future.slice(1)
        return {
          past: [...past, present],
          present: next,
          future: newFuture
        }
      default:
        // Delegate handling the action to the passed reducer
        const newPresent = reducer(present, action)
        if (present === newPresent) {
          return state
        }
        return {
          past: [...past, present],
          present: newPresent,
          future: []
        }
    }
  }
}
