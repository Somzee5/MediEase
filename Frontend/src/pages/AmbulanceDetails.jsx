import React, { useState } from 'react';
// import starIcon from "../../assets/images/Star.png";
// import DoctorAbout from './DoctorAbout.jsx';
// import Feedback from './Feedback.jsx';
// import SidePanel from './SidePanel.jsx'
// import DoctorCard from '../../components/Doctors/DoctorCard.jsx';
import { BASE_URL } from '../config.js';
import useFetchData from '../hooks/useFetchData.jsx';
import Loader from '../components/Loader/Loading';
import Error from '../components/Error/Error.jsx';
import { useParams } from 'react-router-dom';
import AmbulanceSidePanel from './AmbulanceSidePanel.jsx';

const AmbulanceDetails = () => {

  const [tab, setTab] = useState("about");
  const { id } = useParams();
  const { data: ambulance, loading, error } = useFetchData(`${BASE_URL}/ambulances/${id}`);


  const {
    name,
    photo,
    gender,
    vehicleNumber,
    servciceArea,
    basePrice,
    availability
  } = ambulance;


  return <section>
    <div className='max-w-[1170px] px-5 mx-auto'>

      {loading && <Loader />}
      {error && <Error />}

      {!loading && !error && (<div className='grid md:grid-cols-3 gap-[50px]'>
        <div className='md:col-span-2'>

          <div className='flex items-center gap-5'>
            <figure className='max-w-[300px] max-h-[300px] '>
              <img src={photo} className='w-full' />
            </figure>
            <div>
              {/* <span className='bg-[#CCF0F3] text-irisBlueColor py-1 px-6 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[16px] lg:leading-7 font-semibold rounded '>
                {specialization}
              </span> */}
              <h3 className='text-headinColor text-[32px] leading-9 mt-3 font-bold capitalize text-headingColor '>
                {name}
              </h3>
              {/* <div className='flex items-center gap-[6px]'>
                <span className='flex items-center gap-[6px] text-[14px] leading-5 lg:text-[16px] lg:leading-7 font-semibold text-headingColor'>
                  <img src={starIcon} alt='' /> {averageRating}
                </span>
                <span className=''>
                  ({totalRating})
                </span>
              </div> */}
              {/* <p className='text__para text-[14px] leading-5 md:text-[15px] lg:max-w-[]'>{bio} </p> */}

            </div>
          </div>

          <div className='mt-[50px] border-b border-solid border-[#0066ff34] '>
            <button onClick={() => setTab('about')} className={`${tab == 'about' && 'border-b border-solid border-primaryColor'} py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}>About</button>
            <button onClick={() => setTab('feedback')} className={`${tab == 'feedback' && 'border-b border-solid border-primaryColor'} py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}>Feedback</button>
          </div>

          {/* <div className='mt-[50px]'>
            {
              tab == 'about' && <DoctorAbout name={name} about={about} qualifications={qualifications} experiences={experiences} />
            }
            {
              tab == 'feedback' && <Feedback reviews={reviews} totalRating={totalRating} />
            }
          </div> */}
        </div>
        <div>
          <AmbulanceSidePanel ambulanceId={ambulance._id} basePrice={basePrice} availability={availability} />
        </div>
      </div>
      )}

    </div>
  </section>
}

export default AmbulanceDetails
