import { ACTIONS } from "./App"
export default function OperationButton({dispatch, operation}) {
    //köllum a dispatch function á onclick
    return <button onClick={() => dispatch ( {type: ACTIONS.CHOOSE_OPERATION, payload: {operation}})}>{operation}</button>
}