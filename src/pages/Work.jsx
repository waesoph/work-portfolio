import ClientSlider from '../components/clientSlider';

export default function Work() {
  return (
    <div className="container section">
      <h1 className="mb-8 text-4xl font-semibold tracking-tight sm:text-5xl">
        Work
      </h1>
      <section>
      <div className="section container">
        <h2 className="text-2xl lg:text-4xl font-semibold mb-8 lg:mb-12">Brands I've Worked With</h2>
        <ClientSlider />     
      </div>
      </section>
    </div>
  )
}
