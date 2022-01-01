import styled from "styled-components";
import { motion } from "framer-motion";
import { executionsState } from "../../state/editor";
import { useAtom } from "jotai";
import { useState } from "react";

const ExecutionContainer = styled(motion.div)`
  position: absolute;
  right: 0;
  top: 135px;
  width: 445px;
  z-index: 999;
  padding: 15px;
  background: ${({ theme }) => theme.layoutDarkest};
  border-bottom-left-radius: 15px;
  border-top-left-radius: 15px;
  box-shadow: 0px 0px 6px 3px rgb(0 0 0 / 25%);
  word-wrap: break-word;
`;

const ExecutionTitle = styled.h1`
  font-size: 1.3em;
  margin: 0;
  color: ${({ theme }) => theme.textLight};
`;

const ExecutionSpan = styled.span`
  display: block;
  font-size: 1em;
  margin: 0 0 10px 0;
  color: ${({ theme }) => theme.textDarker};
`;

const ExecutionText = styled.span`
  color: ${({ theme }) => theme.textLight};
`;

const ExecutionError = styled.span`
  color: #ffcccc;
`;

const codeExecution = {
  initial: {
    x: "100%",
  },
  animate: {
    x: 0,
  },
};

export const CodeExecution: React.FC = (): JSX.Element => {
  const [executions] = useAtom(executionsState);
  const [index, setIndex] = useState(0);
  const hasPrev = index > 0;
  const hasNext = index < executions.length - 1;

  const handlePrevClick = () => {
    if (hasPrev) {
      setIndex(index - 1);
    }
  };

  const handleNextClick = () => {
    if (hasNext) {
      setIndex(index + 1);
    }
  };

  const execution = executions[index];
  const executedOutput = executions[executions.length - 1]?.output;
  const executedDate = executions[executions.length - 1]?.date;

  return (
    <ExecutionContainer
      variants={codeExecution}
      transition={{ duration: 0.45, type: "spring" }}
      initial="initial"
      exit="initial"
      animate="animate"
    >
      <ExecutionTitle>Code output</ExecutionTitle>
      <ExecutionSpan>Powered by Piston</ExecutionSpan>

      <button onClick={handlePrevClick} disabled={!hasPrev}>
        back
      </button>
      <button onClick={handleNextClick} disabled={!hasNext}>
        next
      </button>

      <br />
      <span>
        {index + 1}/{executions.length}
      </span>

      {index > 0 ? (
        <ExecutionSpan>
          <ExecutionText>{execution.date}</ExecutionText> <br />{" "}
          {execution.error === false ? (
            <>{execution.output}</>
          ) : (
            <>
              <ExecutionError>{execution.output}</ExecutionError>
            </>
          )}
        </ExecutionSpan>
      ) : (
        <>
          <br />
          {executedDate}
          <br />
          {executedOutput}
        </>
      )}
    </ExecutionContainer>
  );
};
