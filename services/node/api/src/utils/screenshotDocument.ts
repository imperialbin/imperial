/* eslint-disable new-cap */
import puppeteer from "puppeteer";
import { S3 } from "./aws";

const CARBON_THEME = `[{"id":"theme:kk12asgoqee","name":"imperialv2","highlights":{"background":"rgba(31,31,31,1)","text":"#D4D4D4","variable":"rgba(226,237,252,1)","attribute":"rgba(255,255,255,1)","definition":"rgba(255,255,255,1)","keyword":"rgba(255,110,110,1)","operator":"#D4D4D4","property":"rgba(200,225,255,1)","number":"#B5CEA8","string":"rgba(121,184,255,1)","comment":"rgba(149,157,165,1)","meta":"#D4D4D4","tag":"#569cd6"},"custom":true}]`;
const CARBON_STATE = (code: string) =>
  `{"code":${code},"paddingVertical":"55px","paddingHorizontal":"25px","backgroundImage":null,"backgroundImageSelection":null,"backgroundMode":"color","backgroundColor":"#121212","dropShadow":true,"dropShadowOffsetY":"20px","dropShadowBlurRadius":"68px","theme":"theme:kk12asgoqee","windowTheme":"none","language":"auto","fontFamily":"JetBrains Mono","fontSize":"15px","lineHeight":"133%","windowControls":false,"widthAdjustment":false,"lineNumbers":false,"firstLineNumber":1,"exportSize":"2x","watermark":false,"squaredImage":false,"hiddenCharacters":false,"name":"","width":"700"}`;

const screenshotDocument = async (
  documentId: string,
  code: string,
  memberPlus: boolean
) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto("https://carbon.now.sh/");

  await page.evaluate(
    (CARBON_THEME, CARBON_STATE) => {
      localStorage.setItem("CARBON_THEMES", CARBON_THEME);
      localStorage.setItem("CARBON_STATE", CARBON_STATE);
    },
    CARBON_THEME,
    CARBON_STATE(JSON.stringify(code))
  );
  await page.reload();
  await page.evaluate(WATER_MARK);

  const element = await page.$("#export-container");
  const screenshot = await page.screenshot({
    type: "jpeg",
    omitBackground: true,
    quality: memberPlus ? 100 : 75,
  });

  if (screenshot) {
    await S3.uploadFile(
      `${documentId}.jpeg`,
      screenshot.toString(),
      "image/jpeg"
    );
  }

  await browser.close();
};

const WATER_MARK =
  "document.querySelector('.bg').innerHTML = `<img style=\"position: absolute;bottom: 14px;right: 0;height: 25px;left:50%;transform:translate(-50%,0);\" src=\"data:image/svg+xml,%3Csvg width='360' height='65' viewBox='0 0 360 65' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M38.1262 0L19.5976 31.493L0 42.7239L38.1262 64.7227L76.49 42.7239L56.7737 31.493L38.1262 0Z' fill='%23ACACAC'/%3E%3Cpath d='M103.904 48.8376L112.642 37.5322L104.091 26.4752H107.735L114.423 35.1924L121.049 26.4752H124.693L116.142 37.5322L124.9 48.8376H121.235L114.423 39.8719L107.569 48.8376H103.904Z' fill='%23F8F8F8'/%3E%3Cpath d='M335.302 54.001V34.8391C335.302 32.0957 336.035 29.8399 337.516 28.1073C339.033 26.3325 341.153 25.4408 343.797 25.4408C346.129 25.4408 347.876 26.1122 348.946 27.4934C349.954 28.7953 350.443 30.5642 350.443 32.7801V54.001H357.201V32.1824C357.201 28.3855 356.329 25.4534 354.61 23.3581C352.94 21.3223 350.306 20.2934 346.623 20.2934C344.298 20.2934 342.375 20.7615 340.839 21.6858C339.284 22.6208 338.02 23.945 337.041 25.6727L335.302 28.7416V21.1236H328.543V54.001H335.302ZM339.86 20.1628C341.71 19.0504 343.97 18.5001 346.623 18.5001C350.834 18.5001 354.009 19.7404 356.062 22.2433C358.066 24.6867 359.055 28.0089 359.055 32.1824V55.7943H348.589V32.7801C348.589 30.9224 348.203 29.5253 347.463 28.5689C346.783 27.6919 345.592 27.2342 343.797 27.2342C341.687 27.2342 340.096 27.9034 338.944 29.2503C337.757 30.6393 337.155 32.4904 337.155 34.8391V55.7943H326.69V19.3303H337.155V22.3882C337.951 21.5113 338.853 20.7688 339.86 20.1628ZM291.111 37.5623C291.111 40.1952 291.467 42.5711 292.176 44.6921C292.88 46.7988 293.894 48.6115 295.217 50.1369C296.526 51.6466 298.131 52.8028 300.042 53.6112C301.96 54.4229 304.167 54.8313 306.668 54.8313C309.169 54.8313 311.375 54.4229 313.293 53.6112C315.204 52.8028 316.809 51.6466 318.119 50.1369C319.441 48.6126 320.448 46.8012 321.141 44.6959C321.84 42.5737 322.191 40.1966 322.191 37.5623C322.191 34.9277 321.84 32.5446 321.141 30.4109C320.448 28.2958 319.441 26.4856 318.121 24.9734C316.811 23.4738 315.205 22.3223 313.293 21.5134C311.375 20.7018 309.169 20.2934 306.668 20.2934C304.167 20.2934 301.96 20.7018 300.042 21.5134C298.13 22.3223 296.524 23.4738 295.215 24.9734C293.893 26.4866 292.88 28.2981 292.176 30.4147C291.467 32.5473 291.111 34.929 291.111 37.5623ZM289.257 37.5623C289.257 34.7492 289.641 32.1828 290.412 29.8653C291.188 27.5318 292.317 25.5131 293.799 23.8161C295.293 22.1054 297.129 20.7884 299.299 19.8703C301.463 18.9551 303.921 18.5001 306.668 18.5001C309.414 18.5001 311.873 18.9551 314.036 19.8703C316.206 20.7884 318.043 22.1054 319.536 23.8161C321.019 25.5141 322.143 27.5341 322.908 29.8691C323.666 32.1854 324.044 34.7505 324.044 37.5623C324.044 40.3745 323.666 42.9344 322.907 45.2402C322.143 47.5629 321.02 49.5816 319.538 51.2896C318.044 53.0123 316.207 54.3358 314.036 55.2543C311.873 56.1695 309.414 56.6246 306.668 56.6246C303.921 56.6246 301.463 56.1695 299.299 55.2543C297.128 54.3358 295.291 53.0123 293.797 51.2896C292.316 49.5826 291.188 47.5652 290.412 45.244C289.641 42.937 289.257 40.3758 289.257 37.5623ZM298.239 42.5769V32.5145C298.239 30.1757 299.065 28.3132 300.715 27.0056C302.312 25.7391 304.309 25.1087 306.668 25.1087C309.023 25.1087 311.017 25.7258 312.614 26.9669C314.269 28.2539 315.096 30.1304 315.096 32.5145V42.5769C315.096 44.9826 314.27 46.8701 312.614 48.1577C311.017 49.3988 309.023 50.0159 306.668 50.0159C304.307 50.0159 302.309 49.3789 300.711 48.0997C299.064 46.7812 298.239 44.9145 298.239 42.5769ZM300.093 42.5769C300.093 44.4016 300.692 45.7563 301.893 46.7181C303.143 47.7193 304.722 48.2226 306.668 48.2226C308.618 48.2226 310.201 47.7327 311.453 46.7597C312.644 45.8334 313.243 44.4665 313.243 42.5769V32.5145C313.243 30.6477 312.645 29.2918 311.453 28.3649C310.201 27.392 308.618 26.9021 306.668 26.9021C304.721 26.9021 303.14 27.4008 301.89 28.3926C300.691 29.3432 300.093 30.691 300.093 32.5145V42.5769ZM260.635 54.001V47.0485L262.351 49.745C263.372 51.3496 264.665 52.5958 266.238 53.4947C267.793 54.3834 269.649 54.8313 271.822 54.8313C274.001 54.8313 275.885 54.3917 277.49 53.5184C279.113 52.6351 280.452 51.4359 281.516 49.9125C282.596 48.3658 283.399 46.5492 283.923 44.4578C284.455 42.3374 284.721 40.0392 284.721 37.5623C284.721 35.1292 284.455 32.8356 283.922 30.6804C283.398 28.5574 282.596 26.7315 281.518 25.1978C280.454 23.6847 279.114 22.4901 277.49 21.6062C275.885 20.7329 274.001 20.2934 271.822 20.2934C269.627 20.2934 267.766 20.7411 266.224 21.6286C264.661 22.5275 263.373 23.7741 262.351 25.3796L260.635 28.0761V9.53349H253.877V54.001H260.635ZM262.489 55.7943H252.023V7.74017H262.489V22.2562C263.314 21.4048 264.244 20.6812 265.276 20.0872C267.12 19.0264 269.307 18.5001 271.822 18.5001C274.308 18.5001 276.505 19.0125 278.399 20.0432C280.273 21.0633 281.826 22.448 283.05 24.1894C284.26 25.9103 285.15 27.9367 285.725 30.2637C286.292 32.5586 286.575 34.9919 286.575 37.5623C286.575 40.1776 286.292 42.6172 285.724 44.8805C285.15 47.1728 284.26 49.1863 283.052 50.9163C281.828 52.6696 280.274 54.0607 278.399 55.0814C276.505 56.1121 274.308 56.6246 271.822 56.6246C269.33 56.6246 267.149 56.0982 265.295 55.0387C264.255 54.4438 263.318 53.7186 262.489 52.8652V55.7943ZM260.635 40.1527V34.972C260.635 32.068 261.317 29.7058 262.703 27.9098C264.15 26.0356 266.436 25.1087 269.467 25.1087C271.959 25.1087 273.962 25.7848 275.426 27.154C276.895 28.5272 277.626 30.3779 277.626 32.6473V42.4441C277.626 44.714 276.889 46.5701 275.41 47.9538C273.936 49.3332 271.937 50.0159 269.467 50.0159C266.436 50.0159 264.15 49.0891 262.703 47.2148C261.317 45.4189 260.635 43.0566 260.635 40.1527ZM262.489 40.1527C262.489 42.6951 263.062 44.6832 264.188 46.1418C265.253 47.5221 266.981 48.2226 269.467 48.2226C271.482 48.2226 273.016 47.6986 274.121 46.6648C275.221 45.6353 275.773 44.248 275.773 42.4441V32.6473C275.773 30.843 275.227 29.4613 274.138 28.4434C273.046 27.4215 271.506 26.9021 269.467 26.9021C266.981 26.9021 265.253 27.6025 264.188 28.9828C263.062 30.4414 262.489 32.4295 262.489 34.972V40.1527ZM236.52 54.001V25.9722H247.521V21.1236H229.762V54.001H236.52ZM238.374 55.7943H227.909V19.3303H249.374V27.7655H238.374V55.7943ZM199.542 26.544C200.814 25.5824 202.439 25.1087 204.384 25.1087C206.294 25.1087 207.852 25.5764 209.02 26.5331C210.24 27.5325 210.828 29.0954 210.828 31.1529V34.235L209.979 34.3046L200.264 35.101C196.754 35.4142 194.117 36.5106 192.311 38.3748C190.499 40.2452 189.601 42.45 189.601 45.0345C189.601 46.5147 189.854 47.8374 190.355 49.0087C190.857 50.181 191.565 51.1972 192.484 52.0638C193.407 52.9353 194.479 53.6137 195.705 54.1017C196.924 54.5872 198.279 54.8313 199.776 54.8313C202.313 54.8313 204.323 54.3188 205.825 53.3134C207.367 52.2813 208.607 50.8839 209.548 49.1086L209.806 48.6211H211.591L211.658 54.001H223.372V49.1856H217.452V31.2857C217.452 27.6369 216.334 24.9335 214.111 23.1014C211.848 21.2363 208.73 20.2934 204.721 20.2934C202.697 20.2934 200.831 20.5315 199.123 21.0058C197.435 21.4745 195.991 22.1513 194.784 23.0342C193.592 23.9071 192.637 24.9965 191.915 26.3102C191.327 27.3791 190.965 28.604 190.832 29.9905H197.593C197.778 28.5502 198.429 27.385 199.542 26.544ZM206.879 54.7883C205.04 56.019 202.666 56.6246 199.776 56.6246C198.043 56.6246 196.449 56.3373 194.999 55.7601C193.556 55.1853 192.284 54.3804 191.19 53.3479C190.09 52.3105 189.24 51.0906 188.642 49.6947C188.045 48.2977 187.748 46.7424 187.748 45.0345C187.748 41.9954 188.824 39.3517 190.959 37.1483C193.1 34.9388 196.159 33.6663 200.101 33.3147L208.974 32.5872V31.1529C208.974 29.5795 208.576 28.5188 207.822 27.902C207.017 27.2425 205.883 26.9021 204.384 26.9021C202.831 26.9021 201.607 27.2586 200.682 27.9575C199.82 28.6089 199.39 29.557 199.39 30.8872V31.7839H188.904L188.925 30.8668C188.973 28.8283 189.422 27.0253 190.278 25.4682C191.126 23.9258 192.257 22.6352 193.666 21.604C195.061 20.583 196.711 19.8097 198.612 19.2821C200.492 18.7601 202.529 18.5001 204.721 18.5001C209.143 18.5001 212.687 19.5718 215.313 21.7362C217.979 23.9335 219.305 27.1413 219.305 31.2857V47.3923H225.226V55.7943H209.827L209.78 52.106C208.949 53.1559 207.981 54.0509 206.879 54.7883ZM196.696 45.9975L196.696 42.9945C196.726 41.185 197.713 40.042 199.491 39.8574L210.828 38.873V41.2154C210.828 43.6046 210.127 45.6675 208.725 47.3699C207.278 49.1272 205.277 50.0159 202.803 50.0159C201.131 50.0159 199.733 49.7238 198.618 49.1219C197.362 48.4446 196.696 47.3659 196.696 45.9975ZM199.673 41.642C198.878 41.7246 198.565 42.087 198.549 43.0087V45.9975C198.549 46.7103 198.847 47.1925 199.521 47.5557C200.334 47.9944 201.425 48.2226 202.803 48.2226C204.725 48.2226 206.189 47.5726 207.276 46.2524C208.408 44.8774 208.974 43.2098 208.974 41.2154V40.8345L199.673 41.642ZM181.506 26.6644C180.726 25.1958 179.714 23.9975 178.466 23.0608C177.201 22.1117 175.786 21.4159 174.215 20.9713C172.619 20.5195 170.946 20.2934 169.194 20.2934C166.899 20.2934 164.853 20.6889 163.049 21.4761C161.247 22.2621 159.705 23.3923 158.415 24.873C157.117 26.3621 156.115 28.1832 155.411 30.3434C154.701 32.521 154.344 34.9933 154.344 37.7616C154.344 40.3572 154.668 42.707 155.315 44.8124C155.952 46.8903 156.908 48.6631 158.182 50.1385C159.45 51.6082 161.006 52.7558 162.856 53.5861C164.701 54.414 166.867 54.8313 169.362 54.8313C171.196 54.8313 172.91 54.5797 174.509 54.078C176.093 53.581 177.504 52.8382 178.747 51.8475C179.982 50.8647 180.983 49.6399 181.756 48.1657C182.405 46.9281 182.859 45.4866 183.115 43.8389H176.36C176.003 45.9383 175.258 47.4807 174.081 48.4425C172.789 49.4988 171.059 50.0159 168.925 50.0159C166.753 50.0159 164.941 49.3198 163.551 47.934C162.159 46.548 161.472 44.6568 161.472 42.3113V32.7801C161.472 30.2416 162.203 28.2928 163.698 26.9978C165.147 25.7428 166.882 25.1087 168.858 25.1087C170.803 25.1087 172.455 25.5998 173.781 26.5911C175.009 27.5097 175.77 28.998 176.099 31.02H182.857C182.615 29.3534 182.164 27.9024 181.506 26.6644ZM152.49 37.7616C152.49 34.8178 152.873 32.1648 153.643 29.8038C154.419 27.4253 155.536 25.3941 156.997 23.7172C158.466 22.032 160.232 20.7378 162.287 19.8413C164.34 18.9458 166.645 18.5001 169.194 18.5001C171.12 18.5001 172.968 18.7499 174.736 19.2501C176.529 19.7575 178.153 20.5562 179.602 21.6439C181.067 22.744 182.253 24.1472 183.155 25.8446C184.054 27.5366 184.606 29.5356 184.818 31.8371L184.908 32.8134H174.443L174.361 32.0042C174.159 30.0139 173.57 28.6998 172.647 28.0101C171.663 27.2744 170.411 26.9021 168.858 26.9021C167.335 26.9021 166.042 27.375 164.934 28.334C163.873 29.2529 163.326 30.7136 163.326 32.7801V42.3113C163.326 44.2166 163.849 45.6574 164.88 46.6846C165.911 47.712 167.24 48.2226 168.925 48.2226C170.649 48.2226 171.957 47.8319 172.885 47.0728C173.785 46.3369 174.386 44.9376 174.631 42.8415L174.724 42.0456H185.188L185.086 43.0315C184.851 45.3063 184.294 47.2893 183.409 48.9768C182.522 50.6686 181.36 52.0895 179.925 53.2321C178.501 54.3668 176.884 55.218 175.081 55.7838C173.294 56.3448 171.386 56.6246 169.362 56.6246C166.61 56.6246 164.178 56.1563 162.076 55.213C159.979 54.2721 158.204 52.9622 156.759 51.288C155.319 49.6196 154.246 47.6287 153.538 45.3229C152.838 43.0447 152.49 40.5237 152.49 37.7616Z' fill='%23F8E81C'/%3E%3C/svg%3E%0A\" />`";

export { screenshotDocument };
