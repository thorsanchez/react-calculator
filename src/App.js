import "./styles.css"
import { useReducer } from 'react';
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

//globale variable fyrir öll actions
export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  EVALUATE: 'evaluate',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit'
}
function reducer(state, {type, payload}) {
  switch (type){
    case  ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      //viljum bara eitt 0 og .
      if (payload.digit === "0" && state.currentOperand === "0"){ return state}
      if (payload.digit === "." && state.currentOperand.includes(".")) {return state}
      return{
        ...state,
        /*hafa tomt ef currentOperand er null*/
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
    case ACTIONS.CLEAR:
      return {}

    case ACTIONS.DELETE_DIGIT:
       if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        }
       }
       if (state.currentOperand == null) return state
       if (state.currentOperand.length === 1) {
        return{
          ...state,
          currentOperand: null}
        }
        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1)
        }
       
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null){
        return state
      }
      //ef misstype operation
      if (state.currentOperand == null) {
      return{
        ...state,
        operation: payload.operation,
      }
    }
      //vitum hér að user buinn að stimpla inn tölu, þannig gerum current -> previous
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }
      return{
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }
    case ACTIONS.EVALUATE:
        if(state.operation == null || state.currentOperand == null || state.previousOperand == null) {
          return state
        }
        return {
          ...state,
          overwrite: true,
          previousOperand: null,
          currentOperand: evaluate(state),
          operation: null,
  }
  }
}

function evaluate({currentOperand, previousOperand, operation}) {
  const previous = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(previous) || isNaN(current )) return ""
  let computation = ""
  switch(operation){
    case "+":
      computation = previous + current
      break
    case "-":
      computation = previous - current
      break
    case "*":
      computation = previous * current
      break
    case "÷":
      computation = previous / current
      break
  }
  return computation.toString()
}
/* laga línu 116-124 */
const INTEGER_FORMATTER = new Intl.NumberFormat("is-IS",{
  maximumFractionDigits: 0,
})

function formatOperand (operand) {
  if (operand == null) return 
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}
function App() {
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})


  return (
    //öll reiknivelin
    <div className="calculator-grid">
      {/*gluggi sem 