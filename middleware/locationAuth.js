//check user location is in delivery radius
function checkDeliveryRadius() {
    // Store location (latitude, longitude)
    const storeLocation = {
      latitude: 40.748817,
      longitude: -73.985428,
    };
  
    // User location (latitude, longitude)
    const userLocation = {
      latitude: 40.759103,
      longitude: -73.984457,
    };
  
    // Convert degrees to radians
    function toRadians(degrees) {
      return degrees * (Math.PI/180);
    }
  
    // Calculate the distance between the store and the user using the Haversine formula
    function getDistanceInKm(start, end) {
      const R = 6371; // Radius of the earth in kilometers
      const dLat = toRadians(end.latitude - start.latitude);
      const dLon = toRadians(end.longitude - start.longitude);
      const lat1 = toRadians(start.latitude);
      const lat2 = toRadians(end.latitude);
  
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
      return R * c; // Distance in kilometers
    }
  
    // Check if the user is within a 15km radius of the store location
    const distance = getDistanceInKm(storeLocation, userLocation);
    if (distance <= 15) {
      console.log('User is within the delivery radius');
      // Code to proceed with the delivery
    } else {
      console.log('User is outside the delivery radius');
      // Code to notify the user that delivery is not available
    }
  }
  