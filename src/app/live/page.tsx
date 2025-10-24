
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Video, Send } from 'lucide-react';

export default function LivePage() {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Erreur d\'accès à la caméra:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Accès à la caméra refusé',
          description: 'Veuillez autoriser l\'accès à la caméra dans les paramètres de votre navigateur pour utiliser cette fonctionnalité.',
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-5xl">
          Session Live
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Présentez vos produits et interagissez en direct avec vos clients.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne principale pour la vidéo */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-6 w-6" />
                <span>Votre diffusion en direct</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full bg-muted rounded-md overflow-hidden flex items-center justify-center">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted />
              </div>
              {!hasCameraPermission && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Accès à la caméra requis</AlertTitle>
                  <AlertDescription>
                    Veuillez autoriser l'accès à la caméra pour démarrer votre diffusion.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Colonne latérale pour le chat et les produits */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Chat en direct</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-[400px]">
              <div className="flex-1 space-y-4 overflow-y-auto p-4 border rounded-md bg-muted/50">
                {/* Messages de chat de démo */}
                <div className="text-sm"><span className="font-bold text-primary">Client_123 :</span> Bonjour ! Ce produit est-il en stock ?</div>
                <div className="text-sm"><span className="font-bold text-blue-500">Vous :</span> Bonjour ! Oui, absolument.</div>
                <div className="text-sm"><span className="font-bold text-primary">Client_456 :</span> Quelle est la matière ?</div>
              </div>
              <div className="mt-4 flex gap-2">
                <Textarea placeholder="Écrivez un message..." className="flex-1" />
                <Button size="icon"><Send className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>Produits présentés</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm text-center py-8">
                Les produits que vous ajoutez apparaîtront ici.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
