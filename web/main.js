// Gallery state
let camera = {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0 },
    element: null
};

let isInGallery = false;
let isMouseLocked = false;
let keys = {};
let mouseX = 0;
let mouseY = 0;
let musicPlaying = true;

// Artwork database
const artworks = {
    1: {
        title: "Sunset Dreams",
        artist: "Maria Rodriguez",
        year: "2024",
        medium: "Digital Art",
        dimensions: "24\" x 18\"",
        description: "A vibrant exploration of color and emotion, capturing the fleeting beauty of a summer sunset. The warm hues blend seamlessly, creating a sense of peace and tranquility that invites the viewer to lose themselves in the moment."
    },
    2: {
        title: "Ocean Waves",
        artist: "David Chen",
        year: "2023",
        medium: "Oil on Canvas",
        dimensions: "30\" x 20\"",
        description: "Dynamic brushstrokes capture the raw power and eternal rhythm of the ocean. This piece represents the artist's meditation on nature's force and the human relationship with the sea."
    },
    3: {
        title: "Mountain Vista",
        artist: "Elena Vasquez",
        year: "2024",
        medium: "Watercolor",
        dimensions: "22\" x 16\"",
        description: "Delicate watercolor techniques create an ethereal landscape that seems to float between reality and dreams. The misty mountains evoke a sense of mystery and grandeur."
    },
    4: {
        title: "City Lights",
        artist: "James Thompson",
        year: "2023",
        medium: "Mixed Media",
        dimensions: "28\" x 20\"",
        description: "A contemporary interpretation of urban nightlife, blending traditional painting techniques with modern digital elements. The piece captures the energy and anonymity of city living."
    },
    5: {
        title: "Forest Path",
        artist: "Sophie Laurent",
        year: "2024",
        medium: "Acrylic on Wood",
        dimensions: "26\" x 18\"",
        description: "Inspired by ancient forest paths, this work invites viewers on a journey into the unknown. The interplay of light and shadow creates depth and mystery."
    },
    6: {
        title: "Desert Bloom",
        artist: "Amira Hassan",
        year: "2023",
        medium: "Pastel on Paper",
        dimensions: "20\" x 14\"",
        description: "Delicate pastels capture the unexpected beauty of desert flowers. This piece celebrates resilience and the ability to find beauty in harsh environments."
    },
    7: {
        title: "Cosmic Dance",
        artist: "Roberto Silva",
        year: "2024",
        medium: "Digital Collage",
        dimensions: "32\" x 24\"",
        description: "An abstract exploration of movement and energy, inspired by celestial bodies and their eternal dance through space. The swirling patterns create a sense of infinite motion."
    },
    8: {
        title: "Modern Form",
        artist: "Alex Kowalski",
        year: "2024",
        medium: "Bronze Sculpture",
        dimensions: "15\" x 8\" x 6\"",
        description: "A contemporary sculpture exploring the relationship between organic and geometric forms. The smooth curves contrast with angular elements, representing the balance between nature and modern life."
    }
};

// User uploaded artworks
let userArtworks = [];
let nextArtworkId = 9;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen after delay
    setTimeout(() => {
        document.getElementById('loading-screen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
        }, 500);
    }, 2000);

    // Setup smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Setup modals
    setupModals();
    
    // Setup file upload
    setupFileUpload();

    // Animate hero frame on scroll
    window.addEventListener('scroll', () => {
        const heroFrame = document.getElementById('hero-frame');
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (heroFrame) {
            heroFrame.style.transform = `translateY(${rate}px) rotateY(${scrolled * 0.1}deg)`;
        }
    });
});

function startGalleryExperience() {
    // Hide landing sections
    document.querySelector('.landing-section').style.display = 'none';
    document.querySelector('.about-section').style.display = 'none';
    document.querySelector('.navbar').style.display = 'none';
    
    // Show gallery
    document.getElementById('gallery-container').style.display = 'block';
    document.getElementById('controls').style.display = 'block';
    
    isInGallery = true;
    
    // Initialize 3D gallery
    initializeGallery();
}

function exitGallery() {
    // Show landing sections
    document.querySelector('.landing-section').style.display = 'flex';
    document.querySelector('.about-section').style.display = 'block';
    document.querySelector('.navbar').style.display = 'block';
    
    // Hide gallery
    document.getElementById('gallery-container').style.display = 'none';
    document.getElementById('controls').style.display = 'none';
    
    isInGallery = false;
    
    // Reset camera position
    camera.position = { x: 0, y: 0, z: 0 };
    camera.rotation = { x: 0, y: 0 };
    mouseX = 0;
    mouseY = 0;
    
    // Exit pointer lock
    if (document.pointerLockElement) {
        document.exitPointerLock();
    }
}

function initializeGallery() {
    camera.element = document.getElementById('camera');
    
    // Add event listeners
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('click', onMouseClick);
    
    // Setup artwork interactions
    setupArtworkInteractions();
    
    // Setup music toggle
    setupMusicToggle();
    
    // Start animation loop
    animate();
    
    // Play background music
    const music = document.getElementById('background-music');
    music.volume = 0.3;
    music.play().catch(() => {
        console.log('Autoplay failed, waiting for user interaction');
    });
}

function setupArtworkInteractions() {
    const paintings = document.querySelectorAll('.painting, .sculpture');
    paintings.forEach(painting => {
        painting.addEventListener('click', (e) => {
            e.stopPropagation();
            const artworkId = painting.getAttribute('data-id');
            showArtworkDetails(artworkId);
        });
    });
}

function setupModals() {
    // Artwork modal
    const artworkModal = document.getElementById('artwork-modal');
    const uploadModal = document.getElementById('upload-modal');
    const closes = document.querySelectorAll('.close');
    
    closes.forEach(close => {
        close.addEventListener('click', () => {
            artworkModal.style.display = 'none';
            uploadModal.style.display = 'none';
        });
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === artworkModal) {
            artworkModal.style.display = 'none';
        }
        if (e.target === uploadModal) {
            uploadModal.style.display = 'none';
        }
    });
}

function openUploadModal() {
    document.getElementById('upload-modal').style.display = 'block';
}

function setupFileUpload() {
    const fileInput = document.getElementById('artwork-file');
    const preview = document.getElementById('file-preview');
    const form = document.getElementById('artwork-form');
    
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const fileInput = document.getElementById('artwork-file');
            const title = document.getElementById('artwork-title-input').value;
            const artist = document.getElementById('artwork-artist-input').value;
            const description = document.getElementById('artwork-description-input').value;
            const year = document.getElementById('artwork-year-input').value;
            const medium = document.getElementById('artwork-medium-input').value;
            
            if (!fileInput.files[0]) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const artwork = {
                    id: nextArtworkId++,
                    title: title,
                    artist: artist,
                    year: year,
                    medium: medium,
                    dimensions: "Custom Upload",
                    description: description,
                    imageUrl: e.target.result
                };
                
                // Add to artworks database
                artworks[artwork.id] = artwork;
                userArtworks.push(artwork);
                
                // Add to gallery
                addArtworkToGallery(artwork);
                
                // Close modal and reset form
                document.getElementById('upload-modal').style.display = 'none';
                form.reset();
                preview.innerHTML = '';
            };
            reader.readAsDataURL(fileInput.files[0]);
        });
    }
}

function addArtworkToGallery(artwork) {
    // Find an empty spot on a wall
    const walls = ['left-wall', 'right-wall'];
    const randomWall = walls[Math.floor(Math.random() * walls.length)];
    const wall = document.getElementById(randomWall);
    
    const paintingDiv = document.createElement('div');
    paintingDiv.className = 'painting';
    paintingDiv.setAttribute('data-id', artwork.id);
    
    // Position randomly along the hallway
    const randomPosition = -1800 + Math.random() * 1600; // Random position along hallway
    paintingDiv.style.transform = `translateZ(10px) translateX(${randomPosition}px)`;
    
    paintingDiv.innerHTML = `
        <img src="${artwork.imageUrl}" alt="${artwork.title}">
        <div class="painting-label">${artwork.title}</div>
    `;
    
    paintingDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        showArtworkDetails(artwork.id);
    });
    
    wall.appendChild(paintingDiv);
}

function setupMusicToggle() {
    const musicToggle = document.getElementById('music-toggle');
    const music = document.getElementById('background-music');
    
    if (musicToggle) {
        musicToggle.addEventListener('click', () => {
            if (musicPlaying) {
                music.pause();
                musicToggle.textContent = '🎵 Music: OFF';
                musicPlaying = false;
            } else {
                music.play().catch(console.error);
                musicToggle.textContent = '🎵 Music: ON';
                musicPlaying = true;
            }
        });
    }
}

function showArtworkDetails(artworkId) {
    const artwork = artworks[artworkId];
    if (!artwork) return;
    
    const modal = document.getElementById('artwork-modal');
    const img = document.getElementById('modal-artwork-img');
    const title = document.getElementById('modal-artwork-title');
    const artist = document.getElementById('modal-artwork-artist');
    const description = document.getElementById('modal-artwork-description');
    const year = document.getElementById('modal-artwork-year');
    const medium = document.getElementById('modal-artwork-medium');
    const dimensions = document.getElementById('modal-artwork-dimensions');
    
    // Set image source
    if (artwork.imageUrl) {
        img.src = artwork.imageUrl;
    } else {
        // Use the original image from the painting element
        const paintingElement = document.querySelector(`[data-id="${artworkId}"] img`);
        if (paintingElement) {
            img.src = paintingElement.src;
        }
    }
    
    title.textContent = artwork.title;
    artist.textContent = artwork.artist;
    description.textContent = artwork.description;
    year.textContent = artwork.year;
    medium.textContent = artwork.medium;
    dimensions.textContent = artwork.dimensions;
    
    modal.style.display = 'block';
}

// Movement and camera controls
function onKeyDown(event) {
    if (!isInGallery) return;
    
    keys[event.code] = true;
    
    // Enable music on first user interaction
    if (!musicPlaying && event.code === 'KeyM') {
        const music = document.getElementById('background-music');
        music.play().catch(console.error);
        document.getElementById('music-toggle').textContent = '🎵 Music: ON';
        musicPlaying = true;
    }
}

function onKeyUp(event) {
    if (!isInGallery) return;
    keys[event.code] = false;
}

function onMouseMove(event) {
    if (!isInGallery) return;
    
    if (document.pointerLockElement === document.body) {
        mouseX += event.movementX * 0.002;
        mouseY += event.movementY * 0.002;
        
        // Limit vertical rotation
        mouseY = Math.max(-Math.PI/2, Math.min(Math.PI/2, mouseY));
        
        camera.rotation.x = mouseY;
        camera.rotation.y = mouseX;
    }
}

function onMouseClick(event) {
    if (!isInGallery) return;
    
    // Request pointer lock for mouse look
    if (document.pointerLockElement !== document.body) {
        document.body.requestPointerLock();
    }
}

function updateMovement() {
    if (!isInGallery) return;
    
    const speed = 8;
    let moveX = 0;
    let moveZ = 0;
    
    // Calculate movement based on camera rotation
    const cos = Math.cos(camera.rotation.y);
    const sin = Math.sin(camera.rotation.y);
    
    if (keys['KeyW'] || keys['ArrowUp']) {
        moveX -= sin * speed;
        moveZ -= cos * speed;
    }
    if (keys['KeyS'] || keys['ArrowDown']) {
        moveX += sin * speed;
        moveZ += cos * speed;
    }
    if (keys['KeyA'] || keys['ArrowLeft']) {
        moveX -= cos * speed;
        moveZ += sin * speed;
    }
    if (keys['KeyD'] || keys['ArrowRight']) {
        moveX += cos * speed;
        moveZ -= sin * speed;
    }
    
    // Apply movement with boundaries (hallway limits)
    camera.position.x += moveX;
    camera.position.z += moveZ;
    
    // Keep player within hallway bounds
    camera.position.x = Math.max(-400, Math.min(400, camera.position.x));
    camera.position.z = Math.max(-1800, Math.min(200, camera.position.z));
    camera.position.y = Math.max(-100, Math.min(100, camera.position.y));
}

function updateCamera() {
    if (!isInGallery || !camera.element) return;
    
    const rotateX = camera.rotation.x * 180 / Math.PI;
    const rotateY = camera.rotation.y * 180 / Math.PI;
    
    camera.element.style.transform = `
        translate3d(${-camera.position.x}px, ${-camera.position.y}px, ${camera.position.z}px)
        rotateX(${-rotateX}deg)
        rotateY(${-rotateY}deg)
    `;
}

function animate() {
    updateMovement();
    updateCamera();
    requestAnimationFrame(animate);
}

// Handle page visibility for music
document.addEventListener('visibilitychange', () => {
    const music = document.getElementById('background-music');
    if (document.hidden && musicPlaying) {
        music.pause();
    } else if (!document.hidden && musicPlaying) {
        music.play().catch(console.error);
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    const container = document.getElementById('gallery-container');
    if (container) {
        const aspectRatio = window.innerWidth / window.innerHeight;
        container.style.perspectiveOrigin = '50% 50%';
    }
});

// Error handling for images
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3E%3Crect width="300" height="200" fill="%23f0f0f0"/%3E%3Ctext x="150" y="100" text-anchor="middle" fill="%23666" font-family="Arial" font-size="16"%3EImage not found%3C/text%3E%3C/svg%3E';
    }
}, true);

console.log('🎨 Welcome to the Artisan Gallery!');
console.log('Click "Begin Your Journey" to start exploring the 3D hallway!');