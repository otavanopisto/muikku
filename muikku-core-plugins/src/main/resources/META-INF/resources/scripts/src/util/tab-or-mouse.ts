/**
 * tabOrMouse
 */
export default function tabOrMouse() {
  // Let the document know when the mouse is being used
  document.body.addEventListener("mousedown", function () {
    document.body.classList.add("using-mouse");
  });

  // Re-enable focus styling when Tab is pressed
  document.body.addEventListener("keydown", function (event) {
    if (event.key === "Tab") {
      document.body.classList.remove("using-mouse");
    }
  });
}
