// RetrieveAndGenerate
// a simple chatbot that uses the Bedrock Agent Runtime API to communicate with the Claude V2 model.

import { typeText, formatAndDisplayMarkdown, rl } from "../common.mjs";
import chalk from "chalk";
import {
  BedrockAgentRuntimeClient,
  RetrieveAndGenerateCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";

const bedrockAgentRuntimeClient = new BedrockAgentRuntimeClient({
  region: "us-east-1",
});

async function sendMessage(message) {
  try {
    const input = {
      input: {
        text: message, // required
      },
      retrieveAndGenerateConfiguration: {
        type: "KNOWLEDGE_BASE",
        knowledgeBaseConfiguration: {
          knowledgeBaseId: "GONROFTACT",
          modelArn:
            "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-v2",
        },
      },
    };

    // API로 실사용시: 첫 요청에서 sessionId를 반환해준 후 필요에 따라 sessionId 속성 추가
    // if (typeof body.sessionId !== 'undefined') {
    //   input.sessionId = body.sessionId;
    // }

    const command = new RetrieveAndGenerateCommand(input);
    const bedrockResponse = await bedrockAgentRuntimeClient.send(command);
    const reply = bedrockResponse.output.text;

    await typeText(reply, 50); // 글자 단위로 포맷된 텍스트 출력
    const hasMarkdownOrJson = formatAndDisplayMarkdown(reply);

    if (hasMarkdownOrJson) {
      console.log(chalk.green("Enter your next command:"));
    }
  } catch (error) {
    console.error("Error communicating with bedrock:", error.message);
  }
  promptUser(); // 다음 입력 받기
}

function promptUser() {
  rl.question(chalk.green("You: "), (input) => {
    if (input.toLowerCase() === "exit") {
      rl.close();
    } else {
      sendMessage(input);
    }
  });
}

promptUser();
