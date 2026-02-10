"use client";

import { Check, Eye, Loader2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function EnsInput() {
  const [ensName, setEnsName] = useState("");
  const [savedEns, setSavedEns] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load saved ENS name
  useEffect(() => {
    fetch("/api/user/ens")
      .then((res) => res.json())
      .then((data) => {
        if (data.ensName) {
          setSavedEns(data.ensName);
          setEnsName(data.ensName);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!ensName.trim()) {
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/user/ens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ensName: ensName.trim() }),
      });
      if (res.ok) {
        setSavedEns(ensName.trim());
        setEditing(false);
        toast.success("ENS name saved");
      }
    } catch {
      toast.error("Failed to save ENS name");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
        <span className="text-muted-foreground text-sm">Loading...</span>
      </div>
    );
  }

  if (savedEns && !editing) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-mono text-sm">{savedEns}</p>
          <Button
            onClick={() => setEditing(true)}
            size="icon-xs"
            variant="ghost"
          >
            <Pencil className="size-3" />
          </Button>
        </div>
        <Button
          className="w-full"
          onClick={() => router.push(`/portfolio/${savedEns}`)}
          variant="outline"
        >
          <Eye className="size-4" />
          View My Portfolio
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          onChange={(e) => setEnsName(e.target.value)}
          placeholder="vitalik.eth or 0x..."
          value={ensName}
        />
        <Button
          disabled={!ensName.trim() || saving}
          onClick={handleSave}
          size="sm"
        >
          {saving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Check className="size-4" />
          )}
        </Button>
      </div>
      <p className="text-muted-foreground text-xs">
        Add your ENS name or Ethereum address to view your portfolio
      </p>
    </div>
  );
}
