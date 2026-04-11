import { Link } from 'react-router-dom'

export default function Hero({ title }) {
    const hasTitleOnlyMode = Boolean(title)

    return (
        <section
            className={`flex w-full flex-col bg-black ${
                hasTitleOnlyMode
                    ? 'h-[220px] items-start justify-center px-6 py-0 text-left lg:px-12'
                    : 'gap-4 py-14 text-center lg:py-18'
            }`}
        >
            <div className={`flex flex-col justify-center ${hasTitleOnlyMode ? 'items-start' : 'items-center'}`}>
                {hasTitleOnlyMode ? (
                    <h1 className="text-6xl font-semibold tracking-tight text-white sm:text-8xl lg:text-[7rem]">
                        {title}
                    </h1>
                ) : (
                    <>
                        <h1 className="text-6xl font-semibold tracking-tight text-white sm:text-8xl lg:text-[7rem]">
                            Will Aesoph
                        </h1>
                        <p className="text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">Professional Web Developer</p>
                        <Link className="text-semibold text-xl sm:text-2xl border border-white rounded-2xl w-fit py-4 px-8 mx-auto mt-10" to="/contact#contact" >Contact</Link>
                    </>
                )}
            </div>
        </section>
    )
}
