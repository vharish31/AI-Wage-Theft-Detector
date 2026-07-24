/**
 * Location Helper & Reverse Geocoding Utility (Frontend)
 */

export const INDIAN_STATES_CITIES_MAP = {
  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Salem",
    "Tiruchirappalli (Trichy)",
    "Tirunelveli",
    "Vellore",
    "Erode",
    "Thanjavur",
    "Tuticorin"
  ],
  "Karnataka": [
    "Bengaluru",
    "Mysuru (Mysore)",
    "Hubballi-Dharwad",
    "Mangaluru (Mangalore)",
    "Belagavi (Belgaum)",
    "Kalaburagi",
    "Davangere"
  ],
  "Maharashtra": [
    "Mumbai",
    "Pune",
    "Nagpur",
    "Nashik",
    "Thane",
    "Aurangabad (Chhatrapati Sambhajinagar)",
    "Solapur"
  ],
  "Delhi": [
    "Delhi",
    "New Delhi",
    "Noida",
    "Gurugram",
    "Faridabad",
    "Ghaziabad"
  ],
  "West Bengal": [
    "Kolkata",
    "Howrah",
    "Durgapur",
    "Siliguri",
    "Asansol",
    "Bardhaman"
  ],
  "Telangana": [
    "Hyderabad",
    "Warangal",
    "Nizamabad",
    "Khammam",
    "Karimnagar"
  ],
  "Andhra Pradesh": [
    "Visakhapatnam",
    "Vijayawada",
    "Guntur",
    "Nellore",
    "Kurnool",
    "Tirupati"
  ],
  "Kerala": [
    "Kochi",
    "Thiruvananthapuram",
    "Kozhikode",
    "Thrissur",
    "Kollam",
    "Kannur"
  ],
  "Gujarat": [
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
    "Bhavnagar"
  ],
  "Uttar Pradesh": [
    "Lucknow",
    "Kanpur",
    "Agra",
    "Varanasi",
    "Prayagraj (Allahabad)",
    "Meerut"
  ]
};

export const CITY_TO_STATE_MAP = {
  "chennai": "Tamil Nadu",
  "coimbatore": "Tamil Nadu",
  "madurai": "Tamil Nadu",
  "salem": "Tamil Nadu",
  "trichy": "Tamil Nadu",
  "tiruchirappalli": "Tamil Nadu",
  "bengaluru": "Karnataka",
  "bangalore": "Karnataka",
  "mysore": "Karnataka",
  "mysuru": "Karnataka",
  "mumbai": "Maharashtra",
  "pune": "Maharashtra",
  "delhi": "Delhi",
  "new delhi": "Delhi",
  "kolkata": "West Bengal",
  "hyderabad": "Telangana",
  "visakhapatnam": "Andhra Pradesh",
  "kochi": "Kerala",
  "thiruvananthapuram": "Kerala",
  "ahmedabad": "Gujarat",
  "lucknow": "Uttar Pradesh"
};

export const resolveLocationState = (cityName, stateName = null) => {
  if (stateName && String(stateName).trim()) {
    return String(stateName).trim();
  }
  if (!cityName) return "Tamil Nadu";

  const cleanCity = String(cityName).trim().toLowerCase();
  for (const [c, s] of Object.entries(CITY_TO_STATE_MAP)) {
    if (cleanCity.includes(c) || c.includes(cleanCity)) {
      return s;
    }
  }

  return "Tamil Nadu";
};

export const reverseGeocodeCoords = async (latitude, longitude) => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`;
    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'en-US,en;q=0.9',
        'User-Agent': 'AI-Wage-Theft-Detector/1.0'
      }
    });

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      
      const city = addr.city || addr.town || addr.municipality || addr.county || addr.state_district || "Chennai";
      const state = addr.state || resolveLocationState(city);

      // Clean city name (e.g. "Chennai District" -> "Chennai")
      const cleanCity = city.replace(/\s+(District|Division|Zone|Taluk)$/i, '').trim();

      return {
        city: cleanCity,
        state: state,
        formattedLocation: `${cleanCity}, ${state}`
      };
    }
  } catch (err) {
    console.warn("Reverse geocoding fetch error:", err.message);
  }

  // Fallback default if reverse geocode service fails
  return {
    city: "Chennai",
    state: "Tamil Nadu",
    formattedLocation: "Chennai, Tamil Nadu"
  };
};
