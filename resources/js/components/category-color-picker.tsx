import { Palette } from 'lucide-react';
import { useEffect, useState } from 'react';

export const CATEGORY_COLOR_SWATCHES = ['#3d8ab8', '#16a34a', '#e75f1a', '#9f6fd5', '#dc2626', '#0891b2', '#ca8a04', '#db2777'];

interface CategoryColorPickerProps {
    value: string | null;
    onChange: (color: string | null) => void;
    allowAuto?: boolean;
}

function isHexColor(value: string): boolean {
    return /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(value);
}

export function CategoryColorPicker({ value, onChange, allowAuto = false }: CategoryColorPickerProps) {
    const isPreset = value !== null && CATEGORY_COLOR_SWATCHES.includes(value);
    const [showCustom, setShowCustom] = useState(() => value !== null && !isPreset);
    const [customInput, setCustomInput] = useState(value && !isPreset ? value : '#000000');

    useEffect(() => {
        if (value && !CATEGORY_COLOR_SWATCHES.includes(value)) {
            setShowCustom(true);
            setCustomInput(value);
        } else if (value && CATEGORY_COLOR_SWATCHES.includes(value)) {
            setShowCustom(false);
        }
    }, [value]);

    const handleCustomHexChange = (hex: string) => {
        setCustomInput(hex);
        if (isHexColor(hex)) {
            onChange(hex);
        }
    };

    return (
        <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--subheading)]">Warna Kategori</label>
            <div className="flex flex-wrap items-center gap-3">
                {allowAuto && (
                    <button
                        type="button"
                        aria-label="Warna otomatis"
                        onClick={() => onChange(null)}
                        className={`flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed text-[10px] font-semibold transition ${
                            !value
                                ? 'border-[var(--subheading)] text-[var(--subheading)]'
                                : 'border-[var(--border-strong)] text-[var(--grey-text)] hover:border-[var(--subheading)]'
                        }`}
                    >
                        Auto
                    </button>
                )}

                {CATEGORY_COLOR_SWATCHES.map((color) => (
                    <button
                        key={color}
                        type="button"
                        aria-label={`Pilih warna ${color}`}
                        onClick={() => {
                            setShowCustom(false);
                            onChange(color);
                        }}
                        className={`h-11 w-11 rounded-full transition ${value === color ? 'ring-4 ring-offset-2' : 'hover:scale-105'}`}
                        style={{ backgroundColor: color, ['--tw-ring-color' as any]: color }}
                    />
                ))}

                <button
                    type="button"
                    aria-label="Warna custom"
                    onClick={() => {
                        setShowCustom(true);
                        if (isHexColor(customInput)) onChange(customInput);
                    }}
                    className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition ${
                        showCustom ? 'border-[var(--subheading)] ring-4 ring-offset-2' : 'border-[var(--border-strong)] hover:scale-105'
                    }`}
                    style={
                        showCustom
                            ? { backgroundColor: customInput, ['--tw-ring-color' as any]: customInput }
                            : { background: 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)' }
                    }
                >
                    {!showCustom && <Palette className="h-5 w-5 text-white drop-shadow" />}
                </button>
            </div>

            {showCustom && (
                <div className="mt-3 flex items-center gap-2">
                    <input
                        type="color"
                        aria-label="Pilih warna custom lewat color picker"
                        value={isHexColor(customInput) ? customInput : '#000000'}
                        onChange={(e) => handleCustomHexChange(e.target.value)}
                        className="h-10 w-10 cursor-pointer rounded-lg border border-[var(--border-strong)] p-0.5"
                    />
                    <input
                        type="text"
                        aria-label="Kode warna hex custom"
                        value={customInput}
                        onChange={(e) => handleCustomHexChange(e.target.value)}
                        placeholder="#RRGGBB"
                        maxLength={7}
                        className="h-10 flex-1 rounded-lg border border-[var(--border-strong)] px-3 text-sm uppercase focus-visible:ring-1 focus-visible:ring-[var(--subheading)] focus-visible:outline-none"
                    />
                </div>
            )}
        </div>
    );
}
