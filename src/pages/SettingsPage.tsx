import { useState } from "react";
import { toast } from "sonner";
import { RotateCcw, Database } from "lucide-react";
import { resetToInitialData } from "@/lib/storage";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function SettingsPage() {
  const [resetOpen, setResetOpen] = useState(false);

  function handleReset() {
    resetToInitialData();
    toast.success("Données réinitialisées. Rechargement de la page…");
    setTimeout(() => window.location.reload(), 1000);
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header title="Paramètres" subtitle="Configuration de l'application" />
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6 max-w-2xl">
          {/* Infos app */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Database className="h-4 w-4 text-primary" />
                À propos de l'application
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <Badge variant="secondary">1.0.0</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stockage</span>
                <span>localStorage (navigateur)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Interface</span>
                <span>shadcn/ui + React</span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Les données sont stockées localement dans votre navigateur. Elles ne sont pas
                synchronisées entre différents appareils ou navigateurs.
              </p>
            </CardContent>
          </Card>

          {/* Réinitialisation */}
          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-destructive">
                <RotateCcw className="h-4 w-4" />
                Réinitialiser les données
              </CardTitle>
              <CardDescription>
                Restaure les données de démonstration (famille Dupont avec 3 véhicules).
                Toutes les modifications seront perdues.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={resetOpen} onOpenChange={setResetOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Réinitialiser les données de démo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmer la réinitialisation</DialogTitle>
                    <DialogDescription>
                      Cette action supprimera toutes les données saisies et restaurera les données
                      de démonstration. Cette action est irréversible.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setResetOpen(false)}>
                      Annuler
                    </Button>
                    <Button variant="destructive" onClick={handleReset}>
                      Réinitialiser
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
