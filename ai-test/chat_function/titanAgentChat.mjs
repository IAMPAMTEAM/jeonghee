// InvokeAgent
// Description: Chat with the agent using the Titan Agent Runtime API.

import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";
import { typeText, formatAndDisplayMarkdown, rl } from "../common.mjs";
import chalk from "chalk";

const bedrockAgentRuntimeClient = new BedrockAgentRuntimeClient({
  region: "us-east-1",
});

const invokingAgent = async (message) => {
  const inputPayload = {
    //sjh-chat-agent
    agentId: "EGLOQK3DJR",
    agentAliasId: "UEGMPLATTK",
    sessionId: "anySessionId",
    inputText: message,
    enableTrace: true,
  };
  const command = new InvokeAgentCommand({ ...inputPayload });
  let runningResponseText = "";

  try {
    const response = await bedrockAgentRuntimeClient.send(command);

    if (response.completion === undefined) {
      throw new Error("Completion is undefined");
    }
    if (response.completion) {
      console.log("metadata: ", response.$metadata);
      //각 이벤트(event)의 chunk와 trace를 추출하여 처리
      for await (const event of response.completion) {
        if (event.chunk) {
          const response = new TextDecoder("utf-8").decode(event.chunk.bytes);
          runningResponseText += response;
        }
      }
      console.log(runningResponseText);
      return runningResponseText;
    }
  } catch (e) {
    console.log("Error occurred L50");
    console.error(e);
  }
};

const sendMessage = async (message) => {
  const completion = await invokingAgent(message);
  const reply = completion.replace(/%\[\d+\]%/g, "").replace(/%\[X\]%/g, "");
  const hasMarkdownOrJson = formatAndDisplayMarkdown(reply);

  if (hasMarkdownOrJson) {
    console.log(chalk.green("Enter your next command:"));
  } else {
    const result = JSON.parse(reply)
      .result.trim()
      .replace(/^"(.*)"$/, "$1")
      .replace(/ .$/g, ".");
    await typeText(result, 50); // 글자 단위로 포맷된 텍스트 출력
  }
  promptUser(); // 다음 입력 받기
};

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
