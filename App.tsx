import React, { useState, useEffect } from 'react';
import { generatePalette, generateRandomColor, getContrastYIQ, ColorScheme, getHarmoniousColor, generateHarmony, getContrastRatio } from './utils/colorGenerator';
import { Palette, AppState } from './types';
import { UiExampleGrid } from './components/Previews';
import {
    RefreshCw, Copy, Download, Grid, Plus, Trash2,
    Check, Sliders, Lock, Unlock, Palette as PaletteIcon, Code, X,
    Sun, Moon
} from 'lucide-react';

const INITIAL_COLOR = '#3b82f6'; // Blue-500

// --- Components defined outside App to prevent re-renders ---

const PaletteInput = ({
    label,
    color,
    onChange,
    locked,
    onToggleLock
}: {
    label: string,
    color: string,
    onChange: (c: string) => void,
    locked?: boolean,
    onToggleLock?: () => void
}) => (
    <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-slate-700">{label}</label>
            <span className="text-xs font-mono text-slate-400 uppercase">{color}</span>
        </div>
        <div className="flex gap-2">
            <div className="relative flex-1 h-12 rounded-lg border border-slate-200 shadow-sm bg-white flex items-center px-3 gap-3 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-shadow">
                {/* Color Swatch Trigger */}
                <div className="relative w-8 h-8 flex-shrink-0 cursor-pointer group">
                    <div
                        className="w-full h-full rounded-full border border-slate-200 shadow-sm transition-transform group-hover:scale-110"
                        style={{ backgroundColor: color }}
                    ></div>
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => onChange(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                </div>

                {/* Text Input */}
                <input
                    type="text"
                    value={color}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 bg-transparent border-none text-sm text-slate-800 focus:ring-0 p-0 font-medium uppercase tracking-wide placeholder-slate-400"
                    placeholder="#000000"
                />

                {onToggleLock && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleLock(); }}
                        className="text-slate-400 hover:text-slate-600 p-1 transition-colors"
                    >
                        {locked ? <Lock size={14} /> : <Unlock size={14} />}
                    </button>
                )}
            </div>
        </div>
    </div>
);

const PaletteRow = ({
    name,
    palette,
    onCopy
}: {
    name: string,
    palette: Palette,
    onCopy: (text: string) => void
}) => {
    const [localCopied, setLocalCopied] = useState<string | null>(null);

    const handleCopy = (text: string) => {
        onCopy(text);
        setLocalCopied(text);
        setTimeout(() => setLocalCopied(null), 1500);
    };

    return (
        <div className="mb-8">
            <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                {name} <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Click to copy HEX</span>
            </h3>
            <div className="grid grid-cols-11 gap-2">
                {(Object.entries(palette) as [string, string][]).map(([shade, hex]) => {
                    const contrast = getContrastYIQ(hex);
                    const isWhite = contrast === 'white';
                    const textColorClass = isWhite ? 'text-white' : 'text-slate-900';
                    const subTextColorClass = isWhite ? 'text-white/60' : 'text-slate-900/40';

                    return (
                        <div
                            key={shade}
                            className="group relative aspect-[3/4] rounded-lg cursor-pointer hover:z-10 hover:scale-110 transition-all duration-200 shadow-sm hover:shadow-xl flex flex-col justify-end p-2"
                            style={{ backgroundColor: hex }}
                            onClick={() => handleCopy(hex)}
                        >
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {localCopied === hex ? <Check size={14} className={textColorClass} /> : <Copy size={12} className={textColorClass} />}
                            </div>

                            <div className="flex flex-col">
                                <span className={`text-[10px] font-bold ${textColorClass} mb-0.5`}>{shade}</span>
                                <span className={`text-[9px] font-mono ${subTextColorClass} uppercase opacity-100`}>{hex}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

type ExportFormat = 'tailwind3' | 'tailwind4' | 'css' | 'scss' | 'json';

const ExportModal = ({
    show,
    onClose,
    primary,
    secondary,
    hasSecondary,
    onCopy
}: {
    show: boolean,
    onClose: () => void,
    primary: Palette,
    secondary: Palette,
    hasSecondary: boolean,
    onCopy: (text: string) => void
}) => {
    const [format, setFormat] = useState<ExportFormat>('tailwind3');
    const [copied, setCopied] = useState(false);

    if (!show) return null;

    const getCode = () => {
        switch (format) {
            case 'tailwind3':
                return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
${Object.entries(primary).map(([k, v]) => `          '${k}': '${v}',`).join('\n')}
        }${hasSecondary ? `,
        secondary: {
${Object.entries(secondary).map(([k, v]) => `          '${k}': '${v}',`).join('\n')}
        }` : ''}
      }
    }
  }
}`;
            case 'tailwind4':
                return `/* CSS (Tailwind 4 / Main stylesheet) */
@theme {
${Object.entries(primary).map(([k, v]) => `  --color-primary-${k}: ${v};`).join('\n')}
${hasSecondary ? Object.entries(secondary).map(([k, v]) => `  --color-secondary-${k}: ${v};`).join('\n') : ''}
}`;
            case 'css':
                return `:root {
  /* Primary */
${Object.entries(primary).map(([k, v]) => `  --color-primary-${k}: ${v};`).join('\n')}

  ${hasSecondary ? `/* Secondary */
${Object.entries(secondary).map(([k, v]) => `  --color-secondary-${k}: ${v};`).join('\n')}` : ''}
}`;
            case 'scss':
                return `// Primary
${Object.entries(primary).map(([k, v]) => `$color-primary-${k}: ${v};`).join('\n')}

${hasSecondary ? `// Secondary
${Object.entries(secondary).map(([k, v]) => `$color-secondary-${k}: ${v};`).join('\n')}` : ''}`;
            case 'json':
                return JSON.stringify({
                    primary,
                    ...(hasSecondary ? { secondary } : {})
                }, null, 2);
            default: return '';
        }
    };

    const code = getCode();

    const handleCopy = () => {
        onCopy(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    const tabs: { id: ExportFormat, label: string, badge?: string }[] = [
        { id: 'tailwind3', label: 'Tailwind 3', badge: 'free' },
        { id: 'tailwind4', label: 'Tailwind 4', badge: 'free' },
        { id: 'css', label: 'CSS' },
        { id: 'scss', label: 'SCSS' },
        { id: 'json', label: 'SVG / Figma' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[600px] overflow-hidden flex flex-col scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800">Export code</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-64 border-r border-slate-100 p-4 bg-slate-50 flex flex-col gap-1 overflow-y-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setFormat(tab.id)}
                                className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between group ${format === tab.id
                                    ? 'bg-white shadow-sm text-slate-900 ring-1 ring-slate-200'
                                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                                    }`}
                            >
                                <span>{tab.label}</span>
                                {tab.badge && (
                                    <span className="text-[10px] font-bold text-slate-400 border border-slate-200 px-1.5 rounded-full bg-white">{tab.badge}</span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Code Area */}
                    <div className="flex-1 bg-white flex flex-col relative">
                        <div className="absolute top-4 right-4 z-10">
                            <button
                                onClick={handleCopy}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg ${copied
                                    ? 'bg-green-500 text-white'
                                    : 'bg-slate-900 text-white hover:bg-slate-800'
                                    }`}
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                {copied ? 'Copied!' : 'Copy to clipboard'}
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-6">
                            <pre className="font-mono text-sm text-slate-600 whitespace-pre">
                                {code}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PaletteEditorModal = ({
    show,
    onClose,
    primary,
    secondary,
    hasSecondary,
    onUpdateShade
}: {
    show: boolean,
    onClose: () => void,
    primary: Palette,
    secondary: Palette,
    hasSecondary: boolean,
    onUpdateShade: (palette: 'primary' | 'secondary', shade: string, hex: string) => void
}) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Palette Editor</h2>
                        <p className="text-xs text-slate-500">Fine-tune individual shades.</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Primary Palette */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary-500"></span> Primary Palette
                            </h3>
                            <div className="space-y-3">
                                {Object.entries(primary).map(([shade, hex]) => (
                                    <div key={`p-${shade}`} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                                        <div className="w-10 h-10 rounded-md shadow-inner border border-slate-100" style={{ backgroundColor: hex }}></div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-bold text-slate-500">{shade}</span>
                                                <span className="text-[10px] font-mono text-slate-400 uppercase">{hex}</span>
                                            </div>
                                            <input
                                                type="color"
                                                value={hex}
                                                onChange={(e) => onUpdateShade('primary', shade, e.target.value)}
                                                className="w-full h-6 rounded cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Secondary Palette */}
                        {hasSecondary && (
                            <div>
                                <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-secondary-500"></span> Secondary Palette
                                </h3>
                                <div className="space-y-3">
                                    {Object.entries(secondary).map(([shade, hex]) => (
                                        <div key={`s-${shade}`} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                                            <div className="w-10 h-10 rounded-md shadow-inner border border-slate-100" style={{ backgroundColor: hex }}></div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs font-bold text-slate-500">{shade}</span>
                                                    <span className="text-[10px] font-mono text-slate-400 uppercase">{hex}</span>
                                                </div>
                                                <input
                                                    type="color"
                                                    value={hex}
                                                    onChange={(e) => onUpdateShade('secondary', shade, e.target.value)}
                                                    className="w-full h-6 rounded cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    const [state, setState] = useState<AppState>({
        primary: {
            hex: INITIAL_COLOR,
            name: 'Primary',
            palette: generatePalette(INITIAL_COLOR)
        },
        secondary: {
            hex: '#ec4899',
            name: 'Secondary',
            palette: generatePalette('#ec4899')
        },
        hasSecondary: false
    });

    const [showExport, setShowExport] = useState(false);
    const [showContrast, setShowContrast] = useState(false);
    const [showEditor, setShowEditor] = useState(false);
    const [colorScheme, setColorScheme] = useState<ColorScheme>('auto');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [contrastView, setContrastView] = useState<'p-p' | 's-s' | 'p-s' | 's-p'>('p-p');

    // Update CSS Variables
    useEffect(() => {
        const root = document.documentElement;

        // Primary Colors
        Object.entries(state.primary.palette).forEach(([shade, hex]) => {
            root.style.setProperty(`--color-primary-${shade}`, hex as string);
        });

        // Secondary Colors
        if (state.hasSecondary) {
            Object.entries(state.secondary.palette).forEach(([shade, hex]) => {
                root.style.setProperty(`--color-secondary-${shade}`, hex as string);
            });
        } else {
            // If no secondary, MAP secondary CSS vars to PRIMARY values.
            // This ensures consistent look for single-color usage.
            Object.entries(state.primary.palette).forEach(([shade, value]) => {
                root.style.setProperty(`--color-secondary-${shade}`, value as string);
            });
        }

    }, [state.primary.palette, state.secondary.palette, state.hasSecondary]);

    // Dark Mode Logic
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    // Handle Automatic Harmony
    useEffect(() => {
        if (colorScheme !== 'auto' && state.hasSecondary) {
            const newSecondaryHex = getHarmoniousColor(state.primary.hex, colorScheme);
            if (newSecondaryHex !== state.secondary.hex) {
                setState(s => ({
                    ...s,
                    secondary: { ...s.secondary, hex: newSecondaryHex, palette: generatePalette(newSecondaryHex) }
                }));
            }
        }
    }, [state.primary.hex, colorScheme, state.hasSecondary]);

    const updatePrimary = (hex: string) => {
        setState(s => ({
            ...s,
            primary: { ...s.primary, hex, palette: generatePalette(hex) }
        }));
    };

    const updateSecondary = (hex: string) => {
        setState(s => ({
            ...s,
            secondary: { ...s.secondary, hex, palette: generatePalette(hex) }
        }));
    };

    const updateShade = (palette: 'primary' | 'secondary', shade: string, hex: string) => {
        setState(s => ({
            ...s,
            [palette]: {
                ...s[palette],
                palette: {
                    ...s[palette].palette,
                    [shade]: hex
                }
            }
        }));
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">

            {/* Sidebar Controls */}
            <aside className="w-full md:w-[380px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-auto md:h-screen overflow-y-auto relative md:sticky top-0 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)] scrollbar-hide">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-slate-900 font-bold text-lg shadow-lg shadow-slate-900/20">UI</div>
                            <h1 className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Colors</h1>
                        </div>
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Tailwind CSS Color Generator</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Instantly create stunning color scales by entering a base color.</p>
                    </div>

                    <PaletteInput
                        label="Primary"
                        color={state.primary.hex}
                        onChange={updatePrimary}
                    />

                    <button
                        onClick={() => updatePrimary(generateRandomColor())}
                        className="w-full py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 font-medium hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 mb-6 shadow-sm group"
                    >
                        <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" /> Generate random
                    </button>

                    {!state.hasSecondary ? (
                        <button
                            onClick={() => setState(s => ({ ...s, hasSecondary: true }))}
                            className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 hover:translate-y-[-1px]"
                        >
                            <Plus size={16} /> Add secondary color scale
                        </button>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-300 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-secondary-500"></span> Secondary Scale
                                </span>
                                <button
                                    onClick={() => setState(s => ({ ...s, hasSecondary: false }))}
                                    className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
                                    title="Remove secondary color"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            <PaletteInput
                                label="Secondary Color"
                                color={state.secondary.hex}
                                onChange={updateSecondary}
                            />

                            <div className="mb-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Harmony Scheme</label>
                                <div className="relative">
                                    <select
                                        value={colorScheme}
                                        onChange={(e) => setColorScheme(e.target.value as ColorScheme)}
                                        className="w-full appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 pl-3 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer hover:border-slate-300 transition-colors"
                                    >
                                        <option value="auto">Manual / Auto</option>
                                        <option value="complementary">Complementary</option>
                                        <option value="analogous">Analogous</option>
                                        <option value="triadic">Triadic</option>
                                        <option value="split">Split Complementary</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                                        <Sliders size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <button onClick={() => setShowExport(true)} className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:-translate-y-1 transition-all text-slate-600 dark:text-slate-400 border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                            <Download size={20} className="text-slate-400 dark:text-slate-500" />
                            <span className="text-[11px] font-bold">Export</span>
                        </button>
                        <button onClick={() => setShowContrast(true)} className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:-translate-y-1 transition-all text-slate-600 dark:text-slate-400 border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                            <Grid size={20} className="text-slate-400 dark:text-slate-500" />
                            <span className="text-[11px] font-bold">Contrast</span>
                        </button>
                        <button onClick={() => setShowEditor(true)} className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:-translate-y-1 transition-all text-slate-600 dark:text-slate-400 border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                            <PaletteIcon size={20} className="text-slate-400 dark:text-slate-500" />
                            <span className="text-[11px] font-bold">Editor</span>
                        </button>
                    </div>
                </div>
            </aside >

            {/* Main Preview Area */}
            <main className="flex-1 min-h-screen md:h-screen md:overflow-hidden flex flex-col relative bg-[#F8FAFC] dark:bg-slate-950" >
                <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex gap-6">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                            Preview Mode
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-sm font-medium transition-colors">Feedback</button>
                        <div className="w-px h-4 bg-slate-300 dark:bg-slate-700"></div>
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
                        </a>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    <div className="p-4 md:p-8 pb-20">
                        {/* Palette Strips */}
                        <div className="max-w-7xl mx-auto mb-16">
                            <PaletteRow name="Primary Palette" palette={state.primary.palette} onCopy={copyToClipboard} />
                            {state.hasSecondary && (
                                <div className="animate-in fade-in slide-in-from-top-2">
                                    <PaletteRow name="Secondary Palette" palette={state.secondary.palette} onCopy={copyToClipboard} />
                                </div>
                            )}
                        </div>

                        <div className="max-w-7xl mx-auto">
                            <div className="mb-8 flex items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">UI Components</h2>
                                    <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time preview of your generated color scales.</p>
                                </div>
                                {state.hasSecondary && <span className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-100 flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                                    </span>
                                    Live Combined Preview
                                </span>}
                            </div>

                            <UiExampleGrid />
                        </div>
                    </div>
                </div>
            </main >

            {/* Export Modal - Full Features */}
            {showExport && (
                <ExportModal
                    show={showExport}
                    onClose={() => setShowExport(false)}
                    primary={state.primary.palette}
                    secondary={state.secondary.palette}
                    hasSecondary={state.hasSecondary}
                    onCopy={copyToClipboard}
                />
            )}

            {/* Contrast Grid Modal */}
            {showContrast && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col scale-100 animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Contrast Grid</h2>
                                <p className="text-xs text-slate-500">Check WCAG accessibility for your color palettes.</p>
                            </div>
                            <button onClick={() => setShowContrast(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <X className="rotate-90" size={20} />
                            </button>
                        </div>

                        {/* Tabs for Contrast View */}
                        {state.hasSecondary && (
                            <div className="px-6 pt-4 flex gap-2 border-b border-slate-100 bg-white overflow-x-auto">
                                <button
                                    onClick={() => setContrastView('p-p')}
                                    className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${contrastView === 'p-p' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                >
                                    Primary / Primary
                                </button>
                                <button
                                    onClick={() => setContrastView('s-s')}
                                    className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${contrastView === 's-s' ? 'border-secondary-500 text-secondary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                >
                                    Secondary / Secondary
                                </button>
                                <button
                                    onClick={() => setContrastView('p-s')}
                                    className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${contrastView === 'p-s' ? 'border-slate-800 text-slate-800' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                >
                                    Primary Bg / Secondary Text
                                </button>
                                <button
                                    onClick={() => setContrastView('s-p')}
                                    className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${contrastView === 's-p' ? 'border-slate-800 text-slate-800' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                >
                                    Secondary Bg / Primary Text
                                </button>
                            </div>
                        )}

                        <div className="p-8 overflow-y-auto bg-white">
                            {(() => {
                                let rowPalette = state.primary.palette;
                                let colPalette = state.primary.palette;
                                let rowLabel = 'Primary';
                                let colLabel = 'Primary';

                                if (state.hasSecondary) {
                                    if (contrastView === 's-s') {
                                        rowPalette = state.secondary.palette;
                                        colPalette = state.secondary.palette;
                                        rowLabel = 'Secondary';
                                        colLabel = 'Secondary';
                                    } else if (contrastView === 'p-s') {
                                        rowPalette = state.primary.palette;
                                        colPalette = state.secondary.palette;
                                        rowLabel = 'Primary';
                                        colLabel = 'Secondary';
                                    } else if (contrastView === 's-p') {
                                        rowPalette = state.secondary.palette;
                                        colPalette = state.primary.palette;
                                        rowLabel = 'Secondary';
                                        colLabel = 'Primary';
                                    }
                                }

                                return (
                                    <>
                                        <div className="grid grid-cols-12 gap-1 mb-1">
                                            <div className="col-span-1"></div>
                                            {Object.keys(colPalette).map(key => (
                                                <div key={key} className="col-span-1 text-center text-[10px] font-bold text-slate-400">{key}</div>
                                            ))}
                                        </div>
                                        {Object.entries(rowPalette).map(([bgName, bgHex]) => (
                                            <div key={bgName} className="grid grid-cols-12 gap-1 mb-1">
                                                <div className="col-span-1 text-[10px] font-bold text-slate-400 flex items-center justify-end pr-2">{bgName}</div>
                                                {Object.entries(colPalette).map(([textName, textHex]) => {
                                                    const ratio = getContrastRatio(bgHex as string, textHex as string);
                                                    const isAAA = ratio >= 7;
                                                    const isAA = ratio >= 4.5;
                                                    const isAALarge = ratio >= 3;

                                                    let badgeColor = 'bg-slate-100 text-slate-400';
                                                    if (isAAA) badgeColor = 'bg-green-100 text-green-700 font-bold';
                                                    else if (isAA) badgeColor = 'bg-blue-100 text-blue-700 font-bold';
                                                    else if (isAALarge) badgeColor = 'bg-orange-100 text-orange-700';

                                                    return (
                                                        <div
                                                            key={textName}
                                                            className={`col-span-1 aspect-square rounded flex flex-col items-center justify-center relative group transition-all hover:scale-110 hover:z-10 cursor-default border ${isAA ? 'border-transparent' : 'border-slate-100'}`}
                                                            style={{ backgroundColor: bgHex as string }}
                                                        >
                                                            <span style={{ color: textHex as string }} className="text-sm font-bold mb-1">Aa</span>
                                                            <span className={`text-[8px] px-1 rounded-full ${badgeColor}`}>
                                                                {ratio.toFixed(1)}
                                                            </span>

                                                            {/* Tooltip */}
                                                            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-800 text-white text-xs p-2 rounded shadow-lg whitespace-nowrap z-20 pointer-events-none">
                                                                <div className="font-bold">{rowLabel} {bgName} bg / {colLabel} {textName} text</div>
                                                                <div>Ratio: {ratio.toFixed(2)}:1</div>
                                                                <div className="flex gap-2 mt-1">
                                                                    <span className={isAA ? 'text-green-400' : 'text-red-400'}>AA {isAA ? 'Pass' : 'Fail'}</span>
                                                                    <span className={isAAA ? 'text-green-400' : 'text-red-400'}>AAA {isAAA ? 'Pass' : 'Fail'}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        ))}
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}

            {/* Palette Editor Modal */}
            {showEditor && (
                <PaletteEditorModal
                    show={showEditor}
                    onClose={() => setShowEditor(false)}
                    primary={state.primary.palette}
                    secondary={state.secondary.palette}
                    hasSecondary={state.hasSecondary}
                    onUpdateShade={updateShade}
                />
            )}
        </div >
    );
};

export default App;