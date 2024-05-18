import readline from "readline";
import chalk from "chalk";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function typeText(text, delay = 50) {
  let i = 0;
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (i < text.length) {
        process.stdout.write(text[i++]);
      } else {
        clearInterval(interval);
        process.stdout.write("\n");
        resolve();
      }
    }, delay);
  });
}

function formatAndDisplayMarkdown(text) {
  let found = false;
  // Markdown 테이블 감지
  const tableRegex = /\|.*\|/g;
  const tableMatches = text.match(tableRegex);
  if (tableMatches && tableMatches.length) {
    console.log(chalk.blueBright("Markdown Table Detected:"));
    tableMatches.forEach((match) => {
      console.log(chalk.blueBright(match));
    });
    found = true;
  }

  // JSON 코드 블록 감지
  const jsonRegex = /\[[^\[\]]*\]/g;
  const jsonMatches = text.match(jsonRegex);
  if (jsonMatches && jsonMatches.length) {
    console.log(chalk.yellow("JSON Code Block Detected:"));
    jsonMatches.forEach((match) => {
      console.log(chalk.yellow(match));
    });
    found = true;
  }

  return found;
}

export { typeText, formatAndDisplayMarkdown, rl };
