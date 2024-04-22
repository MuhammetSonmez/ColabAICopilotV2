// ==UserScript==
// @name         Colab AI Copilot V2
// @namespace    http://tampermonkey.net/
// @version      2024-02-21
// @description  try to take over the world!
// @author       MuhammetSonmez (github)
// @match        https://colab.research.google.com/*
// @icon         https://ssl.gstatic.com/colaboratory-static/common/ef0f647ca75d5b2cdb44b4acc87fa7e4/img/favicon.ico
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/axios@0.27.2/dist/axios.min.js
// ==/UserScript==

(async function() {
    'use strict';

    async function ask(question) {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // CORS Anywhere proxy
        const targetUrl = 'https://www.blackbox.ai/api/chat'; // Original URL

        const url = proxyUrl + targetUrl;
        const headers = {
            "Content-Type": "application/json",
            "Accept": "*/*"
        };

        const data = {
            "messages": [{"id": "None", "content": question, "role": "user"}],
            "previewToken": null,
            "codeModelMode": true,
            "agentMode": {},
            "trendingAgentMode": {"mode": true},
            "isMicMode": false,
        };

        try {
            console.log("Sending request through proxy...");
            const response = await axios.post(url, data, { headers });
            console.log("Response status: ", response.status);
            return response.data;
        } catch (error) {
            console.error("Error making the request via proxy:", error);
        }
    }

    async function getCell() {
        let cells = document.querySelectorAll('.cell');
        for (let cell of cells) {
            if (cell.textContent.includes('<help>')) {
                return cell;
            }
        }
        return null;
    }

    document.addEventListener('keydown', async function(event) {
        let cell = await getCell();
        if (cell) {
            let question = cell.innerText.replace('<help>', "").trim();
            console.log("Question:", question);
            try {
                let response = await ask(question);
                if (response) {
                    cell.innerText = response;
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });
})();
