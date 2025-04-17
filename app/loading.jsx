import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex justify-center items-center w-full h-40">
      <Loader2 className="animate-spin size-4" />
    </div>
  )
}
