import React from "react";
import { BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";

const ServiceCard = ({ item, index }) => {
    const { name, desc, bgColor, textColor } = item;

    // Initialize linkTo to /doctors for all cards by default
    let linkTo = "/doctors"; 

    // Override the link only for the "Safe Vault" card
    if (name === "A Safe Vault for patients to upload their medical Documents") {
        linkTo = "/users/profile/me/documents"; 
    }

    else if (name === "Thorough Analysis of Lab Records With AI") {
        linkTo = "/users/profile/me/analysis"; 
    }
    // No need for an explicit check for "Book Appointments with Ease" because the default is already "/doctors"

    return (
        <div className='py-[30px] px-3 lg:px-5 shadow hover:shadow-lg bg-[#fafdf6]'>
            <h2 className='font-sans text-[26px] leading-9 text-headingColor font-[700]'>{name}</h2>
            <p className='text-[16px] leading-7 font-[400] text-textColor mt-4'>{desc}</p>

            <div className="flex items-center justify-between mt-[30px]">
                <Link
                    to={linkTo} // Use the dynamically determined link
                    className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor hover:border-none"
                >
                    <BsArrowRight className="group-hover:text-white w-6 h-5" />
                </Link>
                <span
                    className="w-[44px] h-[44px] flex items-center justify-center text-[18px] leading-[30px] font-[600] "
                    style={{
                        background: `${bgColor}`,
                        color: `${textColor}`,
                        borderRadius: `6px 0 0 6px`,
                    }}
                >
                    {index + 1}
                </span>
            </div>
        </div>
    );
};

export default ServiceCard;