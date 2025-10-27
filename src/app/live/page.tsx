
'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Video, Send, Mic, MicOff, VideoOff } from 'lucide-react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, serverTimestamp, CollectionReference } from 'firebase/firestore';
import type { ChatMessage, WithId } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

// Pour cette démo, nous utilisons un ID de session live unique et fixe.
// Dans une vraie application, cet ID serait généré dynamiquement.
const LIVE_SESSION_ID = "main_session";

function LiveChat() {
  const firestore = useFirestore();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const messagesRef = useMemoFirebase(() => {
    return collection(firestore, 'liveSessions', LIVE_SESSION_ID, 'messages');
  }, [firestore]);

  const messagesQuery = useMemoFirebase(() => {
    if (!messagesRef) return null;
    return query(messagesRef, orderBy('timestamp', 'asc'));
  }, [messagesRef]);

  const { data: messages, isLoading } = useCollection<ChatMessage>(messagesQuery);
  
  // Fait défiler le chat vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user || !messagesRef) return;

    const messageData: Omit<ChatMessage, 'id' | 'timestamp'> = {
      text: newMessage,
      senderId: user.uid,
      senderName: user.displayName || user.email || 'Anonyme',
    };

    // Utilisation de la fonction non bloquante pour une meilleure réactivité
    addDocumentNonBlocking(messagesRef as CollectionReference, {
      ...messageData,
      timestamp: serverTimestamp(),
    });

    setNewMessage('');
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'un instant';
    const date = timestamp.toDate();
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  };

  return (
     <Card>
        <CardHeader>
          <CardTitle>Chat en direct</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-[400px]">
          <div ref={chatContainerRef} className="flex-1 space-y-4 overflow-y-auto p-4 border rounded-md bg-muted/50">
            {isLoading && <div className="text-sm text-center text-muted-foreground">Chargement des messages...</div>}
            {messages && messages.length === 0 && <div className="text-sm text-center text-muted-foreground">Aucun message pour le moment. Soyez le premier !</div>}
            {messages?.map((msg: WithId<ChatMessage>) => (
                <div key={msg.id} className="text-sm">
                    <span className={`font-bold ${msg.senderId === user?.uid ? 'text-primary' : 'text-blue-500'}`}>
                        {msg.senderId === user?.uid ? 'Vous' : msg.senderName}:
                    </span>
                    <span className="ml-2">{msg.text}</span>
                    <span className="text-xs text-muted-foreground/50 ml-2">{formatTimestamp(msg.timestamp)}</span>
                </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
            <Textarea 
              placeholder={user ? "Écrivez un message..." : "Connectez-vous pour chatter"}
              className="flex-1"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={!user}
            />
            <Button type="submit" size="icon" disabled={!user || newMessage.trim() === ''}><Send className="h-4 w-4" /></Button>
          </form>
        </CardContent>
      </Card>
  )
}

export default function LivePage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Erreur d\'accès aux médias:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Accès Média Refusé',
          description: 'Veuillez autoriser l\'accès à la caméra et au micro dans les paramètres de votre navigateur.',
        });
      }
    };

    getPermissions();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);
  
  const toggleCamera = () => {
      if (streamRef.current) {
          const videoTrack = streamRef.current.getVideoTracks()[0];
          if (videoTrack) {
              videoTrack.enabled = !videoTrack.enabled;
              setIsCameraOn(videoTrack.enabled);
          }
      }
  };

  const toggleMic = () => {
      if (streamRef.current) {
          const audioTrack = streamRef.current.getAudioTracks()[0];
          if (audioTrack) {
              audioTrack.enabled = !audioTrack.enabled;
              setIsMicOn(audioTrack.enabled);
          }
      }
  };


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
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Video className="h-6 w-6" />
                    <span>Votre diffusion en direct</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={toggleMic} variant={isMicOn ? "outline" : "destructive"} size="icon" disabled={!hasCameraPermission}>
                        {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                    </Button>
                    <Button onClick={toggleCamera} variant={isCameraOn ? "outline" : "destructive"} size="icon" disabled={!hasCameraPermission}>
                        {isCameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                    </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full bg-slate-900 text-white rounded-md overflow-hidden flex items-center justify-center relative">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                 {hasCameraPermission === false && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                        <VideoOff className="h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">Caméra non disponible</p>
                    </div>
                )}
              </div>
              {hasCameraPermission === false && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Accès à la caméra et au micro requis</AlertTitle>
                  <AlertDescription>
                    Veuillez autoriser l'accès pour démarrer votre diffusion.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <LiveChat />
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
