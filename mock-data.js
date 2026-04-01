/**
 * KOREA AI TRIP PLANNER - MOCK DATA
 * Sample locations and routes for Seoul, Korea
 */

const mockData = {
    // Hotels in Seoul
    hotels: [
        {
            id: 'hotel-1',
            name: 'Lotte Hotel Seoul',
            type: 'hotel',
            lat: 37.5650,
            lng: 126.9810,
            rating: 5,
            price: 450000,
            crowdLevel: 65,
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
            description: 'Luxury 5-star hotel in the heart of Seoul',
            address: '30 Eulji-ro, Jung-gu, Seoul'
        },
        {
            id: 'hotel-2',
            name: 'Four Seasons Hotel Seoul',
            type: 'hotel',
            lat: 37.5720,
            lng: 126.9770,
            rating: 5,
            price: 520000,
            crowdLevel: 45,
            image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop',
            description: 'Elegant luxury with stunning city views',
            address: '97 Saemunan-ro, Jongno-gu, Seoul'
        },
        {
            id: 'hotel-3',
            name: 'The Shilla Seoul',
            type: 'hotel',
            lat: 37.5560,
            lng: 127.0050,
            rating: 5,
            price: 480000,
            crowdLevel: 55,
            image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
            description: 'Premium hotel near Namsan Mountain',
            address: '249 Dongho-ro, Jung-gu, Seoul'
        },
        {
            id: 'hotel-4',
            name: 'Park Hyatt Seoul',
            type: 'hotel',
            lat: 37.5270,
            lng: 127.0390,
            rating: 5,
            price: 490000,
            crowdLevel: 38,
            image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe208?w=400&h=300&fit=crop',
            description: 'Modern luxury in Gangnam district',
            address: '606 Teheran-ro, Gangnam-gu, Seoul'
        }
    ],

    // Activities and Attractions
    activities: [
        {
            id: 'activity-1',
            name: 'Gyeongbokgung Palace',
            type: 'activity',
            lat: 37.5796,
            lng: 126.9770,
            rating: 5,
            price: 3000,
            crowdLevel: 78,
            image: 'https://images.unsplash.com/photo-1548115184-bc65443f5592?w=400&h=300&fit=crop',
            description: 'Main royal palace of Joseon Dynasty',
            address: '161 Sajik-ro, Jongno-gu, Seoul',
            duration: 3
        },
        {
            id: 'activity-2',
            name: 'N Seoul Tower',
            type: 'activity',
            lat: 37.5512,
            lng: 126.9882,
            rating: 4,
            price: 24000,
            crowdLevel: 82,
            image: 'https://images.unsplash.com/photo-1582269255951-3c0298a5e8b6?w=400&h=300&fit=crop',
            description: 'Iconic tower with panoramic city views',
            address: '105 Namsangongwon-gil, Yongsan-gu, Seoul',
            duration: 2
        },
        {
            id: 'activity-3',
            name: 'Bukchon Hanok Village',
            type: 'activity',
            lat: 37.5825,
            lng: 126.9845,
            rating: 4,
            price: 0,
            crowdLevel: 62,
            image: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=400&h=300&fit=crop',
            description: 'Traditional Korean village with hanok houses',
            address: '37 Gyedong-gil, Jongno-gu, Seoul',
            duration: 2
        },
        {
            id: 'activity-4',
            name: 'Hongdae Shopping District',
            type: 'activity',
            lat: 37.5563,
            lng: 126.9236,
            rating: 4,
            price: 0,
            crowdLevel: 71,
            image: 'https://images.unsplash.com/photo-1572508589611-c2addf5a8bb9?w=400&h=300&fit=crop',
            description: 'Vibrant youth culture and shopping area',
            address: 'Hongik-ro, Mapo-gu, Seoul',
            duration: 3
        },
        {
            id: 'activity-5',
            name: 'Myeongdong Shopping Street',
            type: 'activity',
            lat: 37.5636,
            lng: 126.9850,
            rating: 4,
            price: 0,
            crowdLevel: 85,
            image: 'https://images.unsplash.com/photo-1582269255951-3c0298a5e8b6?w=400&h=300&fit=crop',
            description: 'Premier shopping and food destination',
            address: 'Myeongdong-gil, Jung-gu, Seoul',
            duration: 3
        },
        {
            id: 'activity-6',
            name: 'Changdeokgung Palace',
            type: 'activity',
            lat: 37.5791,
            lng: 126.9917,
            rating: 5,
            price: 3000,
            crowdLevel: 52,
            image: 'https://images.unsplash.com/photo-1548115184-bc65443f5592?w=400&h=300&fit=crop',
            description: 'UNESCO World Heritage palace with secret garden',
            address: '99 Yulgok-ro, Jongno-gu, Seoul',
            duration: 3
        },
        {
            id: 'activity-7',
            name: 'Dongdaemun Design Plaza',
            type: 'activity',
            lat: 37.5665,
            lng: 127.0094,
            rating: 4,
            price: 0,
            crowdLevel: 48,
            image: 'https://images.unsplash.com/photo-1572508967444-e34f297e6a92?w=400&h=300&fit=crop',
            description: 'Futuristic architectural landmark',
            address: '281 Eulji-ro, Jung-gu, Seoul',
            duration: 2
        }
    ],

    // Restaurants
    restaurants: [
        {
            id: 'restaurant-1',
            name: 'Jungsik Seoul',
            type: 'restaurant',
            lat: 37.5265,
            lng: 127.0400,
            rating: 5,
            price: 180000,
            crowdLevel: 42,
            image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
            description: 'Michelin 2-star modern Korean cuisine',
            address: '15 Seolleung-ro 158-gil, Gangnam-gu, Seoul',
            cuisine: 'Korean Fine Dining'
        },
        {
            id: 'restaurant-2',
            name: 'Gwangjang Market',
            type: 'restaurant',
            lat: 37.5701,
            lng: 126.9995,
            rating: 4,
            price: 15000,
            crowdLevel: 88,
            image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop',
            description: 'Historic market with street food stalls',
            address: '88 Changgyeonggung-ro, Jung-gu, Seoul',
            cuisine: 'Street Food'
        },
        {
            id: 'restaurant-3',
            name: 'Maple Tree House',
            type: 'restaurant',
            lat: 37.5270,
            lng: 127.0380,
            rating: 4,
            price: 45000,
            crowdLevel: 58,
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
            description: 'Premium Korean BBQ restaurant',
            address: '521 Teheran-ro, Gangnam-gu, Seoul',
            cuisine: 'Korean BBQ'
        },
        {
            id: 'restaurant-4',
            name: 'Tosokchon Samgyetang',
            type: 'restaurant',
            lat: 37.5755,
            lng: 126.9735,
            rating: 4,
            price: 22000,
            crowdLevel: 67,
            image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop',
            description: 'Famous ginseng chicken soup restaurant',
            address: '85-1 Chejae-dong, Jongno-gu, Seoul',
            cuisine: 'Traditional Korean'
        }
    ],

    // Sample Route (logical travel sequence)
    route: [
        { id: 'hotel-1', order: 1, time: '09:00' },
        { id: 'activity-1', order: 2, time: '10:30' },
        { id: 'activity-3', order: 3, time: '13:00' },
        { id: 'restaurant-4', order: 4, time: '15:30' },
        { id: 'activity-2', order: 5, time: '17:30' },
        { id: 'restaurant-1', order: 6, time: '19:30' }
    ],

    // Carbon points for eco-friendly choices
    carbonPoints: {
        walking: 15,
        publicTransport: 10,
        bicycle: 20,
        electricVehicle: 25
    },

    // Weather data
    weather: {
        temp: 12,
        condition: 'Partly Cloudy',
        humidity: 45,
        windSpeed: 3.2
    },

    // Notifications
    notifications: [
        {
            id: 1,
            title: 'Crowd Alert',
            message: 'Gyeongbokgung Palace is currently very crowded (78%). Consider visiting early morning.',
            time: '5 min ago',
            type: 'warning'
        },
        {
            id: 2,
            title: 'Carbon Points Earned',
            message: 'You earned +25 carbon points for choosing public transport!',
            time: '1 hour ago',
            type: 'success'
        },
        {
            id: 3,
            title: 'Weather Update',
            message: 'Light rain expected this afternoon. Don\'t forget your umbrella!',
            time: '2 hours ago',
            type: 'info'
        }
    ]
};

// Helper function to get all locations
function getAllLocations() {
    return [
        ...mockData.hotels,
        ...mockData.activities,
        ...mockData.restaurants
    ];
}

// Helper function to get location by ID
function getLocationById(id) {
    const allLocations = getAllLocations();
    return allLocations.find(loc => loc.id === id);
}

// Helper function to get crowd color based on percentage
function getCrowdColor(percentage) {
    if (percentage <= 40) return 'green';
    if (percentage <= 70) return 'yellow';
    return 'red';
}

// Helper function to format price in Korean Won
function formatPrice(price) {
    return `₩${price.toLocaleString()}`;
}

// Helper function to generate star rating HTML
function generateStars(rating) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            stars += '★';
        } else {
            stars += '☆';
        }
    }
    return stars;
}
