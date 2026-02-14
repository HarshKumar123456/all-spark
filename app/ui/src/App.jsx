import React from "react";
import Layout from "./components/layout/Layout";
import techCubeImage from "./assets/images/tech-cube.png";
import { Link } from "react-router-dom";
import Heading from "./components/heading/Heading";
import FeatureBox from "./components/feature/FeatureBox";

import gearsIconSVG from "./assets/icons/gears-icon.svg";
import infinityIconSVG from "./assets/icons/infinity-icon.svg";
import keyholeIconSVG from "./assets/icons/keyhole-icon.svg";
import serverIconSVG from "./assets/icons/server-icon.svg";

const App = () => {

  const features = [
    {
      name: "Open Source",
      description: "Code is Available on GitHub for Everyone to collaborate and improve this software",
      imageInfo: {
        url: keyholeIconSVG,
        altText: "Open Source Feature Icon"
      },
    },

    {
      name: "Self Hostable",
      description: "You can deploy on your own infra with just a click",
      imageInfo: {
        url: serverIconSVG,
        altText: "Self Hostable Feature Icon"
      },
    },


    {
      name: "Event Driven",
      description: "Powers development flexibility, feature addition made quicker and easier",
      imageInfo: {
        url: gearsIconSVG,
        altText: "Distributed Event Driven Feature Icon"
      },
    },


    {
      name: "Scalable",
      description: "With microservices' architecture it can scale upto your needs",
      imageInfo: {
        url: infinityIconSVG,
        altText: "Distributed Event Driven Feature Icon"
      },
    },

  ];

  return (
    <>
      <Layout>

        {/* Hero Section - Starts Here */}
        <div className="flex flex-row items-center px-8 lg:px-16 py-16 lg:py-8">

          {/* Brief Info Section - Starts Here */}
          <div className="lg:w-1/2 mx-auto flex flex-col gap-16 lg:gap-20 lg:px-24">

            <div className="text-left flex flex-col justify-center gap-2">
              <h1 className="text-3xl lg:text-5xl poppins-semibold black-100-text">
                Open source
              </h1>
              <h2 className="text-xl lg:text-2xl block poppins-semibold">
                <span className="primary-gradient-text">
                  Self Hostable
                </span>
              </h2>
              <h2 className="text-xl lg:text-2xl poppins-regular">
                Distributed Event Driven
              </h2>
              <h2 className="text-2xl lg:text-4xl poppins-medium black-100-text">
                Code Execution Platform
              </h2>
            </div>


            <Link to={"/login"}>
              <button className="transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] bg-[#135BEB] cursor-pointer py-3 lg:py-4 px-18 lg:px-20 text-xl lg:text-2xl text-white rounded-full poppins-semibold custom-smooth-drop-shadow">
                Get Started
              </button>
            </Link>

          </div>

          {/* Brief Info Section - Ends Here */}


          {/* Image Section - Starts Here */}
          <div className="hidden lg:w-1/2 lg:flex flex-col items-center">
            <img src={techCubeImage} alt="decorative image showing the technology illustration via a cube bursting out" className="object-fill rounded-lg" />
          </div>
          {/* Image Section - Ends Here */}

        </div>
        {/* Hero Section - Ends Here */}



        {/* Features Section - Starts Here */}
        <div className="my-12 lg:my-24 px-4 lg:px-16 py-4 lg:py-8 flex flex-col gap-8">

          <Heading
            text={"Features"}
          />

          <div className="flex flex-row flex-wrap justify-center items-center gap-12">

            {features.map((feature, index) => {
              return <FeatureBox
                key={`feature-${index}`}
                name={feature.name}
                description={feature.description}
                imageInfo={feature.imageInfo}
              />;
            })}

          </div>

        </div>
        {/* Features Section - Ends Here */}
      </Layout>
    </>
  )
}

export default App;
