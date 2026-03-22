export default function PhoneMockup() {
  return (
    <div className="relative w-full md:w-96 h-[480px] md:h-[980px] rounded-[3rem] border-4 border-foreground bg-white flex flex-col overflow-hidden shadow-2xl">
      {/* notch */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full bg-black z-10" />
      {/* screen content */}
      <div className="flex flex-col h-full pt-12 px-5 pb-4 gap-4">
        {/* balance */}
        <div className="flex flex-col gap-1">
          <p className="text-[10px] text-black/40 uppercase tracking-widest">Balance</p>
          <p className="text-3xl font-bold text-black">$1,284.50</p>
          <p className="text-[9px] text-black/30 font-mono">0x1a2b…9f3c</p>
        </div>
      </div>
      {/* home indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-black/20" />
    </div>
  )
}
