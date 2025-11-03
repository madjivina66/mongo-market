
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Video, Send, Mic, MicOff, VideoOff, PlusCircle, ShoppingCart, Tv } from 'lucide-react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, serverTimestamp, CollectionReference, type DocumentData } from 'firebase/firestore';
import type { ChatMessage, WithId, Product } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Image from 'next/image';
import { useCart } from '@/context/cart-context';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from '@/hooks/use-mobile';
import { FeaturedProductsManager } from './featured-products-manager';

const LIVE_SESSION_ID = "main_session";

function LiveChat() {
  const firestore = useFirestore(); // Correct hook
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
  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user || user.isAnonymous || !messagesRef) return;

    const messageData = {
      text: newMessage,
      senderId: user.uid,
      senderName: user.displayName || user.email || 'Anonyme',
      timestamp: serverTimestamp(),
    };

    // Use the correctly imported non-blocking function
    await addDocumentNonBlocking(messagesRef as CollectionReference<DocumentData>, messageData);
    setNewMessage('');
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'un instant';
    const date = timestamp.toDate();
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  };
  
  const isUserAllowedToChat = user && !user.isAnonymous;

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
              placeholder={isUserAllowedToChat ? "Écrivez un message..." : "Connectez-vous pour chatter"}
              className="flex-1"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={!isUserAllowedToChat}
            />
            <Button type="submit" size="icon" disabled={!isUserAllowedToChat || newMessage.trim() === ''}><Send className="h-4 w-4" /></Button>
          </form>
        </CardContent>
      </Card>
  )
}

function FeaturedProducts() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const { addToCart } = useCart();

    const featuredProductsQuery = useMemoFirebase(() => {
        return collection(firestore, 'liveSessions', LIVE_SESSION_ID, 'featuredProducts');
    }, [firestore]);
    
    // Le type ici est partiel, car on ne stocke pas toutes les données du produit
    const { data: products, isLoading } = useCollection<Partial<Product>>(featuredProductsQuery);

    const handleAddToCart = (product: WithId<Partial<Product>>) => {
        // On doit reconstruire un objet Product complet pour le contexte du panier
        const fullProduct: Product = {
            id: product.id,
            name: product.name || 'Produit sans nom',
            price: product.price || 0,
            description: product.description || '',
            category: product.category || 'Vêtements',
            imageUrl: product.imageUrl || '',
            imageHint: product.imageHint || '',
            sellerId: 'live_session_seller', // Placeholder
        };
        addToCart(fullProduct);
        toast({
            title: "Ajouté au panier",
            description: `${fullProduct.name} a été ajouté à votre panier.`,
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Produits présentés</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading && <p className="text-muted-foreground text-sm text-center py-8">Chargement...</p>}
                {!isLoading && (!products || products.length === 0) && (
                    <p className="text-muted-foreground text-sm text-center py-8">
                        Les produits que vous ajoutez apparaîtront ici.
                    </p>
                )}
                <div className="space-y-4">
                    {products?.map(product => (
                        <div key={product.id} className="flex items-center gap-3">
                            <Image src={product.imageUrl!} alt={product.name!} width={64} height={64} className="rounded-md object-cover aspect-square" />
                            <div className="flex-1">
                                <p className="font-semibold text-sm">{product.name}</p>
                                <p className="text-muted-foreground text-sm">${product.price?.toFixed(2)}</p>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => handleAddToCart(product)}>
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Ajouter
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

function ProductManagerDialog() {
    const isMobile = useIsMobile();
    const [open, setOpen] = useState(false);

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Présenter un produit
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[80%]">
                    <DrawerHeader className="text-left">
                        <DrawerTitle>Gérer les produits présentés</DrawerTitle>
                        <DrawerDescription>
                            Sélectionnez les produits de votre inventaire à montrer en direct.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 flex-1 overflow-auto">
                        <FeaturedProductsManager />
                    </div>
                    <DrawerFooter className="pt-2">
                        <DrawerClose asChild>
                            <Button variant="outline">Fermer</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Présenter un produit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px] h-[70vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Gérer les produits présentés</DialogTitle>
                    <DialogDescription>
                        Sélectionnez les produits de votre inventaire à montrer en direct.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 relative min-h-0">
                    <FeaturedProductsManager />
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function LivePage() {
  const [isLive, setIsLive] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const isSeller = user && !user.isAnonymous;

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      setHasCameraPermission(true);
      setIsLive(true);
    } catch (error) {
      console.error('Erreur d\'accès aux médias:', error);
      setHasCameraPermission(false);
      setIsLive(false);
      toast({
        variant: 'destructive',
        title: 'Accès Média Refusé',
        description: 'Veuillez autoriser l\'accès à la caméra et au micro dans les paramètres de votre navigateur.',
      });
    }
  };

  useEffect(() => {
    if (streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isLive, hasCameraPermission]);

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  const handleGoLive = () => {
    startStream();
  };

  const handleStopLive = () => {
    stopStream();
    setIsLive(false);
    setHasCameraPermission(null);
  };
  
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
          {isLive ? "Vous êtes en direct ! Interagissez avec vos clients." : "Préparez-vous à lancer votre session de vente en direct."}
        </p>
      </header>
      
      {!isLive ? (
        <Card className="flex flex-col items-center justify-center py-24">
            <CardContent className="text-center">
                <Tv className="mx-auto h-24 w-24 text-muted-foreground/50" />
                <h2 className="mt-6 text-2xl font-bold font-headline">Vous êtes prêt à passer en direct</h2>
                <p className="mt-2 text-muted-foreground">Cliquez sur le bouton ci-dessous pour démarrer votre diffusion.</p>
                <Button size="lg" className="mt-8 font-headline text-xl" onClick={handleGoLive}>
                    Lancer le direct
                </Button>
            </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="relative flex items-center justify-center">
                            <div className="absolute h-3 w-3 rounded-full bg-red-500 animate-ping"></div>
                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        </div>
                        <span>En direct</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button onClick={toggleMic} variant={isMicOn ? "outline" : "destructive"} size="icon" disabled={hasCameraPermission === false}>
                            {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                        </Button>
                        <Button onClick={toggleCamera} variant={isCameraOn ? "outline" : "destructive"} size="icon" disabled={hasCameraPermission === false}>
                            {isCameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                        </Button>
                        <Button onClick={handleStopLive} variant="destructive" size="sm">Arrêter le direct</Button>
                    </div>
                </CardTitle>
                </CardHeader>
                <CardContent>
                <div className="aspect-video w-full bg-slate-900 text-white rounded-md overflow-hidden flex items-center justify-center relative">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                    {!isCameraOn && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                            <VideoOff className="h-12 w-12 text-muted-foreground" />
                            <p className="mt-2 text-muted-foreground">Caméra coupée</p>
                        </div>
                    )}
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
            <div className="space-y-4">
                {isSeller && <ProductManagerDialog />}
                <FeaturedProducts />
            </div>
            </div>
        </div>
      )}
    </div>
  );
}
