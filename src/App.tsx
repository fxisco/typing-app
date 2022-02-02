import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const text = `hola
esto es una prueba
esto es una prueba
`;

type KeyType = {
  isCurrent?: boolean;
  isCorrect?: boolean;
  hasCorrection?: boolean;
};

const Container = styled.div`
  position: relative;
`;

const CorrectText = styled.span`
  color: #00ff00;
`;

const TextContainer = styled.div`
  padding: 0 10px;
  margin-top: 50px;
  text-align: left;
  width: fit-content;
  position: relative;

  @media (min-width: 768px) {
    padding: 50px;
    margin: 20px auto;
  }
`;

const PunctuationContainer = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  font-size: 1.5em;
  font-weight: bold;

  @media (min-width: 768px) {
    top: 50px;
    right: 100px;
  }
`;

const ProgressContainer = styled.div`
  padding: 2rem 0;
  text-align: center;
`;

const HiddenText = styled.h1``;

const Key = styled.div<KeyType>`
  background-color: ${({ hasCorrection, isCurrent, isCorrect }) => {
    if (isCorrect) return "#00ff00";
    if (isCurrent) return "#fff";
    if (!hasCorrection) return "#909090";
    if (!isCorrect) return "#ff0000";
  }};
  border-radius: 3px;
  border: 1px solid #b4b4b4;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2),
    0 2px 0 0 rgba(255, 255, 255, 0.7) inset;
  color: #000;
  display: inline-block;
  font-size: 1.5em;
  font-weight: 700;
  line-height: 1;
  padding: 0.2rem 0.3rem;
  white-space: nowrap;
  margin: 0 5px 10px 0;

  @media (min-width: 768px) {
    padding: 0.8rem 1rem;
    margin: 0 10px 20px 0;
  }
`;

function App() {
  const letters = text.split("");
  const [responses] = useState<Array<boolean>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [height, setHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const getText = (letter: string) => {
    const isCarriageReturn = /\r|\n/.exec(letter);
    if (isCarriageReturn || letter === " ") return "\u00A0";

    return letter;
  };

  const isCarriageReturn = (letter: string) => /\r|\n/.exec(letter);

  const isKeyPressedCorrect = (keyPressed: string | null, letter: string) => {
    const isCarriageReturn = /\r|\n/.exec(letter);

    return (
      keyPressed === letter.normalize("NFD").replace(/[\u0300-\u036f]/g, "") ||
      (isCarriageReturn && keyPressed === " ")
    );
  };

  const convertToKeys = (letter: string, index: number) => {
    const isCurrentLetter = index === currentIndex;

    const isCorrect = index < currentIndex ? responses[index] : false;

    return (
      <>
        <Key
          hasCorrection={index <= currentIndex}
          key={index}
          isCorrect={isCorrect}
          isCurrent={isCurrentLetter}
        >
          {getText(letter)}
        </Key>
        {isCarriageReturn(letter) && <br key={`line-${index}`}></br>}
      </>
    );
  };

  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });

    setHeight(ref.current?.children[0].clientHeight || 0);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") e.preventDefault();

      if (isCarriageReturn(letters[currentIndex])) {
        window.scroll({
          top: window.scrollY + height,
          behavior: "smooth",
        });
      }

      if (isKeyPressedCorrect(e.key, letters[currentIndex])) {
        return responses.push(true);
      }

      return responses.push(false);
    };

    const onKeyUp = ({ key }: KeyboardEvent) => {
      setCurrentIndex(currentIndex + 1);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [currentIndex, responses]);

  const correctAnswers = responses.filter((answer) => answer);

  return (
    <Container>
      <PunctuationContainer>
        <CorrectText>{correctAnswers.length}</CorrectText> / {letters.length}
      </PunctuationContainer>
      <TextContainer ref={ref}>
        {letters.map((letter, index) => {
          return convertToKeys(letter, index);
        })}
        {correctAnswers.length === letters.length && (
          <HiddenText>Te quiero chuchi ❤️</HiddenText>
        )}
      </TextContainer>
    </Container>
  );
}

export default App;
