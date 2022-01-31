import React, { useState } from 'react';
import styled from 'styled-components';

const text = `hola cómo estás,
esto es otra prueba
`;

const Container = styled.div`
  padding: 10rem 0;
  text-align: center;
`;

const Key = styled.div`
  background-color: #eee;
  border-radius: 3px;
  border: 1px solid #b4b4b4;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .2), 0 2px 0 0 rgba(255, 255, 255, .7) inset;
  color: #333;
  display: inline-block;
  font-size: 1.5em;
  font-weight: 700;
  line-height: 1;
  padding: 0.5rem 1rem;
  white-space: nowrap;
  margin: 0 0.2rem;
`

const Space = styled.span`
  margin: 0 0.2rem;
`

function App() {
  const convertToKeys = (text: string) => {
    return text.split("").map((letter, index) => {
      var isCarriageReturn = /\r|\n/.exec(letter);
      
      if (isCarriageReturn) return <Key key={`${letter}-${index}`}>↵</Key>
      if (letter === ' ') return <Space key={`space-${index}`} />
  
      return <Key key={`${letter}-${index}`}>{letter}</Key>
    })
  }

  const paragrahps = text.match(/[^\n]+(?:\r?\n|$)/g) || '';
  const keys = convertToKeys(paragrahps[0]);

  return (
    <Container>
      {keys}
    </Container>
  );
}

export default App;
