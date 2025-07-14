// For Test

"use client"

import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/store/store"
import { increment, decrement } from "@/store/slices/counterSlice"
import { Button } from "@/components/ui/button"

export default function CounterClient() {
  const value = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div className="flex flex-col gap-4 items-center mt-5">
      <p className="text-xl">Value: {value}</p>
      <div className="flex gap-2">
        <Button onClick={() => dispatch(increment())}>+</Button>
        <Button onClick={() => dispatch(decrement())}>-</Button>
      </div>
    </div>
  )
}
