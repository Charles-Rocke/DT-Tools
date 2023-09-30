// Create a function to trigger the download
function downloadJpg() {
  // Replace 'your-image.jpg' with the actual URL of the JPG file you want to download
  const imageUrl = "agera.jpg";

  // Create a hidden anchor element
  const anchor = document.createElement("a");
  anchor.href = imageUrl;

  // Set the download attribute to specify the desired file name
  anchor.download = "downloaded-image.jpg";

  // Programmatically trigger a click event on the anchor element
  anchor.click();
}

// Call the function when needed, for example, on a button click
document
  .getElementById("downloadButton")
  .addEventListener("click", downloadJpg);
