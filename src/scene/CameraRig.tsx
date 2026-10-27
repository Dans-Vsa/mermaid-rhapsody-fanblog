import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CatmullRomCurve3, MathUtils, PerspectiveCamera, Vector3 } from 'three'
import { dive } from '../lib/dive'
import { KEYFRAMES } from './keyframes'

const tmpPos = new Vector3()
const tmpLook = new Vector3()

/** Camera rides a CatmullRom spline through one point per section; pointer adds a small parallax. */
export function CameraRig() {
  const camera = useThree((s) => s.camera)
  const { posCurve, lookCurve } = useMemo(
    () => ({
      posCurve: new CatmullRomCurve3(KEYFRAMES.map((k) => k.pos), false, 'centripetal'),
      lookCurve: new CatmullRomCurve3(KEYFRAMES.map((k) => k.look), false, 'centripetal'),
    }),
    [],
  )
  const look = useRef(new Vector3().copy(KEYFRAMES[0].look))
  const first = useRef(true)

  useFrame(({ size }, dt) => {
    // portrait screens get a wider lens so the whale and the mermaid stay in frame beside the text
    const fov = size.width / size.height < 0.8 ? 66 : 50
    const cam = camera as PerspectiveCamera
    if (cam.fov !== fov) {
      cam.fov = fov
      cam.updateProjectionMatrix()
    }
    const reduced = dive.reducedMotion
    const section = reduced ? Math.round(dive.section) : dive.section
    // getPoint is parametric by segment for open curves, so t = i/(n-1) lands exactly on keyframe i.
    const t = section / (KEYFRAMES.length - 1)
    posCurve.getPoint(t, tmpPos)
    lookCurve.getPoint(t, tmpLook)

    if (!reduced) {
      tmpPos.x += dive.pointer.x * 0.9
      tmpPos.y += dive.pointer.y * 0.5
      // slow buoyant bob
      const time = performance.now() / 1000
      tmpPos.y += Math.sin(time * 0.6) * 0.15
    }

    if (reduced || first.current) {
      camera.position.copy(tmpPos)
      look.current.copy(tmpLook)
      first.current = false
    } else {
      const d = Math.min(dt, 0.1)
      camera.position.x = MathUtils.damp(camera.position.x, tmpPos.x, 2.4, d)
      camera.position.y = MathUtils.damp(camera.position.y, tmpPos.y, 2.4, d)
      camera.position.z = MathUtils.damp(camera.position.z, tmpPos.z, 2.4, d)
      look.current.x = MathUtils.damp(look.current.x, tmpLook.x, 2, d)
      look.current.y = MathUtils.damp(look.current.y, tmpLook.y, 2, d)
      look.current.z = MathUtils.damp(look.current.z, tmpLook.z, 2, d)
    }
    camera.lookAt(look.current)
  })

  return null
}
