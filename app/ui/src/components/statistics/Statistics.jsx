import React, { useEffect } from "react";


import monitorIcon from "../../assets/icons/monitor-icon.png";
import laptopIcon from "../../assets/icons/laptop-icon.png";
import requestIcon from "../../assets/icons/request-icon.png";
import codeIcon from "../../assets/icons/code-icon.png";
import microservicesIcon from "../../assets/icons/microservices-icon.png";

const Statistics = () => {
  const counters = [
    {
      id: 1,
      countUpto: 512,
      countingSpeed: 800,
      icon: requestIcon,
      iconAltText: "icon",
      title: "Requests Per Second",
    },
    {
      id: 2,
      countUpto: 10,
      countingSpeed: 800,
      icon: codeIcon,
      iconAltText: "icon",
      title: "Concurrent Submissions",
    },
    // {
    //   id: 3,
    //   countUpto: 10,
    //   countingSpeed: 800,
    //   icon: microservicesIcon,
    //   iconAltText: "icon",
    //   title: "Microservices",
    // },
    // {
    //   id: 4,
    //   countUpto: 2000,
    //   countingSpeed: 800,
    //   icon: laptopIcon,
    //   iconAltText: "icon",
    //   title: "Animated Videos",
    // },
  ]


  useEffect(() => {

    const animateCounter = (element, countTo) => {
      let start = 0;
      const duration = parseInt(element.getAttribute("data-speed"));
      const increment = countTo / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= countTo) {
          start = countTo;
          clearInterval(timer);
        }
        element.innerText = Math.floor(start);
      }, 16);
    };

    const animateNumbersCounting = () => {

      const countersElement = document.getElementById("counters");

      // Check if we have Scrolled Upto the element which have counters in it
      if (countersElement && (countersElement.offsetTop - window.innerHeight) < window.scrollY) {

        const counters = document.querySelectorAll(".count");
        console.log(counters);
        counters.forEach(element => {
          const countUpto = parseInt(element.getAttribute("data-target"));
          animateCounter(element, countUpto);
        });

        // Remove Event Listener only when we Started Counting
        window.removeEventListener("scroll", animateNumbersCounting);
      }

    };

    window.addEventListener("scroll", animateNumbersCounting);
  }, []);

  return <>
    {/* Statistics Section - Starts Here */}
      <div className="mx-auto md:px-4 w-full py-13">
        <ul className="mx-auto w-fit px-8 flex flex-col lg:flex-row gap-8 lg:gap-16 flex-wrap" id="counters">
          {counters.map((item) => (
            <li key={item.id} className="flex flex-col mb-12 lg:flex-row items-center justify-center text-center lg:text-left lg:items-start">
              <img src={item.icon} alt={item.iconAltText} className='object-cover w-12 pb-4 lg:pb-0 md:me-7' />
              <div className="text-wrap w-full">
                <div className="text-2xl font-medium flex flex-row gap-0 justify-center lg:justify-start items-center">
                <h3 data-target={item.countUpto} data-speed={item.countingSpeed} className="count text-2xl font-medium">
                  0
                </h3>
                +
                </div>
                <p className="text-[#6f6f6f] pri-font text-sm/[24px] uppercase">
                  {item.title}
                </p>
              </div>
            </li>
          ))}

        </ul>
      </div>
    {/* Statistics Section - Ends Here */}
  </>;
};

export default Statistics;