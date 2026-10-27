import { DoubleSide } from 'three'

/** The surface seen from below. Becomes a rippling shader with caustics in stage (c). */
export function WaterSurface() {
  return (
    <mesh rotation-x={Math.PI / 2} position={[0, 0, -20]}>
      <planeGeometry args={[400, 400]} />
      <meshBasicMaterial color="#3E9DB6" side={DoubleSide} transparent opacity={0.65} />
    </mesh>
  )
}
