const fs = require('fs');
let code = fs.readFileSync('src/components/PauseModal.tsx', 'utf8');

const target = `            <button
              id="btn-pause-change-memory"
              onClick={onChangeMemory}
              className="w-full py-3 px-4 bg-[#F3ECE4] hover:bg-[#EAE1D7] active:scale-[0.98] text-[#5C534B] font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 font-display cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#8C7A6B]" />
              <span>Change Photo Memory</span>
            </button>

            {/* Sound Toggle */}
            <div className="pt-2">
              <button
                id="btn-pause-toggle-sound"`;

const replacement = `            <button
              id="btn-pause-change-memory"
              onClick={onChangeMemory}
              className="w-full py-3 px-4 bg-[#F3ECE4] hover:bg-[#EAE1D7] active:scale-[0.98] text-[#5C534B] font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 font-display cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#8C7A6B]" />
              <span>Change Photo Memory</span>
            </button>
          </div>
          
          <div className="mt-4 pt-4 border-t border-[#E8DFC8]">
            <p className="text-xs font-semibold text-[#8C7A6B] mb-3 uppercase tracking-wider">
              Background Theme
            </p>
            <div className="flex items-center justify-center gap-3">
              {BACKGROUND_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => onThemeChange(theme.id)}
                  className={\`w-8 h-8 rounded-full transition-transform shadow-xs cursor-pointer \${
                    currentBgTheme === theme.id ? 'scale-125 ring-2 ring-offset-2 ring-[#2D2A26]' : 'hover:scale-110'
                  }\`}
                  style={{ background: theme.swatchBackground || theme.color }}
                  title={theme.name}
                  aria-label={\`Select \${theme.name} theme\`}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#E8DFC8]">
            {/* Sound Toggle */}
            <div className="flex justify-center">
              <button
                id="btn-pause-toggle-sound"`;

if (code.includes(target)) {
  fs.writeFileSync('src/components/PauseModal.tsx', code.replace(target, replacement));
  console.log("Success");
} else {
  console.log("Target not found");
}
