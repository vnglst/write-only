import React from 'react'
import { render, fireEvent, cleanup } from 'react-testing-library'

import App from './App'

let textarea
let getByTestId
let utils

beforeEach(() => {
  utils = render(<App />)
  getByTestId = utils.getByTestId
  textarea = getByTestId('textarea')
})

afterEach(() => {
  // TODO: add tests for localStorage and it's edge cases
  window.localStorage.clear()
  cleanup()
})

it('should render App with default text', () => {
  expect(textarea.textContent).toContain('Then there was the bad weather.')
})

it('should clear all text when Clear is pressed', () => {
  const clear = getByTestId('clear-button')
  fireEvent.click(clear)
  expect(textarea.textContent).toBe('')
})

it('should show about text when About is pressed', () => {
  const about = getByTestId('about-button')
  fireEvent.click(about)
  expect(textarea.textContent).toContain('Write Only is')
})

it('should reset to initial text when Reset is pressed', () => {
  const clear = getByTestId('clear-button')
  fireEvent.click(clear)
  const reset = getByTestId('reset-button')
  fireEvent.click(reset)
  expect(textarea.textContent).toContain('Then there was the bad weather.')
})

it('should be possible to add text', () => {
  fireEvent.change(textarea, { target: { value: 'Hello world' } })
  expect(textarea.textContent).toBe('Hello world')
})

it('should be possible to undo any text changes', () => {
  fireEvent.change(textarea, { target: { value: 'Hello world' } })
  const undo = getByTestId('undo-button')
  fireEvent.click(undo)
  expect(textarea.textContent).toContain('Then there was the bad weather.')
})

it('should not crash or change when pressing undo twice', () => {
  fireEvent.change(textarea, { target: { value: 'Hello world' } })
  const undo = getByTestId('undo-button')
  fireEvent.click(undo)
  fireEvent.click(undo)
  expect(textarea.textContent).toContain('Then there was the bad weather.')
})

it('should be possible to redo undos', () => {
  fireEvent.change(textarea, { target: { value: 'Hello world' } })
  const undo = getByTestId('undo-button')
  fireEvent.click(undo)
  const redo = getByTestId('redo-button')
  fireEvent.click(redo)
  expect(textarea.textContent).toContain('Hello world')
})

it('should not crash when pressing redo twice', () => {
  fireEvent.change(textarea, { target: { value: 'Hello world' } })
  const undo = getByTestId('undo-button')
  fireEvent.click(undo)
  const redo = getByTestId('redo-button')
  fireEvent.click(redo)
  fireEvent.click(redo)
  expect(textarea.textContent).toContain('Hello world')
})
