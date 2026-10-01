import {
  ajouterCredit,
  Boisson,
  creditInsere,
  echecInsertion,
  echecSelection,
  enAttente,
  EtatMachine,
  montant,
  resultatAnnulation,
  ResultatAnnulation,
  ResultatInsertion,
  ResultatSelection,
  succesInsertion,
  succesSelection,
} from "./model.js";

export interface Distributrice {
  insererMontant(m: number): ResultatInsertion;
  selectionnerBoisson(b: Boisson): ResultatSelection;
  annuler(): ResultatAnnulation;
}

export function creerDistributrice(catalogue: Record<Boisson, number>, etatInitial = enAttente()): Distributrice {
  let etat: EtatMachine = etatInitial;

  return {
    insererMontant: (montantInsere: number) => {
      switch (etat.statut) {
        case "en_attente": {
          etat = creditInsere(montantInsere);
          return succesInsertion(montant(etat));
        }
        case "credit_insere": {
          etat = ajouterCredit(etat, montantInsere);
          return succesInsertion(montant(etat));
        }
        case "hors_service": {
          return echecInsertion("Machine hors service");
        }
      }
    },
    selectionnerBoisson: (b: Boisson): ResultatSelection => {
      switch (etat.statut) {
        case "en_attente": {
          return echecSelection("Fonds insuffisants");
        }
        case "credit_insere": {
          const prix = catalogue[b];
          if (prix === undefined) {
            return echecSelection("Boisson non disponible");
          }

          const soldeActuel = montant(etat);
          if (soldeActuel >= prix) {
            const monnaieRendue = soldeActuel - prix;
            etat = enAttente();
            return succesSelection(b, monnaieRendue);
          }
          return echecSelection("Fonds insuffisants");
        }
        case "hors_service": {
          return echecSelection("Machine hors service");
        }
      }
    },
    annuler: () => {
      switch (etat.statut) {
        case "en_attente": {
          return resultatAnnulation(0);
        }
        case "credit_insere": {
          const monnaieRendue = montant(etat);
          etat = enAttente();
          return resultatAnnulation(monnaieRendue);
        }
        case "hors_service": {
          return resultatAnnulation(0);
        }
      }
    },
  };
}
