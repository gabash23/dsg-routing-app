import { NextResponse } from 'next/server';

// Mock address data - in production, this would connect to Google Places API, USPS, or your address database
const mockAddresses = [
  {
    id: '1',
    formatted_address: '123 Main St, Anytown, NY 12345, USA',
    street_number: '123',
    route: 'Main St',
    locality: 'Anytown',
    administrative_area_level_1: 'NY',
    postal_code: '12345',
    country: 'USA',
    geometry: {
      lat: 40.7128,
      lng: -74.006,
    },
  },
  {
    id: '2',
    formatted_address: '456 Oak Ave, Springfield, IL 62701, USA',
    street_number: '456',
    route: 'Oak Ave',
    locality: 'Springfield',
    administrative_area_level_1: 'IL',
    postal_code: '62701',
    country: 'USA',
    geometry: {
      lat: 39.7817,
      lng: -89.6501,
    },
  },
  {
    id: '3',
    formatted_address: '789 Pine Rd, Portland, OR 97201, USA',
    street_number: '789',
    route: 'Pine Rd',
    locality: 'Portland',
    administrative_area_level_1: 'OR',
    postal_code: '97201',
    country: 'USA',
    geometry: {
      lat: 45.5152,
      lng: -122.6784,
    },
  },
  {
    id: '4',
    formatted_address: '321 Elm St, Austin, TX 78701, USA',
    street_number: '321',
    route: 'Elm St',
    locality: 'Austin',
    administrative_area_level_1: 'TX',
    postal_code: '78701',
    country: 'USA',
    geometry: {
      lat: 30.2672,
      lng: -97.7431,
    },
  },
  {
    id: '5',
    formatted_address: '654 Maple Dr, Denver, CO 80202, USA',
    street_number: '654',
    route: 'Maple Dr',
    locality: 'Denver',
    administrative_area_level_1: 'CO',
    postal_code: '80202',
    country: 'USA',
    geometry: {
      lat: 39.7392,
      lng: -104.9903,
    },
  },
  {
    id: '6',
    formatted_address: '714 Techwood Dr NW, Atlanta, GA 30318, USA',
    street_number: '714',
    route: 'Techwood Dr NW',
    locality: 'Atlanta',
    administrative_area_level_1: 'GA',
    postal_code: '30318',
    country: 'USA',
    geometry: {
      lat: 33.749,
      lng: -84.388,
    },
  },
  {
    id: '7',
    formatted_address: '1000 Techwood Dr, Atlanta, GA 30318, USA',
    street_number: '1000',
    route: 'Techwood Dr',
    locality: 'Atlanta',
    administrative_area_level_1: 'GA',
    postal_code: '30318',
    country: 'USA',
    geometry: {
      lat: 33.749,
      lng: -84.388,
    },
  },
  {
    id: '8',
    formatted_address: '555 Techwood Ave, Atlanta, GA 30309, USA',
    street_number: '555',
    route: 'Techwood Ave',
    locality: 'Atlanta',
    administrative_area_level_1: 'GA',
    postal_code: '30309',
    country: 'USA',
    geometry: {
      lat: 33.749,
      lng: -84.388,
    },
  },
  {
    id: '9',
    formatted_address: '1234 First St, Los Angeles, CA 90210, USA',
    street_number: '1234',
    route: 'First St',
    locality: 'Los Angeles',
    administrative_area_level_1: 'CA',
    postal_code: '90210',
    country: 'USA',
    geometry: {
      lat: 34.0522,
      lng: -118.2437,
    },
  },
  {
    id: '10',
    formatted_address: '5678 Second Ave, Miami, FL 33101, USA',
    street_number: '5678',
    route: 'Second Ave',
    locality: 'Miami',
    administrative_area_level_1: 'FL',
    postal_code: '33101',
    country: 'USA',
    geometry: {
      lat: 25.7617,
      lng: -80.1918,
    },
  },
  {
    id: '11',
    formatted_address: '9999 Third Blvd, Seattle, WA 98101, USA',
    street_number: '9999',
    route: 'Third Blvd',
    locality: 'Seattle',
    administrative_area_level_1: 'WA',
    postal_code: '98101',
    country: 'USA',
    geometry: {
      lat: 47.6062,
      lng: -122.3321,
    },
  },
  {
    id: '12',
    formatted_address: '1111 Fourth St, Chicago, IL 60601, USA',
    street_number: '1111',
    route: 'Fourth St',
    locality: 'Chicago',
    administrative_area_level_1: 'IL',
    postal_code: '60601',
    country: 'USA',
    geometry: {
      lat: 41.8781,
      lng: -87.6298,
    },
  },
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 3) {
      return NextResponse.json({
        success: true,
        results: [],
        message: 'Please enter at least 3 characters to search',
      });
    }

    // First, try to find matches in our mock data
    const filteredAddresses = mockAddresses.filter(
      (address) =>
        address.formatted_address.toLowerCase().includes(query.toLowerCase()) ||
        address.locality.toLowerCase().includes(query.toLowerCase()) ||
        address.administrative_area_level_1
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        address.postal_code.includes(query)
    );

    // If we have matches, return them
    if (filteredAddresses.length > 0) {
      return NextResponse.json({
        success: true,
        results: filteredAddresses,
        query: query,
        source: 'mock_data',
      });
    }

    // If no matches found, try to geocode the address using Nominatim API
    try {
      const geocodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=us&limit=5&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'DSG-Routing-App/1.0',
          },
        }
      );

      if (geocodeResponse.ok) {
        const geocodeData = await geocodeResponse.json();

        if (geocodeData && geocodeData.length > 0) {
          // Transform Nominatim results to our format
          const geocodedAddresses = geocodeData.map((result, index) => ({
            id: `geocoded_${index}`,
            formatted_address: result.display_name,
            street_number: result.address?.house_number || '',
            route: result.address?.road || result.address?.street || '',
            locality:
              result.address?.city ||
              result.address?.town ||
              result.address?.village ||
              '',
            administrative_area_level_1: result.address?.state || '',
            postal_code: result.address?.postcode || '',
            country: result.address?.country || 'USA',
            geometry: {
              lat: parseFloat(result.lat),
              lng: parseFloat(result.lon),
            },
            is_geocoded: true,
            confidence: result.importance || 0,
          }));

          return NextResponse.json({
            success: true,
            results: geocodedAddresses,
            query: query,
            source: 'geocoding',
          });
        }
      }
    } catch (geocodeError) {
      console.log(
        'Geocoding failed, falling back to generic address:',
        geocodeError.message
      );
    }

    // Fallback: create a generic address if geocoding fails
    const genericAddress = {
      id: 'generic',
      formatted_address: query,
      street_number: '',
      route: '',
      locality: '',
      administrative_area_level_1: '',
      postal_code: '',
      country: 'USA',
      geometry: {
        lat: 0,
        lng: 0,
      },
      is_generic: true,
      note: 'Address not found - please verify details',
    };

    return NextResponse.json({
      success: true,
      results: [genericAddress],
      query: query,
      source: 'fallback',
    });
  } catch (error) {
    console.error('Address search error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search addresses',
        message: 'An error occurred while searching for addresses',
      },
      { status: 500 }
    );
  }
}

// For future Google Places API integration
export async function POST(request) {
  try {
    const body = await request.json();
    const { query, apiKey } = body;

    // This would integrate with Google Places API
    // For now, return a placeholder response
    return NextResponse.json({
      success: false,
      message: 'Google Places API integration not yet implemented',
      suggestion: 'Use GET endpoint with query parameter for basic search',
    });
  } catch (error) {
    console.error('Address search POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid request format',
      },
      { status: 400 }
    );
  }
}
