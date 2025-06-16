import React, { useRef, useEffect, JSX } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

const phrase = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.";

function TextAnimation() {
  const refs = useRef<HTMLSpanElement[]>([]);
  const body = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.set(refs.current, { opacity: 0.2 });
    createAnimation();
  }, []);

  const createAnimation = () => {
    gsap.to(refs.current, {
      scrollTrigger: {
        trigger: container.current,
        scrub: true,
        start: 'top',
        end: `+=${window.innerHeight / 1.5}`,
      },
      opacity: 1,
      ease: "none",
      stagger: 0.1
    });
  };

  const splitWords = (phrase: string) => {
    const words = phrase.split(" ");
    return (
      <p className="text-line">
        {words.map((word, i) => (
          <span key={word + "_" + i} className="word">
            {splitLetters(word)}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </p>
    );
  };

  const splitLetters = (word: string) => {
    const letters: JSX.Element[] = [];
    word.split("").forEach((letter, i) => {
      letters.push(
        <span 
          key={letter + "_" + i} 
          ref={el => { if (el) refs.current.push(el) }}
          style={{ opacity: 0.2 }}
        >
          {letter}
        </span>
      );
    });
    return letters;
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