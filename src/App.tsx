import { useState } from 'react'
import './App.css'
import Input from 'src/components/Input/Input.tsx'

function App() {
  const [value, setValue] = useState('')

  const onChange = (value: string) => setValue(value)

  return (
    <div className="App">
      <p>Input value: {value}</p>
      <Input id="input" label="Type some value" value={value} onChange={onChange} />
    </div>
  )
}

export default App
