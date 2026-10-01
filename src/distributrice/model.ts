export interface EnAttente {
  readonly statut: "en_attente";
}

export interface CreditInsere {
  readonly statut: "credit_insere";
  readonly montant: number;
}

export interface HorsService {
  readonly statut: "hors_service";
  readonly raison: string;
}

export type EtatMachine = EnAttente | CreditInsere | HorsService;

export type ResultatInsertion =
  | { readonly succes: true; readonly soldeCourant: number }
  | { readonly succes: false; readonly raison: "Machine hors service" };

export type Boisson = "espresso" | "chocolat" | "the";

export type ResultatSelection =
  | {
      readonly succes: true;
      readonly boisson: Boisson;
      readonly monnaieRendue: number;
    }
  | {
      readonly succes: false;
      readonly raison: "Fonds insuffisants" | "Machine hors service" | "Boisson non disponible";
    };

export type ResultatAnnulation = { readonly monnaieRendue: number };

// création de la barrière d'abstraction
export function enAttente(): EnAttente {
  return { statut: "en_attente" };
}

export function creditInsere(montant: number): CreditInsere {
  return { statut: "credit_insere", montant };
}

export function ajouterCredit(etat: CreditInsere, montantInsere: number): CreditInsere {
  return creditInsere(montant(etat) + montantInsere);
}

export function depenserCredit(etat: CreditInsere, montantDepense: number): CreditInsere {
  return creditInsere(montant(etat) - montantDepense);
}

export function succesInsertion(soldeCourant: number): ResultatInsertion {
  return { succes: true, soldeCourant };
}

export function echecInsertion(raison: "Machine hors service"): ResultatInsertion {
  return { succes: false, raison };
}

export function succesSelection(boisson: Boisson, monnaieRendue: number): ResultatSelection {
  return { succes: true, boisson, monnaieRendue };
}

export function echecSelection(
  raison: "Fonds insuffisants" | "Machine hors service" | "Boisson non disponible",
): ResultatSelection {
  return { succes: false, raison };
}
export function resultatAnnulation(monnaieRendue: number): ResultatAnnulation {
  return { monnaieRendue };
}

export function montant(etat: CreditInsere): number {
  return etat.montant;
}

export function raison(etat: HorsService): string {
  return etat.raison;
}
