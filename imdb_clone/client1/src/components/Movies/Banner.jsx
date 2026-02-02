import axios from "axios";
import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./myCarouselStyles.css";

function Banner() {
  let [slides, setSlides] = useState([]);

  useEffect(() => {
    (async () => {
      let result = await axios.get("https://kitsu.io/api/edge/trending/anime");
      setSlides(result.data.data);
    })();
  }, []);

  return (
    <>
      <div>
        <Carousel
          showThumbs={false}
          autoPlay
          infiniteLoop
          interval={2650}
          showStatus={false}
          transitionTime={700}
          showArrows={true}
        >
          {slides.map((item, index) => (
            <div
              key={index}
              className="relative flex items-end justify-start mx-auto  h-[70vh] lg:w-[90vw] bg-no-repeat"
            >
              <img
                loading="lazy"
                src={item.attributes.coverImage["original"]}
                alt="poster"
                className="absolute inset-0 w-full h-full object-fill"
              />
              <div className="absolute pl-[30px] py-[10px] mb-[10px] text-3xl w-full text-white bg-[rgba(0,0,0,0.6)]">
                {item.attributes.titles["en_jp"]}
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </>
  );
}

export default Banner;
