import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '../components/ui/button'

function ViewTrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  useEffect(() => {
    const GetTripData = () => {
      const userTrips = JSON.parse(localStorage.getItem('userTrips') || '[]');
      const foundTrip = userTrips.find(trip => trip.id === tripId);
      setTrip(foundTrip);
    }
    
    GetTripData();
  }, [tripId]);

  if (!trip) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold">Trip not found</h2>
          <p className="text-gray-500">The requested trip could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
      {/* Information Section */}
      <div className='mb-10'>
        <img 
          src="/placeholder.jpg" 
          alt={trip.destination}
          className='h-[340px] w-full object-cover rounded-xl'
        />
        
        <div className='mt-6'>
          <h2 className='font-bold text-2xl'>{trip.destination}</h2>
          <div className='flex gap-5 mt-2'>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
              📅 {trip.days} Day{trip.days > 1 ? 's' : ''}
            </h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
              💰 {trip.budget} Budget
            </h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
              🥂 {trip.travelers}
            </h2>
          </div>
        </div>
      </div>

      {/* Hotels */}
      <div className='mb-10'>
        <h2 className='font-bold text-lg'>Hotel Recommendation</h2>
        <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-5'>
          {trip.hotel_options?.map((hotel, index) => (
            <div key={index} className='hover:scale-105 transition-all cursor-pointer'>
              <img 
                src={hotel.image_url} 
                alt={hotel.name}
                className='rounded-xl h-[180px] w-full object-cover'
              />
              <div className='my-2 flex flex-col gap-2'>
                <h2 className='font-medium'>{hotel.name}</h2>
                <h2 className='text-xs text-gray-500'>📍 {hotel.address}</h2>
                <h2 className='text-sm'>💰 {hotel.price}</h2>
                <h2 className='text-sm'>⭐ {hotel.rating}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Plan */}
      <div>
        <h2 className='font-bold text-lg'>Places to Visit</h2>
        <div>
          {trip.itinerary?.map((item, index) => (
            <div key={index} className='mt-5'>
              <h2 className='font-medium text-lg'>{item.day}</h2>
              <div className='grid md:grid-cols-2 gap-5'>
                {item.plan?.map((place, index) => (
                  <div key={index} className='my-3'>
                    <h2 className='font-medium text-sm text-orange-600'>{place.time}</h2>
                    <div className='border p-3 rounded-lg hover:scale-105 transition-all cursor-pointer hover:shadow-md'>
                      <img 
                        src={place.image_url} 
                        alt={place.place}
                        className='w-full h-[130px] object-cover rounded-lg'
                      />
                      <div className='mt-2'>
                        <h2 className='font-bold text-lg'>{place.place}</h2>
                        <p className='text-sm text-gray-500'>{place.details}</p>
                        <h2 className='mt-2 text-sm'>🎟️ {place.ticket_pricing}</h2>
                        <h2 className='text-sm'>⭐ {place.rating}</h2>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ViewTrip
