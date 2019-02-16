import React, { useReducer, useEffect } from 'react'

const CACHE_KEY = 'write-only-storage'
const INITIAL_TEXT =
  'Then there was the bad weather. It would come in one day when the fall was over. We would have to shut the windows in the night against the rain and the cold wind would strip the leaves from the trees in the Place Contrescarpe. The leaves lay sodden in the rain and the wind drove the rain against the big green autobus at the terminal and the Café des Amateurs was crowded and the windows misted over from the heat and the smoke inside.'

function reducer(state, action) {
  const { past, text, future } = state
  switch (action.type) {
    case 'update':
      return { past: [...past, text], text: action.text, future: [] }
    case 'clear':
      return { past: [...past, text], text: '', future: [] }
    case 'reset':
      return { past: [...past, text], text: INITIAL_TEXT, future: [] }
    case 'undo': {
      const previous = past[past.length - 1]
      const newPast = past.slice(0, past.length - 1)
      return {
        past: newPast,
        text: previous,
        future: [text, ...future]
      }
    }
    case 'redo':
      const next = future[0]
      const newFuture = future.slice(1)
      return {
        past: [...past, text],
        text: next,
        future: newFuture
      }
    default:
      throw new Error(`Unknown action ${action.type}`)
  }
}

function getInitialState() {
  const storedState = JSON.parse(window.localStorage.getItem(CACHE_KEY))
  if (storedState) return storedState
  return {
    past: [],
    text: INITIAL_TEXT,
    future: []
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, getInitialState())
  useEffect(
    () => window.localStorage.setItem(CACHE_KEY, JSON.stringify(state)),
    [state] // only save in locatstorage if state changes
  )

  const { past, text, future } = state

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
