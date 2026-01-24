import React from "react";
import Slider from "react-slick";

export default function ServicesSlider({ images = [] }) {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,  
  };
  return (
    <div className="slider-container">
      <Slider {...settings}>
        {images.map((image) => (
            <img key={image.alt ?? image.image} src={image.image} alt={image.alt} />
        ))}
      </Slider>
    </div>
  );
}
