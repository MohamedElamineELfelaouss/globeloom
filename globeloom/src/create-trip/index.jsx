import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { SelectTravelList, SelectBudgetOptions } from '../constants/options'
import { generateTripPlan } from '../services/mockApi'
import { useNavigate } from 'react-router-dom'

function CreateTrip() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const OnGenerateTrip = async () => {
    if (!formData?.place || !formData?.noOfDays || !formData?.budget || !formData?.traveler) {
      alert("Please fill all details");
      return;
    }

    setLoading(true);
    try {
      const result = await generateTripPlan(
        formData.place,
        formData.noOfDays,
        formData.budget,
        formData.traveler
      );
      
      // Store the trip data in localStorage
      const userTrips = JSON.parse(localStorage.getItem('userTrips') || '[]');
      userTrips.push(result);
      localStorage.setItem('userTrips', JSON.stringify(userTrips));
      
      // Navigate to view trip
      navigate(`/view-trip/${result.id}`);
    } catch (error) {
      console.error('Error generating trip:', error);
      alert('Error generating trip. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
      <h2 className='font-bold text-3xl'>Tell us your travel preferences 🏕️🌴</h2>
      <p className='mt-3 text-gray-500 text-xl'>Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.</p>
      
      <div className='mt-20 flex flex-col gap-10'>
        <div>
          <h2 className='text-xl my-3 font-medium'>What is destination of choice?</h2>
          <Input 
            placeholder='Ex. Paris, France' 
            onChange={(e) => handleInputChange('place', e.target.value)}
          />
        </div>

        <div>
          <h2 className='text-xl my-3 font-medium'>How many days are you planning your trip?</h2>
          <Input 
            placeholder='Ex. 3' 
            type='number'
            onChange={(e) => handleInputChange('noOfDays', e.target.value)}
          />
        </div>

        <div>
          <h2 className='text-xl my-3 font-medium'>What is Your Budget?</h2>
          <div className='grid grid-cols-3 gap-5 mt-5'>
            {SelectBudgetOptions.map((item, index) => (
              <div 
                key={index}
                onClick={() => handleInputChange('budget', item.title)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${formData?.budget === item.title && 'shadow-lg border-black'}`}
              >
                <h2 className='text-4xl'>{item.icon}</h2>
                <h2 className='font-bold text-lg'>{item.title}</h2>
                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className='text-xl my-3 font-medium'>Who do you plan on traveling with on your next adventure?</h2>
          <div className='grid grid-cols-3 gap-5 mt-5'>
            {SelectTravelList.map((item, index) => (
              <div 
                key={index}
                onClick={() => handleInputChange('traveler', item.people)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${formData?.traveler === item.people && 'shadow-lg border-black'}`}
              >
                <h2 className='text-4xl'>{item.icon}</h2>
                <h2 className='font-bold text-lg'>{item.title}</h2>
                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div className='my-10 justify-end flex'>
          <Button 
            disabled={loading}
            onClick={OnGenerateTrip}
          >
            {loading ? 'Generating...' : 'Generate Trip'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateTrip
