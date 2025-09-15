import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function MyTrips() {
  const [userTrips, setUserTrips] = useState([]);

  useEffect(() => {
    GetUserTrips();
  }, []);

  const GetUserTrips = () => {
    const trips = JSON.parse(localStorage.getItem('userTrips') || '[]');
    setUserTrips(trips);
  }

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
      <h2 className='font-bold text-3xl'>My Trips</h2>
      
      <div className='grid grid-cols-2 md:grid-cols-3 gap-5 mt-10'>
        {userTrips?.length > 0 ? userTrips.map((trip, index) => (
          <Link to={'/view-trip/' + trip?.id} key={index}>
            <div className='hover:scale-105 transition-all hover:shadow-md cursor-pointer'>
              <img 
                src="/placeholder.jpg" 
                alt={trip.destination}
                className='object-cover rounded-xl h-[220px] w-full'
              />
              <div className='mt-3'>
                <h2 className='font-bold text-lg'>{trip?.destination}</h2>
                <h2 className='text-sm text-gray-500'>{trip?.days} Days trip with {trip?.budget} Budget</h2>
              </div>
            </div>
          </Link>
        )) : (
          <div className='col-span-full text-center py-20'>
            <h3 className='text-xl text-gray-500'>No trips found</h3>
            <p className='text-gray-400 mt-2'>Create your first trip to get started!</p>
            <Link to="/create-trip" className='inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'>
              Create Trip
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyTrips
