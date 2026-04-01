/**
 * KOREA AI TRIP PLANNER - MAIN JAVASCRIPT
 * Map initialization, route drawing, chat functionality, and interactions
 */

// ============================================
// CONFIGURATION
// ============================================

// IMPORTANT: Replace with your actual Mapbox token from mapbox.com
const MAPBOX_TOKEN = 'YOUR_MAPBOX_TOKEN';

// Seoul coordinates
const SEOUL_CENTER = [126.9780, 37.5665];
const INITIAL_ZOOM = 11;
const MAP_PITCH = 50;

// Colors
const COLORS = {
    primaryPurple: '#9D4EDD',
    secondaryCyan: '#06FFB4',
    crowdGreen: '#06FFB4',
    crowdYellow: '#FFD93D',
    crowdRed: '#FF6B6B'
};

// ============================================
// GLOBAL STATE
// ============================================

let map = null;
let markers = [];
let routeLayer = null;
let heatmapLayer = null;
let currentItinerary = [...mockData.route];
let carbonPoints = 187;
let currentLanguage = 'en';
let isDarkMode = true;
let selectedLocationId = null;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
    setupEventListeners();
    loadInitialItinerary();
    displayNotifications();
});

/**
 * Initialize Mapbox GL JS map with 3D terrain
 */
function initializeMap() {
    // Set Mapbox access token
    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Create map instance
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v11',
        center: SEOUL_CENTER,
        zoom: INITIAL_ZOOM,
        pitch: MAP_PITCH,
        bearing: 0,
        antialias: true
    });

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Wait for map to load
    map.on('load', () => {
        console.log('Map loaded successfully');
        
        // Add 3D terrain if available
        add3DTerrain();
        
        // Add markers for all locations
        addLocationMarkers();
        
        // Draw animated routes
        drawAnimatedRoutes();
        
        // Add heatmap layer (hidden by default)
        addHeatmapLayer();
        
        // Fly to first location after 2 seconds
        setTimeout(() => {
            flyToFirstLocation();
        }, 2000);
        
        // Show welcome message in chat
        showWelcomeMessage();
    });

    // Handle map errors
    map.on('error', (e) => {
        console.error('Map error:', e);
    });
}

/**
 * Add 3D terrain layer for depth effect
 */
function add3DTerrain() {
    // Add DEM source for terrain
    map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
    });

    // Set terrain with exaggerated height for visual effect
    map.setTerrain({
        source: 'mapbox-dem',
        exaggeration: 1.5
    });

    // Add sky layer for atmosphere
    map.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 0.0],
            'sky-atmosphere-sun-intensity': 15
        }
    });
}

/**
 * Add custom markers for all locations
 */
function addLocationMarkers() {
    const allLocations = getAllLocations();

    allLocations.forEach(location => {
        // Create custom marker element
        const markerEl = createMarkerElement(location);
        
        // Create popup content
        const popupContent = createPopupContent(location);
        
        // Create marker with popup
        const marker = new mapboxgl.Marker(markerEl)
            .setLngLat([location.lng, location.lat])
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
            .addTo(map);
        
        // Store marker reference
        markers.push({
            id: location.id,
            marker: marker,
            element: markerEl
        });

        // Add click event to fly to location
        markerEl.addEventListener('click', () => {
            flyToLocation(location);
            highlightLocation(location.id);
        });
    });
}

/**
 * Create custom marker DOM element with icon based on type
 */
function createMarkerElement(location) {
    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.style.cssText = `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: ${getMarkerColor(location.type)};
        border: 3px solid white;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
    `;

    // Add icon based on type
    let iconClass = 'fa-map-marker-alt';
    if (location.type === 'hotel') iconClass = 'fa-hotel';
    else if (location.type === 'activity') iconClass = 'fa-camera';
    else if (location.type === 'restaurant') iconClass = 'fa-utensils';

    el.innerHTML = `<i class="fas ${iconClass}" style="color: white; font-size: 18px;"></i>`;

    // Add pulsing animation for selected location
    if (selectedLocationId === location.id) {
        el.style.animation = 'pulse 1.5s infinite';
    }

    return el;
}

/**
 * Get marker color based on location type
 */
function getMarkerColor(type) {
    switch(type) {
        case 'hotel': return COLORS.primaryPurple;
        case 'activity': return COLORS.secondaryCyan;
        case 'restaurant': return COLORS.crowdYellow;
        default: return '#999';
    }
}

/**
 * Create popup HTML content for a location
 */
function createPopupContent(location) {
    const crowdColor = getCrowdColor(location.crowdLevel);
    const stars = generateStars(location.rating);
    
    return `
        <div class="marker-popup" style="padding: 10px; min-width: 200px;">
            <img src="${location.image}" alt="${location.name}" 
                 style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">
            <h3 style="margin: 0 0 5px 0; font-size: 16px; color: #1a1a2e;">${location.name}</h3>
            <div style="color: #FFD93D; margin-bottom: 5px;">${stars}</div>
            <p style="margin: 5px 0; font-size: 13px; color: #666;">${location.description || ''}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                <span style="font-weight: bold; color: #9D4EDD;">${formatPrice(location.price)}</span>
                <div class="crowd-indicator" style="display: flex; align-items: center; gap: 5px;">
                    <span class="crowd-dot ${crowdColor}" style="width: 10px; height: 10px; border-radius: 50%;"></span>
                    <span style="font-size: 12px;">${location.crowdLevel}% crowded</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Draw curved bezier route lines with animation
 */
function drawAnimatedRoutes() {
    // Get route coordinates
    const routeCoords = currentItinerary.map(item => {
        const location = getLocationById(item.id);
        return [location.lng, location.lat];
    });

    // Create curved path using bezier curves
    const curvedPath = createCurvedPath(routeCoords);

    // Add route source
    map.addSource('route', {
        type: 'geojson',
        data: {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: curvedPath
            }
        }
    });

    // Add glowing route line
    map.addLayer({
        id: 'route-glow',
        type: 'line',
        source: 'route',
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': COLORS.primaryPurple,
            'line-width': 8,
            'line-blur': 4,
            'line-opacity': 0.6
        }
    });

    // Add main route line
    map.addLayer({
        id: 'route-main',
        type: 'line',
        source: 'route',
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': COLORS.secondaryCyan,
            'line-width': 4,
            'line-opacity': 1
        }
    });

    // Animate route drawing
    animateRouteDrawing(curvedPath.length);
}

/**
 * Create curved bezier path between points
 */
function createCurvedPath(coordinates) {
    const curvedPath = [];
    
    for (let i = 0; i < coordinates.length - 1; i++) {
        const start = coordinates[i];
        const end = coordinates[i + 1];
        
        // Calculate control point for bezier curve (arc upward)
        const midX = (start[0] + end[0]) / 2;
        const midY = (start[1] + end[1]) / 2;
        
        // Add elevation to create arc effect
        const controlPoint = [midX, midY + 0.02]; // Adjust for curvature
        
        // Generate quadratic bezier curve points
        const segments = 50;
        for (let t = 0; t <= 1; t += 1/segments) {
            const x = Math.pow(1-t, 2) * start[0] + 2 * (1-t) * t * controlPoint[0] + Math.pow(t, 2) * end[0];
            const y = Math.pow(1-t, 2) * start[1] + 2 * (1-t) * t * controlPoint[1] + Math.pow(t, 2) * end[1];
            curvedPath.push([x, y]);
        }
    }
    
    // Add last point
    curvedPath.push(coordinates[coordinates.length - 1]);
    
    return curvedPath;
}

/**
 * Animate route line drawing effect
 */
function animateRouteDrawing(totalPoints) {
    let currentPoint = 0;
    const speed = 2; // Points per frame
    
    function animate() {
        currentPoint += speed;
        
        if (currentPoint <= totalPoints) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

/**
 * Add heatmap layer for crowd visualization
 */
function addHeatmapLayer() {
    const allLocations = getAllLocations();
    
    // Create GeoJSON for heatmap
    const heatmapData = {
        type: 'FeatureCollection',
        features: allLocations.map(loc => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [loc.lng, loc.lat]
            },
            properties: {
                intensity: loc.crowdLevel / 100
            }
        }))
    };

    // Add heatmap source
    map.addSource('heatmap', {
        type: 'geojson',
        data: heatmapData
    });

    // Add heatmap layer (initially hidden)
    map.addLayer({
        id: 'heatmap-layer',
        type: 'heatmap',
        source: 'heatmap',
        paint: {
            'heatmap-weight': ['get', 'intensity'],
            'heatmap-intensity': 1.5,
            'heatmap-radius': 30,
            'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0, 'rgba(6, 255, 180, 0)',
                0.3, 'rgba(6, 255, 180, 0.6)',
                0.6, 'rgba(255, 217, 61, 0.6)',
                1, 'rgba(255, 107, 107, 0.8)'
            ]
        },
        layout: {
            visibility: 'none'
        }
    });
}

/**
 * Fly camera to first location in itinerary
 */
function flyToFirstLocation() {
    if (currentItinerary.length > 0) {
        const firstItem = currentItinerary[0];
        const location = getLocationById(firstItem.id);
        
        if (location) {
            map.flyTo({
                center: [location.lng, location.lat],
                zoom: 14,
                pitch: 50,
                bearing: 0,
                duration: 2000,
                easing: (t) => t
            });
        }
    }
}

/**
 * Fly camera to specific location
 */
function flyToLocation(location) {
    map.flyTo({
        center: [location.lng, location.lat],
        zoom: 15,
        pitch: 50,
        bearing: 0,
        duration: 1500,
        easing: (t) => t
    });
}

/**
 * Highlight a specific location on map
 */
function highlightLocation(locationId) {
    // Remove highlight from all markers
    markers.forEach(m => {
        m.element.style.transform = 'scale(1)';
        m.element.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
    });

    // Highlight selected marker
    const selectedMarker = markers.find(m => m.id === locationId);
    if (selectedMarker) {
        selectedMarker.element.style.transform = 'scale(1.3)';
        selectedMarker.element.style.boxShadow = `0 0 20px ${COLORS.primaryPurple}`;
        selectedLocationId = locationId;
    }
}

// ============================================
// CHAT FUNCTIONALITY
// ============================================

/**
 * Load initial itinerary cards into chat
 */
function loadInitialItinerary() {
    currentItinerary.forEach((item, index) => {
        const location = getLocationById(item.id);
        if (location) {
            addItineraryCard(location, item.time);
        }
    });

    // Add AI follow-up message
    setTimeout(() => {
        addAIMessage("I've created a personalized itinerary for you based on popular attractions and optimal routing. You can:\n\n• Click any card to view it on the map\n• Remove items you're not interested in\n• Edit dates and times\n• Book directly when ready\n\nWould you like me to suggest any changes or add more activities?");
    }, 1000);
}

/**
 * Add an itinerary card to the chat
 */
function addItineraryCard(location, time) {
    const chatMessages = document.getElementById('chat-messages');
    const crowdColor = getCrowdColor(location.crowdLevel);
    const stars = generateStars(location.rating);

    const cardHTML = `
        <div class="itinerary-card" data-location-id="${location.id}">
            <img src="${location.image}" alt="${location.name}" class="card-image">
            <div class="card-details">
                <div class="card-header">
                    <div>
                        <h4 class="card-name">${location.name}</h4>
                        <div class="card-rating">${stars}</div>
                    </div>
                </div>
                <div class="card-info">
                    <span><i class="fas fa-clock"></i> ${time || 'Flexible'}</span>
                    <span><i class="fas fa-won-sign"></i> ${formatPrice(location.price)}</span>
                    <span class="crowd-indicator">
                        <span class="crowd-dot ${crowdColor}"></span>
                        ${location.crowdLevel}% busy
                    </span>
                </div>
                <div class="card-actions">
                    <button class="action-icon-btn remove" onclick="removeFromItinerary('${location.id}')" title="Remove">
                        <i class="fas fa-times"></i>
                    </button>
                    <button class="action-icon-btn edit" onclick="editItineraryItem('${location.id}')" title="Edit">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="action-icon-btn book" onclick="bookLocation('${location.id}')" title="Book">
                        <i class="fas fa-check"></i> Book
                    </button>
                </div>
            </div>
        </div>
    `;

    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai-message';
    messageDiv.innerHTML = `<div class="message-content">${cardHTML}</div>`;
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

/**
 * Remove item from itinerary
 */
function removeFromItinerary(locationId) {
    const card = document.querySelector(`.itinerary-card[data-location-id="${locationId}"]`);
    
    if (card) {
        // Add removing animation
        card.classList.add('card-removing');
        
        // Remove after animation completes
        setTimeout(() => {
            card.parentElement.remove();
            
            // Update itinerary array
            currentItinerary = currentItinerary.filter(item => item.id !== locationId);
            
            // Recalculate route on map
            recalculateRoute();
            
            // Add carbon points for eco-friendly choice notification
            addCarbonPoints(5);
            
            // Show confirmation message
            addAIMessage(`I've removed this location from your itinerary. The route has been updated automatically! 🗺️`);
        }, 300);
    }
}

/**
 * Edit itinerary item - opens modal
 */
function editItineraryItem(locationId) {
    const location = getLocationById(locationId);
    const modal = document.getElementById('edit-modal');
    
    if (location && modal) {
        // Set current values
        document.getElementById('edit-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('edit-time').value = '10:00';
        document.getElementById('edit-duration').value = location.duration || 2;
        document.getElementById('edit-notes').value = '';
        
        // Store location ID for saving
        modal.dataset.locationId = locationId;
        
        // Show modal
        modal.classList.add('active');
    }
}

/**
 * Book a location
 */
function bookLocation(locationId) {
    const location = getLocationById(locationId);
    
    if (location) {
        addAIMessage(`Great choice! 🎉 I've initiated the booking process for ${location.name}. You'll receive a confirmation email shortly with all the details.`);
        
        // Add carbon points
        addCarbonPoints(10);
        
        // Add notification
        showNotification('Booking Confirmed', `Your reservation at ${location.name} has been confirmed!`, 'success');
    }
}

/**
 * Recalculate route on map after removal
 */
function recalculateRoute() {
    // Remove existing route layers
    if (map.getLayer('route-glow')) map.removeLayer('route-glow');
    if (map.getLayer('route-main')) map.removeLayer('route-main');
    if (map.getSource('route')) map.removeSource('route');
    
    // Redraw route with updated itinerary
    if (currentItinerary.length > 0) {
        drawAnimatedRoutes();
    }
}

/**
 * Add AI message to chat
 */
function addAIMessage(text) {
    const chatMessages = document.getElementById('chat-messages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai-message';
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${text.replace(/\n/g, '<br>')}</p>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

/**
 * Add user message to chat
 */
function addUserMessage(text) {
    const chatMessages = document.getElementById('chat-messages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${text}</p>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

/**
 * Scroll chat to bottom
 */
function scrollToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Show welcome message
 */
function showWelcomeMessage() {
    // Welcome message already in HTML, just scroll to bottom
    scrollToBottom();
}

// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Budget slider
    const budgetSlider = document.getElementById('budget-slider');
    const budgetValue = document.getElementById('budget-value');
    
    budgetSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value).toLocaleString();
        budgetValue.textContent = `₩${value}`;
        
        // Update AI suggestions based on budget
        updateSuggestionsByBudget(parseInt(e.target.value));
    });

    // Search input
    const searchInput = document.getElementById('search-input');
    const sendBtn = document.getElementById('send-btn');
    
    sendBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Heatmap toggle
    document.getElementById('heatmap-toggle').addEventListener('click', toggleHeatmap);

    // Route type toggle
    document.getElementById('route-type-toggle').addEventListener('click', toggleRouteType);

    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Language toggle
    document.getElementById('lang-toggle').addEventListener('click', toggleLanguage);

    // Notification button
    document.getElementById('notification-btn').addEventListener('click', toggleNotifications);

    // Modal close buttons
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('cancel-edit').addEventListener('click', closeModal);
    document.getElementById('save-edit').addEventListener('click', saveEdit);

    // Export PDF
    document.getElementById('export-pdf').addEventListener('click', exportPDF);

    // Share trip
    document.getElementById('share-trip').addEventListener('click', shareTrip);

    // Clear notifications
    document.getElementById('clear-notifications').addEventListener('click', clearNotifications);
}

/**
 * Handle search/query from user
 */
function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim();
    
    if (query) {
        // Add user message
        addUserMessage(query);
        
        // Simulate AI processing
        searchInput.value = '';
        searchInput.disabled = true;
        
        setTimeout(() => {
            // Simple keyword matching for demo
            let response = "I found some great options for you! Let me add them to your itinerary.";
            
            if (query.toLowerCase().includes('hotel') || query.toLowerCase().includes('stay')) {
                suggestHotels();
            } else if (query.toLowerCase().includes('food') || query.toLowerCase().includes('restaurant') || query.toLowerCase().includes('eat')) {
                suggestRestaurants();
            } else if (query.toLowerCase().includes('activity') || query.toLowerCase().includes('attraction') || query.toLowerCase().includes('visit')) {
                suggestActivities();
            } else {
                addAIMessage(response);
            }
            
            searchInput.disabled = false;
            searchInput.focus();
        }, 1000);
    }
}

/**
 * Suggest hotels based on query
 */
function suggestHotels() {
    const hotel = mockData.hotels[0];
    addAIMessage(`Based on your preferences, I recommend ${hotel.name}. It's a ${hotel.rating}-star hotel with excellent reviews!`);
    addItineraryCard(hotel, 'Check-in');
}

/**
 * Suggest restaurants based on query
 */
function suggestRestaurants() {
    const restaurant = mockData.restaurants[0];
    addAIMessage(`For dining, ${restaurant.name} offers amazing ${restaurant.cuisine} cuisine!`);
    addItineraryCard(restaurant, '19:00');
}

/**
 * Suggest activities based on query
 */
function suggestActivities() {
    const activity = mockData.activities[0];
    addAIMessage(`${activity.name} is a must-visit attraction in Seoul!`);
    addItineraryCard(activity, '14:00');
}

/**
 * Update suggestions based on budget
 */
function updateSuggestionsByBudget(budget) {
    // Filter locations within budget
    const affordableLocations = getAllLocations().filter(loc => loc.price <= budget);
    
    if (affordableLocations.length > 0) {
        console.log(`Found ${affordableLocations.length} locations within budget`);
    }
}

/**
 * Toggle heatmap visibility
 */
function toggleHeatmap() {
    const visibility = map.getLayoutProperty('heatmap-layer', 'visibility');
    const newVisibility = visibility === 'visible' ? 'none' : 'visible';
    map.setLayoutProperty('heatmap-layer', 'visibility', newVisibility);
}

/**
 * Toggle route type (walking vs public transport)
 */
function toggleRouteType() {
    // For demo, just change route color
    const glowLayer = map.getPaintProperty('route-glow', 'line-color');
    const newColor = glowLayer === COLORS.primaryPurple ? COLORS.secondaryCyan : COLORS.primaryPurple;
    
    map.setPaintProperty('route-glow', 'line-color', newColor);
    map.setPaintProperty('route-main', 'line-color', newColor === COLORS.primaryPurple ? COLORS.secondaryCyan : COLORS.primaryPurple);
    
    addAIMessage(`Route style updated! ${newColor === COLORS.primaryPurple ? 'Public transport' : 'Walking'} route displayed.`);
}

/**
 * Toggle dark/light theme
 */
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.innerHTML = isDarkMode ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    
    // Update map style
    if (map) {
        map.setStyle(isDarkMode ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/streets-v12');
    }
}

/**
 * Toggle language (English/Korean)
 */
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'ko' : 'en';
    
    // For demo, just show a message
    const msg = currentLanguage === 'en' 
        ? 'Language switched to English' 
        : '언어가 한국어로 변경되었습니다';
    
    addAIMessage(msg);
}

/**
 * Toggle notifications panel
 */
function toggleNotifications() {
    const panel = document.getElementById('notification-panel');
    panel.classList.toggle('active');
}

/**
 * Close edit modal
 */
function closeModal() {
    const modal = document.getElementById('edit-modal');
    modal.classList.remove('active');
}

/**
 * Save edited item details
 */
function saveEdit() {
    const modal = document.getElementById('edit-modal');
    const locationId = modal.dataset.locationId;
    
    const date = document.getElementById('edit-date').value;
    const time = document.getElementById('edit-time').value;
    const duration = document.getElementById('edit-duration').value;
    const notes = document.getElementById('edit-notes').value;
    
    // Update itinerary
    const itemIndex = currentItinerary.findIndex(item => item.id === locationId);
    if (itemIndex !== -1) {
        currentItinerary[itemIndex].time = time;
        currentItinerary[itemIndex].date = date;
        currentItinerary[itemIndex].duration = duration;
        currentItinerary[itemIndex].notes = notes;
    }
    
    // Close modal
    closeModal();
    
    // Show confirmation
    addAIMessage(`✓ Updated details for this location. Your itinerary has been saved!`);
    
    // Add carbon points
    addCarbonPoints(3);
}

/**
 * Export itinerary as PDF
 */
function exportPDF() {
    addAIMessage('📄 Generating PDF of your itinerary... This will be available for download shortly!');
    
    // For demo, just show success message
    setTimeout(() => {
        showNotification('PDF Ready', 'Your itinerary PDF has been generated and downloaded!', 'success');
    }, 1500);
}

/**
 * Share trip itinerary
 */
function shareTrip() {
    // Generate shareable link (demo)
    const shareLink = window.location.href + '?trip=' + Date.now();
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareLink).then(() => {
        showNotification('Link Copied', 'Share link copied to clipboard!', 'success');
        addAIMessage('🔗 Share link copied! You can now send it to friends or family.');
    }).catch(() => {
        addAIMessage('Here\'s your share link: ' + shareLink);
    });
}

/**
 * Display notifications
 */
function displayNotifications() {
    const notificationList = document.getElementById('notification-list');
    
    mockData.notifications.forEach(notif => {
        const notifHTML = `
            <div class="notification-item">
                <strong>${notif.title}</strong>
                <p>${notif.message}</p>
                <small style="color: var(--text-gray);">${notif.time}</small>
            </div>
        `;
        notificationList.innerHTML += notifHTML;
    });
}

/**
 * Show a notification
 */
function showNotification(title, message, type = 'info') {
    const notificationList = document.getElementById('notification-list');
    
    const notifHTML = `
        <div class="notification-item" style="border-left: 3px solid ${type === 'success' ? COLORS.crowdGreen : COLORS.primaryPurple}">
            <strong>${title}</strong>
            <p>${message}</p>
            <small style="color: var(--text-gray);">Just now</small>
        </div>
    `;
    
    notificationList.insertAdjacentHTML('afterbegin', notifHTML);
    
    // Update notification dot
    document.querySelector('.notification-dot').style.display = 'block';
}

/**
 * Clear all notifications
 */
function clearNotifications() {
    document.getElementById('notification-list').innerHTML = '';
    document.querySelector('.notification-dot').style.display = 'none';
}

/**
 * Add carbon points
 */
function addCarbonPoints(points) {
    carbonPoints += points;
    document.getElementById('carbon-points').textContent = `+${carbonPoints}`;
    
    // Animate badge
    const badge = document.querySelector('.carbon-points-badge');
    badge.style.transform = 'scale(1.1)';
    setTimeout(() => {
        badge.style.transform = 'scale(1)';
    }, 300);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Handle card click to show on map
 */
document.addEventListener('click', (e) => {
    const card = e.target.closest('.itinerary-card');
    if (card && !e.target.closest('.action-icon-btn')) {
        const locationId = card.dataset.locationId;
        const location = getLocationById(locationId);
        
        if (location) {
            flyToLocation(location);
            highlightLocation(locationId);
            
            // Open popup
            const markerObj = markers.find(m => m.id === locationId);
            if (markerObj) {
                markerObj.marker.togglePopup();
            }
        }
    }
});

// Make functions globally accessible for inline onclick handlers
window.removeFromItinerary = removeFromItinerary;
window.editItineraryItem = editItineraryItem;
window.bookLocation = bookLocation;
