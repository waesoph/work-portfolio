import { Link } from 'react-router-dom'
import bannerImg from '../assets/images/banner.webp'

export default function Hero() {
    return (
        <section className="flex flex-col gap-6 w-full py-12 lg:py-25 text-center relative bg-center bg-cover" style={{ backgroundImage: `url(${bannerImg})` }}>
            <div className="absolute bg-black/70 inset-0 w-full h-full z-0"></div>
            <div className="flex flex-col z-2">
                <h1 className="text-4xl font-semibold tracking-tight sm:text-8xl text-white">
                Will Aesoph
                </h1>
                <p className="text-4xl font-semibold tracking-tight sm:text-8xl text-white">Professional Web Developer</p>
                <Link className="text-semibold text-xl sm:text-2xl border border-white rounded-2xl w-fit py-4 px-8 mx-auto mt-10" to="/contact#contact" >Contact</Link>
            </div>
        </section>
    )
}