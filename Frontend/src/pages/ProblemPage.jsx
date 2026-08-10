import React from 'react'
import { useParams } from 'react-router'

function ProblemPage() {

    const { id } = useParams();
  return (
    <div>ProblemPage-{id}</div>
  )
}

export default ProblemPage