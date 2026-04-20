import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car, Mail, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const success = await login(email.trim(), password);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Adresse e-mail ou mot de passe incorrect.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Branding */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <Car className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Rappel Entretien</h1>
            <p className="text-sm text-blue-300">Gestion de la flotte familiale</p>
          </div>
        </div>

        {/* Carte de connexion */}
        <Card className="shadow-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Connexion</CardTitle>
            <CardDescription>
              Connectez-vous avec votre adresse e-mail familiale
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Adresse e-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="prenom@famille.fr"
                    autoComplete="email"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Connexion en cours…" : "Se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Aide pour la démo */}
        <Card className="border-blue-800/30 bg-blue-950/40 text-blue-200">
          <CardContent className="pt-4 pb-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
              Comptes de démonstration
            </p>
            <div className="space-y-1 text-xs">
              {[
                { email: "papa@dupont.fr", name: "Pierre (admin)" },
                { email: "maman@dupont.fr", name: "Marie" },
                { email: "lucas@dupont.fr", name: "Lucas" },
                { email: "emma@dupont.fr", name: "Emma" },
              ].map((u) => (
                <button
                  key={u.email}
                  type="button"
                  className="flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-blue-800/30"
                  onClick={() => {
                    setEmail(u.email);
                    setPassword("famille123");
                  }}
                >
                  <span className="font-medium text-blue-300">{u.name}</span>
                  <span className="text-blue-400/70">{u.email}</span>
                </button>
              ))}
              <p className="mt-2 text-blue-400/70">Mot de passe : famille123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
