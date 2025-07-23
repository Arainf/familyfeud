"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Play, Pause, Volume2 } from 'lucide-react';

interface SoundControlCardProps {
  sounds: string[];
}

const SoundControlCard: React.FC<SoundControlCardProps> = ({ sounds }) => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
  const [playing, setPlaying] = useState<{ [key: string]: boolean }>({});
  const [looping, setLooping] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    sounds.forEach(sound => {
      if (!audioRefs.current[sound]) {
        audioRefs.current[sound] = new Audio(`/sounds/${sound}`);
      }
    });

    return () => {
      // Cleanup audio elements on unmount
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, [sounds]);

  const togglePlay = (sound: string) => {
    const audio = audioRefs.current[sound];
    if (!audio) return;

    if (playing[sound]) {
      audio.pause();
    } else {
      audio.currentTime = 0;
      audio.play();
    }
    setPlaying(prev => ({ ...prev, [sound]: !prev[sound] }));
  };

  const toggleLoop = (sound: string) => {
    const audio = audioRefs.current[sound];
    if (!audio) return;

    const newLoopingState = !looping[sound];
    audio.loop = newLoopingState;
    setLooping(prev => ({ ...prev, [sound]: newLoopingState }));
  };
  
  const formatSoundName = (name: string) => {
    return name.replace(/_/g, ' ').replace('.mp3', '').replace('.wav', '').replace('.ogg', '');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center"><Volume2 className="mr-2" /> Sound Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-h-96 overflow-y-auto pr-2">
            {sounds.map(sound => (
            <div key={sound} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                <p className="font-medium text-sm flex-grow truncate mr-4" title={formatSoundName(sound)}>{formatSoundName(sound)}</p>
                <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={() => togglePlay(sound)} className="w-8 h-8">
                    {playing[sound] ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <div className="flex items-center space-x-2">
                    <Switch
                    id={`loop-${sound}`}
                    checked={looping[sound] || false}
                    onCheckedChange={() => toggleLoop(sound)}
                    />
                    <Label htmlFor={`loop-${sound}`} className="text-sm">Loop</Label>
                </div>
                </div>
            </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SoundControlCard;
