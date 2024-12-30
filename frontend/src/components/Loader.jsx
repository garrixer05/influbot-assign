import { ring } from 'ldrs'

ring.register()
const Loader = ({size,stroke,bgOpacity,speed,color}) => {
  return (
    <l-ring
    size={size}
    stroke={stroke}
    bg-opacity={bgOpacity}
    speed={speed} 
    color={color}
    ></l-ring>
  )
}

export default Loader