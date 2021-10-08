import styled from "styled-components";
import { motion } from "framer-motion";
import { executionsState } from "../../state/editor";
import { useAtom } from "jotai";

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
  color: white;
`;

const ExecutionError = styled.span`
  color: #FFCCCC;
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

      {executions
        .slice(1)
        .slice(-5)
        .map((e, key) => (
          <ExecutionSpan key={key}>
            <ExecutionText>{e.date}</ExecutionText> <br />{" "}
            {e.error === false ? (
              <>
                <ExecutionText>&gt;</ExecutionText> {e.output}
              </>
            ) : (
              <>
                <ExecutionText>&gt;</ExecutionText> <ExecutionError>{e.output}</ExecutionError>
              </>
            )}
          </ExecutionSpan>
        ))}

      {executedDate}
      <br />
      {executedOutput}
    </ExecutionContainer>
  );
};
