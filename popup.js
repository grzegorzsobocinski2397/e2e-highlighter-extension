const highlightButtonId = "e2e-button";
const highlightButton = document.getElementById(highlightButtonId);

highlightButton.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: highlight,
  });
});

/**
 * Highlight elements with valid id with green border.
 * Highlight elements with no id or with GUID id with red border.
 */
function highlight() {
  /**
   * Elements that should have IDs.
   */
  const idElements = ["button", "a", "input"];
  const validBorder = "2px solid green";
  const invalidBorder = "2px solid red";

  highlightValidIds();
  highlightInvalidIds();

  /**
   * Highlight elements with an ID that is not GUID with green border.
   */
  function highlightValidIds() {
    Array.from(document.querySelectorAll("*"))
      .filter((element) => element.id !== "" && !isGuid(element.id))
      .forEach((element) => (element.style.border = validBorder));
  }

  /**
   * Highlight elements that have no ID or a GUID id with red border.
   */
  function highlightInvalidIds() {
    const elementsWithNoIds = idElements.reduce((elements, elementSelector) => {
      const elementsWithNoId = Array.from(document.querySelectorAll(elementSelector)).filter(
        (element) => element.id === "" || isGuid(element.id)
      );
      return [...elementsWithNoId, ...elements];
    }, []);

    elementsWithNoIds.forEach((element) => (element.style.border = invalidBorder));
  }

  /**
   * Validate whether an id is just a GUID. GUID ids are incorrect.
   * @param {string} idSelector Id attribute value.
   * @returns Whether an id is just a GUID.
   */
  function isGuid(idSelector) {
    const guidMinusCount = 4;
    const guidLength = 36;
    return idSelector.length === guidLength && idSelector.split("").filter((character) => character === "-").length === guidMinusCount;
  }
}
