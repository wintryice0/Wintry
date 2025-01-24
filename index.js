import { extension_settings, getContext, loadExtensionSettings } from "../../../extensions.js";
import { saveSettingsDebounced } from "../../../../script.js";

const extensionName = "wintry";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const extensionSettings = extension_settings[extensionName];
const defaultSettings = {
    enabled: false,
};

async function loadSettings() {
    extension_settings[extensionName] = extension_settings[extensionName] || {};
    if (Object.keys(extension_settings[extensionName]).length === 0) {
        Object.assign(extension_settings[extensionName], defaultSettings);
    }

    $("#wintry_enable").prop("checked", extension_settings[extensionName].enabled).trigger("input");
}

function onEnableInput(event) {
    const enabled = Boolean($(event.target).prop("checked"));
    extension_settings[extensionName].enabled = enabled;
    saveSettingsDebounced();
    toastr.success(`Wintry ${enabled ? "enabled" : "disabled"}`);
}

jQuery(async () => {
    const settingsHtml = await $.get(`${extensionFolderPath}/example.html`);
    $("#extensions_settings").append(settingsHtml);
    $("#wintry_enable").on("input", onEnableInput);
    loadSettings();
});
