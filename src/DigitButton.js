import { ACTIONS } from "./App"
export default function DigitButton({dispatch, digit, className}) {
    //köllum a dispatch function á onclick
    return <button className={className} onClick={() => dispatch ( {type: ACTIONS.ADD_DIGIT, payload: {digit}})}>{digit}</button>
}