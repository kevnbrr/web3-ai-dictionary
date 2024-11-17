document.addEventListener("DOMContentLoaded", () => {
    // Automatically focus on the input box when the popup opens
    const termInput = document.getElementById("term");
    termInput.focus();

    // Handle search button click
    document.getElementById("search").addEventListener("click", () => {
        submitSearch();
    });

    // Handle "Enter" key press for submission
    termInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            submitSearch();
        }
    });

    // Function to handle the API request and display results
    async function submitSearch() {
        const term = termInput.value.trim();
        if (!term) {
            document.getElementById("result").textContent = "Please enter a term.";
            return;
        }

        document.getElementById("result").textContent = "Fetching...";

        try {
            const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer your-api-key` // Replace with your OpenAI API key
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo", // Use "gpt-4" if available
                    messages: [
                        { role: "system", content: "You are a senior professor in Web3 concepts and know everything regarding blockchain and crypto. You are able to simplify complex concepts amd explain them well." },
                        { role: "user", content: `Explain the following Web3 concept in a short and concise manner: ${term}` }
                    ],
                    max_tokens: 150
                })
            });

            if (response.ok) {
                const data = await response.json();
                const explanation = data.choices[0]?.message?.content.trim() || "No explanation found.";
                document.getElementById("result").textContent = explanation;
            } else {
                const errorDetails = await response.text();
                console.error("API request failed:", errorDetails);
                document.getElementById("result").textContent = "Failed to fetch the explanation. Please check your API key and request.";
            }
        } catch (error) {
            console.error("Fetch error:", error);
            document.getElementById("result").textContent = "An error occurred while fetching data. Please try again later.";
        }
    }
});