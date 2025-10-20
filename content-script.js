
// content-script.js

console.log("Pinterest content script active");

const observer = new MutationObserver(() => {
  PinterestHelper.processPinsOnce().then(PinterestHelper.observeVisiblePins);
});
const mutationObserver = new MutationObserver(() => PinterestHelper.observeVisiblePins());
mutationObserver.observe(document.body, { childList: true, subtree: true });

PinterestHelper.processPinsOnce().then(PinterestHelper.observeVisiblePins);
