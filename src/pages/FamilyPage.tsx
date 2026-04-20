import { useState } from "react";
import { UserPlus, Shield, User, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import type { FamilyMember } from "@/types";
import { generateId } from "@/lib/storage";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

export function FamilyPage() {
  const { familyMembers, currentUser, addFamilyMember, removeFamilyMember } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "member" as "admin" | "member" });

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const initials = form.name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const member: FamilyMember = {
      id: generateId("member"),
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      initials,
      role: form.role,
      passwordHash: form.password,
    };

    addFamilyMember(member);
    toast.success(`${member.name} ajouté(e) à la famille.`);
    setOpen(false);
    setForm({ name: "", email: "", password: "", role: "member" });
  }

  function handleRemove(member: FamilyMember) {
    if (member.id === currentUser?.id) {
      toast.error("Vous ne pouvez pas supprimer votre propre compte.");
      return;
    }
    removeFamilyMember(member.id);
    toast.success(`${member.name} retiré(e) de la famille.`);
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="Membres de la famille"
        subtitle={`${familyMembers.length} membre${familyMembers.length > 1 ? "s" : ""}`}
      />
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-5">
          <div className="flex justify-end">
            {currentUser?.role === "admin" && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Ajouter un membre
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un membre</DialogTitle>
                    <DialogDescription>
                      Le nouveau membre pourra se connecter avec cet e-mail et ce mot de passe.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAdd} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Nom complet</Label>
                      <Input
                        placeholder="Prénom Nom"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Adresse e-mail</Label>
                      <Input
                        type="email"
                        placeholder="prenom@famille.fr"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Mot de passe</Label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                        minLength={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Rôle</Label>
                      <Select
                        value={form.role}
                        onValueChange={(v) => setForm({ ...form, role: v as "admin" | "member" })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Membre</SelectItem>
                          <SelectItem value="admin">Administrateur</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Annuler
                      </Button>
                      <Button type="submit">Ajouter</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {familyMembers.map((member) => (
              <Card key={member.id} className={member.id === currentUser?.id ? "border-primary/30" : ""}>
                <CardContent className="flex items-center gap-4 p-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{member.name}</p>
                      {member.id === currentUser?.id && (
                        <Badge variant="info" className="text-xs">Vous</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                    <div className="mt-1 flex items-center gap-1">
                      {member.role === "admin" ? (
                        <Shield className="h-3 w-3 text-primary" />
                      ) : (
                        <User className="h-3 w-3 text-muted-foreground" />
                      )}
                      <span className="text-xs text-muted-foreground capitalize">
                        {member.role === "admin" ? "Administrateur" : "Membre"}
                      </span>
                    </div>
                  </div>
                  {currentUser?.role === "admin" && member.id !== currentUser?.id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemove(member)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
