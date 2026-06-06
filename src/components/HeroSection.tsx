export function HeroSection() {
  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center animate-ken-burns will-change-transform"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1920&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg animate-fade-in-up">
          ค้นพบสถานที่ท่องเที่ยวทั่วไทย
        </h1>
        <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto drop-shadow animate-fade-in-up [animation-delay:200ms]">
          บทความและรีวิวสถานที่ท่องเที่ยว ครอบคลุมทุกจังหวัดทั่วประเทศ
        </p>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/80 animate-fade-in [animation-delay:900ms]">
        <span className="block text-2xl animate-float">⌄</span>
      </div>
    </section>
  )
}
