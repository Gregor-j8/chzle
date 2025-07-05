import { useEffect, useState } from 'react'

export default function EvaluationBar({ evaluation }){
  const [score, setScore] = useState(0)

    useEffect(() => {
    const timer = setTimeout(() => {
        if (!evaluation || evaluation.error) {
            setScore(0)
        } else {
            const pv = evaluation?.pvs?.[0]
            let newScore = 0
            if (pv) {
                newScore = Math.max(0, Math.min(100, (pv.cp + 1000) / 20))
            }
            setScore(newScore)
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
