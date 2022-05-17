(async () => {

  function buildPostUrl() {
    const selectedEngine = [...document.getElementById("engine-selection").childNodes].find(opt => opt.selected).value;
    return `https://api.openai.com/v1/engines/${selectedEngine}/completions`;
  }

  async function getAnswer(
    token,
    prompt,
    modelParams = { max_tokens: 16 },
  ) {
    buildPostUrl();
    const result = await fetch(
      buildPostUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        prompt,
        ...modelParams
      })
    });
    return (await result.json());
  }

  function initEngineSelection() {
    const engines = [
      "ada",
      "text-curie-001",
      "babbage",
      "text-davinci-002",
      "text-davinci-001",
      "curie",
      "davinci",
      "text-ada-001",
      "text-babbage-001"
    ];
    const select = document.getElementById("engine-selection");
    engines.forEach((engine) => {
      const option = document.createElement("option");
      option.value = engine;
      option.innerHTML = engine;
      if (engine === "text-curie-001") option.selected = true;
      select.appendChild(option);
    });
  }

  initEngineSelection();

  async function submitHandler(event) {
    event.preventDefault();
    const token = document.getElementById("token").value;
    const prompt = document.getElementsByClassName("prompt-input")[0]?.value;
    const chatArea = document.getElementById("chat");
    const modelParams = {
      temperature: 0.5,
      max_tokens: 64,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    };

    if (!token || !prompt) {
      alert("Please, specify token and prompt");
      return;
    }

    const answer = await getAnswer(token, prompt, modelParams);

    const divForResponse = document.createElement("div");
    let output;
    if (chatArea.childNodes.length > 1) {
      chatArea.prepend(divForResponse);
      output = divForResponse;
    } else {
      output = chatArea.appendChild(divForResponse);
    }
    output.classList.add("response")
    output.innerHTML = "Response: " + answer?.choices[0]?.text || "Robot doesn't have an answer to this question."

    const divForPrompt = document.createElement("div");
    let input;
    if (chatArea.childNodes.length > 1) {
      chatArea.prepend(divForPrompt);
      input = divForPrompt;
    } else {
      input = chatArea.appendChild(divForPrompt);
    }
    input.classList.add("prompt")
    input.innerHTML = "Prompt: " + prompt;
  }

  const form = document.getElementById("chatForm");

  form.addEventListener("submit", submitHandler)
})();
