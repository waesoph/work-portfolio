import ArrowBack from "../assets/icons/arrow-back.svg?react";
import ArrowForward from "../assets/icons/arrow-forward.svg?react";
import Slider from "react-slick";

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      className={`${className} z-10 flex !h-full !w-15 !right-0 items-center before:!content-none justify-center px-3 py-2 !bg-black/35 backdrop-blur-[1px] duration-300 hover:!bg-black/55 group`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    >
      <ArrowForward className="h-15 w-15 text-slate-100/90 group-hover:text-slate-50 duration-300" />
    </button>
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      className={`${className} z-10 flex !h-full !w-15 !left-0 items-center before:!content-none justify-center px-3 py-2 !bg-black/35 backdrop-blur-[1px] duration-300 hover:!bg-black/55 group`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    >
      <ArrowBack className="h-15 w-15 text-slate-100/90 group-hover:text-slate-50 duration-300" />
    </button>
  );
}

export default function ServicesSlider({ images = [] }) {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
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
