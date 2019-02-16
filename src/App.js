import React, { useEffect } from 'react'
import { useUndoableReducer, UNDO, REDO } from './useUndoableReducer'

const UPDATE = 'update'
const CLEAR = 'clear'
const RESET = 'reset'

const CACHE_KEY = 'app-storage'
const INITIAL_TEXT =
  'Then there was the bad weather. It would come in one day when the fall was over. We would have to shut the windows in the night against the rain and the cold wind would strip the leaves from the trees in the Place Contrescarpe. The leaves lay sodden in the rain and the wind drove the rain against the big green autobus at the terminal and the Café des Amateurs was crowded and the windows misted over from the heat and the smoke inside.'

function reducer(state, action) {
  switch (action.type) {
    case UPDATE:
      return { text: action.text }
    case CLEAR:
      return { text: '' }
    case RESET:
      return { text: INITIAL_TEXT }
    default:
      throw new Error(`Unknown action ${action.type}`)
  }
}

function getInitialState() {
  const storedState = JSON.parse(window.localStorage.getItem(CACHE_KEY))
  if (storedState) return storedState
  return {
    text: INITIAL_TEXT
  }
}

function App() {
  const [state, dispatch, history] = useUndoableReducer(
    reducer,
    getInitialState()
  )

  useEffect(
    () => window.localStorage.setItem(CACHE_KEY, JSON.stringify(state)),
    [state] // only save in locatstorage if state changes
  )

  const { canRedo, canUndo } = history
  const { text } = state

  return (
    <>
      <nav className="Controls">
        <button type="button" onClick={e => dispatch({ type: CLEAR })}>
          Clear
        </button>
        <button onClick={e => dispatch({ type: RESET })}>Reset</button>
        <button disabled={!canUndo} onClick={e => dispatch({ type: UNDO })}>
          Undo
        </button>
        <button disabled={!canRedo} onClick={e => dispatch({ type: REDO })}>
          Redo
        </button>
      </nav>
      <textarea
        autoFocus
        value={text}
        onChange={e => dispatch({ type: UPDATE, text: e.target.value })}
      />
    </>
  )
}

export default App
