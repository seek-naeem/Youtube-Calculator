import { gsap } from "gsap";

export const pageLoadAnimation = () => {
  const tl = gsap.timeline();
  
  tl.from("header", { 
    y: -100, 
    opacity: 0, 
    duration: 1, 
    ease: "power3.out" 
  })
  .from(".hero-title", { 
    y: 50, 
    opacity: 0, 
    duration: 1, 
    ease: "power3.out" 
  }, "-=0.5")
  .from(".glass-morphism", { 
    y: 30, 
    opacity: 0, 
    duration: 0.8, 
    stagger: 0.1, 
    ease: "power2.out" 
  }, "-=0.3");
  
  return tl;
};

export const themeTransition = () => {
  return gsap.fromTo(document.body, 
    { opacity: 0.8 }, 
    { opacity: 1, duration: 0.3, ease: "power2.out" }
  );
};

export const numberCountAnimation = (element: HTMLElement, endValue: number, duration: number = 1) => {
  const startValue = 0;
  const obj = { value: startValue };
  
  return gsap.to(obj, {
    value: endValue,
    duration,
    ease: "power2.out",
    onUpdate: () => {
      element.textContent = Math.round(obj.value).toLocaleString();
    }
  });
};

export const cardHoverAnimation = (element: HTMLElement, scale: number = 1.02) => {
  return gsap.to(element, { 
    scale, 
    duration: 0.3, 
    ease: "power2.out" 
  });
};

export const cardLeaveAnimation = (element: HTMLElement) => {
  return gsap.to(element, { 
    scale: 1, 
    duration: 0.3, 
    ease: "power2.out" 
  });
};

export const slideInAnimation = (element: HTMLElement, direction: "left" | "right" | "up" | "down" = "up") => {
  const directions = {
    left: { x: -30, y: 0 },
    right: { x: 30, y: 0 },
    up: { x: 0, y: 30 },
    down: { x: 0, y: -30 }
  };
  
  const { x, y } = directions[direction];
  
  return gsap.from(element, {
    x,
    y,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out"
  });
};
