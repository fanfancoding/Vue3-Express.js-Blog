import svgCaptcha from "svg-captcha";

export async function getCaptchaServer() {
  return svgCaptcha.create({
    size: 4,
    ignoreChars: "0o1iI",
    noise: 2,
    color: true,
    background: "#cc9966",
  });
}
