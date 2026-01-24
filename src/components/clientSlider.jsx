import React, { Component } from "react";
import ArrowBack from '../assets/icons/arrow-back.svg?react'
import ArrowForward from '../assets/icons/arrow-forward.svg?react'
import { Link } from 'react-router-dom'
import { clients } from '../assets/images/clients'
import Slider from "react-slick";

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      className={`${className} flex !h-full !bg-slate-200 !w-15 !-right-16 items-center text-red before:!content-none justify-center px-3 py-2 duration-300 hover:!bg-slate-800 group`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    >
      <ArrowForward className="h-15 w-15 text-slate-900 group-hover:text-slate-200 duration-300" />
    </button>
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      className={`${className} flex !h-full !bg-slate-200 !w-15 !-left-16 items-center text-red before:!content-none justify-center px-3 py-2 duration-300 hover:!bg-slate-800 group`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    >
      <ArrowBack className="h-15 w-15 text-slate-900 group-hover:text-slate-200 duration-300" />
    </button>
  );
}

export default function ClientSlider() {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]     
  };
  return (
    <div className="slider-container">
      <Slider {...settings}>
        {clients.map((client) => (
          <div key={client.name} className="relative bg-slate-200 group h-50">
            <div className="flex flex-col items-center justify-center w-full h-full gap-4 border-black border p-4">
              <img src={client.logo} alt={`${client.name} logo`} className="h-1/3 max-w-2/3 object-contain" />
              <h3 className="text-lg lg:text-xl font-semibold text-slate-950">{client.name}</h3>
            </div>
            <div className="absolute left-0 -top-full group-hover:top-0 h-1/2 duration-300 w-full bg-black/70 p-6 text-left ">
              <h4 className="text-lg font-semibold">Projects Completed:</h4>
              <ul className="opacity-0 group-hover:opacity-100 !duration-400 group-hover:delay-400">
                {client.work.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="p-6 absolute left-0 -bottom-full group-hover:bottom-0 h-1/2 duration-300 w-full bg-black/70 flex justify-between">
              {client.url ? (
                <Link
                  target="_blank"
                  rel="noreferrer"
                  to={client.url}
                  className="h-auto flex justify-center items-center rounded-2xl py-4 px-8 bg-amber-50 text-black opacity-0 group-hover:opacity-100 !duration-400"
                >
                  Visit {client.name}
                </Link>
              ) : null}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
