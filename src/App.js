import React, { useReducer, useEffect } from 'react'

const CACHE_KEY = 'write-only-storage'
const INITIAL_TEXT =
  'Then there was the bad weather. It would come in one day when the fall was over. We would have to shut the windows in the night against the rain and the cold wind would strip the leaves from the trees in the Place Contrescarpe. The leaves lay sodden in the rain and the wind drove the rain against the big green autobus at the terminal and the Café des Amateurs was crowded and the windows misted over from the heat and the smoke inside.'

function undoable(reducer) {
  // Return a reducer that handles undo and redo
  return function(state, action) {
    const { past, present, future } = state

    switch (action.type) {
      case 'undo':
        const previous = past[past.length - 1]
        const newPast = past.slice(0, past.length - 1)
        return {
          past: newPast,
          present: previous,
          future: [present, ...future]
        }
      case 'redo':
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

function textReducer(state, action) {
  switch (action.type) {
    case 'update':
      return { text: action.text }
    case 'clear':
      return { text: '' }
    case 'reset':
      return { text: INITIAL_TEXT }
    default:
      return { text: INITIAL_TEXT }
  }
}

function getInitialState() {
  const storedState = JSON.parse(window.localStorage.getItem(CACHE_KEY))
  if (storedState) return storedState
  // Call the reducer with empty action to populate the initial state
  return {
    past: [],
    present: textReducer(undefined, {}),
    future: []
  }
}

function App() {
  const [state, dispatch] = useReducer(undoable(textReducer), getInitialState())
  useEffect(
    () => window.localStorage.setItem(CACHE_KEY, JSON.stringify(state)),
    [state] // only save in locatstorage if state changes
  )

  const { past, present, future } = state
  const { text } = present

  // selectors, derived state
  const canUndo = past.length > 0
  const canRedo = future.length > 0

  return (
    <>
      <nav className="Controls">
        <button type="button" onClick={e => dispatch({ type: 'clear' })}>
          Clear
        </button>
        <button onClick={e => dispatch({ type: 'reset' })}>Reset</button>
        <button disabled={!canUndo} onClick={e => dispatch({ type: 'undo' })}>
          Undo
        </button>
        <button disabled={!canRedo} onClick={e => dispatch({ type: 'redo' })}>
          Redo
        </button>
      </nav>
      <textarea
        autoFocus
        value={text}
        onChange={e => dispatch({ type: 'update', text: e.target.value })}
      />
    </>
  )
}

export default App
