class BelowGameImage {
    constructor(imagePath, containerId, width, height) {
        this.imagePath = imagePath;
        this.containerId = containerId;
        this.width = width;
        this.height = height;
        this.init();
    }

    init() {
        // Create an image element
        const img = document.createElement('img');
        img.src = this.imagePath;
        img.width = this.width;
        img.height = this.height;
        img.style.display = 'block';
        img.style.margin = '20px auto';

        // Append the image to the container
        const container = document.getElementById(this.containerId);
        container.appendChild(img);
    }
}