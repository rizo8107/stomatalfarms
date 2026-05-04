const avatars = ["P", "R", "A", "K"];
const avatarColors = ["#4f7a2e", "#2e4e18", "#6a7462", "#8a5a2e"];

const SocialProofBar = () => (
  <div className="w-full bg-[#fffbf5] border-b border-[rgba(46,63,37,0.10)] py-3 px-4">
    <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 flex-wrap">
      {/* Overlapping avatars */}
      <div className="flex -space-x-2">
        {avatars.map((initial, i) => (
          <div
            key={i}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold ring-2 ring-[#fffbf5]"
            style={{ background: avatarColors[i] }}
          >
            {initial}
          </div>
        ))}
      </div>
      {/* Stars */}
      <div className="flex items-center gap-1.5">
        <span className="text-sm" style={{ color: "#c9a05a" }}>★★★★★</span>
        <span className="text-sm font-bold text-[#1e2519]">4.9</span>
      </div>
      <span className="text-sm text-[#6a7462] font-medium">
        1,200+ happy customers · 500+ orders this month
      </span>
    </div>
  </div>
);

export default SocialProofBar;
