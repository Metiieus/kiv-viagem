
export const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
};

// Helper: Calculate bearing between two points
export const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const dLon = deg2rad(lon2 - lon1);
    const y = Math.sin(dLon) * Math.cos(deg2rad(lat2));
    const x = Math.cos(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) -
        Math.sin(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(dLon);
    const brng = rad2deg(Math.atan2(y, x));
    return (brng + 360) % 360;
};

// Calculate Curvature (Angle change between 3 points)
// Returns angle in degrees. Lower angle = sharper turn? No, change in bearing.
// If bearing1 = 0 (North) and bearing2 = 90 (East), change is 90.
// We want the deflection angle.
export const calculateCurvature = (
    p1: { latitude: number; longitude: number },
    p2: { latitude: number; longitude: number },
    p3: { latitude: number; longitude: number }
): number => {
    const bearing1 = calculateBearing(p1.latitude, p1.longitude, p2.latitude, p2.longitude);
    const bearing2 = calculateBearing(p2.latitude, p2.longitude, p3.latitude, p3.longitude);

    let angleChange = Math.abs(bearing1 - bearing2);
    if (angleChange > 180) angleChange = 360 - angleChange;

    return angleChange; // 0 = straight, 90 = sharp right/left
};

// Calculate Slope (Grade in %)
export const calculateSlope = (
    p1: { latitude: number; longitude: number; altitude?: number },
    p2: { latitude: number; longitude: number; altitude?: number }
): number => {
    if (p1.altitude === undefined || p2.altitude === undefined) return 0;

    const distKm = getDistanceFromLatLonInKm(p1.latitude, p1.longitude, p2.latitude, p2.longitude);
    const distM = distKm * 1000;
    if (distM === 0) return 0;

    const deltaAlt = p2.altitude - p1.altitude;
    return (deltaAlt / distM) * 100; // % Grade
};

const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
};

const rad2deg = (rad: number) => {
    return rad * (180 / Math.PI);
};

export const calcDistKm = getDistanceFromLatLonInKm; // Alias for consistency
