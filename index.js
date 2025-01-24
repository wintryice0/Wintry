import { extension_settings, getContext, loadExtensionSettings } from "../../../extensions.js";
import { saveSettingsDebounced } from "../../../../script.js";

const extensionName = "wintryice0-wintry";
const extensionFolderPath = `scripts/extensions/${extensionName}`;
let isEnabled = false; // Keep track of whether asterisk removal is enabled

// Function to remove asterisks from a string
function removeAsterisks(text) {
    return text.replace(/\*/g, "");
}

// Function called for each chat message
function processChatMessage(message) {
    const context = getContext();
    if (isEnabled && message.is_user === false) {
        message.mes = removeAsterisks(message.mes);
    }
}

// Function to toggle the extension on or off
function toggleExtension() {
    isEnabled = !isEnabled;
    $("#wintry_toggle").val(isEnabled ? "Disable Asterisk Removal" : "Enable Asterisk Removal");
    extension_settings[extensionName].enabled = isEnabled;
    saveSettingsDebounced();
    console.log(`Wintry extension toggled ${isEnabled ? "on" : "off"}`);
}

// Load settings
async function loadSettings() {
    extension_settings[extensionName] = extension_settings[extensionName] || {};
    if (Object.keys(extension_settings[extensionName]).length === 0) {
      Object.assign(extension_settings[extensionName], { enabled: false });
    }
    isEnabled = extension_settings[extensionName].enabled;
    $("#wintry_toggle").val(isEnabled ? "Disable Asterisk Removal" : "Enable Asterisk Removal");
    console.log("Wintry extension settings loaded.");
}

// Main function when the extension is loaded
jQuery(async () => {
    const settingsHtml = await $.get(`${extensionFolderPath}/example.html`);
    $("#extensions_settings").append(settingsHtml);

    $("#wintry_toggle").on("click", toggleExtension);

    const context = getContext();
    context.eventSource.on(context.eventCall, processChatMessage);

    loadSettings();
});
