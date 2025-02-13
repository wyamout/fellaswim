document.addEventListener("DOMContentLoaded", () => {
    function isDesktop() {
        return window.matchMedia("(min-width: 768px)").matches;
    }

    const cursor = document.getElementById("global-cursor");

    // Function to handle mouse move and cursor position
    function updateCursorPosition(event) {
        cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    }

    // Function to handle image click
    function handleImageClick(event) {
        if (!isDesktop()) return; // Exit if not on desktop

        const image = event.target.closest(".product--image--image");
        if (image) {
            const imgSrc = image.dataset.src || image.src;
            const imgAlt = image.alt || "Image";

            // Get or create the layer element
            let layer = document.getElementById("layer");
            if (!layer) {
                layer = document.createElement("div");
                layer.id = "layer";
                layer.className = "layer";
                document.body.appendChild(layer);

                // Add click event to the layer to close it
                layer.addEventListener("click", closeLayer);
            }

            // Create a wrapper div
            const wrapper = document.createElement("div");
            wrapper.className = "layer-wrapper";

            // Create a spinner element
            const spinner = document.createElement("div");
            spinner.className = "layer-spinner";
            wrapper.appendChild(spinner);

            // Create a new image element for the layer
            const imgInLayer = document.createElement("img");
            imgInLayer.src = imgSrc;
            imgInLayer.alt = imgAlt;
            imgInLayer.className = "layer-img";
            imgInLayer.loading = "lazy"; // Enable native lazy loading

            // Handle image load event
            imgInLayer.addEventListener("load", () => {
                imgInLayer.classList.add("loaded"); // Add class to make image visible
                spinner.style.display = "none"; // Hide spinner when image is loaded
            });

            // Handle image error event
            imgInLayer.addEventListener("error", () => {
                spinner.style.display = "none"; // Hide spinner if image fails to load
            });

            // Create a close button
            const closeButton = document.createElement("button");
            closeButton.className = "layer-close-btn";
            closeButton.innerHTML = "✖";
            closeButton.addEventListener("click", closeLayer);

            // Append the image and close button to the wrapper
            wrapper.appendChild(imgInLayer);
            wrapper.appendChild(closeButton);

            // Clear any existing content in the layer and add the wrapper
            layer.innerHTML = "";
            layer.appendChild(wrapper);

            // Show the layer
            layer.classList.add("layer-visible");

            // Hide background scroll
            document.body.style.overflow = "hidden";

            // Prevent clicks on the image itself from closing the modal
            imgInLayer.addEventListener("click", (event) => {
                event.stopPropagation(); // Prevents click from closing the modal
            });

            // Change cursor text to "Close"
            cursor.textContent = "Close";
        }
    }

    // Function to close the layer
    function closeLayer() {
        const layer = document.getElementById("layer");
        if (layer) {
            layer.classList.remove("layer-visible");
            layer.innerHTML = ""; // Clear the layer content
        }

        // Restore background scroll
        document.body.style.overflow = "";

        // Change cursor text back to "Zoom"
        cursor.textContent = "Zoom";
    }

    // Function to show cursor on hover
    function handleImageHover() {
        cursor.style.opacity = "1"; // Show cursor
        document.body.style.cursor = 'pointer';
    }

    // Function to hide cursor when not hovering
    function handleImageMouseLeave() {
        cursor.style.opacity = "0"; // Hide cursor
        document.body.style.cursor = 'default';
    }

    // Function to attach event listeners to images
    function attachImageEventListeners() {
        document.querySelectorAll(".product--image--image").forEach((image) => {
            image.addEventListener("mouseover", handleImageHover);
            image.addEventListener("mouseleave", handleImageMouseLeave);
            image.addEventListener("click", handleImageClick);
        });
    }

    // Function to initialize or reinitialize event listeners
    function initialize() {
        // Attach mousemove event to update cursor position
        document.addEventListener("mousemove", updateCursorPosition);

        // Attach click event to existing images
        attachImageEventListeners();
    }

    // Observe for dynamically added images
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                // Reattach event listeners to newly added images
                attachImageEventListeners();
            }
        }
    });

    // Observe changes in the entire document body
    observer.observe(document.body, { childList: true, subtree: true });

    // Initialize on DOMContentLoaded
    initialize();
});
