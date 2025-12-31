import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Download, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { convertPngToIco } from '@/utils/pngToIco';


const folderPrompts = [
  {
    name: 'General Folder',
    prompt: 'glitch cyberpunk neon icon, glowing magenta and teal accents, dark background, holographic distortion, pixel noise, sharp edges, futuristic UI aesthetic, high contrast, minimalistic symbol centered, icon-style rendering',
  },
  {
    name: 'Documents',
    prompt: 'glitch cyberpunk neon folder icon, glowing magenta and teal edges, dark background, holographic distortion, pixel glitch effects, futuristic UI style',
  },
  {
    name: 'Pictures',
    prompt: 'glitch cyberpunk neon folder icon with camera symbol, magenta/teal neon, scanline distortion, holographic glow',
  },
  {
    name: 'Music',
    prompt: 'glitch cyberpunk neon folder icon with music note symbol, magenta/teal neon, pixel glitch, holographic waveform',
  },
  {
    name: 'Videos',
    prompt: 'glitch cyberpunk neon folder icon with play button symbol, magenta/teal neon, VHS glitch, holographic distortion',
  },
  {
    name: 'Downloads',
    prompt: 'glitch cyberpunk neon folder icon with downward arrow symbol, magenta/teal neon, pixel noise, holographic glow',
  },
  {
    name: 'Code/Dev',
    prompt: 'glitch cyberpunk neon folder icon with code brackets {}, magenta/teal neon, pixel glitch, holographic UI',
  },
  {
    name: 'Projects',
    prompt: 'glitch cyberpunk neon folder icon with cube symbol, magenta/teal neon, scanline distortion, holographic glow',
  },
  {
    name: 'Games',
    prompt: 'glitch cyberpunk neon folder icon with gamepad symbol, magenta/teal neon, pixel glitch, holographic distortion',
  },
  {
    name: 'System/Tools',
    prompt: 'glitch cyberpunk neon folder icon with gear symbol, magenta/teal neon, pixel noise, holographic UI',
  },
];

export default function IconGallery() {
  const [icons, setIcons] = useState({});
  const [generating, setGenerating] = useState({});
  const [generatingAll, setGeneratingAll] = useState(false);

  const generateIcon = async (folder) => {
    setGenerating(prev => ({ ...prev, [folder.name]: true }));
    try {
      const result = await base44.integrations.Core.GenerateImage({
        prompt: folder.prompt,
      });
      setIcons(prev => ({ ...prev, [folder.name]: result.url }));
      toast.success(`${folder.name} generated!`);
    } catch (error) {
      toast.error(`Failed to generate ${folder.name}`);
    } finally {
      setGenerating(prev => ({ ...prev, [folder.name]: false }));
    }
  };

  const generateAll = async () => {
    setGeneratingAll(true);
    toast.info('Generating all icons... This will take ~60 seconds');
    
    for (const folder of folderPrompts) {
      await promise.all(folderprompts.map(folder => generateIcon(folder)));
    }
    
    setGeneratingAll(false);
    toast.success('All icons generated!');
  };

  const downloadIcon = (url, name) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name.replace(/\//g, '-')}-icon.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0f0a1a] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            Cyberpunk Folder Icons
          </h1>
          <p className="text-gray-400 mb-6">
            Glitch aesthetic Windows folder icons with neon magenta/teal glow
          </p>
          <Button
            onClick={generateAll}
            disabled={generatingAll}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white gap-2"
          >
            {generatingAll ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating All... (~60s)
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate All Icons
              </>
            )}
          </Button>
        </div>

        {/* Icon Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {folderPrompts.map((folder) => (
            <div
              key={folder.name}
              className="relative group bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-purple-500/20 rounded-xl p-6 hover:border-pink-500/50 transition-all duration-300 backdrop-blur-sm"
            >
              {/* Icon Display */}
              <div className="aspect-square bg-black/40 rounded-lg mb-4 flex items-center justify-center overflow-hidden border border-cyan-500/20">
                {generating[folder.name] ? (
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-pink-500 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Generating...</p>
                  </div>
                ) : icons[folder.name] ? (
                  <img
                    src={icons[folder.name]}
                    alt={folder.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center text-gray-600">
                    <Sparkles className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p className="text-xs">Not generated</p>
                  </div>
                )}
              </div>

              {/* Name */}
              <h3 className="text-lg font-semibold text-white mb-2 text-center">
                {folder.name}
              </h3>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => generateIcon(folder)}
                  disabled={generating[folder.name]}
                  className="flex-1 bg-purple-600/80 hover:bg-purple-600 text-white"
                  size="sm"
                >
                  {generating[folder.name] ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Generate'
                  )}
                </Button>
                {icons[folder.name] && (
                  <Button
                    onClick={() => downloadIcon(icons[folder.name], folder.name)}
                    variant="outline"
                    size="sm"
                    className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-3">How to Use on Windows</h2>
          <ol className="text-gray-300 space-y-2 list-decimal list-inside">
            <li>Generate and download all icons</li>
            <li>Right-click a folder in Windows → Properties</li>
            <li>Go to "Customize" tab → "Change Icon"</li>
            <li>Click "Browse" and select your downloaded .png file</li>
            <li>Click OK to apply the icon</li>
          </ol>
          <p className="text-sm text-gray-500 mt-4">
            Note: Windows may require .ico format. Use an online converter if needed.
          </p>
        </div>
      </div>
    </div>
  );
}