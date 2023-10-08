// StarChart.js

// Reference to the HTML canvas element
const canvas = document.getElementById('starChart');
const ctx = canvas.getContext('2d');

// Load the star data from starsData.json
fetch('starsData.json')
  .then((response) => response.json())
  .then((data) => {
    // Data contains an array of star objects
    const stars = data.stars;

    // Function to draw a star on the canvas
    function drawStar(x, y, magnitude, color) {
      const starSize = 2.5 - magnitude; // Adjust star size based on magnitude
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, starSize, 0, Math.PI * 2);
      ctx.fill();
    }

    // Function to render the star chart
    function renderStarChart() {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Loop through the stars and draw them
      stars.forEach((star) => {
        // Calculate the position on the canvas based on celestial coordinates
        const x = (star.rightAscension / 24) * canvas.width;
        const y = ((90 - star.declination) / 180) * canvas.height;

        // Draw the star
        drawStar(x, y, star.magnitude, star.color);
      });
    }

    // Initial rendering of the star chart
    renderStarChart();

    // Handle window resize to maintain canvas size
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderStarChart();
    });
  })
  .catch((error) => console.error('Error loading star data:', error));
