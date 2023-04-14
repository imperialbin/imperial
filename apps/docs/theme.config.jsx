import { GitHubLogo, Logo, PoweredByVercel } from "@docs/components/Icons";

export default {
  logo: (
    <>
      <Logo />
      <span style={{ marginLeft: ".4em", fontWeight: 800 }}>IMPERIAL</span>
    </>
  ),
  project: {
    link: "https://github.com/imperialbin/imperial/tree/main/apps/docs",
    icon: <GitHubLogo />,
  },
  useNextSeoProps() {
    return {
      titleTemplate: "IMPERIAL – %s",
    };
  },
  footer: {
    text: (
      <span>
        ©{" "}
        <a href="https://imperialb.in/" target="_blank">
          IMPERIAL
        </a>

        <div style={{display:"flex",alignItems:"center",gap:10,marginTop:15}}>
Powered By
        <PoweredByVercel />
        </div>
      </span>
    ),
  },
};
