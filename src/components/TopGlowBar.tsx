const TopGlowBar = () => {
  return (
    <div className="relative w-full h-20 mb-8 -mx-0 md:-mx-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b0f] via-[#0c0c1a] to-transparent opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.05)_0%,_transparent_70%)]" />
    </div>
  )
}

export default TopGlowBar

