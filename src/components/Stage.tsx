import { lazy, Suspense, useEffect, useState } from 'react';
import { useExperience } from '../context/Experience';
import FallbackScene from '../scene/FallbackScene';

const loadScene = () => import('../scene/SceneCanvas');
const SceneCanvas = lazy(loadScene);

/** Fixed full-viewport visual layer shared by every route. */
export default function Stage() {
  const { webgl, introOpen } = useExperience();
  // The 3D chunk is downloaded during the welcome sequence, but only mounted
  // (and its shaders compiled) once the intro ends — so the greetings never stutter.
  const [mount, setMount] = useState(!introOpen);
  useEffect(() => {
    if (!webgl) return;
    loadScene();
    if (!introOpen) setMount(true);
  }, [webgl, introOpen]);

  return (
    <div className="stage" aria-hidden="true">
      {webgl && mount ? (
        <Suspense fallback={<FallbackScene loading />}>
          <SceneCanvas />
        </Suspense>
      ) : (
        <FallbackScene loading={webgl} />
      )}
      <div className="stage-grain" />
      <div className="stage-vignette" />
    </div>
  );
}
