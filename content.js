document.addEventListener("mouseup", async (event) => {
    const selectedText = window.getSelection().toString().trim();
    if (!selectedText) return;

    // Remove any existing tooltip
    const existingTooltip = document.getElementById("web3-tooltip");
    if (existingTooltip) existingTooltip.remove();

    // Add styles dynamically to ensure they are applied
    const style = document.createElement("style");
    style.textContent = `
        .tooltip-container {
            background: #0056b3;
            color: #fff;
            padding: 10px;
            font-size: 14px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            max-width: 300px;
            z-index: 10000;
            line-height: 1.5;
            white-space: pre-wrap;
            position: fixed; /* Use fixed to prevent viewport scrolling issues */
        }
    `;
    if (!document.getElementById("tooltip-styles")) {
        style.id = "tooltip-styles";
        document.head.appendChild(style);
    }

    // Create and style the tooltip
    const tooltip = document.createElement("div");
    tooltip.id = "web3-tooltip";
    tooltip.className = "tooltip-container";
    tooltip.textContent = "Fetching explanation...";

    // Position the tooltip near the highlighted text while considering viewport boundaries
    const { clientX: x, clientY: y } = event;
    const tooltipWidth = 300; // Match max-width in styles
    const tooltipHeight = 50; // Estimated height
    const offsetX = 10; // Distance from cursor
    const offsetY = 10;

    let left = x + offsetX;
    let top = y + offsetY;

    // Adjust for viewport boundaries
    if (left + tooltipWidth > window.innerWidth) {
        left = x - tooltipWidth - offsetX; // Shift tooltip to the left
    }
    if (top + tooltipHeight > window.innerHeight) {
        top = y - tooltipHeight - offsetY; // Shift tooltip above the cursor
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;

    document.body.appendChild(tooltip);

    // Fetch explanation from the API
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
                    { role: "system", content: "You are a Web3 expert." },
                    { role: "user", content: `Explain the Web3 concept: ${selectedText} in simple terms.` }
                ],
                max_tokens: 150
            })
        });

        if (response.ok) {
            const data = await response.json();
            const explanation = data.choices[0]?.message?.content.trim() || "No explanation found.";
            tooltip.textContent = explanation;
        } else {
            tooltip.textContent = "Failed to fetch explanation.";
            console.error("API request failed:", await response.text());
        }
    } catch (error) {
        tooltip.textContent = "An error occurred while fetching data.";
        console.error("Fetch error:", error);
    }

    // Remove the tooltip after 10 seconds
    setTimeout(() => tooltip.remove(), 10000);
});