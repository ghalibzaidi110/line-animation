import React, { useRef, useEffect, JSX } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

const phrase = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.";

function TextAnimation() {
  const wordRefs = useRef<HTMLSpanElement[]>([]);
  const body = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.set(wordRefs.current, { opacity: 0.2 });
    createAnimation();
  }, []);

  const createAnimation = () => {
    gsap.to(wordRefs.current, {
      scrollTrigger: {
        trigger: container.current,
        scrub: true,
        start: 'top',
        end: `+=${window.innerHeight / 1.5}`,
      },
      opacity: 1,
      ease: "none",
      stagger: 0.2
    });
  };

  const splitWords = (phrase: string) => {
    const words = phrase.split(" ");
    return (
      <p className="text-line" style={{ fontFamily: "'Poppins', sans-serif" }}>
        {words.map((word, i) => (
          <span 
            key={word + "_" + i} 
            className="word"
            ref={el => { if (el) wordRefs.current.push(el) }}
            style={{ opacity: 0.2, fontFamily: "'Poppins', sans-serif" }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </p>
    );
  };

  return (
    <main ref={container} className="text-main">
      <div ref={body} className="text-body">
        {splitWords(phrase)}
      </div>
    </main>
  );
}

export default TextAnimation;