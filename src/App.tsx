import React, { useState, useEffect } from "react";
import styled from "styled-components";

const text = `hola esto es una prueba
vamos probando a ver que pasa
`;

type KeyType = {
  isCurrent?: boolean;
  isCorrect?: boolean;
  isPressed?: boolean;
};

const Container = styled.div`
  padding: 10rem 0;
  text-align: center;
`;

const Key = styled.div<KeyType>`
  background-color: ${({ isCurrent, isCorrect, isPressed }) => {
    if (isCurrent && !isPressed) return "#fff";
    if (isCurrent && isPressed && isCorrect) return "#00ff00";
    if (isCurrent && isPressed && !isCorrect) return "#ff0000";

    return "#909090";
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
  padding: 0.8rem 1rem;
  white-space: nowrap;
  margin: 0 0.2rem 0.4rem 0;
`;

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isKeyPressed, setIsKeyPressed] = useState(false);
  const [keyPressed, setKeyPressed] = useState<string | null>(null);
  const paragrahps = text.match(/[^\n]+(?:\r?\n|$)/g) || "";

  const getText = (letter: string) => {
    const isCarriageReturn = /\r|\n/.exec(letter);
    if (isCarriageReturn) return "↵";
    if (letter === " ") return "␣";

    return letter;
  };

  const isKeyPressedCorrect = (keyPressed: string | null, letter: string) => {
    const isCarriageReturn = /\r|\n/.exec(letter);

    return (
      keyPressed !== null &&
      (keyPressed === letter.normalize("NFD").replace(/[\u0300-\u036f]/g, "") ||
        (isCarriageReturn && keyPressed === "Enter"))
    );
  };

  const convertToKeys = (text: string) => {
    return text.split("").map((letter, index) => {
      const isCurrentLetter = index === currentIndex;

      const isCorrect =
        isCurrentLetter &&
        isKeyPressed &&
        isKeyPressedCorrect(keyPressed, letter);

      return (
        <Key
          key={`${letter}-${index}`}
          isCurrent={isCurrentLetter}
          isPressed={isKeyPressed}
          isCorrect={!!isCorrect}
        >
          {getText(letter)}
        </Key>
      );
    });
  };

  const paragrah = convertToKeys(paragrahps[0]);

  useEffect(() => {
    const onKeyDown = ({ key }: KeyboardEvent) => {
      if (keyPressed) return;

      setIsKeyPressed(true);
      setKeyPressed(key);
    };

    const onKeyUp = ({ key }: KeyboardEvent) => {
      setIsKeyPressed(false);
      setKeyPressed(null);

      if (currentIndex >= paragrahps[0].length - 1) return;

      setCurrentIndex(currentIndex + 1);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [currentIndex, keyPressed]);

  return <Container>{paragrah}</Container>;
}

export default App;
