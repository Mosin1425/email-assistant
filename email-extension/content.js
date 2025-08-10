function injectSuggestButton() {
  console.log("Checking Gmail compose/reply boxes...");
  const editors = document.querySelectorAll('div[aria-label="Message Body"], div[role="textbox"]');

  editors.forEach((editor) => {
    if (editor.dataset.suggestAttached === "true") return;

    const dialog = editor.closest('div[role="dialog"], div[role="region"], div[jscontroller]');
    if (!dialog) return;

    const sendButton = dialog.querySelector('div[role="button"][data-tooltip^="Send"], div[role="button"][aria-label*=\"Send\"]');
    if (!sendButton) return;

    // --- Create tone dropdown ---
    const toneSelect = document.createElement('select');
    toneSelect.style.marginLeft = '8px';
    toneSelect.style.padding = '6px';
    toneSelect.style.border = '1px solid #ccc';
    toneSelect.style.borderRadius = '4px';
    toneSelect.style.fontSize = '13px';

    const tones = ['Professional', 'Friendly', 'Apologetic', 'Formal', 'Casual'];
    tones.forEach(tone => {
      const option = document.createElement('option');
      option.value = tone;
      option.innerText = tone;
      toneSelect.appendChild(option);
    });

    // --- Create AI Reply Button ---
    const suggestBtn = document.createElement('button');
    suggestBtn.innerText = '✨ AI Reply';
    suggestBtn.style.marginLeft = '8px';
    suggestBtn.style.padding = '6px 12px';
    suggestBtn.style.background = 'linear-gradient(135deg, #6e8efb, #a777e3)';
    suggestBtn.style.color = '#fff';
    suggestBtn.style.border = 'none';
    suggestBtn.style.borderRadius = '20px';
    suggestBtn.style.cursor = 'pointer';
    suggestBtn.style.fontSize = '13px';
    suggestBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
    suggestBtn.style.display = 'inline-flex';
    suggestBtn.style.alignItems = 'center';
    suggestBtn.style.gap = '6px';

    const spinner = document.createElement('span');
    spinner.className = 'ai-spinner';
    spinner.style.border = '2px solid #fff';
    spinner.style.borderTop = '2px solid transparent';
    spinner.style.borderRadius = '50%';
    spinner.style.width = '14px';
    spinner.style.height = '14px';
    spinner.style.animation = 'spin 1s linear infinite';
    spinner.style.display = 'none';
    suggestBtn.appendChild(spinner);

    // Add spinner keyframes
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleSheet);

    suggestBtn.onclick = async () => {
      const tone = toneSelect.value;

      let originalEmailEl = null;
      const messageNodes = Array.from(document.querySelectorAll('div[data-message-id]'))
        .filter(el => el.offsetHeight > 0 && el.innerText.trim().length > 0);

      if (messageNodes.length > 0) {
        originalEmailEl = messageNodes[messageNodes.length - 1];
      }

      const emailContent = originalEmailEl?.innerText || editor.innerText || '';

      if (!emailContent.trim()) {
        alert("Email content is empty.");
        return;
      }

      // Show spinner and disable button
      spinner.style.display = 'inline-block';
      suggestBtn.disabled = true;
      suggestBtn.style.opacity = '0.7';

      try {
        const response = await fetch('http://localhost:8080/api/email/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emailContent, tone })
        });

        const suggestion = await response.text();

        if (!editor.innerText.trim()) {
          editor.innerText = suggestion;
        } else {
          editor.innerText += '\n\n' + suggestion;
        }
      } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to get AI suggestion.");
      } finally {
        // Hide spinner and enable button
        spinner.style.display = 'none';
        suggestBtn.disabled = false;
        suggestBtn.style.opacity = '1';
      }
    };

    // Attach both
    sendButton.parentElement.appendChild(toneSelect);
    sendButton.parentElement.appendChild(suggestBtn);
    editor.dataset.suggestAttached = "true";
  });
}

const observer = new MutationObserver(() => {
  injectSuggestButton();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
