import { useReducer } from 'react'

export const REDO = 'redo'
export const UNDO = 'undo'

export function useUndoableReducer(reducer, initialPresent) {
  const initialState = {
    history: [initialPresent],
    currentIndex: 0
  }

  const [state, dispatch] = useReducer(undoable(reducer), initialState)

  const { history, currentIndex } = state

  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1

  return { state: history[currentIndex], dispatch, history, canUndo, canRedo }
}

function undoable(reducer) {
  // Return a reducer that handles undo and redo
  return function(state, action) {
    const { history, currentIndex } = state

    switch (action.type) {
      case UNDO:
        return {
          ...state,
          currentIndex: currentIndex - 1
        }
      case REDO:
        return {
          ...state,
          currentIndex: currentIndex + 1
        }
      default:
        // Delegate handling the action to the passed reducer
        const present = history[currentIndex]
        const newPresent = reducer(present, action)

        // Nothing's changed, don't update history
        if (present === newPresent) {
          return state
        }

        const newIndex = currentIndex + 1
        const newHistory = history.slice(0, newIndex)

        return {
          history: [...newHistory, newPresent],
          currentIndex: newIndex
        }
    }
  }
}
