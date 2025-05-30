import React, { useEffect, useState } from "react";
import convertTime from "../utils/convertTime";
import { BASE_URL } from "../config.js";
import { toast } from "react-toastify";
import { token } from "../config.js";
import { useNavigate } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader.js";

const AmbulanceSidePanel = ({ ambulanceId, basePrice, availability }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

  const confirmBooking = (availability) => {
    if (
      window.confirm(
        "Do you want to confirm booking of the selected time slot?"
      )
    ) {
      setSelectedTimeSlot(availability);
      bookAppointment(availability);
    }
  };

  const bookAppointment = async (availability) => {
    try {
        // console.log(availability);
      setLoading(true);
      const res = await fetch(
        `${BASE_URL}/ambulances/bookings/checkout-session-razorpay/${ambulanceId}`,
        {
          method: "post",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message + "Please try again!");
      }
      setLoading(false);
      if (data.success) {
        var options = {
          key: "" + data.key_id + "",
          amount: "" + data.amount + "",
          currency: "INR",
          name: "" + data.name + "",
          description: "" + "description" + "",
          image: "https://dummyimage.com/600x400/000/fff",
          order_id: "" + data.order_id + "",
          handler: async function (response) {
            const newdata = JSON.stringify({
              aid: data.ambulance,
              uid: data.user,
              price: data.basePrice,
              availability: availability,
            });

            try {
              const res = await fetch(
                `${BASE_URL}/ambulances/bookings/newbooking`,
                {
                  method: "post",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                  body: newdata,
                }
              );
              const data = await res.json();
              if (data.success) {
                toast.success(data.message);
                navigate("/checkout-success");
              } else {
                toast.error(data.message);
              }
            } catch (error) {
              console.log(error);
            }
          },
          prefill: {
            contact: "" + data.contact + "",
            name: "" + data.name + "",
            email: "" + data.email + "",
          },
          notes: {
            description: "" + "res.description" + "",
          },
          theme: {
            color: "#2300a3",
          },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else {
        alert(res.msg);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="shadow-panelShadow p-3 lg:p-5 rounded-md">
      <div className="flex items-center justify-between">
        {/* <p className="text__para mt-0 font-semibold">Ticket Price</p> */}
        <span className="text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold  border-blue-600 border-b-4 bordery">
          {basePrice} INR
        </span>
      </div>

      <div className="mt-[30px]">
        <p className="text__para mt-0 font-semibold text-headingColor text-[30px] mb-3">
          Available Days:
        </p>

        <ul className="mt-3">
          {availability &&
            Object.entries(availability).map(
              ([day, available]) =>
                available && (
                  <li
                    key={day}
                    className="mt-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[25px] text-green-600 font-bold">
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </p>
                      {selectedTimeSlot === day ? (
                        <span className="text-green-500 font-semibold">
                          Booked
                        </span>
                      ) : (
                        <button
                          onClick={() => confirmBooking(day)}
                          className="btn rounded-md"
                          style={{
                            width: "70px",
                            height: "40px",
                            marginTop: "20px",
                            padding: "8px 16px",
                          }}
                        >
                          Book
                        </button>
                      )}
                    </div>
                    {/* <span className="text-green-500 font-semibold">
                    Available
                  </span> */}
                  </li>
                )
            )}
        </ul>
      </div>
    </div>
  );
};

export default AmbulanceSidePanel;
