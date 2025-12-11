import headshotImg from '../assets/headshot.jpg'

export default function Home() {
  return (
    <section className="flex flex-col gap-6 container section text-center">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        Welcome to my work portfolio
      </h1>
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        <p className="text-left text-lg lg:text-2xl">
          I am a Canadian web developer from British Columbia, with years of experience building websites for clients of all sizes.
          This text is just a placeholder for now but needs to be long enough in order to be styled properly.
        </p>
        <img src={headshotImg} alt="Headshot of Will Aesoph" className="rounded-full w-1/2" />
      </div>
    </section>
  )
}
