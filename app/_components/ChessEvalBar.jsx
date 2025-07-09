import { useEffect, useState } from 'react'

export default function EvaluationBar({ evaluation }){
  const [score, setScore] = useState(evaluation?.winChance)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (evaluation && !evaluation.error) {
        setScore(Math.round(evaluation.winChance))
      } else {
        setScore(null)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [evaluation])

  return (
    <div className="w-4 h-[360px] relative bg-black rounded overflow-hidden border border-gray-700">
      <div
        className="absolute bottom-0 bg-white w-full"
        style={{
          height: `${score}%`,
          transition: 'height 0.5s ease-in-out',
        }}
      />
    </div>
  )
}
