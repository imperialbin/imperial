import { useEffect, useState } from "react";
import { Mail } from "react-feather";
import {
  BrandContainer,
  CallbackWrapper,
  Paragraph,
  Title,
} from "../../components/CallbackStyles";
import { makeRequest } from "../../utils/rest";

function Upgrade() {
  const [success, setSuccess] = useState<boolean | undefined>(undefined);
  const [message, setMessage] = useState("Hang tight, we're confirming your email now.");

  useEffect(() => {
    const confirm = async () => {
      const token = new URLSearchParams(window.location.search).get("token");
      if (!token) {
        setSuccess(false);
        setMessage("No token was provided. Please try again.");
        return;
      }

      const { success, error } = await makeRequest("POST", "/auth/confirm", {
        token,
      });

      if (!success) {
        setSuccess(false);
        setMessage(error?.message ?? "An error occurred whilst confirming your email.");

        return;
      }

      setSuccess(true);
      setMessage("Nice! You can now close this tab and enjoy IMPERIAL's sweet features.");
    };

    confirm();
  }, []);

  return (
    <CallbackWrapper>
      <BrandContainer>
        <Mail color="var(--text-secondary)" width={50} />
      </BrandContainer>
      <Title>
        {success === undefined
          ? "Confirming your email"
          : success
          ? "Confirmed your email"
          : "Oops..."}
      </Title>
      <Paragraph>{message}</Paragraph>
    </CallbackWrapper>
  );
}

export default Upgrade;
