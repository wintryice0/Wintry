// index.js
import { extension_settings, eventSource, event_types } from "../../../../script.js";
import { applyTextTransformations } from "./text-processor.js";

const DEFAULT_SETTINGS = {
    enabled: true
};

const extensionName = "wintryice0-asterisks"; // Match your folder name
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;

function loadSettings() {
    if (!extension_settings.asteriskProcessor) {
        extension_settings.asteriskProcessor = DEFAULT_SETTINGS;
    }
}

function processMessage(element) {
    if (!extension_settings.asteriskProcessor.enabled) return;
    
    const contentBlocks = element.querySelectorAll(".mes_text, .mes__edit_content");
    contentBlocks.forEach(block => {
        block.innerHTML = applyTextTransformations(block.innerHTML);
    });
}

jQuery(async () => {
    loadSettings();
    
    // Load and append the HTML from example.html
    const settingsHtml = await $.get(`${extensionFolderPath}/example.html`);
    $("#extensions_settings2").append(settingsHtml);
    
    // Initialize checkbox state and bind change event
    $("#asterisk-processor-enabled")
        .prop("checked", extension_settings.asteriskProcessor.enabled)
        .on("change", function() {
            extension_settings.asteriskProcessor.enabled = this.checked;
            eventSource.emit(event_types.CHAT_CHANGED);
        });
    
    eventSource.on(event_types.MESSAGE_RECEIVED, processMessage);
    eventSource.on(event_types.MESSAGE_SWIPED, processMessage);
});
