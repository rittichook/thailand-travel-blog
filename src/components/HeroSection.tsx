export function HeroSection() {
  return (
    <section className="relative h-[88vh] min-h-[560px] flex items-end overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1920&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="relative z-10 w-full px-4 pb-20">
        <div className="container mx-auto">
          <p className="text-white/70 text-sm tracking-[0.2em] uppercase mb-4">
            Thailand Travel Guide
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-4 text-white max-w-2xl">
            ค้นพบสถานที่ท่องเที่ยวทั่วไทย
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-xl font-light">
            บทความและรีวิวสถานที่ท่องเที่ยว ครอบคลุมทุกจังหวัดทั่วประเทศ
          </p>
        </div>
      </div>
    </section>
  )
}
