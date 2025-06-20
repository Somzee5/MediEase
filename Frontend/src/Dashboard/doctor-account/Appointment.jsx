import React, { useContext } from "react";
import { formatDate } from "../../utils/formatDate";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";
import { authContext } from "../../context/AuthContext";
import { RiDeleteBinFill } from "react-icons/ri";

const Appointment = ({ appointment }) => {
  const { token, role } = useContext(authContext); // 'role' is crucial here

  const handleJoinMeeting = (url, userRole) => {
    console.log(`User role: ${userRole}. Attempting to join meeting using URL: ${url}`);
    window.open(url, "_blank");
  };

  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirmCancel) return;

    if (!token) {
      toast.error("Authentication token not found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/users/appointments/cancel/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (result.success) {
        toast.success("Booking canceled successfully");
        window.location.reload(); // Refresh to update the list
      } else {
        toast.error(result.message || "Error canceling booking");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this booking record? This action cannot be undone."
    );
    if (!confirmDelete) return;

    if (!token) {
      toast.error("Authentication token not found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/doctors/appointments/delete/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (result.success) {
        toast.success("Booking record deleted successfully");
        window.location.reload(); // Refresh to update the list
      } else {
        toast.error(result.message || "Error deleting booking record");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred while deleting booking record");
    }
  };

  return (
    <table className="w-full text-left text-sm text-gray-500 shadow-lg px-4 p-2">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3">
            Name
          </th>
          <th scope="col" className="px-6 py-3">
            Gender
          </th>
          <th scope="col" className="px-6 py-3">
            Payment
          </th>
          <th scope="col" className="px-6 py-3">
            Price
          </th>
          <th scope="col" className="px-6 py-3">
            Booked On
          </th>
          <th scope="col" className="px-6 py-3">
            Meeting Link {/* Changed from "Start URL" for generality */}
          </th>
          <th scope="col" className="px-6 py-3">
            Cancel Appointment
          </th>
          <th scope="col" className="px-6 py-3">
            Delete Record
          </th>
        </tr>
      </thead>

      <tbody>
        {appointment?.map((item) => {
          const appointmentStartDate = new Date(item.appointmentStartTime);
          const [endHours, endMinutes] = item.timeSlot.endingTime.split(':').map(Number);
          const appointmentEndDateTime = new Date(
            appointmentStartDate.getFullYear(),
            appointmentStartDate.getMonth(),
            appointmentStartDate.getDate(),
            endHours,
            endMinutes
          );
          const isAppointmentPassed = appointmentEndDateTime < new Date();

          // Determine which URL to use based on user role
          const meetingUrl = role === 'doctor' ? item.start_url : item.join_url;
          const buttonText = role === 'doctor' ? "Start Meeting" : "Join Meeting"; // Adjust button text

          return (
            <tr key={item._id} className="shadow">
              <th
                scope="row"
                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap "
              >
                <img
                  src={item.user.photo}
                  className="w-10 h-10 rounded-full"
                  alt=""
                />
                <div className="pl-3">
                  <div className="text-base font-semibold">{item.user.name}</div>
                  <div className="text-normal text-gray-500">
                    {item.user.email}
                  </div>
                </div>
              </th>
              <td className="px-6 py-4">{item.user.gender}</td>
              <td className="px-6 py-4">
                {item.isPaid && (
                  <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                    Paid
                  </div>
                )}
                {!item.isPaid && (
                  <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                    UnPaid
                  </div>
                )}
              </td>
              <td className="px-6 py-4">{item.ticketPrice}</td>
              <td className="px-6 py-4">{formatDate(item.createdAt)}</td>
              <td className="px-6 py-4">
                <button
                  className={`mt-auto bg-blue-500 text-white font-bold py-1 px-8 rounded shadow border-2 
                    border-blue-500 ${isAppointmentPassed ? "opacity-50 cursor-not-allowed" : "hover:bg-transparent hover:text-blue-500 teansition-all duration-300"}`}
                  onClick={() => handleJoinMeeting(meetingUrl, role)} // Pass the correct URL and role
                  disabled={isAppointmentPassed}
                >
                  {buttonText}{" "}
                </button>
              </td>
              <td className="px-6 py-4">
                <button
                  className={`bg-red-500 text-white font-bold py-1 px-7 rounded shadow border-2 
                  border-red-500 ${isAppointmentPassed ? "opacity-50 cursor-not-allowed" : "hover:bg-transparent hover:text-red-500 transition-all duration-300"}`}
                  onClick={() => handleCancelBooking(item._id)}
                  disabled={isAppointmentPassed}
                >
                  Cancel
                </button>
              </td>
              <td className="px-6 py-4">
                {isAppointmentPassed && (
                  <button
                    className="text-red-500 text-2xl hover:text-red-700 transition-all duration-300"
                    onClick={() => handleDeleteBooking(item._id)}
                    title="Delete Record"
                  >
                    <RiDeleteBinFill />
                  </button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Appointment;