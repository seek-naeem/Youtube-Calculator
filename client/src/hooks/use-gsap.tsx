import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function useGSAP(callback: () => void, deps: any[] = []) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      callback();
    }
  }, deps);

  return ref;
}

export function useGSAPTimeline() {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    timelineRef.current = gsap.timeline();
    
    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  return timelineRef.current;
}
