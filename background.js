chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed.");
    chrome.contextMenus.create({
        id: "web3Dictionary",
        title: "Define Web3 Term",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "web3Dictionary" && info.selectionText) {
        try {
            const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer your-api-key` // Replace with your OpenAI API key
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: "You are a senior professor in Web3 concepts and know everything regarding blockchain and crypto. You are able to simplify complex concepts amd explain them well." },
                        { role: "user", content: `Explain the following Web3 concept in a short and concise manner: ${info.selectionText}` }
                    ],
                    max_tokens: 150
                })
            });

            if (response.ok) {
                const data = await response.json();
                const explanation = data.choices[0]?.message?.content.trim() || "No explanation found.";
                console.log("Explanation:", explanation);

                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: (text) => {
                        const tooltip = document.createElement("div");
                        tooltip.textContent = text;
                        tooltip.style.position = "fixed";
                        tooltip.style.backgroundColor = "#f9f9f9";
                        tooltip.style.border = "1px solid #ccc";
                        tooltip.style.padding = "10px";
                        tooltip.style.zIndex = "9999";
                        tooltip.style.top = "10px";
                        tooltip.style.left = "10px";
                        document.body.appendChild(tooltip);
                        setTimeout(() => tooltip.remove(), 5000);
                    },
                    args: [explanation]
                });
            } else {
                console.error("API request failed:", await response.text());
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }
});