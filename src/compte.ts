export type Compte = {
  readonly id: string;
  readonly solde: number;
};

export function compte(id: string, soldeInitial: number): Compte {
  return { id, solde: soldeInitial };
}

export function id(c: Compte): string {
  return c.id;
}

export function solde(c: Compte): number {
  return c.solde;
}

export type ResultatRetrait =
  | { readonly succes: true; readonly montantRetire: number }
  | { readonly succes: false; readonly raison: "Fonds insuffisants" };

export function retirer(c: Compte, montant: number): readonly [Compte, ResultatRetrait] {
  if (c.solde < montant) {
    return [c, { succes: false, raison: "Fonds insuffisants" }] as const;
  }

  const nouveauCompte: Compte = {
    ...c,
    solde: c.solde - montant,
  };

  return [nouveauCompte, { succes: true, montantRetire: montant }] as const;
}

export function deposer(c: Compte, montant: number): readonly [Compte, number] {
  const nouveauCompte: Compte = {
    ...c,
    solde: c.solde + montant,
  };
  return [nouveauCompte, nouveauCompte.solde] as const;
}
