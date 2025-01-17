import React, { useEffect, useState } from "react";

//import axios: for calling APIs
import axios from "axios";

//import icons
import {
  IoMdSunny,
  IoMdRainy,
  IoMdCloudy,
  IoMdSnow,
  IoMdThunderstorm,
  IoMdSearch,
} from "react-icons/io";

import {
  BsCloudHaze2Fill,
  BsCloudDrizzleFill,
  BsEye,
  BsWater,
  BsThermometer,
  BsWind,
  BsCloudHaze,
} from "react-icons/bs";

import { ImSpinner10 } from "react-icons/im";

const api_key = "a4a1323db098bae06ae6914dac7ad18b";

const App = () => {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState("malaga");
  const [inputValue, setInputValue] = useState("");
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleInput = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //if inputvalue is not empty
    if (inputValue !== "") {
      setLocation(inputValue);
    }

    //select input
    const input = document.querySelector("input");

    //if unput value is empty
    if (input.value === "") {
      //animate is set to true
      setAnimate(true);
      //after 500ms set animate to false
      setTimeout(() => {
        setAnimate(false);
      }, 500);
    }

    //clear input
    input.value = "";
  };

  //fetch data
  useEffect(() => {
    //set loading to true
    setLoading(true);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${api_key}`;

    axios
      .get(url)
      .then((res) => {
        //give the data after 1500ms
        setTimeout(() => {
          setData(res.data);
          //set loading false
          setLoading(false);
        }, 1500);
      })
      .catch((err) => {
        setLoading(false);
        setErrorMsg(err);
      });
  }, [location]);

  //error message
  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMsg("");
    }, 2000);
    //clear timer
    return () => clearTimeout(timer);
  }, [errorMsg]);

  //if data is false, show spinner
  if (!data) {
    return (
      <div className="w-full h-screen justify-center items-center flex bg-gradient-to-r from-green-500 via-emerald-600-500 to-slate-700">
        <div >
          <ImSpinner10 className="text-5xl animate-spin text-white" />
        </div>
      </div>
    );
  }

  //icon according to weather
  let icon;

  switch (data.weather[0].main) {
    case "Clouds":
      icon = <IoMdCloudy className="text-[#c1b8b8]" />;
      break;
    case "Haze":
      icon = <BsCloudHaze2Fill className="text-[gray]" />;
      break;
    case "Rain":
      icon = <IoMdRainy className="text-[#31cafb]"/>;
      break;
    case "Clear":
      icon = <IoMdSunny className="text-[#ffae00]"/>;
      break;
    case "Drizzle":
      icon = <BsCloudDrizzleFill className="text-[#75d5f5]"/>;
      break;
    case "Snow":
      icon = <IoMdSnow className="text-[#31cafb]"/>;
      break;
    case "Thunderstorm":
      icon = <IoMdThunderstorm />;
      break;

    default:
      icon = <BsCloudHaze />;
      break;
  }

  //date
  let d = new Date();
  let date = d.getDate();
  let year = d.getFullYear();
  let month = d.toLocaleString("default", { month: "long" });
  let day = d.toLocaleString("default", { weekday: "long" });

  return (
    <div className="w-full h-screen bg-gradient-to-r from-green-500 via-emerald-600-500 to-slate-700 flex flex-col items-center justify-center px-4 lg:px-0">
      {errorMsg && <div className='w-full max-w-[90vw] lg:max-w-[450px] bg-[#E81736] text-white absolute top-1 lg:top-10 p-4 capitalize rounded-md'>{`${errorMsg.response.data.message}`}</div>}
      {/* card */}
      <div className="w-full max-w-[450px] bg-black/20 min-h-[584px] text-white backdrop-blur-[32px] rounded-[32px] py-12 px-6">
        {/* form */}
        <div>
          <form
            className={`${
              animate ? "animate-shake" : "animate-none"
            }my-2 h-10 bg-black/30 w-full max-w-[450px] rounded-full backdrop-blur-[32px] mb-8`}
          >
            <div className="h-full relative flex items-center justify-between p-2">
              <input
                onChange={(e) => handleInput(e)}
                className="flex-1 bg-transparent outline-none placeholder:text-green-200 text-[18px] font-light pl-6 h-full"
                type="text"
                placeholder="Search by city name or country"
              />
              <button
                onClick={(e) => handleSubmit(e)}
                className="bg-[#50C878] hover:bg-[#34AC90] w-14 h-7 rounded-full flex justify-center items-center transition"
              >
                <IoMdSearch className="text-2xl text-white" />
              </button>
            </div>
          </form>
        </div>
        {loading ? (
          <div className="w-full h-full flex justify-center items-center">
            <ImSpinner10 className="text-white text-5xl animate-spin" />
          </div>
        ) : (
          <div>
            {/* card top */}
            <div className=" flex items-center gap-x-5">
              {/* icon */}
              <div className="text-[87px]">{icon}</div>
              <div>
                {/* country name */}
                <div className="text-2xl font-semibold">
                  {data.name}, {data.sys.country}
                </div>
                {/* date */}
                <div>
                  {day}, {month} {date}, {year}
                </div>
              </div>
            </div>
            {/* card middle */}
            <div className="my-14">
              <div className="flex items-center justify-center gap-x-10">
                {/* temp */}
                <div className="text-[100px]">
                  {parseInt(data.main.temp)}&deg;C
                </div>
                {/* max and min temp */}
                <div>
                  <div className="text-[30px]">{data.main.temp_max}&deg;C</div>
                  <hr />
                  <div className="text-[30px]">{data.main.temp_min}&deg;C</div>
                </div>
              </div>
              {/* weather description */}
              <div className="capitalize text-center text-[20px]">
                {data.weather[0].description}
              </div>
            </div>
            {/* card bottom */}
            <div className="max-w-[378px] mx-auto flex flex-col gap-y-6">
              <div className="flex justify-between">
                <div className="flex items-center gap-x-2">
                  {/* Icon */}
                  <div className="text-[20px]">
                    <BsEye />
                  </div>
                  <div>
                    Visibility{" "}
                    <span className="ml-2">{data.visibility / 1000} km</span>
                  </div>
                </div>
                <div className="flex items-center gap-x-2">
                  {/* Icon */}
                  <div className="text-[20px]">
                    <BsThermometer />
                  </div>
                  <div>
                    Feels like{" "}
                    <span className="ml-2">
                      {parseInt(data.main.feels_like)}&deg;C
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-x-2">
                  {/* Icon */}
                  <div className="text-[20px]">
                    <BsWater />
                  </div>
                  <div>
                    Humidity{" "}
                    <span className="ml-2">{data.main.humidity} %</span>
                  </div>
                </div>
                <div className="flex items-center gap-x-2">
                  {/* Icon */}
                  <div className="text-[20px]">
                    <BsWind />
                  </div>
                  <div>
                    Wind <span className="ml-2">{data.wind.speed} m/s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
